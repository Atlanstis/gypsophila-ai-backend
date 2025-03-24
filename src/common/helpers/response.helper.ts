import { StatusCode } from '../enums/status-code.enum';
import { Response } from '../interfaces/response.interface';
import { Request } from 'express';

/**
 * 响应帮助工具类
 * 用于创建标准格式的响应
 */
export class ResponseHelper {
  /**
   * 创建成功响应
   * @param data 响应数据
   * @param message 响应消息
   * @param request 请求对象
   * @returns 标准响应对象
   */
  static success<T>(
    data: T,
    message: string = '操作成功',
    request?: Request,
  ): Response<T> {
    return {
      code: StatusCode.SUCCESS,
      message,
      data,
      path: request?.path || '',
      timestamp: Math.floor(Date.now() / 1000),
    };
  }

  /**
   * 创建错误响应
   * @param errorCode 错误码
   * @param message 错误消息
   * @param request 请求对象
   * @param error 错误详情
   * @returns 标准响应对象
   */
  static error(
    errorCode: StatusCode,
    message: string,
    request?: Request,
    error?: any,
  ): Response {
    return {
      code: errorCode,
      message,
      data: null,
      path: request?.path || '',
      timestamp: Math.floor(Date.now() / 1000),
      error:
        process.env.NODE_ENV === 'development' ? error?.message : undefined,
    };
  }
}
