import { HttpStatus } from '@nestjs/common';

import { StatusCode } from '../enums/status-code.enum';

/**
 * 业务错误码类型
 */
type ErrorCode = StatusCode.PARAMETER_ERROR;

/**
 * 参数异常类
 * 用于处理参数相关的错误
 */
export class ParamException extends Error {
  private readonly errorCode: ErrorCode;
  private readonly statusCode = HttpStatus.BAD_REQUEST;

  constructor(
    message: string,
    /**
     * 错误码
     */
    errorCode: ErrorCode = StatusCode.PARAMETER_ERROR,
  ) {
    super(message);
    this.name = 'ParamException';
    this.errorCode = errorCode;
  }

  getErrorCode(): ErrorCode {
    return this.errorCode;
  }

  getStatusCode() {
    return this.statusCode;
  }
}
