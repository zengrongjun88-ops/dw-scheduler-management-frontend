/**
 * 目录API Mock Handler
 */

import { mockDirectories, buildDirectoryTree, MockDirectory } from '../data/directories';
import { generateId, generateTime } from '../utils/generator';
import { saveToStorage, loadFromStorage } from '../utils/storage';

let directories = loadFromStorage<MockDirectory[]>('directories', [...mockDirectories]);

export function getDirectoryTree() {
  return buildDirectoryTree(directories);
}

export function getDirectoryList() {
  return directories;
}

export function createDirectory(data: {
  name: string;
  parentId: number | null;
  description: string;
}) {
  const newDirectory: MockDirectory = {
    ...data,
    id: generateId(),
    createTime: generateTime(),
    updateTime: generateTime(),
  };
  
  directories.push(newDirectory);
  saveToStorage('directories', directories);
  
  return newDirectory;
}

export function updateDirectory(id: number, data: Partial<MockDirectory>) {
  const index = directories.findIndex(d => d.id === id);
  if (index === -1) {
    throw new Error('目录不存在');
  }
  
  directories[index] = {
    ...directories[index],
    ...data,
    updateTime: generateTime(),
  };
  
  saveToStorage('directories', directories);
  return directories[index];
}

export function deleteDirectory(id: number) {
  // 检查是否有子目录
  const hasChildren = directories.some(d => d.parentId === id);
  if (hasChildren) {
    throw new Error('目录下存在子目录,无法删除');
  }
  
  const index = directories.findIndex(d => d.id === id);
  if (index === -1) {
    throw new Error('目录不存在');
  }
  
  directories.splice(index, 1);
  saveToStorage('directories', directories);
  
  return { success: true };
}
