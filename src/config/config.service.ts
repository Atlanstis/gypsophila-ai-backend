import { Injectable, Inject, Logger as NestLogger } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parse } from 'yaml';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { configSchema } from './config.schema';
import { BusinessException } from '../common/exceptions/business.exception';
import { StatusCode } from '../common/enums/status-code.enum';

/**
 * 配置接口类型
 */
export interface Config {
  app: {
    name: string;
    env: string;
    port: number;
    prefix: string;
  };
  database: {
    type: string;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    synchronize: boolean;
    logging: boolean;
  };
  redis: {
    host: string;
    port: number;
    password?: string;
    db: number;
    keyPrefix: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
    refreshExpiresIn: string;
  };
  logger: {
    level: string;
    maxFiles: number;
    maxSize: number;
  };
  cors: {
    enabled: boolean;
    origin: string | string[];
    methods: string;
    credentials: boolean;
  };
  security: {
    rateLimiter: {
      enabled: boolean;
      windowMs: number;
      max: number;
    };
    helmet: {
      enabled: boolean;
    };
    compression: {
      enabled: boolean;
    };
  };
}

/**
 * 配置服务
 * 负责加载和验证配置文件
 */
@Injectable()
export class ConfigService {
  private readonly config: Config;
  private readonly nestLogger = new NestLogger(ConfigService.name);

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.config = this.loadConfig();
  }

  /**
   * 记录日志
   * 如果 Winston Logger 可用则使用它，否则使用 NestJS Logger
   */
  private logInfo(message: string): void {
    if (this.logger) {
      this.logger.info(message, { context: 'ConfigService' });
    } else {
      this.nestLogger.log(message);
    }
  }

  private logError(message: string): void {
    if (this.logger) {
      this.logger.error(message, { context: 'ConfigService' });
    } else {
      this.nestLogger.error(message);
    }
  }

  /**
   * 加载配置文件
   */
  private loadConfig(): Config {
    try {
      // 查找配置文件路径
      const configPath = this.getConfigPath();

      // 读取YAML配置
      const fileContent = readFileSync(configPath, 'utf8');
      const parsedConfig = parse(fileContent);

      // 验证配置
      const { error, value } = configSchema.validate(parsedConfig, {
        abortEarly: false,
        allowUnknown: false,
      });

      if (error) {
        const errorDetails = error.details
          .map((detail) => detail.message)
          .join(', ');
        this.logError(`配置验证失败: ${errorDetails}`);
        throw new BusinessException(
          `配置验证失败: ${errorDetails}`,
          StatusCode.INTERNAL_SERVER_ERROR,
        );
      }

      this.logInfo('配置加载成功');
      return value;
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error;
      }
      this.logError(`加载配置文件失败: ${error.message}`);
      throw new BusinessException(
        `加载配置文件失败: ${error.message}`,
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 获取配置文件路径
   */
  private getConfigPath(): string {
    const env = process.env.NODE_ENV || 'development';
    const configName = env === 'development' ? 'app.yaml' : `app.${env}.yaml`;
    return join(process.cwd(), 'config', configName);
  }

  /**
   * 获取配置值
   * @param key 配置键名
   * @param subKey 配置子键名（可选）
   * @returns 配置值
   */
  get<K extends keyof Config>(key: K): Config[K];
  get<K extends keyof Config, T extends keyof Config[K]>(
    key: K,
    subKey: T,
  ): Config[K][T];

  get<K extends keyof Config, T extends keyof Config[K]>(
    key: K,
    subKey?: T,
  ): Config[K] | Config[K][T] {
    if (subKey) {
      const section = this.config[key];
      if (!section || typeof section !== 'object') {
        throw new BusinessException(
          `配置项 ${key} 不存在或不是对象类型`,
          StatusCode.INTERNAL_SERVER_ERROR,
        );
      }
      if (!(String(subKey) in section)) {
        throw new BusinessException(
          `配置项 ${key}.${String(subKey)} 不存在`,
          StatusCode.INTERNAL_SERVER_ERROR,
        );
      }
      return section[subKey];
    }
    return this.config[key];
  }
}
