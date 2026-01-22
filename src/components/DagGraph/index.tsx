import React, { useEffect, useRef } from 'react';
import G6, { Graph } from '@antv/g6';
import type { DagData, DagNode, DagEdge } from '@/types/task';

/**
 * DAG 图属性
 */
interface DagGraphProps {
  data: DagData;
  width?: number;
  height?: number;
  onNodeClick?: (node: DagNode) => void;
}

/**
 * DAG 图组件
 * 使用 G6 渲染任务依赖关系图
 */
const DagGraph: React.FC<DagGraphProps> = ({
  data,
  width = 800,
  height = 600,
  onNodeClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 创建图实例
    const graph = new G6.Graph({
      container: containerRef.current,
      width,
      height,
      layout: {
        type: 'dagre',
        rankdir: 'LR',
        align: 'UL',
        nodesep: 20,
        ranksep: 50,
      },
      defaultNode: {
        type: 'rect',
        size: [120, 40],
        style: {
          fill: '#5B8FF9',
          stroke: '#5B8FF9',
          lineWidth: 1,
          radius: 4,
        },
        labelCfg: {
          style: {
            fill: '#fff',
            fontSize: 12,
          },
        },
      },
      defaultEdge: {
        type: 'polyline',
        style: {
          stroke: '#A3B1BF',
          lineWidth: 2,
          endArrow: {
            path: G6.Arrow.triangle(10, 12, 0),
            fill: '#A3B1BF',
          },
        },
      },
      modes: {
        default: ['drag-canvas', 'zoom-canvas', 'drag-node'],
      },
    });

    // 监听节点点击事件
    if (onNodeClick) {
      graph.on('node:click', (evt) => {
        const node = evt.item;
        if (node) {
          const model = node.getModel();
          onNodeClick(model as any);
        }
      });
    }

    graphRef.current = graph;

    return () => {
      graph.destroy();
    };
  }, [width, height]);

  // 更新图数据
  useEffect(() => {
    if (graphRef.current) {
      const g6Data = {
        nodes: data.nodes.map((node) => ({
          id: node.id,
          label: node.label,
          taskId: node.taskId,
          status: node.status,
          style: getNodeStyle(node.status),
        })),
        edges: data.edges.map((edge) => ({
          source: edge.source,
          target: edge.target,
        })),
      };
      graphRef.current.data(g6Data);
      graphRef.current.render();
    }
  }, [data]);

  // 根据状态获取节点样式
  const getNodeStyle = (status?: string) => {
    const styles: Record<string, any> = {
      PENDING: { fill: '#D3D3D3', stroke: '#D3D3D3' },
      RUNNING: { fill: '#1890FF', stroke: '#1890FF' },
      SUCCESS: { fill: '#52C41A', stroke: '#52C41A' },
      FAILED: { fill: '#FF4D4F', stroke: '#FF4D4F' },
      TERMINATED: { fill: '#FAAD14', stroke: '#FAAD14' },
    };
    return styles[status || ''] || { fill: '#5B8FF9', stroke: '#5B8FF9' };
  };

  return (
    <div
      ref={containerRef}
      style={{
        border: '1px solid #e8e8e8',
        borderRadius: 4,
        overflow: 'hidden',
      }}
    />
  );
};

export default DagGraph;
