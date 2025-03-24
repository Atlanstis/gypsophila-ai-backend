import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from '../interfaces/response.interface';
import { RESPONSE_MESSAGE_METADATA_KEY } from '../decorators/response-message.decorator';
import { ResponseHelper } from '../helpers/response.helper';
import { Request } from 'express';

/**
 * 全局响应拦截器
 * 统一处理成功响应的格式
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest<Request>();

    // 从处理程序中获取自定义响应消息（如果存在）
    const responseMessage = this.reflector.get<string>(
      RESPONSE_MESSAGE_METADATA_KEY,
      context.getHandler(),
    );

    return next.handle().pipe(
      map((data) => {
        // 如果返回数据已经是标准响应格式则直接返回
        if (this.isStandardResponse(data)) {
          return data;
        }

        // 确定响应消息
        let message = '操作成功';
        let actualData = data;

        // 优先使用装饰器设置的消息
        if (responseMessage) {
          message = responseMessage;
        }
        // 其次检查如果数据是 { data, message } 格式，提取出来
        else if (
          data &&
          typeof data === 'object' &&
          'data' in data &&
          'message' in data &&
          Object.keys(data).length === 2
        ) {
          message = data.message;
          actualData = data.data;
        }

        // 使用 ResponseHelper 创建标准响应
        return ResponseHelper.success(actualData, message, request);
      }),
    );
  }

  /**
   * 检查数据是否已经是标准响应格式
   */
  private isStandardResponse(data: any): data is Response<any> {
    return (
      data &&
      typeof data === 'object' &&
      'code' in data &&
      'message' in data &&
      'data' in data &&
      'path' in data &&
      'timestamp' in data
    );
  }
}
