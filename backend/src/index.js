const express = require('express');
const config = require('./config/config');
const routes = require('./routes');

const app = express();

app.use(express.json());
app.use('/api', routes);

app.listen(config.port, () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
});
