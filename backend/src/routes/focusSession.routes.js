const { Router } = require('express');
const focusSessionController = require('../controllers/focusSessionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

router.use(authMiddleware);
router.get('/', focusSessionController.listSessions);

module.exports = router;
