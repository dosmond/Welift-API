/* eslint-disable @typescript-eslint/no-var-requires */
// import { configService } from '../config/config.service';
const { configService } = require('../config/config.service-module');
const fs = require('fs');
fs.writeFileSync(
  'ormconfig.json',
  JSON.stringify(configService.getTypeOrmConfig(), null, 2),
);
