import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { StatusCode } from '../enums/status-code.enum';
import { AuthException } from '../exceptions/auth.exception';

/**
 * 用户信息装饰器
 * 用于获取当前认证用户的信息
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new AuthException('未认证的请求', StatusCode.UNAUTHORIZED);
    }

    // 如果指定了data，则返回用户对象的特定字段
    if (data) {
      return user[data];
    }

    // 否则返回整个用户对象
    return user;
  },
);
