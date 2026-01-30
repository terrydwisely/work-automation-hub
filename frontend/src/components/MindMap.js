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

// Determine which handle to use based on angle from source to target
function getHandleIds(angle) {
  // Normalize to 0-360
  const a = ((angle % 360) + 360) % 360;
  if (a >= 315 || a < 45) return { sourceHandle: 'right', targetHandle: 'left' };
  if (a >= 45 && a < 135) return { sourceHandle: 'src-bottom', targetHandle: 'top' };
  if (a >= 135 && a < 225) return { sourceHandle: 'src-left', targetHandle: 'right' };
  return { sourceHandle: 'src-top', targetHandle: 'bottom' };
}

function getAngle(x1, y1, x2, y2) {
  return Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
}

// Hub handle based on quadrant
function getHubHandle(angle) {
  const a = ((angle % 360) + 360) % 360;
  if (a >= 315 || a < 45) return 'right';
  if (a >= 45 && a < 135) return 'bottom';
  if (a >= 135 && a < 225) return 'left';
  return 'top';
}

const HUB_X = 500;
const HUB_Y = 400;
const CAT_RADIUS = 300;
const TASK_RADIUS = 200;
const STEP_RADIUS = 180;

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

  // Radial category placement
  categories.forEach((cat, i) => {
    const angle = (360 / catCount) * i - 90; // start from top
    const rad = (angle * Math.PI) / 180;
    const x = HUB_X + Math.cos(rad) * CAT_RADIUS;
    const y = HUB_Y + Math.sin(rad) * CAT_RADIUS;
    catPositions[cat.id] = { x, y, angle };

    nodes.push({
      id: `cat-${cat.id}`,
      type: 'taskNode',
      position: { x, y },
      data: { label: cat.name, color: cat.color, isCategory: true },
    });

    const hubHandle = getHubHandle(angle);
    const { targetHandle } = getHandleIds(angle);

    edges.push({
      id: `hub-to-${cat.id}`,
      source: 'hub',
      target: `cat-${cat.id}`,
      sourceHandle: hubHandle,
      targetHandle,
      style: { stroke: cat.color, strokeWidth: 2 },
      animated: true,
    });
  });

  // Group tasks by category
  const tasksByCategory = {};
  tasks.forEach((t) => {
    if (!tasksByCategory[t.category]) tasksByCategory[t.category] = [];
    tasksByCategory[t.category].push(t);
  });

  Object.entries(tasksByCategory).forEach(([catId, catTasks]) => {
    const catPos = catPositions[catId];
    if (!catPos) return;
    const catObj = categories.find((c) => c.id === catId);
    const color = catObj ? catObj.color : '#999';

    // Spread tasks radially around their category
    const baseAngle = catPos.angle;
    const spreadAngle = 40;

    catTasks.forEach((task, tIdx) => {
      const taskAngle = baseAngle + (tIdx - (catTasks.length - 1) / 2) * spreadAngle;
      const rad = (taskAngle * Math.PI) / 180;
      const taskX = catPos.x + Math.cos(rad) * TASK_RADIUS;
      const taskY = catPos.y + Math.sin(rad) * TASK_RADIUS;

      const edgeAngle = getAngle(catPos.x, catPos.y, taskX, taskY);
      const handles = getHandleIds(edgeAngle);

      // Use parentNode for group dragging when expanded
      const parentId = expandedTasks[task.id] ? undefined : undefined;

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
        id: `cat-${catId}-to-${task.id}`,
        source: `cat-${catId}`,
        target: task.id,
        sourceHandle: handles.sourceHandle,
        targetHandle: handles.targetHandle,
        style: { stroke: color, strokeWidth: 1.5 },
      });

      // Steps radially around the task when expanded
      if (expandedTasks[task.id]) {
        const stepCount = task.steps.length;
        const stepSpread = 360 / Math.max(stepCount, 1);

        task.steps.forEach((step, sIdx) => {
          const stepId = `${task.id}-step-${step.order}`;
          const stepAngle = stepSpread * sIdx - 90;
          const sRad = (stepAngle * Math.PI) / 180;
          const stepX = taskX + Math.cos(sRad) * STEP_RADIUS;
          const stepY = taskY + Math.sin(sRad) * STEP_RADIUS;

          let stepColor = '#888';
          if (step.automation_level === 'full') stepColor = '#50C878';
          else if (step.automation_level === 'manual') stepColor = '#E8543E';
          else if (step.automation_level === 'notification') stepColor = '#F5A623';

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
            parentNode: task.id,
            extent: 'parent',
          });

          edges.push({
            id: `${task.id}-to-${stepId}`,
            source: task.id,
            target: stepId,
            sourceHandle: sHandles.sourceHandle,
            targetHandle: sHandles.targetHandle,
            style: { stroke: color, strokeWidth: 1 },
          });

          // Sequential connections between steps
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
  });

  return { nodes, edges };
}

export default function MindMap() {
  const tasks = useStore((s) => s.tasks);
  const categories = useStore((s) => s.categories);
  const expandedTasks = useStore((s) => s.expandedTasks);
  const groupDrag = useStore((s) => s.groupDrag);
  const toggleGroupDrag = useStore((s) => s.toggleGroupDrag);
  const lastPositions = useRef({});

  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildNodes(tasks, categories, expandedTasks),
    [tasks, categories, expandedTasks]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  React.useEffect(() => {
    const { nodes: n, edges: e } = buildNodes(tasks, categories, expandedTasks);
    // Preserve user-dragged positions
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

  // Group drag: when a parent moves, move its children too
  const handleNodesChange = useCallback((changes) => {
    if (groupDrag) {
      changes.forEach((change) => {
        if (change.type === 'position' && change.position) {
          const nodeId = change.id;
          const prev = lastPositions.current[nodeId];
          if (prev) {
            const dx = change.position.x - prev.x;
            const dy = change.position.y - prev.y;

            // Find child nodes (steps of this task, or tasks of this category)
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

    // Track positions
    changes.forEach((change) => {
      if (change.type === 'position' && change.position) {
        lastPositions.current[change.id] = { ...change.position };
      }
    });

    onNodesChange(changes);
  }, [groupDrag, onNodesChange, setNodes, edges]);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#1a1a2e' }}>
      {/* Group drag toggle */}
      <div style={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 10,
        display: 'flex',
        gap: 8,
        alignItems: 'center',
      }}>
        <button
          onClick={toggleGroupDrag}
          style={{
            background: groupDrag ? '#50C878' : '#333',
            color: '#fff',
            border: `2px solid ${groupDrag ? '#50C878' : '#555'}`,
            borderRadius: 8,
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            transition: 'all 0.2s',
            boxShadow: groupDrag ? '0 0 12px rgba(80, 200, 120, 0.4)' : 'none',
          }}
        >
          {groupDrag ? '🔗 Group Drag ON' : '🔓 Group Drag OFF'}
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
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
