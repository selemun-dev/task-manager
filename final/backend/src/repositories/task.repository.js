/**
 * Task Repository — in-memory data store.
 * Abstracts all persistence concerns from the service layer.
 */

const { v4: uuidv4 } = require('uuid');

// In-memory store
const tasks = new Map();

function findAll() {
  return Array.from(tasks.values()).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

function findById(id) {
  return tasks.get(id) || null;
}

function create({ title, description, status }) {
  const now = new Date().toISOString();
  const task = {
    id: uuidv4(),
    title,
    description: description || '',
    status: status || 'TODO',
    createdAt: now,
    updatedAt: now,
  };
  tasks.set(task.id, task);
  return task;
}

function update(id, fields) {
  const existing = tasks.get(id);
  if (!existing) return null;

  const updated = {
    ...existing,
    ...fields,
    id: existing.id,       // id is immutable
    createdAt: existing.createdAt, // createdAt is immutable
    updatedAt: new Date().toISOString(),
  };
  tasks.set(id, updated);
  return updated;
}

function remove(id) {
  return tasks.delete(id);
}

module.exports = { findAll, findById, create, update, remove };
