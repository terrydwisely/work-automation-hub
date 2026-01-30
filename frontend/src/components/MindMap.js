import React, { useCallback, useMemo, useRef } from 'react';
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

const catIcons = {
  meetings: '📋',
  scheduling: '📅',
  communication: '💬',
};

function getHandleIds(angle) {
  const a = ((angle % 360) + 360) % 360;
  if (a >= 315 || a < 45) return { sourceHandle: 'right', targetHandle: 'left' };
  if (a >= 45 && a < 135) return { sourceHandle: 'src-bottom', targetHandle: 'top' };
  if (a >= 135 && a < 225) return { sourceHandle: 'src-left', targetHandle: 'right' };
  return { sourceHandle: 'src-top', targetHandle: 'bottom' };
}

function getAngle(x1, y1, x2, y2) {
  return Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
}

function getHubHandle(angle) {
  const a = ((angle % 360) + 360) % 360;
  if (a >= 315 || a < 45) return 'right';
  if (a >= 45 && a < 135) return 'bottom';
  if (a >= 135 && a < 225) return 'left';
  return 'top';
}

const HUB_X = 600;
const HUB_Y = 450;
const CAT_RADIUS = 320;
const TASK_RADIUS = 240;
const STEP_RADIUS = 220;

const edgeDefaults = {
  type: 'smoothstep',
  animated: false,
};

function buildNodes(tasks, categories, expandedTasks) {
  const nodes = [];
  const edges = [];

  nodes.push({
    id: 'hub',
    type: 'centerNode',
    position: { x: HUB_X, y: HUB_Y },
    data: { label: 'Work Automation Hub' },
  });

  const catCount = categories.length;
  const catPositions = {};

  const tasksByCategory = {};
  tasks.forEach((t) => {
    if (!tasksByCategory[t.category]) tasksByCategory[t.category] = [];
    tasksByCategory[t.category].push(t);
  });

  categories.forEach((cat, i) => {
    const angle = (360 / catCount) * i - 90;
    const rad = (angle * Math.PI) / 180;
    const x = HUB_X + Math.cos(rad) * CAT_RADIUS;
    const y = HUB_Y + Math.sin(rad) * CAT_RADIUS;
    catPositions[cat.id] = { x, y, angle };

    const catTasks = tasksByCategory[cat.id] || [];

    nodes.push({
      id: `cat-${cat.id}`,
      type: 'taskNode',
      position: { x, y },
      data: {
        label: cat.name,
        color: cat.color,
        isCategory: true,
        categoryId: cat.id,
        icon: catIcons[cat.id],
        taskCount: catTasks.length,
      },
    });

    const hubHandle = getHubHandle(angle);
    const { targetHandle } = getHandleIds(angle);

    edges.push({
      ...edgeDefaults,
      id: `hub-to-${cat.id}`,
      source: 'hub',
      target: `cat-${cat.id}`,
      sourceHandle: hubHandle,
      targetHandle,
      style: { stroke: cat.color, strokeWidth: 2, opacity: 0.4 },
      animated: true,
    });
  });

  Object.entries(tasksByCategory).forEach(([catId, catTasks]) => {
    const catPos = catPositions[catId];
    if (!catPos) return;
    const catObj = categories.find((c) => c.id === catId);
    const color = catObj ? catObj.color : '#999';
    const baseAngle = catPos.angle;
    const spreadAngle = 45;

    catTasks.forEach((task, tIdx) => {
      const taskAngle = baseAngle + (tIdx - (catTasks.length - 1) / 2) * spreadAngle;
      const rad = (taskAngle * Math.PI) / 180;
      const taskX = catPos.x + Math.cos(rad) * TASK_RADIUS;
      const taskY = catPos.y + Math.sin(rad) * TASK_RADIUS;

      const edgeAngle = getAngle(catPos.x, catPos.y, taskX, taskY);
      const handles = getHandleIds(edgeAngle);

      nodes.push({
        id: task.id,
        type: 'taskNode',
        position: { x: taskX, y: taskY },
        data: {
          label: task.title,
          color,
          categoryId: task.category,
          priority: task.priority,
          frequency: task.frequency,
          summary: task.summary,
          status: task.status,
          isCategory: false,
          expanded: expandedTasks[task.id],
          taskId: task.id,
          steps: task.steps,
        },
      });

      edges.push({
        ...edgeDefaults,
        id: `cat-${catId}-to-${task.id}`,
        source: `cat-${catId}`,
        target: task.id,
        sourceHandle: handles.sourceHandle,
        targetHandle: handles.targetHandle,
        style: { stroke: color, strokeWidth: 1.5, opacity: 0.35 },
      });

      if (expandedTasks[task.id]) {
        const stepCount = task.steps.length;
        const stepSpread = 360 / Math.max(stepCount, 1);

        task.steps.forEach((step, sIdx) => {
          const stepId = `${task.id}-step-${step.order}`;
          const stepAngle = stepSpread * sIdx - 90;
          const sRad = (stepAngle * Math.PI) / 180;
          const stepX = taskX + Math.cos(sRad) * STEP_RADIUS;
          const stepY = taskY + Math.sin(sRad) * STEP_RADIUS;

          let stepColor = '#9CA3AF';
          if (step.automation_level === 'full') stepColor = '#34D399';
          else if (step.automation_level === 'manual') stepColor = '#F87171';
          else if (step.automation_level === 'notification') stepColor = '#FBBF24';

          const sEdgeAngle = getAngle(taskX, taskY, stepX, stepY);
          const sHandles = getHandleIds(sEdgeAngle);

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
            ...edgeDefaults,
            id: `${task.id}-to-${stepId}`,
            source: task.id,
            target: stepId,
            sourceHandle: sHandles.sourceHandle,
            targetHandle: sHandles.targetHandle,
            style: { stroke: stepColor, strokeWidth: 1.5, opacity: 0.3 },
          });

          if (sIdx > 0) {
            const prevStepId = `${task.id}-step-${task.steps[sIdx - 1].order}`;
            edges.push({
              ...edgeDefaults,
              id: `${prevStepId}-to-${stepId}`,
              source: prevStepId,
              target: stepId,
              style: { stroke: '#3A3A42', strokeWidth: 1, strokeDasharray: '6,4' },
              animated: true,
            });
          }
        });
      }
    });
  });

  return { nodes, edges };
}

