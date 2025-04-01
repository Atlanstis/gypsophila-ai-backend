import * as fs from 'fs';
import { type WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

import { ConfigService } from '../config/config.service';

const isDevelopment = process.env.NODE_ENV !== 'production';

// 创建日志目录
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// 日志文件路径
const errorLogPath = 'error-%DATE%.log';
const combinedLogPath = 'combined-%DATE%.log';
const accessLogPath = 'access-%DATE%.log';

// 日志格式
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
);

// 控制台输出格式
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(
    ({ level, message, timestamp, context, requestId, ...meta }) => {
      const requestIdStr = requestId ? `[${requestId}] ` : '';
      const contextStr = context ? `[${context}] ` : '';
      const metaStr = Object.keys(meta).length
        ? `\n${JSON.stringify(meta, null, 2)}`
        : '';

      return `${timestamp} ${level}: ${requestIdStr}${contextStr}${message}${metaStr}`;
    },
  ),
);

// 定义日志过滤器
const accessFilter = winston.format((info) => {
  if (info.context === 'RequestLogger') {
    return info;
  }
  return false;
});

/**
 * 创建日志配置
 */
export const createLoggerConfig = (
  configService: ConfigService,
): WinstonModuleOptions => {
  const loggerConfig = configService.get('logger');
  const logLevel = loggerConfig.level || (isDevelopment ? 'debug' : 'info');
  const consoleEnabled =
    loggerConfig.console !== undefined ? loggerConfig.console : true;
  const fileEnabled =
    loggerConfig.file?.enabled !== undefined ? loggerConfig.file.enabled : true;
  const maxFiles = loggerConfig.file?.maxFiles || 30;
  const maxSize = loggerConfig.file?.maxSize || 10485760; // 10MB

  const transports = [];

  // 添加控制台日志
  if (consoleEnabled) {
    transports.push(
      new winston.transports.Console({
        format: consoleFormat,
      }),
    );
  }

  // 添加文件日志
  if (fileEnabled) {
    // 错误日志
    transports.push(
      new winston.transports.DailyRotateFile({
        dirname: logDir,
        filename: errorLogPath,
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        format: logFormat,
        maxFiles,
        maxSize,
        zippedArchive: true,
      }),
    );
    // 访问日志（仅包含请求和响应信息）
    transports.push(
      new winston.transports.DailyRotateFile({
        dirname: logDir,
        filename: accessLogPath,
        datePattern: 'YYYY-MM-DD',
        format: winston.format.combine(accessFilter(), logFormat),
        maxFiles,
        maxSize,
        zippedArchive: true,
      }),
    );
    // 所有日志
    transports.push(
      new winston.transports.DailyRotateFile({
        dirname: logDir,
        filename: combinedLogPath,
        datePattern: 'YYYY-MM-DD',
        format: logFormat,
        maxFiles,
        maxSize,
        zippedArchive: true,
      }),
    );
  }

  return {
    transports,
    level: logLevel,
    // 在生产环境下处理未捕获的异常和 Promise rejection
    handleExceptions: !isDevelopment,
    handleRejections: !isDevelopment,
  };
};
