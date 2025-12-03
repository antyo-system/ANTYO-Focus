const express = require('express');
const config = require('./config/config');
const routes = require('./routes');
const { logger, requestLoggerMiddleware } = require('./middleware/logger');

const app = express();

app.use(express.json());
app.use(requestLoggerMiddleware);
app.use('/api', routes);

app.listen(config.port, () => {
  logger.info(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
});
