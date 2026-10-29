/**
 * Task Controller — HTTP layer.
 * Handles request parsing, delegates to service, formats responses.
 */

const service = require('../services/task.service');
const { validateCreateTask, validateUpdateTask, toTaskResponse } = require('../dto/task.dto');

function getAllTasks(req, res, next) {
  try {
    const tasks = service.getAllTasks();
    res.status(200).json(tasks.map(toTaskResponse));
  } catch (err) {
    next(err);
  }
}

function getTaskById(req, res, next) {
  try {
    const task = service.getTaskById(req.params.id);
    res.status(200).json(toTaskResponse(task));
  } catch (err) {
    next(err);
  }
}

function createTask(req, res, next) {
  try {
    const { data, errors } = validateCreateTask(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ status: 400, message: errors.join('; ') });
    }
    const task = service.createTask(data);
    res.status(201).json(toTaskResponse(task));
  } catch (err) {
    next(err);
  }
}

function updateTask(req, res, next) {
  try {
    const { data, errors } = validateUpdateTask(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ status: 400, message: errors.join('; ') });
    }
    const task = service.updateTask(req.params.id, data);
    res.status(200).json(toTaskResponse(task));
  } catch (err) {
    next(err);
  }
}

function deleteTask(req, res, next) {
  try {
    service.deleteTask(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask };
