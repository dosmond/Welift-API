import { AcceptedLift } from '@src/model/acceptedLift.entity';
import { AcceptedLiftService } from './../routes/accepted-lift/accepted-lift.service';
import { configService } from '@src/config/config.service';
import { ConnectionOptions, createConnection } from 'typeorm';

async function run() {
  const seedId = Date.now()
    .toString()
    .split('')
    .reverse()
    .reduce((s, it, x) => (x > 3 ? s : (s += it)), '');

  const opt = {
    ...configService.getTypeOrmConfig(),
    debug: true,
  };

  const connection = await createConnection(opt as ConnectionOptions);

  //const acceptedLiftService = new AcceptedLiftService(connection.getRepository(AcceptedLift))
}

run()
  .then((_) => console.log('...waiting for script to exit'))
  .catch((error) => console.error('seed error', error));
