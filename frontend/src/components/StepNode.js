import React from 'react';
import { Handle, Position } from 'reactflow';

const levelConfig = {
  full: {
    label: 'Automated',
    icon: '⚡',
    color: '#059669',
    bg: '#ECFDF5',
    border: '#A7F3D0',
    dot: '#059669',
  },
  manual: {
    label: 'Manual',
    icon: '✋',
    color: '#DC2626',
    bg: '#FEF2F2',
    border: '#FECACA',
    dot: '#DC2626',
  },
  notification: {
    label: 'Notify',
    icon: '🔔',
    color: '#D97706',
    bg: '#FFFBEB',
    border: '#FDE68A',
    dot: '#D97706',
  },
  needs_detail: {
    label: 'Pending',
    icon: '○',
    color: '#6B7280',
    bg: '#F9FAFB',
    border: '#E5E7EB',
    dot: '#9CA3AF',
  },
};

const handleStyle = (color) => ({
  background: color,
  border: '2px solid white',
  width: 7,
  height: 7,
});

export default function StepNode({ data }) {
  const config = levelConfig[data.automationLevel] || levelConfig.needs_detail;

  return (
    <div style={{
      background: 'white',
      border: `1px solid ${config.border}`,
      borderRadius: 10,
      padding: '10px 14px',
      width: 190,
      boxShadow: '0 1px 4px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)',
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
          color: '#1A1917',
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
            background: '#F9FAFB',
            color: '#6B7280',
            border: '1px solid #E5E7EB',
          }}>
            Needs detail
          </span>
        )}
      </div>
    </div>
  );
}
