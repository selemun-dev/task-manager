/**
 * Task Routes — maps HTTP methods + paths to controller handlers.
 */

const { Router } = require('express');
const ctrl = require('../controllers/task.controller');

const router = Router();

router.get('/', ctrl.getAllTasks);
router.get('/:id', ctrl.getTaskById);
router.post('/', ctrl.createTask);
router.put('/:id', ctrl.updateTask);
router.delete('/:id', ctrl.deleteTask);

module.exports = router;
