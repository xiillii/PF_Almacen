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

describe('Category tests', () => {
  let post;
  let token;

  beforeAll(async () => {
    console.log('beforeAll Category');
    await mongoose.connect(process.env.MONGO_JEST_CATEGORIES_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  beforeEach(async () => {
    console.log('beforeEach Category');
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
    console.log('afterEach Category');
    await dropAllCollections();
  });

  afterAll(async () => {
    console.log('afterAll Category');
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

  it('test1', () => {});
  it('test2', () => {});
});
