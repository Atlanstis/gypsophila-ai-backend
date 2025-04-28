import { HttpStatus } from '@nestjs/common';

import { StatusCode } from '../enums/status-code.enum';

/**
 * 业务错误码类型
 */
type ErrorCode = StatusCode.CONFIG_ERROR;

/**
 * 配置异常类
 * 用于处理配置相关的错误
 */
export class ConfigException extends Error {
  private readonly errorCode: ErrorCode;
  private readonly statusCode = HttpStatus.BAD_REQUEST;

  constructor(
    message: string,
    /**
     * 错误码
     */
    errorCode: ErrorCode = StatusCode.CONFIG_ERROR,
  ) {
    super(message);
    this.name = 'ConfigException';
    this.errorCode = errorCode;
  }

  getErrorCode(): ErrorCode {
    return this.errorCode;
  }

  getStatusCode() {
    return this.statusCode;
  }
}
