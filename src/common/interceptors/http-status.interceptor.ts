import { Observable } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

/**
 * 全局 HTTP 状态码拦截器
 * 统一处理 HTTP 状态码
 */
@Injectable()
export class HttpStatusInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    // 如果是 POST 请求，将状态码设置为 200
    if (method === 'POST') {
      context.switchToHttp().getResponse().status(200);
    }

    return next.handle();
  }
}
