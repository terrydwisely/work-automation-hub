import React from 'react';
import { Handle, Position } from 'reactflow';
import useStore from '../store';

export default function TaskNode({ data }) {
  const toggleExpand = useStore((s) => s.toggleExpand);

  const handleClick = () => {
    if (!data.isCategory && data.taskId) {
      toggleExpand(data.taskId);
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        background: data.isCategory
          ? `linear-gradient(135deg, ${data.color}22, ${data.color}44)`
          : '#16213e',
        border: `2px solid ${data.color}`,
        borderRadius: data.isCategory ? 12 : 8,
        padding: data.isCategory ? '16px 24px' : '12px 16px',
        minWidth: data.isCategory ? 180 : 220,
        maxWidth: 280,
        cursor: data.isCategory ? 'default' : 'pointer',
        boxShadow: data.expanded
          ? `0 0 20px ${data.color}55`
          : `0 4px 12px rgba(0,0,0,0.3)`,
        transition: 'all 0.2s ease',
      }}
    >
      <Handle type="target" position={Position.Top} id="top" style={{ background: data.color }} />
      <Handle type="target" position={Position.Bottom} id="bottom" style={{ background: data.color, top: 'auto', bottom: -4 }} />
      <Handle type="target" position={Position.Left} id="left" style={{ background: data.color }} />
      <Handle type="target" position={Position.Right} id="right" style={{ background: data.color }} />

      <Handle type="source" position={Position.Top} id="src-top" style={{ background: data.color }} />
      <Handle type="source" position={Position.Bottom} id="src-bottom" style={{ background: data.color }} />
      <Handle type="source" position={Position.Left} id="src-left" style={{ background: data.color }} />
      <Handle type="source" position={Position.Right} id="src-right" style={{ background: data.color }} />

      <div style={{
        color: '#fff',
        fontWeight: 'bold',
        fontSize: data.isCategory ? 15 : 13,
        marginBottom: data.isCategory ? 0 : 6,
      }}>
        {data.label}
        {!data.isCategory && (
          <span style={{ float: 'right', fontSize: 10, opacity: 0.6 }}>
            {data.expanded ? '▼' : '▶'}
          </span>
        )}
      </div>

      {!data.isCategory && (
        <>
          <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
            <span style={{
              background: data.priority === 'high' ? '#e94560' : '#F5A623',
              color: '#fff',
              fontSize: 10,
              padding: '2px 6px',
              borderRadius: 4,
            }}>
              {data.priority}
            </span>
            <span style={{
              background: '#333',
              color: '#aaa',
              fontSize: 10,
              padding: '2px 6px',
              borderRadius: 4,
            }}>
              {data.frequency}
            </span>
          </div>
          <div style={{
            color: '#aaa',
            fontSize: 11,
            lineHeight: 1.4,
          }}>
            {data.summary}
          </div>
        </>
      )}
    </div>
  );
}
