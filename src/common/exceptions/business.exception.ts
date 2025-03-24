import { StatusCode } from '../enums/status-code.enum';

/**
 * 业务错误码类型
 * 排除所有授权相关的错误码
 */
export type BusinessErrorCode =
  | StatusCode.BAD_REQUEST
  | StatusCode.ACCESS_FORBIDDEN
  | StatusCode.NOT_FOUND
  | StatusCode.METHOD_NOT_ALLOWED
  | StatusCode.PARAMETER_ERROR
  | StatusCode.TOO_MANY_REQUESTS
  | StatusCode.INTERNAL_SERVER_ERROR
  | StatusCode.SERVICE_UNAVAILABLE
  | StatusCode.BUSINESS_ERROR
  | StatusCode.USER_NOT_FOUND
  | StatusCode.PASSWORD_ERROR;

/**
 * 业务异常类
 * 用于处理业务逻辑相关的错误
 */
export class BusinessException extends Error {
  /**
   * 错误码
   */
  private readonly errorCode: BusinessErrorCode;

  /**
   * 构造函数
   * @param message 错误消息
   * @param errorCode 错误码
   */
  constructor(
    message: string,
    /**
     * 错误码
     */
    errorCode: BusinessErrorCode = StatusCode.BUSINESS_ERROR,
  ) {
    super(message);
    this.name = 'BusinessException';
    this.errorCode = errorCode;
  }

  /**
   * 获取错误码
   */
  getErrorCode(): BusinessErrorCode {
    return this.errorCode;
  }
}
