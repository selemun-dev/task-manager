/**
 * Task Service — business logic layer.
 * Orchestrates repository calls and enforces domain rules.
 */

const repo = require('../repositories/task.repository');

function getAllTasks() {
  return repo.findAll();
}

function getTaskById(id) {
  const task = repo.findById(id);
  if (!task) {
    const err = new Error(`Task with id '${id}' not found`);
    err.statusCode = 404;
    throw err;
  }
  return task;
}

function createTask(dto) {
  return repo.create(dto);
}

function updateTask(id, dto) {
  // Ensure the task exists first (throws 404 if not)
  getTaskById(id);
  return repo.update(id, dto);
}

function deleteTask(id) {
  // Ensure the task exists first (throws 404 if not)
  getTaskById(id);
  repo.remove(id);
}

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask };
