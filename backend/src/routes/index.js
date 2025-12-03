const { Router } = require('express');
const healthRoutes = require('./health.routes');

const router = Router();

router.use('/health', healthRoutes);
router.get('/', (_req, res) => {
  res.json({ message: 'API is running' });
});

module.exports = router;
