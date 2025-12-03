const { Router } = require('express');
const focusSessionController = require('../controllers/focusSessionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

router.use(authMiddleware);
router.get('/', focusSessionController.listSessions);
router.post('/start', focusSessionController.startSession);
router.post('/:id/stop', focusSessionController.stopSession);

module.exports = router;
