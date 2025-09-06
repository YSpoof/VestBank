import { createStorage } from 'unstorage';
import fsDriverLite from 'unstorage/drivers/fs-lite';
import { Client } from '../../shared/validators';

export const clientsDb = createStorage<Client>({
  driver: fsDriverLite({
    base: './data/clients',
  }),
});
