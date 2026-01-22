#!/bin/bash

echo "================================"
echo "Mock实现验证脚本"
echo "================================"
echo ""

# 检查Mock数据文件
echo "1. 检查Mock数据文件..."
MOCK_DATA_FILES=(
  "src/mocks/data/tasks.ts"
  "src/mocks/data/directories.ts"
  "src/mocks/data/datasources.ts"
  "src/mocks/data/dependencies.ts"
  "src/mocks/data/instances.ts"
  "src/mocks/data/logs.ts"
  "src/mocks/data/servers.ts"
  "src/mocks/data/monitor.ts"
)

for file in "${MOCK_DATA_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  else
    echo "  ✗ $file (缺失)"
  fi
done
echo ""

# 检查Mock Handler文件
echo "2. 检查Mock Handler文件..."
MOCK_HANDLER_FILES=(
  "src/mocks/handlers/task.ts"
  "src/mocks/handlers/datasource.ts"
  "src/mocks/handlers/instance.ts"
  "src/mocks/handlers/server.ts"
  "src/mocks/handlers/directory.ts"
)

for file in "${MOCK_HANDLER_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  else
    echo "  ✗ $file (缺失)"
  fi
done
echo ""

# 检查Mock工具文件
echo "3. 检查Mock工具文件..."
MOCK_UTIL_FILES=(
  "src/mocks/utils/pagination.ts"
  "src/mocks/utils/filter.ts"
  "src/mocks/utils/storage.ts"
  "src/mocks/utils/generator.ts"
)

for file in "${MOCK_UTIL_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  else
    echo "  ✗ $file (缺失)"
  fi
done
echo ""

# 检查核心文件
echo "4. 检查核心文件..."
CORE_FILES=(
  "src/api/mockAdapter.ts"
  "src/mocks/index.ts"
  "src/mocks/test.ts"
  ".env.mock"
)

for file in "${CORE_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  else
    echo "  ✗ $file (缺失)"
  fi
done
echo ""

# 检查文档
echo "5. 检查文档..."
DOC_FILES=(
  "MOCK_README.md"
  "MOCK_QUICKSTART.md"
  "MOCK_IMPLEMENTATION.md"
)

for file in "${DOC_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  else
    echo "  ✗ $file (缺失)"
  fi
done
echo ""

# 统计代码
echo "6. 代码统计..."
TOTAL_FILES=$(find src/mocks -name "*.ts" | wc -l | tr -d ' ')
TOTAL_LINES=$(find src/mocks -name "*.ts" -exec wc -l {} + | tail -1 | awk '{print $1}')
echo "  文件数: $TOTAL_FILES"
echo "  代码行数: $TOTAL_LINES"
echo ""

# 检查package.json脚本
echo "7. 检查npm脚本..."
if grep -q "dev:mock" package.json; then
  echo "  ✓ dev:mock 脚本已添加"
else
  echo "  ✗ dev:mock 脚本未添加"
fi

if grep -q "build:mock" package.json; then
  echo "  ✓ build:mock 脚本已添加"
else
  echo "  ✗ build:mock 脚本未添加"
fi
echo ""

echo "================================"
echo "验证完成!"
echo "================================"
echo ""
echo "启动Mock模式:"
echo "  npm run dev:mock"
echo ""
echo "查看文档:"
echo "  cat MOCK_QUICKSTART.md"
echo ""
