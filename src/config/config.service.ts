import { readFileSync } from 'fs';
import { join } from 'path';
import { parse } from 'yaml';

import { Injectable, Logger as NestLogger } from '@nestjs/common';

import { BusinessException, StatusCode } from 'src/common';

import { configSchema } from './config.schema';

/**
 * 配置接口类型
 */
export interface Config {
  /** 应用配置 */
  app: {
    /** 应用名称 */
    name: string;
    /** 环境 */
    env: string;
    /** 端口 */
    port: number;
    /** 接口前缀 */
    prefix: string;
  };
  /** 数据库配置 */
  database: {
    /** 数据库类型 */
    type: string;
    /** 数据库主机 */
    host: string;
    /** 数据库端口 */
    port: number;
    /** 数据库用户名 */
    username: string;
    /** 数据库密码 */
    password: string;
    /** 数据库名称 */
    database: string;
    /** 是否同步 */
    synchronize: boolean;
    /** 是否记录日志 */
    logging: boolean;
  };
  /** Redis配置 */
  redis: {
    /** 主机 */
    host: string;
    /** 端口 */
    port: number;
    /** 密码 */
    password?: string;
    /** 数据库 */
    db: number;
    /** 键前缀 */
    keyPrefix: string;
  };
  /** JWT配置 */
  jwt: {
    /** 密钥 */
    secret: string;
    /** 过期时间 */
    expiresIn: string;
    /** 刷新过期时间 */
    refreshExpiresIn: string;
  };
  /** 日志配置 */
  logger: {
    /** 日志级别 */
    level: string;
    /** 是否记录到控制台 */
    console: boolean;
    /** 文件配置 */
    file: {
      /** 是否启用 */
      enabled: boolean;
      /** 最大文件数 */
      maxFiles: number;
      /** 最大文件大小 */
      maxSize: number;
    };
  };
  /** CORS配置 */
  cors: {
    /** 是否启用 */
    enabled: boolean;
    /** 允许的源 */
    origin: string | string[];
    /** 允许的方法 */
    methods: string;
    /** 是否允许凭证 */
    credentials: boolean;
  };
  /** 安全配置 */
  security: {
    /** 限流配置 */
    rateLimiter: {
      /** 是否启用 */
      enabled: boolean;
      /** 窗口时间 */
      windowMs: number;
      /** 最大请求数 */
      max: number;
    };
    /** Helmet配置 */
    helmet: {
      /** 是否启用 */
      enabled: boolean;
    };
    /** 压缩配置 */
    compression: {
      /** 是否启用 */
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
  /**
   * 记录日志
   * 在初始化阶段使用 NestJS Logger
   */
  private readonly nestLogger = new NestLogger(ConfigService.name);

  constructor() {
    this.config = this.loadConfig();
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
        const errorMsg = `配置验证失败: ${errorDetails}`;
        this.nestLogger.error(errorMsg);
        throw new BusinessException(errorMsg, StatusCode.INTERNAL_SERVER_ERROR);
      }

      this.nestLogger.log('配置加载成功');
      return value;
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error;
      }
      const errorMsg = `加载配置文件失败: ${error.message}`;
      this.nestLogger.error(errorMsg);
      throw new BusinessException(errorMsg, StatusCode.INTERNAL_SERVER_ERROR);
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
