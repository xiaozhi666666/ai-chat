#!/bin/bash
# 强制使用 npm 进行构建
export npm_config_package_manager=npm
export FORCE_NPM=true

# 清理 yarn 相关文件
rm -f yarn.lock .yarnrc.yml .yarn

# 使用 npm 安装依赖
npm ci --legacy-peer-deps

# 构建项目
npm run build