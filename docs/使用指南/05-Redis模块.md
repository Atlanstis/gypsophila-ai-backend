# Redis模块

## 重要说明

项目中所有 Redis key 必须通过 `src/redis/redis-key.constant.ts` 文件中提供的方法进行生成和使用。这是为了：

1. 统一管理所有 Redis key 的命名规范
2. 避免 key 重复和冲突
3. 便于后期维护和修改
4. 提供类型安全的使用方式

禁止在代码中直接硬编码 Redis key 字符串。

## 基本用法

```typescript
import { RedisService } from 'src/redis/redis.service';
import { UserRedisKey, AuthRedisKey } from 'src/redis/redis-key.constant';

@Injectable()
export class YourService {
  constructor(private readonly redisService: RedisService) {}

  async yourMethod() {
    // 正确的使用方式
    const userInfoKey = UserRedisKey.userInfo('123');
    await this.redisService.set(userInfoKey, 'value');

    // 错误的做法 - 直接使用字符串作为 key
    // await this.redisService.set('user:123:info', 'value'); // 禁止这样做

    // 获取用户信息
    const userInfo = await this.redisService.get(UserRedisKey.userInfo('123'));

    // 删除用户相关缓存
    await this.redisService.delete(UserRedisKey.userInfo('123'));
  }
}
```

## 配置Redis

Redis 配置在配置文件中定义：

```yaml
# config/*.yaml
redis:
  host: 'localhost'
  port: 6379
  password: '' # 可选
  db: 0
  keyPrefix: '' # 可选
```

## Redis服务方法

| 方法                      | 说明                | 参数                                             | 返回值                            |
| ------------------------- | ------------------- | ------------------------------------------------ | --------------------------------- |
| `set(key, value, ttl?)`   | 设置键值对          | `key`: 键<br>`value`: 值<br>`ttl?`: 过期时间(秒) | `Promise<void>`                   |
| `get(key)`                | 获取键值            | `key`: 键                                        | `Promise<string \| null>`         |
| `delete(key)`             | 删除键              | `key`: 键                                        | `Promise<number>` 删除的键数量    |
| `exists(key)`             | 检查键是否存在      | `key`: 键                                        | `Promise<boolean>`                |
| `expire(key, ttl)`        | 设置键的过期时间    | `key`: 键<br>`ttl`: 过期时间(秒)                 | `Promise<boolean>` 成功返回true   |
| `hset(key, field, value)` | 设置哈希表字段      | `key`: 哈希表键<br>`field`: 字段<br>`value`: 值  | `Promise<number>`                 |
| `hget(key, field)`        | 获取哈希表字段      | `key`: 哈希表键<br>`field`: 字段                 | `Promise<string \| null>`         |
| `hgetall(key)`            | 获取哈希表所有字段  | `key`: 哈希表键                                  | `Promise<Record<string, string>>` |
| `getClient()`             | 获取Redis客户端实例 | 无                                               | `Redis` 客户端实例                |

## 最佳实践

1. **键名命名规范**

   - 所有 Redis key 必须通过 `redis-key.constant.ts` 中提供的方法生成
   - 键名格式为：`模块:实体:ID:子项`
   - 例如：`user:info:123`、`auth:token:123:access`

2. **合理设置过期时间**

   - 对于缓存数据，设置合理的过期时间
   - 避免缓存数据长期占用内存

3. **数据序列化**
   - 对于复杂对象，需要手动序列化和反序列化

```typescript
// 存储复杂对象
const user = { id: 1, name: 'admin', roles: ['admin', 'editor'] };
const userInfoKey = UserRedisKey.userInfo('1');
await this.redisService.set(userInfoKey, JSON.stringify(user));

// 读取复杂对象
const userJson = await this.redisService.get(UserRedisKey.userInfo('1'));
const user = userJson ? JSON.parse(userJson) : null;
```

4. **哈希表使用场景**
   - 存储对象的多个字段时，优先使用哈希表
   - 便于单独更新对象的某个字段，而不影响其他字段 

5. **批量操作**
   - 使用 `RedisKeyPattern` 类提供的方法进行批量查询或删除操作
   - 例如：删除用户所有相关缓存

```typescript
// 删除用户所有相关缓存
const pattern = RedisKeyPattern.allUserRelatedKeys('123');
const keys = await this.redisService.keys(pattern);
if (keys.length > 0) {
  await this.redisService.delete(...keys);
}
``` 