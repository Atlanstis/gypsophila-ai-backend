import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthService } from '../auth.service';

/**
 * 解密请求体中的加密数据装饰器
 * 使用方式：@DecryptData('fieldName') decryptedData: any
 */
export const DecryptData = createParamDecorator(
  (field: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const authService = request.app.get(AuthService);

    if (!request.body || !request.body.encryptedData) {
      return null;
    }

    try {
      const decryptedRawData = authService.decryptData(
        request.body.encryptedData,
      );
      const decryptedData = JSON.parse(decryptedRawData);

      // 如果指定了字段，返回该字段的值，否则返回整个解密后的数据
      return field ? decryptedData[field] : decryptedData;
    } catch (error) {
      console.error('解密数据失败:', error.message);
      return null;
    }
  },
);
