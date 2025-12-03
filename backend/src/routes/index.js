const { Router } = require('express');
const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const taskRoutes = require('./task.routes');
const focusSessionRoutes = require('./focusSession.routes');

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/sessions', focusSessionRoutes);

router.get('/', (_req, res) => {
  res.json({ message: 'API is running' });
});

module.exports = router;
