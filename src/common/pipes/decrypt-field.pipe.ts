import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  Type,
} from '@nestjs/common';
import { RsaService } from '../../modules/auth/rsa.service';

/**
 * 解密字段配置类型
 */
export type DecryptFields = string | string[];

/**
 * 解密特定字段的管道
 */
export class DecryptFieldPipe implements PipeTransform {
  private readonly fields: string[];

  constructor(
    private readonly rsaService: RsaService,
    fields: DecryptFields = 'password',
  ) {
    this.fields = Array.isArray(fields) ? fields : [fields];
  }

  /**
   * 转换和解密请求数据中的特定字段
   * @param value 请求体数据
   * @param metadata 参数元数据
   * @returns 处理后的数据
   */
  async transform(value: any, metadata: ArgumentMetadata) {
    // 如果不是请求体数据，或者值为空，则直接返回
    if (metadata.type !== 'body' || !value) {
      return value;
    }

    const result = { ...value };

    // 处理所有需要解密的字段
    for (const fieldName of this.fields) {
      // 检查并解密指定字段
      if (this.shouldDecrypt(result, fieldName)) {
        result[fieldName] = await this.decryptField(
          result[fieldName],
          fieldName,
        );
      }
    }

    return result;
  }

  /**
   * 判断字段是否需要解密
   * @param data 数据对象
   * @param field 字段名
   * @returns 是否需要解密
   */
  private shouldDecrypt(data: any, field: string): boolean {
    return (
      data[field] !== undefined &&
      typeof data[field] === 'string' &&
      data[field].length > 0
    );
  }

  /**
   * 解密字段值
   * @param encryptedValue 加密的值
   * @param fieldName 字段名
   * @returns 解密后的值
   */
  private async decryptField(
    encryptedValue: string,
    fieldName: string,
  ): Promise<any> {
    const decryptedData = await this.rsaService.decryptData(
      encryptedValue,
      fieldName,
    );

    try {
      // 尝试将解密后的数据解析为 JSON
      return JSON.parse(decryptedData);
    } catch {
      // 如果解析失败，则返回原始解密字符串
      return decryptedData;
    }
  }
}

/**
 * 创建解密字段管道的工厂函数
 * @param fields 要解密的字段名，可以是单个字段名字符串或字段名数组，默认为 'password'
 * @returns 解密字段管道
 */
export function DecryptField(
  fields: DecryptFields = 'password',
): Type<PipeTransform> {
  @Injectable()
  class DecryptFieldPipeMixin extends DecryptFieldPipe {
    constructor(rsaService: RsaService) {
      super(rsaService, fields);
    }
  }

  const fieldDisplay = Array.isArray(fields) ? fields.join('_') : fields;

  Object.defineProperty(DecryptFieldPipeMixin, 'name', {
    value: `DecryptField_${fieldDisplay}Pipe`,
  });

  return DecryptFieldPipeMixin;
}
