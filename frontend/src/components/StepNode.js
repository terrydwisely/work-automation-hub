import React from 'react';
import { Handle, Position } from 'reactflow';

export default function StepNode({ data }) {
  const levelLabels = {
    full: '⚡ Automated',
    manual: '👤 Manual',
    notification: '🔔 Notify',
    needs_detail: '❓ Needs Detail',
  };

  return (
    <div style={{
      background: '#1a1a2e',
      border: `1.5px solid ${data.color}`,
      borderRadius: 6,
      padding: '10px 14px',
      minWidth: 160,
      maxWidth: 200,
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    }}>
      <Handle type="target" position={Position.Top} style={{ background: data.color }} />

      <div style={{
        color: '#fff',
        fontSize: 11,
        fontWeight: 600,
        marginBottom: 6,
        lineHeight: 1.3,
      }}>
        <span style={{ color: data.color, marginRight: 4 }}>
          {data.order}.
        </span>
        {data.label}
      </div>

      <div style={{ display: 'flex', gap: 4 }}>
        <span style={{
          background: `${data.color}33`,
          color: data.color,
          fontSize: 9,
          padding: '2px 6px',
          borderRadius: 3,
          fontWeight: 600,
        }}>
          {levelLabels[data.automationLevel] || data.automationLevel}
        </span>
        {data.needsDetail && (
          <span style={{
            background: '#F5A62333',
            color: '#F5A623',
            fontSize: 9,
            padding: '2px 6px',
            borderRadius: 3,
          }}>
            Needs Detail
          </span>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} style={{ background: data.color }} />
    </div>
  );
}
