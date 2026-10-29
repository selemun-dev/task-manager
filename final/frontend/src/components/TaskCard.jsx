/**
 * TaskCard — displays a single task with edit/delete actions.
 */

const STATUS_CONFIG = {
  TODO: { label: 'To Do', className: 'status-todo' },
  IN_PROGRESS: { label: 'In Progress', className: 'status-inprogress' },
  DONE: { label: 'Done', className: 'status-done' },
};

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const status = STATUS_CONFIG[task.status] || STATUS_CONFIG.TODO;

  const createdAt = new Date(task.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="task-card" aria-label={`Task: ${task.title}`}>
      <div className="task-card-header">
        <span className={`status-badge ${status.className}`}>{status.label}</span>
        <span className="task-date">{createdAt}</span>
      </div>

      <h3 className="task-title">{task.title}</h3>

      {task.description && <p className="task-description">{task.description}</p>}

      <div className="task-card-footer">
        {onStatusChange && (
          <select
            className="status-select"
            value={task.status}
            onChange={(e) => onStatusChange(task, e.target.value)}
            aria-label={`Change status of ${task.title}`}
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        )}
        <button
          className="btn btn-sm btn-secondary"
          onClick={() => onEdit(task)}
          aria-label={`Edit task: ${task.title}`}
        >
          ✏️ Edit
        </button>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => onDelete(task)}
          aria-label={`Delete task: ${task.title}`}
        >
          🗑️ Delete
        </button>
      </div>
    </article>
  );
}