export default function MindMap() {
  const tasks = useStore((s) => s.tasks);
  const categories = useStore((s) => s.categories);
  const expandedTasks = useStore((s) => s.expandedTasks);
  const groupDrag = useStore((s) => s.groupDrag);
  const lastPositions = useRef({});

  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildNodes(tasks, categories, expandedTasks),
    [tasks, categories, expandedTasks]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  React.useEffect(() => {
    const { nodes: n, edges: e } = buildNodes(tasks, categories, expandedTasks);
    const posMap = {};
    nodes.forEach((nd) => { posMap[nd.id] = nd.position; });

    const merged = n.map((nd) => {
      if (posMap[nd.id] && !nd.parentNode) {
        return { ...nd, position: posMap[nd.id] };
      }
      return nd;
    });

    setNodes(merged);
    setEdges(e);
  }, [expandedTasks, tasks, categories]);

  const handleNodesChange = useCallback((changes) => {
    if (groupDrag) {
      changes.forEach((change) => {
        if (change.type === 'position' && change.position) {
          const nodeId = change.id;
          const prev = lastPositions.current[nodeId];
          if (prev) {
            const dx = change.position.x - prev.x;
            const dy = change.position.y - prev.y;

            setNodes((nds) =>
              nds.map((n) => {
                const isChild =
                  (n.id.startsWith(nodeId + '-step-')) ||
                  (nodeId.startsWith('cat-') && n.data?.taskId && edges.some(
                    (e) => e.source === nodeId && e.target === n.id
                  ));

                if (isChild && !n.parentNode) {
                  return {
                    ...n,
                    position: {
                      x: n.position.x + dx,
                      y: n.position.y + dy,
                    },
                  };
                }
                return n;
              })
            );
          }
          lastPositions.current[nodeId] = { ...change.position };
        }
      });
    }

    changes.forEach((change) => {
      if (change.type === 'position' && change.position) {
        lastPositions.current[change.id] = { ...change.position };
      }
    });

    onNodesChange(changes);
  }, [groupDrag, onNodesChange, setNodes, edges]);

  return (
    <div style={{
      flex: 1,
      height: '100%',
      background: 'var(--surface-0)',
    }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        attributionPosition="bottom-left"
        defaultEdgeOptions={edgeDefaults}
        proOptions={{ hideAttribution: true }}
        minZoom={0.15}
        maxZoom={2}
      >
        <Background
          variant="dots"
          gap={24}
          size={1.5}
          color="#2E2E35"
        />
        <Controls
          position="bottom-right"
          showInteractive={false}
        />
        <MiniMap
          nodeColor={(n) => {
            if (n.type === 'centerNode') return '#D97706';
            if (n.data?.isCategory) return n.data?.color || '#6B7280';
            return '#D6D5D0';
          }}
          maskColor="rgba(17, 17, 19, 0.85)"
          position="bottom-right"
          style={{
            marginBottom: 55,
          }}
        />
      </ReactFlow>
    </div>
  );
}
