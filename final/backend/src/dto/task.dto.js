/**
 * DTOs — shape the data flowing in and out of the API.
 * We never expose internal storage objects directly.
 */

const VALID_STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];

/**
 * Validate and sanitize a create-task request body.
 * Returns { data, errors }.
 */
function validateCreateTask(body) {
  const errors = [];
  const { title, description, status } = body || {};

  // title: required, 3–100 chars
  if (!title || typeof title !== 'string') {
    errors.push('title is required');
  } else if (title.trim().length < 3) {
    errors.push('title must be at least 3 characters');
  } else if (title.trim().length > 100) {
    errors.push('title must be at most 100 characters');
  }

  // description: optional, max 500 chars
  if (description !== undefined && description !== null) {
    if (typeof description !== 'string') {
      errors.push('description must be a string');
    } else if (description.length > 500) {
      errors.push('description must be at most 500 characters');
    }
  }

  // status: optional on create (defaults to TODO), must be valid if provided
  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    errors.push(`status must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  if (errors.length > 0) return { data: null, errors };

  return {
    data: {
      title: title.trim(),
      description: description !== undefined && description !== null ? description.trim() : '',
      status: status || 'TODO',
    },
    errors: [],
  };
}

/**
 * Validate and sanitize an update-task request body.
 * All fields optional, but at least one must be present.
 */
function validateUpdateTask(body) {
  const errors = [];
  const { title, description, status } = body || {};

  if (title === undefined && description === undefined && status === undefined) {
    errors.push('at least one field (title, description, status) must be provided');
  }

  if (title !== undefined) {
    if (typeof title !== 'string') {
      errors.push('title must be a string');
    } else if (title.trim().length < 3) {
      errors.push('title must be at least 3 characters');
    } else if (title.trim().length > 100) {
      errors.push('title must be at most 100 characters');
    }
  }

  if (description !== undefined && description !== null) {
    if (typeof description !== 'string') {
      errors.push('description must be a string');
    } else if (description.length > 500) {
      errors.push('description must be at most 500 characters');
    }
  }

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    errors.push(`status must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  if (errors.length > 0) return { data: null, errors };

  const data = {};
  if (title !== undefined) data.title = title.trim();
  if (description !== undefined) data.description = description !== null ? description.trim() : '';
  if (status !== undefined) data.status = status;

  return { data, errors: [] };
}

/**
 * Shape a stored task object into a clean API response DTO.
 */
function toTaskResponse(task) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}

module.exports = { validateCreateTask, validateUpdateTask, toTaskResponse, VALID_STATUSES };
