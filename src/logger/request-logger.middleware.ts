import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { Injectable, NestMiddleware } from '@nestjs/common';

import { LoggerService } from './logger.service';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggerService: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // 为每个请求生成唯一ID
    const requestId = uuidv4();
    req['requestId'] = requestId;

    // 记录请求开始时间
    const startTime = Date.now();

    // 获取客户端IP并处理 IPv6 回环地址
    let ip = String(
      req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown',
    );

    // 处理 IPv6 回环地址 ::1，转换为更易读的 127.0.0.1
    if (ip === '::1' || ip === '::ffff:127.0.0.1') {
      ip = '127.0.0.1';
    }

    // 创建请求日志
    const requestLog = {
      requestId,
      method: req.method,
      url: req.originalUrl || req.url,
      ip,
      userAgent: req.headers['user-agent'] || 'unknown',
      query: req.query,
      body: this.sanitizeBody(req.body),
      timestamp: new Date().toISOString(),
    };

    // 记录请求信息
    this.loggerService.info(
      `请求开始: ${req.method} ${req.originalUrl || req.url}`,
      'RequestLogger',
      {
        request: requestLog,
      },
    );

    // 捕获响应数据
    const originalSend = res.send;
    let responseBody: any;

    // 重写 res.send 方法来捕获响应体
    res.send = function (body) {
      responseBody = body;
      return originalSend.call(this, body);
    } as any;

    // 重写 res.end 方法，以便在响应发送后记录响应信息
    const originalEnd = res.end;
    res.end = function (chunk?: any, ...args: any[]) {
      // 恢复原来的 end 方法并执行
      res.end = originalEnd;
      res.end(chunk, ...args);

      // 计算请求处理时间
      const responseTime = Date.now() - startTime;

      // 获取状态码
      const statusCode = res.statusCode;

      // 尝试解析响应体
      let parsedResponseBody = undefined;
      try {
        if (responseBody) {
          if (
            typeof responseBody === 'string' &&
            responseBody.startsWith('{')
          ) {
            parsedResponseBody = JSON.parse(responseBody);
          } else if (Buffer.isBuffer(responseBody)) {
            // 如果是二进制数据，则不记录详细内容
            parsedResponseBody = '[Binary Data]';
          } else {
            parsedResponseBody = responseBody;
          }
        }
      } catch {
        parsedResponseBody = '[无法解析的响应数据]';
      }

      // 创建响应日志
      const responseLog = {
        requestId,
        method: req.method,
        url: req.originalUrl || req.url,
        statusCode,
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString(),
        responseBody: parsedResponseBody
          ? this.sanitizeResponseBody(parsedResponseBody)
          : undefined,
      };

      const msg = `请求结束: ${req.method} ${
        req.originalUrl || req.url
      } ${statusCode} ${responseTime}ms`;

      // 日志级别根据状态码决定
      if (statusCode >= 400) {
        this.loggerService.warn(msg, 'RequestLogger', {
          response: responseLog,
        });
      } else {
        this.loggerService.info(msg, 'RequestLogger', {
          response: responseLog,
        });
      }
    }.bind(this);

    next();
  }

  /**
   * 处理请求体，移除敏感信息
   */
  private sanitizeBody(body: any): any {
    if (!body) return {};

    // 创建一个副本
    const sanitized = { ...body };

    // 敏感字段列表
    const sensitiveFields = [
      'password',
      'token',
      'secret',
      'authorization',
      'refreshToken',
    ];

    // 替换敏感字段
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '******';
      }
    }

    return sanitized;
  }

  /**
   * 处理响应体，移除敏感信息并限制大小
   */
  private sanitizeResponseBody(body: any): any {
    // 如果是字符串，可能是太大的响应，只记录前100个字符
    if (typeof body === 'string' && body.length > 100) {
      return body.substring(0, 100) + '... [truncated]';
    }

    // 如果是对象，则创建副本并清理
    if (typeof body === 'object' && body !== null) {
      // 如果是数组且长度大于10，只取前10个元素
      if (Array.isArray(body) && body.length > 10) {
        return [
          ...body.slice(0, 10),
          `... [and ${body.length - 10} more items]`,
        ];
      }

      try {
        // 将对象转为字符串，如果太大则截断
        const jsonString = JSON.stringify(body);
        if (jsonString.length > 1000) {
          return JSON.parse(
            jsonString.substring(0, 1000) + '..."} [truncated]',
          );
        }
      } catch {
        return '[复杂对象，无法序列化]';
      }
    }

    return body;
  }
}
