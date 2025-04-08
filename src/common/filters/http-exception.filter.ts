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
import { AuthException } from '../exceptions/auth.exception';
import { BusinessException } from '../exceptions/business.exception';
import { ResponseHelper } from '../helpers/response.helper';

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
      message = exception.message;
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
