const { Router } = require('express');
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

router.use(authMiddleware);
router.get('/', dashboardController.getDashboard);

module.exports = router;
