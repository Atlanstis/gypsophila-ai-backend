import { SetMetadata } from '@nestjs/common';

/**
 * 响应消息元数据键
 */
export const RESPONSE_MESSAGE_METADATA_KEY = 'response_message';

/**
 * 响应消息装饰器
 * 用于设置自定义响应消息
 * @param message 自定义响应消息
 */
export const ResponseMessage = (message: string) =>
  SetMetadata(RESPONSE_MESSAGE_METADATA_KEY, message);
