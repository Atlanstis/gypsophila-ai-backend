import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

const execPromise = util.promisify(exec);

/**
 * 清理目录中除了指定文件外的所有文件和子目录
 * @param directoryPath 要清理的目录路径
 * @param keepFiles 要保留的文件名列表
 */
function cleanDirectory(directoryPath: string, keepFiles: string[] = []) {
  if (!fs.existsSync(directoryPath)) return;

  const files = fs.readdirSync(directoryPath);

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const stat = fs.statSync(filePath);

    // 如果是目录，递归删除
    if (stat.isDirectory()) {
      fs.rmSync(filePath, { recursive: true, force: true });
    }
    // 如果是文件且不在保留列表中，删除
    else if (!keepFiles.includes(file)) {
      fs.unlinkSync(filePath);
    }
  }
}

/**
 * 构建类型并进行摇树优化
 */
async function buildTypes() {
  try {
    // 确保脚本目录存在
    const typesDir = path.resolve(__dirname, '../dist-types');

    // 删除旧的构建
    if (fs.existsSync(typesDir)) {
      fs.rmSync(typesDir, { recursive: true, force: true });
    }

    // 创建必要的目录
    if (!fs.existsSync(typesDir)) {
      fs.mkdirSync(typesDir, { recursive: true });
    }

    // 执行 rollup 构建
    console.log('开始构建类型文件...');
    await execPromise('rollup -c rollup.config.mjs');
    console.log('类型文件构建完成');

    // 验证构建结果
    const apiTsPath = path.resolve(typesDir, 'api.ts');
    if (fs.existsSync(apiTsPath)) {
      // 清理除了 api.ts 之外的所有文件
      cleanDirectory(typesDir, ['api.ts']);

      // 读取生成的类型文件内容
      const content = fs.readFileSync(apiTsPath, 'utf-8');

      // 去除enum的declare修饰
      const updatedContent = content
        .replace(/declare const enum/g, 'const enum')
        .replace(/declare enum/g, 'enum');

      // 写回文件
      fs.writeFileSync(apiTsPath, updatedContent, 'utf-8');

      console.log('成功生成优化后的类型文件：', apiTsPath);
    } else {
      console.error('未找到生成的类型文件：', apiTsPath);
    }
  } catch (error) {
    console.error('构建类型文件时出错：', error);
    process.exit(1);
  }
}

buildTypes();
