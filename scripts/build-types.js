const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const rimraf = require('rimraf');

// 获取当前项目版本和构建时间
const getVersionInfo = () => {
  // 从 package.json 读取版本
  const packageJsonPath = path.resolve(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const version = packageJson.version;

  // 获取当前时间（北京时间）
  const now = new Date();
  // 将 UTC 时间转换为北京时间 (UTC+8)
  const beijingTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  const buildTime =
    beijingTime.toISOString().replace('T', ' ').substring(0, 19) + ' GMT+8';

  // 获取Git信息（如果有）
  let gitCommit = '';
  let gitBranch = '';

  try {
    gitCommit = execSync('git rev-parse --short HEAD').toString().trim();
    gitBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  } catch (error) {
    console.warn('无法获取Git信息:', error.message);
  }

  return {
    version,
    buildTime,
    gitCommit,
    gitBranch,
  };
};

// 输出目录
const outputDir = path.resolve(__dirname, '../dist-types');

// 使用 rimraf 清空输出目录
console.log(`Cleaning directory: ${outputDir}`);
rimraf.sync(outputDir);
console.log('Directory cleaned successfully');

// 确保输出目录存在
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 获取版本信息
const versionInfo = getVersionInfo();
console.log('Building API types...');
console.log(`Version: ${versionInfo.version}`);
console.log(`Build Time: ${versionInfo.buildTime}`);
if (versionInfo.gitCommit && versionInfo.gitBranch) {
  console.log(`Git: ${versionInfo.gitBranch} (${versionInfo.gitCommit})`);
}

// 先使用 TypeScript 编译器生成 .d.ts 文件
console.log('Compiling TypeScript...');
try {
  execSync('tsc -p tsconfig.types.json', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to compile TypeScript:', error);
  process.exit(1);
}

// 创建带有版本信息的入口文件 (可选)
const versionHeaderContent = `/**
 * Gypsophila API 类型定义
 * 
 * @version ${versionInfo.version}
 * @buildTime ${versionInfo.buildTime}
 * ${versionInfo.gitCommit ? `@gitCommit ${versionInfo.gitCommit}` : ''}
 * ${versionInfo.gitBranch ? `@gitBranch ${versionInfo.gitBranch}` : ''}
 */

`;

// 创建版本信息文件
const versionInfoContent = `# 版本信息

- 版本号: ${versionInfo.version}
- 构建时间: ${versionInfo.buildTime}
${versionInfo.gitCommit ? `- Git提交: ${versionInfo.gitCommit}` : ''}
${versionInfo.gitBranch ? `- Git分支: ${versionInfo.gitBranch}` : ''}
`;

fs.writeFileSync(path.resolve(outputDir, 'VERSION.md'), versionInfoContent);

// 添加说明文件
const readmeContent = `# Gypsophila API 类型定义

这个目录包含 Gypsophila Admin 系统的所有 API 接口类型定义，用于前端项目本地引用。

## 版本信息

- 版本号: ${versionInfo.version}
- 构建时间: ${versionInfo.buildTime}
${versionInfo.gitCommit ? `- Git提交: ${versionInfo.gitCommit}` : ''}
${versionInfo.gitBranch ? `- Git分支: ${versionInfo.gitBranch}` : ''}

## 使用方法

1. 将整个 \`dist-types\` 目录复制到前端项目中适当的位置，例如 \`src/types/api-types\`

2. 在前端项目的 tsconfig.json 中添加路径映射：

\`\`\`json
{
  "compilerOptions": {
    "paths": {
      "@api-types/*": ["src/types/api-types/*"]
    }
  }
}
\`\`\`

3. 在前端代码中导入和使用类型：

\`\`\`typescript
// 导入所有API类型
import { GypsophilaApi, LoginRequest, User } from '@api-types/api/index';

// 或者通过根入口导入
import { GypsophilaApi, LoginRequest, User } from '@api-types/index';

// 或者导入特定模块类型
import { AuthApi, LoginRequest } from '@api-types/api/auth/auth.types';
\`\`\`

## 类型结构

- \`api/\`: API相关类型
  - \`common/\`: 通用类型定义
  - \`auth/\`: 认证相关类型
  - \`users/\`: 用户相关类型
  - \`menus/\`: 菜单相关类型
  - \`roles/\`: 角色相关类型
`;

fs.writeFileSync(path.resolve(outputDir, 'README.md'), readmeContent);

console.log('Types bundle created successfully.');
console.log(`Output directory: ${outputDir}`);
console.log('前端项目使用方法请查看 README.md 文件。');
