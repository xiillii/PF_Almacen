import express from 'express';
import dotenv from 'dotenv';

import mongoose from 'mongoose';
import supertest from 'supertest';

import User from '../models/userModel.js';
import userRoutes from '../routes/userRoutes.js';
import categoryRoutes from '../routes/categoryRoutes.js';
import { errorHandler, notFound } from '../middleware/errorMiddleware.js';
import Category from '../models/categoryModel.js';

const app = express();
dotenv.config();

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);

app.use(notFound);
app.use(errorHandler);

describe('Category tests', () => {
  let post;
  let token;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_JEST_CATEGORIES_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  beforeEach(async () => {
    // insertamos un usuario
    post = await insertItem();
    token = await auth();
  });

  const dropAllCollections = async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
      await collection.drop();
    }
  };

  afterEach(async () => {
    await dropAllCollections();
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close();
    });
  });

  const insertItem = async () => {
    const post = await User.create({
      name: 'user 2',
      email: 'email2@email.com',
      password: '123',
    });

    return post;
  };

  const auth = async () => {
    // autenticamos el usuario
    const data = {
      email: 'email2@email.com',
      password: '123',
    };
    let token;

    await supertest(app)
      .post('/api/users/login')
      .send(data)
      .expect(200)
      .then(async (response) => {
        token = response.body.token;
      });

    return token;
  };

  // ************** TESTS **************

  test('GET /api/categories Not authorized', async () => {
    await supertest(app).get('/api/categories').expect(401);
  });

  test('GET /api/categories', async () => {
    const category = await Category.create({
      code: 'code1',
      description: 'Code  1',
    });
    // procedemos con el test
    await supertest(app)
      .get('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toEqual(1);

        expect(response.headers['x-total-count']).toBe('1');

        expect(response.body[0].code).toBe(category.code);
        expect(response.body[0].description).toBe(category.description);
      });
  });

  test('POST /api/categories', async () => {
    // procedemos con el test
    const toInsert = {
      code: 'theCode01',
      description: 'The code 01',
    };
    await supertest(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send(toInsert)
      .expect(201)
      .then((response) => {
        expect(!Array.isArray(response.body)).toBeTruthy();

        expect(response.body.code).toBe(toInsert.code);
        expect(response.body.description).toBe(toInsert.description);
      });
  });

  test('PUT /api/categories/:id', async () => {
    // procedemos con el test
    const toInsert = {
      code: 'theCode01',
      description: 'The code 01',
    };

    const category = await Category.create(toInsert);

    await supertest(app)
      .put(`/api/categories/${category._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(toInsert)
      .expect(200)
      .then((response) => {
        expect(!Array.isArray(response.body)).toBeTruthy();

        expect(response.body.code).toBe(toInsert.code);
        expect(response.body.description).toBe(toInsert.description);
      });
  });

  test('DELETE /api/categories/:id', async () => {
    // procedemos con el test
    const toInsert = {
      code: 'theCode01',
      description: 'The code 01',
    };

    const category = await Category.create(toInsert);

    // procedemos con el test

    await supertest(app)
      .delete(`/api/categories/${category._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        expect(response.body.code).toBeUndefined();
      });
  });

  test('GET /api/categories/:id', async () => {
    // procedemos con el test
    // procedemos con el test
    const toInsert = {
      code: 'theCode01',
      description: 'The code 01',
    };

    const category = await Category.create(toInsert);

    await supertest(app)
      .get(`/api/categories/${category._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        expect(!Array.isArray(response.body)).toBeTruthy();

        expect(response.body.code).toBe(category.code);
        expect(response.body.description).toBe(category.description);
      });
  });
});
