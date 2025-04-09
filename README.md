# Gypsophila AI Backend

基于 NestJS 的后端服务，提供统一的 API 响应格式和认证方案。

## API 响应方案

### 1. 统一响应格式

所有 API 响应都遵循以下格式：

```json
{
  "code": 200000, // 状态码（前3位HTTP状态码+后3位业务码）
  "message": "操作成功", // 响应消息
  "data": null, // 响应数据
  "path": "/api/xxx", // 请求路径
  "timestamp": 1617235235 // 时间戳
}
```

> **注意**：所有接口的 HTTP 状态码默认返回 200，具体的错误信息通过响应体中的 `code` 字段来表示。这样的设计使得前端可以统一处理响应，而不需要针对不同的 HTTP 状态码做特殊处理。

为确保响应格式的一致性，系统采用了以下机制：

1. **响应接口规范化**：所有响应必须符合 `Response<T>` 接口
2. **ResponseHelper 工具类**：提供统一的响应创建方法
3. **全局拦截器**：自动转换控制器返回的数据为标准响应格式
4. **全局异常过滤器**：将异常转换为标准响应格式

这确保了无论是正常响应、异常响应还是业务错误，都能保持一致的格式。

### 2. 状态码说明

状态码格式为 `XXXYYY`，其中：

- `XXX`: HTTP状态码（如200、401、404、500等）
- `YYY`: 业务码（000表示无特定业务场景）

#### 2.1 系统基础状态码

- 200000: 操作成功
- 400000: 请求参数错误
- 401000: 未授权
- 403000: 禁止访问
- 404000: 资源不存在
- 405000: 方法不允许
- 422000: 参数验证失败
- 429000: 请求过于频繁
- 500000: 服务器内部错误
- 503000: 服务不可用

#### 2.2 业务状态码

##### 认证相关 (401XXX)

- 401001: 访问令牌过期
- 401002: 访问令牌无效
- 401003: 刷新令牌过期
- 401004: 刷新令牌无效

##### 用户相关 (404XXX/403XXX)

- 404005: 用户不存在
- 403006: 密码错误

##### 通用业务错误 (400XXX)

- 400000: 通用业务逻辑错误

### 3. 异常处理

本项目使用两种不同类型的异常来区分业务逻辑错误和授权错误：

#### 3.1 业务异常 (BusinessException)

- 用于处理一般业务逻辑错误
- HTTP 状态码固定为 200，通过自定义 code 区分不同错误
- 业务异常通常不会影响用户的认证状态
- 只能使用非授权相关的错误码：
  - 400XXX: 请求参数错误、通用业务错误
  - 403XXX: 禁止访问、密码错误
  - 404XXX: 资源不存在、用户不存在
  - 405XXX: 方法不允许
  - 422XXX: 参数验证失败
  - 429XXX: 请求过于频繁
  - 500XXX: 服务器内部错误
  - 503XXX: 服务不可用

示例：

```typescript
// 用户不存在
throw new BusinessException('用户不存在', StatusCode.USER_NOT_FOUND);

// 密码错误
throw new BusinessException('用户名或密码错误', StatusCode.PASSWORD_ERROR);

// 通用业务错误
throw new BusinessException('订单已关闭', StatusCode.BUSINESS_ERROR);
```

#### 3.2 授权异常 (AuthException)

- 专门用于处理认证和授权相关的错误
- HTTP 状态码固定为 401 (Unauthorized)
- 授权异常会导致客户端需要重新认证
- 只能使用授权相关的错误码：
  - StatusCode.UNAUTHORIZED (401000)
  - StatusCode.TOKEN_EXPIRED (401001)
  - StatusCode.TOKEN_INVALID (401002)
  - StatusCode.REFRESH_TOKEN_EXPIRED (401003)
  - StatusCode.REFRESH_TOKEN_INVALID (401004)

示例：

```typescript
// 令牌过期
throw new AuthException('访问令牌已过期', StatusCode.TOKEN_EXPIRED);

// 缺少认证信息
throw new AuthException('未认证的请求', StatusCode.UNAUTHORIZED);
```

### 4. 响应帮助工具

