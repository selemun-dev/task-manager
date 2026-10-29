/**
 * App — root component, orchestrates all UI state.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useTasks } from './hooks/useTasks';
import TaskCard from './components/TaskCard';
import TaskForm from './components/TaskForm';
import Modal from './components/Modal';
import ConfirmDialog from './components/ConfirmDialog';
import FilterBar from './components/FilterBar';
import Toast from './components/Toast';

let toastCounter = 0;

export default function App() {
  const { tasks, loading, error, reload, addTask, editTask, removeTask } = useTasks();

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Confirm-delete state
  const [confirmTask, setConfirmTask] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Filter / search / sort state
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('NEWEST');
  const searchRef = useRef(null);

  // Toast state
  const [toasts, setToasts] = useState([]);

  function pushToast(message, type = 'success') {
    const id = ++toastCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
  }

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Keyboard shortcuts: "/" focuses search, "n" opens the new-task form ──
  useEffect(() => {
    function onKey(e) {
      const tag = e.target.tagName;
      const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag);
      if (typing || modalOpen || confirmTask || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === '/') {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key === 'n') {
        e.preventDefault();
        openCreateModal();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  // ── Open create modal ──────────────────────────────────────────────────────
  function openCreateModal() {
    setEditingTask(null);
    setSubmitError(null);
    setModalOpen(true);
  }

  // ── Open edit modal ────────────────────────────────────────────────────────
  function openEditModal(task) {
    setEditingTask(task);
    setSubmitError(null);
    setModalOpen(true);
  }

  function closeModal() {
    if (submitting) return;
    setModalOpen(false);
    setEditingTask(null);
    setSubmitError(null);
  }

  // ── Submit create/edit ─────────────────────────────────────────────────────
  async function handleSubmit(payload) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      if (editingTask) {
        await editTask(editingTask.id, payload);
        pushToast('Task updated successfully');
      } else {
        await addTask(payload);
        pushToast('Task created successfully');
      }
      closeModal();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Something went wrong';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  // ── Quick status change straight from a card ───────────────────────────────
  async function handleStatusChange(task, status) {
    if (status === task.status) return;
    try {
      await editTask(task.id, { status });
      pushToast(`"${task.title}" moved to ${status.replace('_', ' ').toLowerCase()}`);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Update failed';
      pushToast(msg, 'error');
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  function requestDelete(task) {
    setConfirmTask(task);
  }

  function cancelDelete() {
    if (deleting) return;
    setConfirmTask(null);
  }

  async function confirmDelete() {
    if (!confirmTask) return;
    setDeleting(true);
    try {
      await removeTask(confirmTask.id);
      pushToast(`"${confirmTask.title}" deleted`);
      setConfirmTask(null);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Delete failed';
      pushToast(msg, 'error');
    } finally {
      setDeleting(false);
    }
  }

  // ── Filtering ──────────────────────────────────────────────────────────────
  const query = search.trim().toLowerCase();

  const filteredTasks = tasks
    .filter((t) => activeFilter === 'ALL' || t.status === activeFilter)
    .filter((t) => !query || `${t.title} ${t.description}`.toLowerCase().includes(query))
    .sort((a, b) => {
      if (sortBy === 'OLDEST') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'TITLE') return a.title.localeCompare(b.title);
      return new Date(b.createdAt) - new Date(a.createdAt); // NEWEST
    });

  function clearFilters() {
    setActiveFilter('ALL');
    setSearch('');
  }

  const counts = {
    ALL: tasks.length,
    TODO: tasks.filter((t) => t.status === 'TODO').length,
    IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    DONE: tasks.filter((t) => t.status === 'DONE').length,
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-brand">
            <span className="header-icon">✅</span>
            <h1>Task Manager</h1>
          </div>
          <button className="btn btn-primary btn-new" onClick={openCreateModal}>
            + New Task
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="app-main">
        {/* Stats bar */}
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-value">{counts.ALL}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item">
            <span className="stat-value stat-todo">{counts.TODO}</span>
            <span className="stat-label">To Do</span>
          </div>
          <div className="stat-item">
            <span className="stat-value stat-inprogress">{counts.IN_PROGRESS}</span>
            <span className="stat-label">In Progress</span>
          </div>
          <div className="stat-item">
            <span className="stat-value stat-done">{counts.DONE}</span>
            <span className="stat-label">Done</span>
          </div>
        </div>

        {/* Search + sort */}
        <div className="toolbar">
          <div className="search-wrap">
            <input
              ref={searchRef}
              className="search-input"
              type="search"
              placeholder='Search tasks…  (press "/")'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search tasks"
            />
            {search && (
              <button
                className="search-clear"
                onClick={() => setSearch('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          <label className="sort-wrap">
            <span className="sort-label">Sort by</span>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="NEWEST">Newest first</option>
              <option value="OLDEST">Oldest first</option>
              <option value="TITLE">Title A–Z</option>
            </select>
          </label>
        </div>

        {/* Filter bar */}
        <FilterBar activeFilter={activeFilter} onChange={setActiveFilter} counts={counts} />

        {!loading && !error && tasks.length > 0 && (
          <p className="results-count" aria-live="polite">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </p>
        )}

        {/* Task list */}
        {loading ? (
          <div className="state-message">
            <div className="spinner" aria-label="Loading tasks…" />
            <p>Loading tasks…</p>
          </div>
        ) : error ? (
          <div className="state-message state-error" role="alert">
            <span className="state-icon">⚠️</span>
            <p>{error}</p>
            <p className="state-hint">Make sure the API server is running on port 8080.</p>
            <button className="btn btn-secondary" onClick={reload}>
              Retry
            </button>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="state-message state-empty">
            <span className="state-icon">📋</span>
            <p>
              {tasks.length === 0
                ? 'No tasks yet. Create your first one!'
                : 'No tasks match your search or filter.'}
            </p>
            {tasks.length === 0 ? (
              <button className="btn btn-primary" onClick={openCreateModal}>
                + Create Task
              </button>
            ) : (
              <button className="btn btn-secondary" onClick={clearFilters}>
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="task-grid">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={openEditModal}
                onDelete={requestDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Create / Edit Modal ── */}
      <Modal
        isOpen={modalOpen}
        title={editingTask ? 'Edit Task' : 'New Task'}
        onClose={closeModal}
      >
        {submitError && (
          <div className="form-api-error" role="alert">
            ⚠️ {submitError}
          </div>
        )}
        <TaskForm
          initialData={editingTask}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          submitting={submitting}
        />
      </Modal>

      {/* ── Confirm Delete Dialog ── */}
      <ConfirmDialog
        isOpen={Boolean(confirmTask)}
        task={confirmTask}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        deleting={deleting}
      />

      {/* ── Toasts ── */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
