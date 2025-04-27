import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';
import dts from 'rollup-plugin-dts';

export default defineConfig({
  // 输入是index.ts文件
  input: './src/types/api/index.ts',
  output: {
    // 输出到dist-types目录的单一文件
    file: './dist-types/index.d.ts',
    format: 'es',
  },
  external: [
    '@nestjs/common',
    '@nestjs/config',
    '@nestjs/core',
    '@nestjs/jwt',
    '@nestjs/platform-express',
    '@nestjs/typeorm',
  ],
  plugins: [
    // 使用nodeResolve插件
    nodeResolve(),
    // 使用TypeScript插件
    typescript({
      tsconfig: './tsconfig.types.json',
      // 只生成声明文件
      declaration: true,
      emitDeclarationOnly: true,
      // 保留注释
      removeComments: false,
    }),
    // 使用dts插件处理和合并声明文件
    dts({
      // 启用摇树优化，只包含被引用的类型
      respectExternal: true,
      compilerOptions: {
        preserveSymlinks: false,
        // 保留注释
        removeComments: false,
      },
    }),
  ],
  // 优化选项
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false,
  },
});
