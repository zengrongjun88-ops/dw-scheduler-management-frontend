/**
 * 目录Mock数据
 * 树形结构，5个目录
 */

export interface MockDirectory {
  id: number;
  name: string;
  parentId: number | null;
  description: string;
  createTime: string;
  updateTime: string;
  children?: MockDirectory[];
}

export const mockDirectories: MockDirectory[] = [
  {
    id: 1,
    name: '数据仓库',
    parentId: null,
    description: '数据仓库相关任务',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00',
  },
  {
    id: 2,
    name: 'ODS层',
    parentId: 1,
    description: '操作数据存储层',
    createTime: '2024-01-02 10:00:00',
    updateTime: '2024-01-02 10:00:00',
  },
  {
    id: 3,
    name: 'DWD层',
    parentId: 1,
    description: '数据明细层',
    createTime: '2024-01-03 10:00:00',
    updateTime: '2024-01-03 10:00:00',
  },
  {
    id: 4,
    name: '实时计算',
    parentId: null,
    description: '实时数据处理任务',
    createTime: '2024-01-04 10:00:00',
    updateTime: '2024-01-04 10:00:00',
  },
  {
    id: 5,
    name: '离线报表',
    parentId: null,
    description: '离线报表生成任务',
    createTime: '2024-01-05 10:00:00',
    updateTime: '2024-01-05 10:00:00',
  },
];

// 构建树形结构
export function buildDirectoryTree(directories: MockDirectory[]): MockDirectory[] {
  const map = new Map<number, MockDirectory>();
  const roots: MockDirectory[] = [];

  // 创建映射
  directories.forEach(dir => {
    map.set(dir.id, { ...dir, children: [] });
  });

  // 构建树
  directories.forEach(dir => {
    const node = map.get(dir.id)!;
    if (dir.parentId === null) {
      roots.push(node);
    } else {
      const parent = map.get(dir.parentId);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(node);
      }
    }
  });

  return roots;
}
