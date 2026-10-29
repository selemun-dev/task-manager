/**
 * useTasks — encapsulates all task-related state and CRUD operations.
 */

import { useState, useEffect, useCallback } from 'react';
import * as api from '../api/tasks';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.fetchTasks();
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Re-sync with the server after a successful change (no loading flash).
  async function refresh() {
    try {
      setTasks(await api.fetchTasks());
    } catch {
      /* keep the local state if the refresh fails */
    }
  }

  async function addTask(payload) {
    const task = await api.createTask(payload);
    setTasks((prev) => [task, ...prev]);
    await refresh();
    return task;
  }

  async function editTask(id, payload) {
    const task = await api.updateTask(id, payload);
    setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
    await refresh();
    return task;
  }

  async function removeTask(id) {
    await api.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await refresh();
  }

  return { tasks, loading, error, reload: loadTasks, addTask, editTask, removeTask };
}
