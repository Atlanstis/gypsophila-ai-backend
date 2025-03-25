import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class LoggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  /**
   * 记录普通信息日志
   * @param message 日志消息
   * @param context 上下文
   * @param meta 元数据
   */
  info(message: string, context?: string, meta?: Record<string, any>): void {
    this.logger.info(message, { context, ...meta });
  }

  /**
   * 记录错误日志
   * @param message 错误消息
   * @param context 上下文
   * @param trace 错误堆栈
   * @param meta 元数据
   */
  error(
    message: string,
    context?: string,
    trace?: string,
    meta?: Record<string, any>,
  ): void {
    this.logger.error(message, { context, trace, ...meta });
  }

  /**
   * 记录警告日志
   * @param message 警告消息
   * @param context 上下文
   * @param meta 元数据
   */
  warn(message: string, context?: string, meta?: Record<string, any>): void {
    this.logger.warn(message, { context, ...meta });
  }

  /**
   * 记录调试日志
   * @param message 调试消息
   * @param context 上下文
   * @param meta 元数据
   */
  debug(message: string, context?: string, meta?: Record<string, any>): void {
    this.logger.debug(message, { context, ...meta });
  }

  /**
   * 记录详细日志
   * @param message 详细消息
   * @param context 上下文
   * @param meta 元数据
   */
  verbose(message: string, context?: string, meta?: Record<string, any>): void {
    this.logger.verbose(message, { context, ...meta });
  }
}
