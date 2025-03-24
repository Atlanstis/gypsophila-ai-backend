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

- 400001: 通用业务逻辑错误

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

### 6. 使用示例

#### 6.1 正常响应

```typescript
@Get('users')
async getUsers() {
  const users = await this.userService.findAll();
  return { data: users };
}
```

#### 6.2 自定义消息响应

##### 6.2.1 通过装饰器设置消息（推荐）

```typescript
@Get('users')
@ResponseMessage('获取用户列表成功')
async getUsers() {
  const users = await this.userService.findAll();
  return users; // 直接返回数据，消息由装饰器设置
}
```

##### 6.2.2 通过返回对象设置消息

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

#### 6.3 抛出业务异常

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

#### 6.4 抛出授权异常

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

### 7. 认证接口

#### 7.1 登录

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

#### 7.2 刷新令牌

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

### 8. 开发说明

#### 8.1 环境变量

```env
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

#### 8.2 依赖安装

```bash
pnpm install
```

#### 8.3 开发服务器

```bash
pnpm start:dev
```
