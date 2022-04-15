import express from 'express';
import dotenv from 'dotenv';

import mongoose from 'mongoose';
import supertest from 'supertest';

import User from '../models/userModel.js';
import warehouseRoutes from '../routes/warehouseRoutes.js';
import userRoutes from '../routes/userRoutes.js';
import { errorHandler, notFound } from '../middleware/errorMiddleware.js';
import Warehouse from '../models/warehouseModel.js';

const app = express();
dotenv.config();

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/warehouses', warehouseRoutes);

app.use(notFound);
app.use(errorHandler);

describe('Warehouse tests', () => {
  let token;

  const insertItem = async () => {
    const post = await User.create({
      name: 'User for test',
      email: 'emailtest@email.com',
      password: '123',
    });

    return post;
  };

  const authUser = async () => {
    let tokenAux;
    // autenticamos el usuario
    const data = {
      email: 'emailtest@email.com',
      password: '123',
    };

    await supertest(app)
      .post('/api/users/login')
      .send(data)
      .expect(200)
      .then(async (response) => {
        tokenAux = response.body.token;
      });

    return tokenAux;
  };

  const dropAllCollections = async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
      await collection.drop();
    }
  };

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_JEST_WAREHOUSE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  beforeEach(async () => {
    // insertamos un usuario
    await insertItem();
    token = await authUser();
  });

  afterEach(async () => {
    await dropAllCollections();
    //console.log('afterEach');
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close();
    });
    //console.log('afterAll');
  });

  // ************** TESTS **************
  test('GET /api/warehouses Not authorized', async () => {
    await supertest(app).get('/api/warehouses').expect(401);
  });

  test('GET /api/warehouses', async () => {
    const warehouse = await Warehouse.create({
      code: 'code1',
      name: 'Name',
      description: 'Code  1',
    });

    // procedemos con el test
    await supertest(app)
      .get('/api/warehouses')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toEqual(1);

        expect(response.headers['x-total-count']).toBe('1');

        expect(response.body[0].code).toBe(warehouse.code);
        expect(response.body[0].name).toBe(warehouse.name);
        expect(response.body[0].description).toBe(warehouse.description);
      });
  });

  test('POST /api/warehouses', async () => {
    // procedemos con el test
    const toInsert = {
      code: 'code1',
      name: 'Name',
      description: 'Code  1',
    };
    await supertest(app)
      .post('/api/warehouses')
      .set('Authorization', `Bearer ${token}`)
      .send(toInsert)
      .expect(201)
      .then((response) => {
        expect(!Array.isArray(response.body)).toBeTruthy();

        expect(response.body.code).toBe(toInsert.code);
        expect(response.body.name).toBe(toInsert.name);
        expect(response.body.description).toBe(toInsert.description);
      });
  });
});
