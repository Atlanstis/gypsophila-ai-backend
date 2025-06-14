import { ParseUUIDPipe, ParseUUIDPipeOptions } from '@nestjs/common';

import { ParamException } from '../exceptions';

/**
 * UUID 验证管道工厂
 * 用于创建统一的 UUID 参数验证管道
 */
export class UuidValidationPipeFactory {
  /**
   * 创建一个配置好的 UUID 验证管道实例
   * @param property 属性名称，用于错误消息中显示
   * @param customOptions 自定义配置选项
   * @returns 配置好的 ParseUUIDPipe 实例
   */
  static create(
    property = '参数',
    customOptions?: Partial<ParseUUIDPipeOptions>,
  ): ParseUUIDPipe {
    const options: ParseUUIDPipeOptions = {
      exceptionFactory: () =>
        new ParamException(`${property}格式错误，应为有效的UUID格式`),
      ...customOptions,
    };

    return new ParseUUIDPipe(options);
  }
}
