import React from 'react';
import { Handle, Position } from 'reactflow';

const levelConfig = {
  full: {
    label: 'Automated',
    icon: '⚡',
    color: '#34D399',
    bg: '#0D2E22',
    border: '#15503A',
  },
  manual: {
    label: 'Manual',
    icon: '✋',
    color: '#F87171',
    bg: '#2D1516',
    border: '#5B2021',
  },
  notification: {
    label: 'Notify',
    icon: '🔔',
    color: '#FBBF24',
    bg: '#2A2010',
    border: '#4A3510',
  },
  needs_detail: {
    label: 'Pending',
    icon: '○',
    color: '#9CA3AF',
    bg: '#1F1F25',
    border: '#2E2E35',
  },
};

const handleStyle = (color) => ({
  background: color,
  border: '2px solid #111113',
  width: 7,
  height: 7,
});

export default function StepNode({ data }) {
  const config = levelConfig[data.automationLevel] || levelConfig.needs_detail;

  return (
    <div style={{
      background: '#1A1A1E',
      border: `1px solid ${config.border}`,
      borderRadius: 10,
      padding: '10px 14px',
      width: 190,
      boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
      fontFamily: "'DM Sans', sans-serif",
      transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      <Handle type="target" position={Position.Top} id="top" style={handleStyle(config.color)} />
      <Handle type="target" position={Position.Bottom} id="bottom" style={handleStyle(config.color)} />
      <Handle type="target" position={Position.Left} id="left" style={handleStyle(config.color)} />
      <Handle type="target" position={Position.Right} id="right" style={handleStyle(config.color)} />
      <Handle type="source" position={Position.Top} id="src-top" style={handleStyle(config.color)} />
      <Handle type="source" position={Position.Bottom} id="src-bottom" style={handleStyle(config.color)} />
      <Handle type="source" position={Position.Left} id="src-left" style={handleStyle(config.color)} />
      <Handle type="source" position={Position.Right} id="src-right" style={handleStyle(config.color)} />

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6,
      }}>
        <div style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          background: config.bg,
          border: `1px solid ${config.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          fontWeight: 700,
          color: config.color,
          fontFamily: "'JetBrains Mono', monospace",
          flexShrink: 0,
        }}>
          {data.order}
        </div>
        <div style={{
          fontSize: 11.5,
          fontWeight: 600,
          color: '#ECECEF',
          lineHeight: 1.3,
          flex: 1,
        }}>
          {data.label}
        </div>
      </div>

      {/* Status badge */}
      <div style={{
        display: 'flex',
        gap: 4,
        flexWrap: 'wrap',
      }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 3,
          fontSize: 10,
          fontWeight: 600,
          padding: '2px 7px',
          borderRadius: 99,
          background: config.bg,
          color: config.color,
          border: `1px solid ${config.border}`,
        }}>
          <span style={{ fontSize: 9 }}>{config.icon}</span>
          {config.label}
        </span>
        {data.needsDetail && data.automationLevel !== 'needs_detail' && (
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            padding: '2px 7px',
            borderRadius: 99,
            background: '#1F1F25',
            color: '#9CA3AF',
            border: '1px solid #2E2E35',
          }}>
            Needs detail
          </span>
        )}
      </div>
    </div>
  );
}
