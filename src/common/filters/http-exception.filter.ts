import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BusinessException } from '../exceptions/business.exception';
import { AuthException } from '../exceptions/auth.exception';
import { StatusCode } from '../enums/status-code.enum';
import { ResponseHelper } from '../helpers/response.helper';
import { LoggerService } from '../../logger/logger.service';

/**
 * 全局HTTP异常过滤器
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let errorCode = StatusCode.INTERNAL_SERVER_ERROR;
    let message = '服务器内部错误';
    let error: string | undefined = undefined;

    if (exception instanceof AuthException) {
      errorCode = exception.getErrorCode();
      message = exception.message;
    } else if (exception instanceof BusinessException) {
      errorCode = exception.getErrorCode();
      message = exception.message;
    } else if (exception instanceof HttpException) {
      const status = exception.getStatus();
      switch (status) {
        case HttpStatus.BAD_REQUEST:
          errorCode = StatusCode.BAD_REQUEST;
          message = `请求参数错误: ${exception.message}`;
          break;
        case HttpStatus.UNAUTHORIZED:
          errorCode = StatusCode.UNAUTHORIZED;
          message = '未授权';
          break;
        case HttpStatus.FORBIDDEN:
          errorCode = StatusCode.ACCESS_FORBIDDEN;
          message = '禁止访问';
          break;
        case HttpStatus.NOT_FOUND:
          errorCode = StatusCode.NOT_FOUND;
          message = '资源不存在';
          break;
        case HttpStatus.METHOD_NOT_ALLOWED:
          errorCode = StatusCode.METHOD_NOT_ALLOWED;
          message = '方法不允许';
          break;
        case HttpStatus.UNPROCESSABLE_ENTITY:
          errorCode = StatusCode.PARAMETER_ERROR;
          message = '参数验证失败';
          break;
        case HttpStatus.TOO_MANY_REQUESTS:
          errorCode = StatusCode.TOO_MANY_REQUESTS;
          message = '请求过于频繁';
          break;
        case HttpStatus.INTERNAL_SERVER_ERROR:
          errorCode = StatusCode.INTERNAL_SERVER_ERROR;
          message = '服务器内部错误';
          break;
        case HttpStatus.SERVICE_UNAVAILABLE:
          errorCode = StatusCode.SERVICE_UNAVAILABLE;
          message = '服务不可用';
          break;
        default:
          errorCode = StatusCode.INTERNAL_SERVER_ERROR;
          message = '服务器内部错误';
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      error = exception instanceof Error ? String(exception.stack) : undefined;
      this.logger.error(message, 'HttpExceptionFilter', error);
    } else {
      this.logger.error(message, 'HttpExceptionFilter');
    }

    const responseBody = ResponseHelper.error(
      errorCode,
      message,
      request,
      error,
    );

    response.status(HttpStatus.OK).json(responseBody);
  }
}
