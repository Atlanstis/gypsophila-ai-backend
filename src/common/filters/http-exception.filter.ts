import { Request, Response } from 'express';

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { LoggerService } from '../../logger/logger.service';
import { StatusCode } from '../enums/status-code.enum';
import { ConfigException, ParamException } from '../exceptions';
import { AuthException } from '../exceptions/auth.exception';
import { BusinessException } from '../exceptions/business.exception';
import { ResponseHelper } from '../helpers/response.helper';

/**
 * 自定义异常基类接口
 */
interface CustomException {
  getErrorCode(): StatusCode;
  getStatusCode(): HttpStatus;
  message: string;
}

/**
 * 全局HTTP异常过滤器
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const errorInfo = this.getErrorInfo(exception);
    const isProduction = process.env.NODE_ENV === 'production';
    const error = isProduction
      ? undefined
      : exception instanceof Error
        ? String(exception.stack)
        : undefined;

    if (isProduction) {
      this.logger.error(errorInfo.message, 'HttpExceptionFilter');
    } else {
      this.logger.error(errorInfo.message, 'HttpExceptionFilter', error);
    }

    const responseBody = ResponseHelper.error(
      errorInfo.errorCode,
      errorInfo.message,
      request,
      error,
    );

    response.status(errorInfo.statusCode).json(responseBody);
  }

  /**
   * 获取错误信息
   */
  private getErrorInfo(exception: unknown): {
    errorCode: StatusCode;
    statusCode: HttpStatus;
    message: string;
  } {
    // 默认错误信息
    const defaultError = {
      errorCode: StatusCode.INTERNAL_SERVER_ERROR,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: '服务器内部错误',
    };

    // 处理自定义异常
    const customExceptions: (new (...args: any[]) => CustomException)[] = [
      AuthException,
      BusinessException,
      ParamException,
      ConfigException,
    ];

    for (const ExceptionClass of customExceptions) {
      if (exception instanceof ExceptionClass) {
        return {
          errorCode: exception.getErrorCode(),
          statusCode: exception.getStatusCode(),
          message: exception.message,
        };
      }
    }

    // 处理 NestJS 内置 HTTP 异常
    if (exception instanceof HttpException) {
      let message = exception.message;
      let errorCode = defaultError.errorCode;
      const statusCode = exception.getStatus();
      switch (statusCode) {
        case HttpStatus.NOT_FOUND:
          message = '请求的资源不存在';
          errorCode = StatusCode.NOT_FOUND;
          break;
        default:
          break;
      }
      return {
        ...defaultError,
        errorCode,
        statusCode,
        message,
      };
    }

    return defaultError;
  }
}
