import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import useStore from '../store';
import TaskNode from './TaskNode';
import StepNode from './StepNode';
import CenterNode from './CenterNode';

const nodeTypes = {
  taskNode: TaskNode,
  stepNode: StepNode,
  centerNode: CenterNode,
};

function buildNodes(tasks, categories, expandedTasks) {
  const nodes = [];
  const edges = [];

  // Center hub node
  nodes.push({
    id: 'hub',
    type: 'centerNode',
    position: { x: 400, y: 50 },
    data: { label: 'Work Automation Hub' },
  });

  // Category nodes
  const categoryMap = {};
  categories.forEach((cat, i) => {
    const x = 100 + i * 400;
    const y = 200;
    categoryMap[cat.id] = { x, y };
    nodes.push({
      id: `cat-${cat.id}`,
      type: 'taskNode',
      position: { x, y },
      data: {
        label: cat.name,
        color: cat.color,
        isCategory: true,
      },
    });
    edges.push({
      id: `hub-to-${cat.id}`,
      source: 'hub',
      target: `cat-${cat.id}`,
      style: { stroke: cat.color, strokeWidth: 2 },
      animated: true,
    });
  });

  // Task nodes
  tasks.forEach((task, tIdx) => {
    const cat = categoryMap[task.category] || { x: 400, y: 200 };
    const taskX = cat.x - 50 + tIdx * 60;
    const taskY = cat.y + 160;
    const catObj = categories.find(c => c.id === task.category);
    const color = catObj ? catObj.color : '#999';

    nodes.push({
      id: task.id,
      type: 'taskNode',
      position: { x: taskX, y: taskY },
      data: {
        label: task.title,
        color,
        priority: task.priority,
        frequency: task.frequency,
        summary: task.summary,
        status: task.status,
        isCategory: false,
        expanded: expandedTasks[task.id],
        taskId: task.id,
      },
    });

    edges.push({
      id: `cat-${task.category}-to-${task.id}`,
      source: `cat-${task.category}`,
      target: task.id,
      style: { stroke: color, strokeWidth: 1.5 },
    });

    // Step nodes when expanded
    if (expandedTasks[task.id]) {
      task.steps.forEach((step, sIdx) => {
        const stepId = `${task.id}-step-${step.order}`;
        const stepX = taskX - 100 + sIdx * 180;
        const stepY = taskY + 180;

        let stepColor = '#888';
        if (step.automation_level === 'full') stepColor = '#50C878';
        else if (step.automation_level === 'manual') stepColor = '#E8543E';
        else if (step.automation_level === 'notification') stepColor = '#F5A623';

        nodes.push({
          id: stepId,
          type: 'stepNode',
          position: { x: stepX, y: stepY },
          data: {
            label: step.action,
            automationLevel: step.automation_level,
            needsDetail: step.needs_detail,
            color: stepColor,
            order: step.order,
          },
        });

        edges.push({
          id: `${task.id}-to-${stepId}`,
          source: task.id,
          target: stepId,
          style: { stroke: color, strokeWidth: 1 },
        });

        // Connect steps sequentially
        if (sIdx > 0) {
          const prevStepId = `${task.id}-step-${task.steps[sIdx - 1].order}`;
          edges.push({
            id: `${prevStepId}-to-${stepId}`,
            source: prevStepId,
            target: stepId,
            style: { stroke: '#ccc', strokeWidth: 1, strokeDasharray: '5,5' },
            animated: true,
          });
        }
      });
    }
  });

  return { nodes, edges };
}

export default function MindMap() {
  const tasks = useStore((s) => s.tasks);
  const categories = useStore((s) => s.categories);
  const expandedTasks = useStore((s) => s.expandedTasks);

  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildNodes(tasks, categories, expandedTasks),
    [tasks, categories, expandedTasks]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Rebuild when expanded state changes
  React.useEffect(() => {
    const { nodes: n, edges: e } = buildNodes(tasks, categories, expandedTasks);
    setNodes(n);
    setEdges(e);
  }, [expandedTasks, tasks, categories, setNodes, setEdges]);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#1a1a2e' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background color="#333" gap={20} />
        <Controls />
        <MiniMap
          nodeColor={(n) => n.data?.color || '#555'}
          style={{ background: '#16213e' }}
        />
      </ReactFlow>
    </div>
  );
}
