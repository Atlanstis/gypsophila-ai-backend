/**
 * 验证错误消息辅助类
 * 用于生成统一的验证错误消息
 */
export class ValidationMessageHelper {
  /**
   * 字符串验证错误消息
   */
  static string = {
    /**
     * 必须是字符串类型
     * @param property 属性名
     * @returns 错误消息
     */
    isString: (property?: string) => `${property || '此字段'}必须是字符串类型`,

    /**
     * 字符串长度范围验证
     * @param min 最小长度
     * @param max 最大长度
     * @param property 属性名
     * @returns 错误消息
     */
    length: (min: number, max: number, property?: string) =>
      `${property || '此字段'}长度必须在${min}到${max}个字符之间`,

    /**
     * 邮箱格式验证
     * @param property 属性名
     * @returns 错误消息
     */
    isEmail: (property?: string) =>
      `${property || '此字段'}必须是有效的电子邮箱地址`,

    /**
     * URL格式验证
     * @param property 属性名
     * @returns 错误消息
     */
    isUrl: (property?: string) => `${property || '此字段'}必须是有效的URL地址`,

    /**
     * 正则表达式匹配验证
     * @param pattern 正则表达式
     * @param property 属性名
     * @returns 错误消息
     */
    matches: (pattern: RegExp, property?: string) =>
      `${property || '此字段'}必须匹配模式 ${pattern.toString()}`,

    /**
     * UUID格式验证
     * @param version UUID版本
     * @param property 属性名
     * @returns 错误消息
     */
    isUuid: (version: string, property?: string) =>
      `${property || '此字段'}必须是有效的UUID${version ? `(版本${version})` : ''}`,

    /**
     * 日期字符串验证
     * @param property 属性名
     * @returns 错误消息
     */
    isDateString: (property?: string) =>
      `${property || '此字段'}必须是有效的日期字符串`,
  };

  /**
   * 数字验证错误消息
   */
  static number = {
    /**
     * 必须是数字类型
     * @param property 属性名
     * @returns 错误消息
     */
    isNumber: (property?: string) => `${property || '此字段'}必须是数字类型`,

    /**
     * 最小值验证
     * @param min 最小值
     * @param property 属性名
     * @returns 错误消息
     */
    min: (min: number, property?: string) =>
      `${property || '此字段'}必须大于或等于${min}`,

    /**
     * 最大值验证
     * @param max 最大值
     * @param property 属性名
     * @returns 错误消息
     */
    max: (max: number, property?: string) =>
      `${property || '此字段'}必须小于或等于${max}`,

    /**
     * 正数验证
     * @param property 属性名
     * @returns 错误消息
     */
    isPositive: (property?: string) => `${property || '此字段'}必须是正数`,

    /**
     * 负数验证
     * @param property 属性名
     * @returns 错误消息
     */
    isNegative: (property?: string) => `${property || '此字段'}必须是负数`,

    /**
     * 整数验证
     * @param property 属性名
     * @returns 错误消息
     */
    isInt: (property?: string) => `${property || '此字段'}必须是整数`,

    /**
     * 枚举值验证
     * @param enumValues 枚举值数组
     * @param property 属性名
     * @returns 错误消息
     */
    isEnum: (enumValues: any[], property?: string) =>
      `${property || '此字段'}必须是以下值之一: ${enumValues.join(', ')}`,
  };

  /**
   * 数组验证错误消息
   */
  static array = {
    /**
     * 必须是数组类型
     * @param property 属性名
     * @returns 错误消息
     */
    isArray: (property?: string) => `${property || '此字段'}必须是数组类型`,

    /**
     * 数组最小长度验证
     * @param min 最小长度
     * @param property 属性名
     * @returns 错误消息
     */
    arrayMinSize: (min: number, property?: string) =>
      `${property || '此字段'}至少要有${min}个元素`,

    /**
     * 数组最大长度验证
     * @param max 最大长度
     * @param property 属性名
     * @returns 错误消息
     */
    arrayMaxSize: (max: number, property?: string) =>
      `${property || '此字段'}最多只能有${max}个元素`,

    /**
     * 数组包含指定值验证
     * @param values 必须包含的值
     * @param property 属性名
     * @returns 错误消息
     */
    arrayContains: (values: any[], property?: string) =>
      `${property || '此字段'}必须包含以下值: ${values.join(', ')}`,

    /**
     * 数组元素唯一性验证
     * @param property 属性名
     * @returns 错误消息
     */
    arrayUnique: (property?: string) =>
      `${property || '此字段'}中的元素必须是唯一的`,
  };

  /**
   * 日期验证错误消息
   */
  static date = {
    /**
     * 必须是日期类型
     * @param property 属性名
     * @returns 错误消息
     */
    isDate: (property?: string) => `${property || '此字段'}必须是有效的日期`,

    /**
     * 最小日期验证
     * @param date 最小日期
     * @param property 属性名
     * @returns 错误消息
     */
    minDate: (date: Date, property?: string) =>
      `${property || '此字段'}必须晚于或等于${date.toISOString()}`,

    /**
     * 最大日期验证
     * @param date 最大日期
     * @param property 属性名
     * @returns 错误消息
     */
    maxDate: (date: Date, property?: string) =>
      `${property || '此字段'}必须早于或等于${date.toISOString()}`,
  };

  /**
   * 布尔值验证错误消息
   */
  static boolean = {
    /**
     * 必须是布尔类型
     * @param property 属性名
     * @returns 错误消息
     */
    isBoolean: (property?: string) => `${property || '此字段'}必须是布尔值类型`,
  };

  /**
   * 对象验证错误消息
   */
  static object = {
    /**
     * 必须是对象类型
     * @param property 属性名
     * @returns 错误消息
     */
    isObject: (property?: string) => `${property || '此字段'}必须是对象类型`,

    /**
     * 必须是指定类的实例
     * @param className 类名
     * @param property 属性名
     * @returns 错误消息
     */
    isInstance: (className: string, property?: string) =>
      `${property || '此字段'}必须是${className}的实例`,
  };

  /**
   * 通用验证错误消息
   */
  static common = {
    /**
     * 字段必须与指定值相等
     * @param comparison 比较值
     * @param property 属性名
     * @returns 错误消息
     */
    equals: (comparison: any, property?: string) =>
      `${property || '此字段'}必须等于${comparison}`,

    /**
     * 非空验证
     * @param property 属性名
     * @returns 错误消息
     */
    isNotEmpty: (property?: string) => `${property || '此字段'}不能为空`,

    /**
     * 字段必须有定义
     * @param property 属性名
     * @returns 错误消息
     */
    isDefined: (property?: string) => `${property || '此字段'}必须被定义`,
  };
}