为了确保响应格式的一致性，系统提供了 `ResponseHelper` 工具类：

```typescript
// 创建成功响应
ResponseHelper.success(data, message, request);

// 创建错误响应
ResponseHelper.error(statusCode, message, request, error);
```

所有响应都会通过这两个方法生成，确保格式一致。

### 5. 认证方案

采用双 Token 认证机制：

#### 5.1 访问令牌 (Access Token)

- 用于 API 访问认证
- 有效期较短（默认 15 分钟）
- 通过 Authorization 请求头传递
- 格式：`Bearer <token>`

#### 5.2 刷新令牌 (Refresh Token)

- 用于刷新访问令牌
- 有效期较长（默认 7 天）
- 通过请求体传递
- 用于获取新的令牌对

### 6. 配置系统

本项目使用YAML文件作为配置，支持多环境配置和配置验证。

#### 6.1 配置文件

配置文件位于项目根目录的 `config` 文件夹中：

- `app.yaml` - 开发环境配置
- `app.production.yaml` - 生产环境配置

系统会根据 `NODE_ENV` 环境变量自动选择相应的配置文件。

#### 6.2 配置结构

配置文件包含以下主要部分：

```yaml
# 应用配置
app:
  name: Gypsophila AI Backend
  env: development
  port: 3000
  prefix: /api

# 数据库配置
database:
  type: mysql
  host: localhost
  port: 3306
  username: root
  password: password
  database: gypsophila
  synchronize: true
  logging: true

# JWT配置
jwt:
  secret: your-jwt-secret-key
  expiresIn: 15m
  refreshExpiresIn: 7d
# 其他配置...
```

#### 6.3 配置验证

所有配置都经过Joi验证，确保配置值的正确性和完整性：

- 必填项缺失会导致应用启动失败
- 类型错误会被检测出来
- 对特定字段进行格式验证（如端口号等）

#### 6.4 日志配置

系统使用 Winston 作为日志记录工具，支持控制台输出和文件记录两种方式，可以在配置文件中进行设置：

```yaml
# 日志配置
logger:
  level: debug # 日志级别: error, warn, info, http, verbose, debug, silly
  console: true # 是否输出到控制台
  file:
    enabled: true # 是否记录到文件
    maxFiles: 30 # 保留的日志文件数量
    maxSize: 10485760 # 单个日志文件最大大小 (默认 10MB)
```

##### 日志特性

- **按日期切割**：日志文件按天自动分割，文件名格式为 `[类型]-YYYY-MM-DD.log`
- **文件压缩**：旧的日志文件会自动压缩为 gzip 格式
- **多种日志**：系统会自动创建三种日志文件：
  - `error-YYYY-MM-DD.log`：仅记录错误级别的日志
  - `access-YYYY-MM-DD.log`：记录 HTTP 请求和响应
  - `combined-YYYY-MM-DD.log`：记录所有级别的日志
- **文件数量限制**：通过 `maxFiles` 配置控制保留的日志文件数量
- **文件大小限制**：通过 `maxSize` 配置控制单个日志文件大小，超出大小会自动创建新文件

##### 环境差异

- **开发环境**：默认同时启用控制台和文件日志
- **测试环境**：默认同时启用控制台和文件日志，但文件数量限制为 10 个
- **生产环境**：默认仅启用文件日志（禁用控制台输出），文件数量限制为 90 个，文件大小为 20MB

##### 日志模块使用说明

系统提供了 `LoggerService` 用于在代码中记录日志，它是对 Winston 的封装，提供了更便捷的使用方式。

###### 1. 在服务或控制器中注入并使用

```typescript
import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class UserService {
  constructor(private readonly logger: LoggerService) {
    // 设置日志上下文，方便区分不同模块的日志
    this.logger.setContext('UserService');
  }

  async findUser(userId: string) {
    this.logger.debug(`查找用户: ${userId}`);

    try {
      // 业务逻辑...
      const user = await this.userRepository.findOne(userId);

      if (!user) {
        this.logger.warn(`用户不存在: ${userId}`);
        return null;
      }

      this.logger.info(`成功获取用户: ${userId}`);
      return user;
    } catch (error) {
      this.logger.error(`获取用户失败: ${userId}`, error.stack);
      throw error;
    }
  }
}
```

