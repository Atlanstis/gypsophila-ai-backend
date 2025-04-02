import { StatusCode } from '../enums/status-code.enum';

/**
 * 授权相关错误码类型
 */
export type AuthErrorCode =
  | StatusCode.UNAUTHORIZED
  | StatusCode.ACCESS_TOKEN_EXPIRED
  | StatusCode.ACCESS_TOKEN_INVALID
  | StatusCode.REFRESH_TOKEN_EXPIRED
  | StatusCode.REFRESH_TOKEN_INVALID
  | StatusCode.USER_NOT_FOUND;

/**
 * 授权异常类
 * 用于处理认证和授权相关的错误
 */
export class AuthException extends Error {
  private readonly errorCode: AuthErrorCode;

  constructor(
    message: string,
    /**
     * 授权相关错误码
     */
    errorCode: AuthErrorCode = StatusCode.UNAUTHORIZED,
  ) {
    super(message);
    this.name = 'AuthException';
    this.errorCode = errorCode;
  }

  /**
   * 获取错误码
   */
  getErrorCode(): AuthErrorCode {
    return this.errorCode;
  }
}
