import { ValidationError } from 'class-validator';

import { StatusCode } from '../enums/status-code.enum';
import { BusinessException } from '../exceptions/business.exception';

/**
 * 验证错误帮助类
 * 用于将class-validator的错误信息转换为更友好的中文提示
 */
export class ValidationErrorHelper {
  /**
   * 将验证错误转换为更友好的错误信息
   * @param errors ValidationError数组
   * @returns 格式化后的错误信息
   */
  static formatValidationErrors(errors: ValidationError[]): string {
    const messages: string[] = [];

    for (const error of errors) {
      if (error.constraints) {
        // 获取每个约束的错误信息
        const constraintMessages = Object.values(error.constraints);
        // 如果约束提供了自定义错误信息，则直接使用
        if (constraintMessages.length > 0) {
          messages.push(...constraintMessages);
        } else {
          // 否则使用字段名称和错误类型构建错误信息
          messages.push(`字段 ${error.property} 验证失败`);
        }
      }

      // 递归处理嵌套的验证错误
      if (error.children && error.children.length > 0) {
        const childrenMessages = this.formatValidationErrors(error.children);
        if (childrenMessages) {
          messages.push(childrenMessages);
        }
      }
    }

    return messages.join('; ');
  }

  /**
   * 将验证错误数组转换为业务异常
   * @param errors ValidationError数组
   * @returns BusinessException
   */
  static toBusinessException(errors: ValidationError[]): BusinessException {
    const message = this.formatValidationErrors(errors);
    return new BusinessException(message, StatusCode.PARAMETER_ERROR);
  }
}