###### 2. 日志级别

`LoggerService` 提供了多种日志级别方法，从低到高依次是：

- `logger.debug()` - 调试信息，仅在开发环境使用
- `logger.verbose()` - 详细信息，包含更多细节
- `logger.info()` - 普通信息，表示重要事件
- `logger.warn()` - 警告信息，表示潜在问题
- `logger.error()` - 错误信息，表示运行时错误

###### 3. 添加请求ID跟踪

在HTTP请求处理流程中，可以添加请求ID以便跟踪完整的请求生命周期：

```typescript
import { Controller, Get, Req } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { Request } from 'express';

@Controller('api')
export class ApiController {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext('ApiController');
  }

  @Get('data')
  async getData(@Req() request: Request) {
    // 使用请求ID记录日志
    const requestId = request.headers['x-request-id'] || 'unknown';
    this.logger.setRequestId(requestId);

    this.logger.info('处理获取数据请求');
    // 业务逻辑...

    return { data: 'some data' };
  }
}
```

###### 4. 记录结构化数据

可以记录包含元数据的结构化日志：

```typescript
this.logger.info('用户登录成功', {
  userId: user.id,
  email: user.email,
  ipAddress: request.ip,
  userAgent: request.headers['user-agent'],
});
```

###### 5. 记录异常堆栈

捕获并记录异常时，可以传入完整的错误堆栈：

```typescript
try {
  // 业务逻辑...
} catch (error) {
  this.logger.error('操作失败', error.stack);
  throw error;
}
```

#### 6.5 使用配置

在代码中通过注入 `ConfigService` 来使用配置：

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';

@Injectable()
export class ExampleService {
  constructor(private readonly configService: ConfigService) {}

