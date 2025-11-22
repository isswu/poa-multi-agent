/**
 * TaskList Component
 * Display list of submitted tasks with status
 */


import { Clock, CheckCircle, XCircle, Loader } from 'lucide-react';
import type { Task } from '../../types';

interface TaskListProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  selectedTaskId?: string;
}

const STATUS_CONFIG = {
  pending: {
    icon: Clock,
    label: '等待中',
    className: 'badge-info',
  },
  running: {
    icon: Loader,
    label: '运行中',
    className: 'badge-warning',
  },
  completed: {
    icon: CheckCircle,
    label: '已完成',
    className: 'badge-success',
  },
  failed: {
    icon: XCircle,
    label: '失败',
    className: 'badge-error',
  },
};

export function TaskList({ tasks, onTaskClick, selectedTaskId }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="card text-center" style={{ padding: 'var(--spacing-3xl)' }}>
        <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-lg)' }}>
          📋 暂无任务
        </p>
        <p style={{ color: 'var(--text-tertiary)' }}>提交您的第一个分析任务</p>
      </div>
    );
  }

  return (
    <div className="card fade-in">
      <div className="card-header">
        <h2 className="card-title">📝 任务列表</h2>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
          共 {tasks.length} 个任务
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        {tasks.map((task) => {
          const config = STATUS_CONFIG[task.status];
          const Icon = config.icon;
          const isSelected = task.id === selectedTaskId;

          return (
            <div
              key={task.id}
              onClick={() => onTaskClick(task)}
              style={{
                padding: 'var(--spacing-lg)',
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1))'
                  : 'var(--bg-secondary)',
                borderRadius: 'var(--border-radius-md)',
                border: isSelected
                  ? '2px solid var(--color-primary-500)'
                  : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all var(--transition-base)',
              }}
              className="task-item"
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 'var(--spacing-sm)',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
                    <span className={`badge ${config.className}`}>
                      <Icon size={14} />
                      {config.label}
                    </span>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                      {task.createdAt.toLocaleString('zh-CN')}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      color: 'var(--text-primary)',
                      fontWeight: 'var(--font-weight-medium)',
                      lineHeight: 1.5,
                    }}
                  >
                    {task.request}
                  </p>
                </div>
              </div>

              {task.error && (
                <div
                  style={{
                    marginTop: 'var(--spacing-sm)',
                    padding: 'var(--spacing-sm)',
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderRadius: 'var(--border-radius-sm)',
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-error)',
                  }}
                >
                  ⚠️ {task.error}
                </div>
              )}

              {task.status === 'completed' && task.completedAt && (
                <div
                  style={{
                    marginTop: 'var(--spacing-sm)',
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--text-tertiary)',
                  }}
                >
                  ✓ 完成于 {task.completedAt.toLocaleString('zh-CN')}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
