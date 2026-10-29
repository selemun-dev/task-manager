/**
 * TaskForm — handles both create and edit modes.
 */

import { useState, useEffect } from 'react';

const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];

const STATUS_LABELS = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};

const EMPTY_FORM = { title: '', description: '', status: 'TODO' };

export default function TaskForm({ initialData, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || 'TODO',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setFieldErrors({});
  }, [initialData]);

  function validate() {
    const errors = {};
    if (!form.title.trim()) errors.title = 'Title is required';
    else if (form.title.trim().length < 3) errors.title = 'Title must be at least 3 characters';
    else if (form.title.trim().length > 100) errors.title = 'Title must be at most 100 characters';
    if (form.description.length > 500) errors.description = 'Description must be at most 500 characters';
    return errors;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    // Clear field error on change
    if (fieldErrors[name]) setFieldErrors((fe) => ({ ...fe, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    await onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
    });
  }

  const isEdit = Boolean(initialData);

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="title">
          Title <span className="required">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Prepare weekly report"
          maxLength={100}
          disabled={submitting}
          aria-describedby={fieldErrors.title ? 'title-error' : undefined}
          aria-invalid={Boolean(fieldErrors.title)}
        />
        {fieldErrors.title && (
          <span id="title-error" className="field-error" role="alert">
            {fieldErrors.title}
          </span>
        )}
        <span className="char-count">{form.title.length}/100</span>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Optional details about this task…"
          rows={3}
          maxLength={500}
          disabled={submitting}
          aria-describedby={fieldErrors.description ? 'desc-error' : undefined}
          aria-invalid={Boolean(fieldErrors.description)}
        />
        {fieldErrors.description && (
          <span id="desc-error" className="field-error" role="alert">
            {fieldErrors.description}
          </span>
        )}
        <span className="char-count">{form.description.length}/500</span>
      </div>

      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={form.status}
          onChange={handleChange}
          disabled={submitting}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? (isEdit ? 'Saving…' : 'Creating…') : isEdit ? 'Save Changes' : 'Create Task'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
      </div>
    </form>
  );
}