  someMethod() {
    // 获取应用端口
    const port = this.configService.get('app', 'port');

    // 获取数据库配置
    const dbConfig = this.configService.get('database');

    // 获取JWT密钥
    const jwtSecret = this.configService.get('jwt', 'secret');
  }
}
```

### 7. 接口示例

#### 7.1 正常响应

```typescript
@Get('users')
async getUsers() {
  const users = await this.userService.findAll();
  return { data: users };
}
```

#### 7.2 自定义消息响应

##### 7.2.1 通过装饰器设置消息（推荐）

```typescript
@Get('users')
@ResponseMessage('获取用户列表成功')
async getUsers() {
  const users = await this.userService.findAll();
  return users; // 直接返回数据，消息由装饰器设置
}
```

##### 7.2.2 通过返回对象设置消息

```typescript
@Post('users')
async createUser() {
  const user = await this.userService.create();
  return {
    data: user,
    message: '用户创建成功'
  };
}
```

#### 7.3 抛出业务异常

```typescript
@Get('users/:id')
async getUser(@Param('id') id: string) {
  const user = await this.userService.findOne(id);
  if (!user) {
    throw new BusinessException('用户不存在', StatusCode.USER_NOT_FOUND); // 返回 404005
  }
  return { data: user };
}
```

#### 7.4 抛出授权异常

```typescript
@Get('protected')
async getProtectedResource(@Headers('authorization') auth: string) {
  if (!auth) {
    throw new AuthException('未提供认证信息', StatusCode.UNAUTHORIZED); // 返回 401000
  }
  // 验证 token
  try {
    const token = auth.split(' ')[1];
    const payload = this.authService.verifyToken(token);
    // 处理业务逻辑...
  } catch (error) {
    throw new AuthException('无效的令牌', StatusCode.TOKEN_INVALID); // 返回 401002
  }
}
```

### 8. 认证接口

#### 8.1 登录

```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password"
}
```

响应：

```json
{
  "code": 200000,
  "message": "登录成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

失败响应：

```json
{
  "code": 403006,
  "message": "用户名或密码错误",
  "data": null
}
```

#### 8.2 刷新令牌

```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

响应：

```json
{
  "code": 200000,
  "message": "令牌刷新成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

失败响应：

```json
{
  "code": 401003,
  "message": "刷新令牌已过期",
  "data": null
}
```

### 9. 开发说明

#### 9.1 环境准备

确保已安装Node.js (>=16.x)和pnpm。

#### 9.2 安装依赖

```bash
pnpm install
```

#### 9.3 开发服务器

```bash
# 开发环境（默认）
pnpm start:dev

# 生产环境构建
pnpm build:production

# 生产环境运行
pnpm start:production

# 或者使用 start:prod 运行编译后的代码
pnpm start:prod
```

#### 9.4 构建项目

```bash
# 默认构建
pnpm build

# 生产环境构建
pnpm build:production
```

#### 9.5 测试

```bash
# 单元测试
pnpm test

# e2e测试
pnpm test:e2e

# 测试覆盖率
pnpm test:cov
```

## 数据库配置

### MySQL 配置

项目使用 TypeORM 作为 ORM 框架，支持 MySQL 数据库。数据库配置位于 `config/app.yaml` 文件中：

```yaml
database:
  type: mysql
  host: localhost
  port: 3306
  username: 'root'
  password: 'your-password'
  database: 'gypsophila-ai'
  synchronize: true # 开发环境建议开启，生产环境建议关闭
  logging: true # 开发环境建议开启，生产环境建议关闭
```

#### 数据库迁移

1. 创建迁移

```bash
pnpm typeorm migration:create src/database/migrations/MigrationName
```

2. 生成迁移

```bash
pnpm typeorm migration:generate src/database/migrations/MigrationName
```

3. 运行迁移

```bash
pnpm typeorm migration:run
```

4. 回滚迁移

```bash
pnpm typeorm migration:revert
```

### Redis 配置

项目使用 ioredis 作为 Redis 客户端，Redis 配置位于 `config/app.yaml` 文件中：

```yaml
redis:
  host: localhost
  port: 6379
  password: '' # Redis 密码，如果有的话
  db: 0 # Redis 数据库编号
  keyPrefix: 'gypsophila:' # 键前缀，用于区分不同环境
```

#### Redis 服务使用示例

```typescript
import { RedisService } from './redis/redis.service';

@Injectable()
export class YourService {
  constructor(private readonly redisService: RedisService) {}

  async example() {
    // 设置键值对
    await this.redisService.set('key', 'value', 3600); // 1小时过期

    // 获取值
    const value = await this.redisService.get('key');

    // 删除键
    await this.redisService.delete('key');

    // 检查键是否存在
    const exists = await this.redisService.exists('key');

    // 设置过期时间
    await this.redisService.expire('key', 7200); // 2小时过期

    // 哈希表操作
    await this.redisService.hset('hash', 'field', 'value');
    const hashValue = await this.redisService.hget('hash', 'field');
    const allHash = await this.redisService.hgetall('hash');
  }
}
```

#### Redis 最佳实践

1. 键命名规范

   - 使用冒号分隔的命名空间
   - 例如：`gypsophila:user:1:profile`

2. 过期时间设置

   - 为所有缓存键设置合理的过期时间
   - 避免使用过长的过期时间
   - 考虑使用滑动过期时间

3. 错误处理

   - Redis 服务会自动处理连接错误
   - 建议在业务代码中处理 Redis 操作异常

4. 性能优化

   - 使用管道（pipeline）批量处理多个操作
   - 合理使用 Redis 事务
   - 避免使用过大的键值

5. 监控
   - 监控 Redis 内存使用情况
   - 监控 Redis 连接状态
   - 监控 Redis 命令执行时间

## 环境要求

- Node.js >= 16
- MySQL >= 8.0
- Redis >= 6.0

## 开发环境设置

1. 安装依赖

```bash
pnpm install
```

2. 配置环境变量

- 复制 `.env.example` 到 `.env`
- 修改数据库和 Redis 配置

3. 启动开发服务器

```bash
pnpm start:dev
```

## 生产环境部署

1. 构建应用

```bash
pnpm build
```

2. 启动生产服务器

```bash
pnpm start:prod
```

## 测试

```bash
# 单元测试
pnpm test

# e2e 测试
pnpm test:e2e
```

## 许可证

[MIT licensed](LICENSE)
