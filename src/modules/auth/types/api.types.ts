/**
 * 认证模块类型定义
 */
import { ICurrentUser } from 'src/common/decorators/user.decorator';
import { ApiResponse } from 'src/types/api/response.types';

import { TokenPair } from './business.types';
import { ILoginDto, IRefreshTokenDto } from './dto.types';

// 复用ICurrentUser，不再定义CurrentUser接口
export type CurrentUser = ICurrentUser;

/**
 * 登录请求类型
 */
export type LoginRequest = ILoginDto;

/**
 * 登录响应类型
 */
export type LoginResponse = ApiResponse<TokenPair>;

/**
 * 刷新令牌请求类型
 */
export type RefreshTokenRequest = IRefreshTokenDto;

/**
 * 刷新令牌响应类型
 */
export type RefreshTokenResponse = ApiResponse<TokenPair>;

/**
 * 获取公钥响应类型
 */
export type GetPublicKeyResponse = ApiResponse<{ publicKey: string }>;

/**
 * 获取用户信息响应类型
 */
export type GetUserInfoResponse = ApiResponse<CurrentUser>;

/**
 * 登出响应类型
 */
export type LogoutResponse = ApiResponse;

/**
 * 认证接口定义
 */
export interface AuthApi {
  /**
   * 获取RSA公钥
   */
  getPublicKey(): Promise<GetPublicKeyResponse>;

  /**
   * 用户登录
   */
  login(data: LoginRequest): Promise<LoginResponse>;

  /**
   * 刷新访问令牌
   */
  refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse>;

  /**
   * 获取当前用户信息
   */
  getUserInfo(): Promise<GetUserInfoResponse>;

  /**
   * 用户登出
   */
  logout(): Promise<LogoutResponse>;
}
