import * as Joi from 'joi';

/**
 * 应用配置验证模式
 */
export const appConfigSchema = Joi.object({
  name: Joi.string().required(),
  env: Joi.string().valid('development', 'test', 'production').required(),
  port: Joi.number().port().default(3000),
  prefix: Joi.string().default('/api'),
});

/**
 * 数据库配置验证模式
 */
export const databaseConfigSchema = Joi.object({
  type: Joi.string().valid('mysql', 'postgres', 'sqlite', 'mongodb').required(),
  host: Joi.string().required(),
  port: Joi.number().port().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  database: Joi.string().required(),
  synchronize: Joi.boolean().default(false),
  logging: Joi.boolean().default(false),
});

/**
 * Redis配置验证模式
 */
export const redisConfigSchema = Joi.object({
  host: Joi.string().required(),
  port: Joi.number().port().default(6379),
  password: Joi.string().allow('').optional(),
  db: Joi.number().min(0).default(0),
  keyPrefix: Joi.string().allow('').default(''),
});

/**
 * JWT配置验证模式
 */
export const jwtConfigSchema = Joi.object({
  secret: Joi.string().min(16).required(),
  expiresIn: Joi.string().required(),
  refreshExpiresIn: Joi.string().required(),
});

/**
 * 日志配置验证模式
 */
export const loggerConfigSchema = Joi.object({
  level: Joi.string()
    .valid('error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly')
    .default('info'),
  console: Joi.boolean().default(true),
  file: Joi.object({
    enabled: Joi.boolean().default(true),
    maxFiles: Joi.number().default(30),
    maxSize: Joi.number().default(10485760), // 10MB
  }).default(),
});

/**
 * CORS配置验证模式
 */
export const corsConfigSchema = Joi.object({
  enabled: Joi.boolean().default(true),
  origin: Joi.alternatives(
    Joi.string(),
    Joi.array().items(Joi.string()),
  ).default('*'),
  methods: Joi.string().default('GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'),
  credentials: Joi.boolean().default(true),
});

/**
 * 安全配置验证模式
 */
export const securityConfigSchema = Joi.object({
  rateLimiter: Joi.object({
    enabled: Joi.boolean().default(true),
    windowMs: Joi.number().default(60000), // 1分钟
    max: Joi.number().default(100), // 每分钟最多100次请求
  }),
  helmet: Joi.object({
    enabled: Joi.boolean().default(true),
  }),
  compression: Joi.object({
    enabled: Joi.boolean().default(true),
  }),
});

/**
 * 完整配置验证模式
 */
export const configSchema = Joi.object({
  app: appConfigSchema.required(),
  database: databaseConfigSchema.required(),
  redis: redisConfigSchema.required(),
  jwt: jwtConfigSchema.required(),
  logger: loggerConfigSchema.default(),
  cors: corsConfigSchema.default(),
  security: securityConfigSchema.default(),
});
