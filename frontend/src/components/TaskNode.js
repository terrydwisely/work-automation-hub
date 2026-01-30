import React from 'react';
import { Handle, Position } from 'reactflow';
import useStore from '../store';

const catColors = {
  meetings: { primary: '#60A5FA', light: '#14213A', border: '#1E3A5F' },
  scheduling: { primary: '#34D399', light: '#0D2E22', border: '#15503A' },
  communication: { primary: '#FBBF24', light: '#2A2010', border: '#4A3510' },
};

const defaultColors = { primary: '#9CA3AF', light: '#1F1F25', border: '#2E2E35' };

const handleStyle = (color) => ({
  background: color,
  border: '2px solid #111113',
  width: 8,
  height: 8,
});

export default function TaskNode({ data }) {
  const toggleExpand = useStore((s) => s.toggleExpand);
  const colors = catColors[data.categoryId] || defaultColors;
  const isCategory = data.isCategory;

  const handleClick = () => {
    if (!isCategory && data.taskId) {
      toggleExpand(data.taskId);
    }
  };

  if (isCategory) {
    return (
      <div style={{
        background: colors.light,
        border: `2px solid ${colors.border}`,
        borderRadius: 12,
        padding: '14px 22px',
        minWidth: 170,
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <Handle type="target" position={Position.Top} id="top" style={handleStyle(colors.primary)} />
        <Handle type="target" position={Position.Bottom} id="bottom" style={handleStyle(colors.primary)} />
        <Handle type="target" position={Position.Left} id="left" style={handleStyle(colors.primary)} />
        <Handle type="target" position={Position.Right} id="right" style={handleStyle(colors.primary)} />
        <Handle type="source" position={Position.Top} id="src-top" style={handleStyle(colors.primary)} />
        <Handle type="source" position={Position.Bottom} id="src-bottom" style={handleStyle(colors.primary)} />
        <Handle type="source" position={Position.Left} id="src-left" style={handleStyle(colors.primary)} />
        <Handle type="source" position={Position.Right} id="src-right" style={handleStyle(colors.primary)} />

        <div style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: colors.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#111113',
          fontSize: 14,
        }}>
          {data.icon || '▦'}
        </div>
        <div>
          <div style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#ECECEF',
            fontFamily: "'DM Sans', sans-serif",
            lineHeight: 1.3,
          }}>
            {data.label}
          </div>
          <div style={{
            fontSize: 11,
            color: '#6E6E78',
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {data.taskCount || 0} workflow{(data.taskCount || 0) !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
    );
  }

  // Task node
  const automatedCount = data.steps ? data.steps.filter(s => s.automation_level === 'full').length : 0;
  const totalSteps = data.steps ? data.steps.length : 0;
  const pct = totalSteps > 0 ? Math.round((automatedCount / totalSteps) * 100) : 0;

  return (
    <div
      onClick={handleClick}
      style={{
        background: '#1A1A1E',
        border: data.expanded ? `2px solid ${colors.primary}` : '1px solid #2E2E35',
        borderRadius: 12,
        padding: 16,
        width: 260,
        cursor: 'pointer',
        boxShadow: data.expanded
          ? `0 4px 16px ${colors.primary}25, 0 2px 8px rgba(0,0,0,0.4)`
          : '0 2px 8px rgba(0,0,0,0.3)',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <Handle type="target" position={Position.Top} id="top" style={handleStyle(colors.primary)} />
      <Handle type="target" position={Position.Bottom} id="bottom" style={handleStyle(colors.primary)} />
      <Handle type="target" position={Position.Left} id="left" style={handleStyle(colors.primary)} />
      <Handle type="target" position={Position.Right} id="right" style={handleStyle(colors.primary)} />
      <Handle type="source" position={Position.Top} id="src-top" style={handleStyle(colors.primary)} />
      <Handle type="source" position={Position.Bottom} id="src-bottom" style={handleStyle(colors.primary)} />
      <Handle type="source" position={Position.Left} id="src-left" style={handleStyle(colors.primary)} />
      <Handle type="source" position={Position.Right} id="src-right" style={handleStyle(colors.primary)} />

      {/* Title row */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
        marginBottom: 10,
      }}>
        <div style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: colors.primary,
          marginTop: 5,
          flexShrink: 0,
        }} />
        <div style={{
          fontSize: 13,
          fontWeight: 600,
          color: '#ECECEF',
          lineHeight: 1.35,
          flex: 1,
        }}>
          {data.label}
        </div>
        <div style={{
          width: 20,
          height: 20,
          borderRadius: 4,
          background: data.expanded ? colors.light : '#242429',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 9,
          color: data.expanded ? colors.primary : '#6E6E78',
          flexShrink: 0,
          transition: 'all 0.15s',
        }}>
          {data.expanded ? '▼' : '▶'}
        </div>
      </div>

      {/* Tags */}
      <div style={{
        display: 'flex',
        gap: 4,
        marginBottom: 10,
        flexWrap: 'wrap',
      }}>
        <span style={{
          fontSize: 10,
          fontWeight: 600,
          padding: '2px 8px',
          borderRadius: 99,
          background: data.priority === 'high' ? '#2D1516' : '#1F1F25',
          color: data.priority === 'high' ? '#F87171' : '#9CA3AF',
          textTransform: 'uppercase',
          letterSpacing: '0.03em',
        }}>
          {data.priority}
        </span>
        <span style={{
          fontSize: 10,
          fontWeight: 500,
          padding: '2px 8px',
          borderRadius: 99,
          background: '#242429',
          color: '#A0A0A8',
        }}>
          {data.frequency}
        </span>
      </div>

      {/* Summary */}
      <div style={{
        fontSize: 11.5,
        color: '#A0A0A8',
        lineHeight: 1.5,
        marginBottom: 12,
      }}>
        {data.summary}
      </div>

      {/* Progress bar */}
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 10,
          fontWeight: 600,
          color: '#6E6E78',
          marginBottom: 4,
        }}>
          <span>AUTOMATION</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>
            {automatedCount}/{totalSteps}
          </span>
        </div>
        <div style={{
          height: 4,
          borderRadius: 2,
          background: '#242429',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${pct}%`,
            borderRadius: 2,
            background: '#34D399',
            transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }} />
        </div>
      </div>
    </div>
  );
}
