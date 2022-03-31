import express from 'express';
import dotenv from 'dotenv';

import mongoose from 'mongoose';
import supertest from 'supertest';

import User from '../models/userModel.js';
import userRoutes from '../routes/userRoutes.js';
import { errorHandler, notFound } from '../middleware/errorMiddleware.js';

const app = express();
dotenv.config();

app.use(express.json());

app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

describe('User tests', () => {
  let post;
  let token;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_JEST_USERS_URI, {
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
      name: 'user 1',
      email: 'email@email.com',
      password: '123',
    });

    return post;
  };

  const auth = async () => {
    // autenticamos el usuario
    const data = {
      name: 'the name',
      email: 'email@email.com',
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

  test('GET /api/users Not authorized', async () => {
    await supertest(app).get('/api/users').expect(401);
  });

  test('GET /api/users', async () => {
    // procedemos con el test
    await supertest(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toEqual(1);

        expect(response.headers['x-total-count']).toBe('1');

        expect(response.body[0].email).toBe(post.email);
        expect(response.body[0].name).toBe(post.name);
      });
  });

  test('POST /api/users', async () => {
    // procedemos con el test
    const toInsert = {
      name: 'the name 2',
      email: 'email2@email.com',
      password: '123',
    };
    await supertest(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send(toInsert)
      .expect(201)
      .then((response) => {
        expect(!Array.isArray(response.body)).toBeTruthy();

        expect(response.body.email).toBe(toInsert.email);
        expect(response.body.name).toBe(toInsert.name);
        expect(response.body.token).toBeDefined();
      });
  });

  test('PUT /api/users/:id', async () => {
    // procedemos con el test
    const toInsert = {
      name: 'the name 2',
      email: 'email2@email.com',
      password: '123',
    };

    await supertest(app)
      .put(`/api/users/${post._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(toInsert)
      .expect(200)
      .then((response) => {
        expect(!Array.isArray(response.body)).toBeTruthy();

        expect(response.body.email).toBe(toInsert.email);
        expect(response.body.name).toBe(toInsert.name);
        expect(response.body.token).toBeDefined();
      });
  });

  test('DELETE /api/users/:id', async () => {
    // procedemos con el test

    await supertest(app)
      .delete(`/api/users/${post._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        expect(response.body.token).toBeUndefined();
      });
  });

  test('GET /api/users/:id', async () => {
    // procedemos con el test

    await supertest(app)
      .get(`/api/users/${post._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        expect(!Array.isArray(response.body)).toBeTruthy();

        expect(response.body.email).toBe(post.email);
        expect(response.body.name).toBe(post.name);
        expect(response.body.token).toBeUndefined();
      });
  });
});
