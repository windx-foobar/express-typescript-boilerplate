import * as nock from 'nock';
import request from 'supertest';

import { User } from '@app/models/User';
import { closeDatabase, createSuperAdmin, createRoles } from '../../utils/database';
import { BootstrapSettings } from '../utils/bootstrap';
import { prepareServer } from '../utils/server';

describe('/api/users', () => {

  let superAdmin: User;
  let superAdminAuthorization: string;
  let settings: BootstrapSettings;

  // -------------------------------------------------------------------------
  // Setup up
  // -------------------------------------------------------------------------

  beforeAll(async () => {
    settings = await prepareServer({ migrate: true });
    await createRoles(settings.connection);
    await createSuperAdmin(settings.connection);
    superAdmin = await User.findOne({ where: { email: 'admin@site.com' } });
    superAdminAuthorization = Buffer
      .from(`${superAdmin.email}:123456`)
      .toString('base64');
  });

  // -------------------------------------------------------------------------
  // Tear down
  // -------------------------------------------------------------------------

  afterAll(async () => {
    nock.cleanAll();
    await closeDatabase(settings.connection);
  });

  // -------------------------------------------------------------------------
  // Test cases
  // -------------------------------------------------------------------------

  test('GET: / should return a list of users', async (done) => {
    const response = await request(settings.app)
      .get('/api/users')
      .set('Authorization', `Basic ${superAdminAuthorization}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.length).toBe(1);
    done();
  });

  test('GET: /:id should return superAdmin', async (done) => {
    const response = await request(settings.app)
      .get(`/api/users/${superAdmin.id}`)
      .set('Authorization', `Basic ${superAdminAuthorization}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.id).toBe(superAdmin.id);
    expect(response.body.email).toBe(superAdmin.email);
    expect(response.body.payload).toBe(superAdmin.payload);

    done();
  });

});
