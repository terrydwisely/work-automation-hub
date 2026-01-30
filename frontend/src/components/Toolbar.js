import React from 'react';
import useStore from '../store';

const ToolbarIcon = ({ children, ...props }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {children}
  </svg>
);

export default function Toolbar() {
  const groupDrag = useStore((s) => s.groupDrag);
  const toggleGroupDrag = useStore((s) => s.toggleGroupDrag);
  const sidebarOpen = useStore((s) => s.sidebarOpen);
  const toggleSidebar = useStore((s) => s.toggleSidebar);
  const tasks = useStore((s) => s.tasks);
  const categories = useStore((s) => s.categories);

  const totalSteps = tasks.reduce((acc, t) => acc + t.steps.length, 0);
  const automatedSteps = tasks.reduce(
    (acc, t) => acc + t.steps.filter(s => s.automation_level === 'full').length, 0
  );

  return (
    <div style={{
      height: 'var(--toolbar-height)',
      background: 'var(--surface-0)',
      borderBottom: '1px solid var(--surface-3)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 var(--sp-5)',
      gap: 'var(--sp-3)',
      zIndex: 20,
      position: 'relative',
    }}>
      {/* Sidebar toggle */}
      <button
        onClick={toggleSidebar}
        style={{
          width: 36,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: sidebarOpen ? 'var(--surface-2)' : 'transparent',
          border: '1px solid transparent',
          borderRadius: 'var(--radius-sm)',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          transition: 'all 0.15s var(--ease-out)',
        }}
        onMouseEnter={e => {
          if (!sidebarOpen) e.target.style.background = 'var(--surface-1)';
        }}
        onMouseLeave={e => {
          if (!sidebarOpen) e.target.style.background = 'transparent';
        }}
        title="Toggle sidebar"
      >
        <ToolbarIcon>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="9" y1="3" x2="9" y2="21" />
        </ToolbarIcon>
      </button>

      {/* Divider */}
      <div style={{
        width: 1,
        height: 24,
        background: 'var(--surface-3)',
      }} />

      {/* App name */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--sp-2)',
      }}>
        <div style={{
          width: 28,
          height: 28,
          borderRadius: 'var(--radius-sm)',
          background: 'linear-gradient(135deg, var(--brand-primary), #92400E)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: 14,
          fontWeight: 700,
        }}>
          W
        </div>
        <div>
          <div style={{
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em',
            lineHeight: 1.2,
          }}>
            Work Automation Hub
          </div>
          <div style={{
            fontSize: 11,
            color: 'var(--text-tertiary)',
            lineHeight: 1.2,
          }}>
            Mind Map View
          </div>
        </div>
      </div>

      {/* Center stats */}
      <div style={{ flex: 1 }} />

      <div style={{
        display: 'flex',
        gap: 'var(--sp-5)',
        alignItems: 'center',
      }}>
        <div style={{
          display: 'flex',
          gap: 'var(--sp-2)',
          alignItems: 'center',
          fontSize: 12,
          color: 'var(--text-tertiary)',
        }}>
          <span style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'var(--cat-meetings)',
            display: 'inline-block',
          }} />
          {tasks.length} workflows
        </div>
        <div style={{
          display: 'flex',
          gap: 'var(--sp-2)',
          alignItems: 'center',
          fontSize: 12,
          color: 'var(--text-tertiary)',
        }}>
          <span style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'var(--status-automated)',
            display: 'inline-block',
          }} />
          {automatedSteps}/{totalSteps} automated
        </div>
        <div style={{
          display: 'flex',
          gap: 'var(--sp-2)',
          alignItems: 'center',
          fontSize: 12,
          color: 'var(--text-tertiary)',
        }}>
          <span style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'var(--cat-scheduling)',
            display: 'inline-block',
          }} />
          {categories.length} categories
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Group drag toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--sp-2)',
        padding: '6px 12px',
        borderRadius: 'var(--radius-full)',
        background: groupDrag ? 'var(--status-automated-light)' : 'var(--surface-1)',
        border: `1px solid ${groupDrag ? 'var(--status-automated)' : 'var(--surface-3)'}`,
        cursor: 'pointer',
        transition: 'all 0.2s var(--ease-out)',
        userSelect: 'none',
      }}
        onClick={toggleGroupDrag}
      >
        <div style={{
          width: 28,
          height: 16,
          borderRadius: 8,
          background: groupDrag ? 'var(--status-automated)' : 'var(--surface-4)',
          position: 'relative',
          transition: 'background 0.2s var(--ease-out)',
        }}>
          <div style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: 'white',
            position: 'absolute',
            top: 2,
            left: groupDrag ? 14 : 2,
            transition: 'left 0.2s var(--ease-out)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }} />
        </div>
        <span style={{
          fontSize: 12,
          fontWeight: 500,
          color: groupDrag ? 'var(--status-automated)' : 'var(--text-tertiary)',
        }}>
          Group Drag
        </span>
      </div>
    </div>
  );
}
