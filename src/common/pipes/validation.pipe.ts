import { ValidationPipe, ValidationPipeOptions } from '@nestjs/common';

import { ValidationErrorHelper } from '../helpers/validation-error.helper';

/**
 * 创建自定义验证管道
 * 用于处理请求参数验证并提供友好的错误消息
 */
export class ValidationPipeFactory {
  /**
   * 创建一个配置好的验证管道实例
   * @returns 配置好的ValidationPipe实例
   */
  static create(): ValidationPipe {
    const options: ValidationPipeOptions = {
      transform: true, // 转换参数类型
      whitelist: true, // 去除未定义的属性
      forbidNonWhitelisted: true, // 禁止未定义的属性
      stopAtFirstError: true, // 遇到第一个错误时停止验证
      exceptionFactory: (errors) => {
        // 使用ValidationErrorHelper将验证错误转换为业务异常
        return ValidationErrorHelper.toBusinessException(errors);
      },
    };

    return new ValidationPipe(options);
  }
}
