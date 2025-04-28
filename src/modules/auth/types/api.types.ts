/**
 * 认证模块类型定义
 */
import { ICurrentUser } from '../../../common/decorators/user.decorator';
import { LoginDto, RefreshTokenDto } from '../dto';
import { ITokenPair } from './business.types';

// 复用ICurrentUser，不再定义CurrentUser接口
export type CurrentUser = ICurrentUser;

/**
 * 登录请求类型
 */
export type LoginRequest = LoginDto;

/**
 * 登录响应类型
 */
export type LoginResponse = ITokenPair;

/**
 * 刷新令牌请求类型
 */
export type RefreshTokenRequest = RefreshTokenDto;

/**
 * 刷新令牌响应类型
 */
export type RefreshTokenResponse = ITokenPair;

/**
 * 获取公钥响应类型
 */
export type GetPublicKeyResponse = { publicKey: string };

/**
 * 获取用户信息响应类型
 */
export type GetAuthInfoResponse = CurrentUser;

/**
 * 登出响应类型
 */
export type LogoutResponse = void;
