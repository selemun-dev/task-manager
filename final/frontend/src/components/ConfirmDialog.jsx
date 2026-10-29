/**
 * ConfirmDialog — delete confirmation dialog.
 */

import Modal from './Modal';

export default function ConfirmDialog({ isOpen, task, onConfirm, onCancel, deleting }) {
  return (
    <Modal isOpen={isOpen} title="Delete Task" onClose={onCancel}>
      <div className="confirm-dialog">
        <p>
          Are you sure you want to delete{' '}
          <strong>&quot;{task?.title}&quot;</strong>?
        </p>
        <p className="confirm-warning">This action cannot be undone.</p>
        <div className="form-actions">
          <button
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={deleting}
            autoFocus
          >
            {deleting ? 'Deleting…' : 'Yes, Delete'}
          </button>
          <button className="btn btn-ghost" onClick={onCancel} disabled={deleting}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
