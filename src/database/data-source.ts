import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import { parse } from 'yaml';
import { readFileSync } from 'fs';

/**
 * 获取配置文件路径
 */
function getConfigPath(): string {
  const env = process.env.NODE_ENV || 'development';
  console.log(env);
  const configName = env === 'development' ? 'app.yaml' : `app.${env}.yaml`;
  return join(process.cwd(), 'config', configName);
}

/**
 * 加载数据库配置
 */
function loadDatabaseConfig(): DataSourceOptions {
  try {
    // 读取YAML配置
    const configPath = getConfigPath();
    const fileContent = readFileSync(configPath, 'utf8');
    const config = parse(fileContent);

    // 获取数据库配置
    const dbConfig = config.database;

    if (!dbConfig) {
      throw new Error('数据库配置不存在');
    }

    return {
      type: dbConfig.type as any,
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.database,
      synchronize: dbConfig.synchronize,
      logging: dbConfig.logging,
      entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
      migrations: [join(process.cwd(), 'migrations', '*{.ts,.js}')],
      migrationsTableName: 'migrations',
    };
  } catch (error) {
    console.error(`加载数据库配置失败: ${error.message}`);
    throw error;
  }
}

// 导出数据源配置，供 TypeORM 迁移和应用程序使用
export const dataSourceOptions = loadDatabaseConfig();

// 导出数据源实例，用于迁移
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
