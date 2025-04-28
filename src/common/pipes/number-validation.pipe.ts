import { ParseIntPipe, ParseIntPipeOptions } from '@nestjs/common';

import { ParamException } from '../exceptions';

/**
 * 数字验证管道工厂
 * 用于创建统一的数字参数验证管道
 */
export class NumberValidationPipeFactory {
  /**
   * 创建一个配置好的数字验证管道实例
   * @param property 属性名称，用于错误消息中显示
   * @param customOptions 自定义配置选项
   * @returns 配置好的 ParseIntPipe 实例
   */
  static create(
    property = '参数',
    customOptions?: Partial<ParseIntPipeOptions>,
  ): ParseIntPipe {
    const options: ParseIntPipeOptions = {
      exceptionFactory: () =>
        new ParamException(`${property}格式错误，应为有效的数字格式`),
      ...customOptions,
    };

    return new ParseIntPipe(options);
  }
}
