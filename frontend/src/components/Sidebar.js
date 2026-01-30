import React from 'react';
import useStore from '../store';

const catColorMap = {
  meetings: { bg: 'var(--cat-meetings-light)', fg: 'var(--cat-meetings)', dot: 'var(--cat-meetings)' },
  scheduling: { bg: 'var(--cat-scheduling-light)', fg: 'var(--cat-scheduling)', dot: 'var(--cat-scheduling)' },
  communication: { bg: 'var(--cat-communication-light)', fg: 'var(--cat-communication)', dot: 'var(--cat-communication)' },
};

const automationLabels = {
  full: { label: 'Automated', color: 'var(--status-automated)', bg: 'var(--status-automated-light)' },
  manual: { label: 'Manual', color: 'var(--status-manual)', bg: 'var(--status-manual-light)' },
  notification: { label: 'Notify', color: 'var(--status-notify)', bg: 'var(--status-notify-light)' },
  needs_detail: { label: 'Pending', color: 'var(--status-pending)', bg: 'var(--status-pending-light)' },
};

function StepRow({ step, index }) {
  const auto = automationLabels[step.automation_level] || automationLabels.needs_detail;

  return (
    <div style={{
      display: 'flex',
      gap: 'var(--sp-2)',
      padding: '8px 0',
      borderBottom: '1px solid var(--surface-2)',
      alignItems: 'flex-start',
    }}>
      <div style={{
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: auto.bg,
        color: auto.color,
        fontSize: 10,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        marginTop: 1,
      }}>
        {step.order}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 12,
          fontWeight: 500,
          color: 'var(--text-primary)',
          lineHeight: 1.4,
        }}>
          {step.action}
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            padding: '1px 6px',
            borderRadius: 'var(--radius-full)',
            background: auto.bg,
            color: auto.color,
          }}>
            {auto.label}
          </span>
          {step.needs_detail && (
            <span style={{
              fontSize: 10,
              fontWeight: 600,
              padding: '1px 6px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--status-pending-light)',
              color: 'var(--status-pending)',
            }}>
              Needs detail
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function TaskCard({ task }) {
  const toggleExpand = useStore((s) => s.toggleExpand);
  const expandedTasks = useStore((s) => s.expandedTasks);
  const selectedTask = useStore((s) => s.selectedTask);
  const selectTask = useStore((s) => s.selectTask);
  const categories = useStore((s) => s.categories);
  const isExpanded = expandedTasks[task.id];
  const isSelected = selectedTask === task.id;
  const cat = categories.find(c => c.id === task.category);
  const colors = catColorMap[task.category] || catColorMap.meetings;

  const automatedCount = task.steps.filter(s => s.automation_level === 'full').length;
  const pct = Math.round((automatedCount / task.steps.length) * 100);

  return (
    <div
      onClick={() => selectTask(task.id)}
      style={{
        background: isSelected ? colors.bg : 'var(--surface-0)',
        border: `1px solid ${isSelected ? colors.dot : 'var(--surface-3)'}`,
        borderRadius: 'var(--radius-md)',
        padding: 'var(--sp-4)',
        cursor: 'pointer',
        transition: 'all 0.15s var(--ease-out)',
        boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
      }}
      onMouseEnter={e => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = 'var(--surface-4)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }
      }}
      onMouseLeave={e => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = 'var(--surface-3)';
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        }
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--sp-2)', marginBottom: 'var(--sp-2)' }}>
        <div style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: colors.dot,
          marginTop: 5,
          flexShrink: 0,
        }} />
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text-primary)',
            lineHeight: 1.3,
          }}>
            {task.title}
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); toggleExpand(task.id); }}
          style={{
            width: 24,
            height: 24,
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--surface-3)',
            background: isExpanded ? colors.bg : 'var(--surface-0)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            color: 'var(--text-tertiary)',
            flexShrink: 0,
            transition: 'all 0.15s',
          }}
          title={isExpanded ? 'Collapse on map' : 'Expand on map'}
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {/* Meta row */}
      <div style={{
        display: 'flex',
        gap: 'var(--sp-2)',
        marginBottom: 'var(--sp-3)',
        flexWrap: 'wrap',
      }}>
        <span style={{
          fontSize: 10,
          fontWeight: 600,
          padding: '2px 8px',
          borderRadius: 'var(--radius-full)',
          background: task.priority === 'high' ? 'var(--status-manual-light)' : 'var(--surface-2)',
          color: task.priority === 'high' ? 'var(--status-manual)' : 'var(--text-tertiary)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}>
          {task.priority}
        </span>
        <span style={{
          fontSize: 10,
          fontWeight: 500,
          padding: '2px 8px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--surface-2)',
          color: 'var(--text-tertiary)',
        }}>
          {task.frequency}
        </span>
      </div>

      {/* Summary */}
      <div style={{
        fontSize: 12,
        color: 'var(--text-secondary)',
        lineHeight: 1.5,
        marginBottom: 'var(--sp-3)',
      }}>
        {task.summary}
      </div>

      {/* Automation progress bar */}
      <div style={{ marginBottom: 'var(--sp-2)' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 10,
          fontWeight: 600,
          color: 'var(--text-tertiary)',
          marginBottom: 4,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          <span>Automation</span>
          <span>{automatedCount}/{task.steps.length} steps ({pct}%)</span>
        </div>
        <div style={{
          height: 4,
          borderRadius: 2,
          background: 'var(--surface-2)',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${pct}%`,
            borderRadius: 2,
            background: 'var(--status-automated)',
            transition: 'width 0.3s var(--ease-out)',
          }} />
        </div>
      </div>

      {/* Tools */}
      {task.tools_involved && (
        <div style={{
          display: 'flex',
          gap: 4,
          flexWrap: 'wrap',
          marginTop: 'var(--sp-2)',
        }}>
          {task.tools_involved.map((tool, i) => (
            <span key={i} style={{
              fontSize: 10,
              fontWeight: 500,
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--surface-1)',
              border: '1px solid var(--surface-3)',
              color: 'var(--text-secondary)',
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {tool}
            </span>
          ))}
        </div>
      )}

      {/* Expanded steps */}
      {isExpanded && (
        <div style={{
          marginTop: 'var(--sp-3)',
          paddingTop: 'var(--sp-3)',
          borderTop: '1px solid var(--surface-2)',
        }}>
          <div style={{
            fontSize: 10,
            fontWeight: 700,
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: 'var(--sp-2)',
          }}>
            Workflow Steps
          </div>
          {task.steps.map((step, i) => (
            <StepRow key={step.order} step={step} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  const sidebarOpen = useStore((s) => s.sidebarOpen);
  const sidebarTab = useStore((s) => s.sidebarTab);
  const setSidebarTab = useStore((s) => s.setSidebarTab);
  const tasks = useStore((s) => s.tasks);
  const categories = useStore((s) => s.categories);

  if (!sidebarOpen) return null;

  return (
    <div style={{
      width: 'var(--sidebar-width)',
      height: '100%',
      background: 'var(--surface-0)',
      borderRight: '1px solid var(--surface-3)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--surface-3)',
        padding: '0 var(--sp-4)',
      }}>
        {[
          { id: 'tasks', label: 'Workflows' },
          { id: 'categories', label: 'Categories' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSidebarTab(tab.id)}
            style={{
              flex: 1,
              padding: '12px 0',
              fontSize: 12,
              fontWeight: 600,
              color: sidebarTab === tab.id ? 'var(--brand-primary)' : 'var(--text-tertiary)',
              background: 'transparent',
              border: 'none',
              borderBottom: `2px solid ${sidebarTab === tab.id ? 'var(--brand-primary)' : 'transparent'}`,
              cursor: 'pointer',
              transition: 'all 0.15s',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: 'var(--sp-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--sp-3)',
      }}>
        {sidebarTab === 'tasks' && tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}

        {sidebarTab === 'categories' && categories.map(cat => {
          const catTasks = tasks.filter(t => t.category === cat.id);
          const colors = catColorMap[cat.id] || catColorMap.meetings;
          return (
            <div key={cat.id} style={{
              background: 'var(--surface-0)',
              border: '1px solid var(--surface-3)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
            }}>
              <div style={{
                padding: 'var(--sp-3) var(--sp-4)',
                background: colors.bg,
                borderBottom: '1px solid var(--surface-3)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--sp-2)',
              }}>
                <div style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: colors.dot,
                }} />
                <span style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: colors.fg,
                }}>
                  {cat.name}
                </span>
                <span style={{
                  marginLeft: 'auto',
                  fontSize: 11,
                  color: 'var(--text-tertiary)',
                  fontWeight: 500,
                }}>
                  {catTasks.length} workflow{catTasks.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div style={{ padding: 'var(--sp-3) var(--sp-4)' }}>
                {catTasks.length === 0 ? (
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                    No workflows yet
                  </div>
                ) : (
                  catTasks.map(t => (
                    <div key={t.id} style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                      padding: '6px 0',
                      borderBottom: '1px solid var(--surface-2)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <span>{t.title}</span>
                      <span style={{
                        fontSize: 10,
                        color: 'var(--text-tertiary)',
                        fontFamily: "'JetBrains Mono', monospace",
                      }}>
                        {t.steps.length} steps
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{
        padding: 'var(--sp-3) var(--sp-4)',
        borderTop: '1px solid var(--surface-3)',
        background: 'var(--surface-1)',
        fontSize: 11,
        color: 'var(--text-tertiary)',
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <span>v0.1.0</span>
        <span>{tasks.length} workflows &middot; {tasks.reduce((a, t) => a + t.steps.length, 0)} steps</span>
      </div>
    </div>
  );
}
