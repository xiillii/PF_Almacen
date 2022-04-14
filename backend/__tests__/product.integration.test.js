import express from 'express';
import dotenv from 'dotenv';

import mongoose from 'mongoose';
import supertest from 'supertest';

import userRoutes from '../routes/userRoutes.js';
import categoryRoutes from '../routes/categoryRoutes.js';
import productRoutes from '../routes/productRouters.js';
import { errorHandler, notFound } from '../middleware/errorMiddleware.js';
import Category from '../models/categoryModel.js';
import Product from '../models/productModel.js';
import { authUser } from '../controllers/userController';
import User from '../models/userModel.js';

const app = express();
dotenv.config();

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

app.use(notFound);
app.use(errorHandler);

describe('Product tests', () => {
  let token;

  const insertItem = async () => {
    const post = await User.create({
      name: 'User for test products',
      email: 'emailtestproduct@email.com',
      password: '123',
    });

    return post;
  };

  const authUser = async () => {
    // autenticamos el usuario
    const data = {
      email: 'emailtestproduct@email.com',
      password: '123',
    };

    await supertest(app)
      .post('/api/users/login')
      .send(data)
      .expect(200)
      .then(async (response) => {
        token = response.body.token;
      });

    return token;
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
    await mongoose.connect(process.env.MONGO_JEST_PRODUCTS_URI, {
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
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close();
    });
  });

  // ************** TESTS **************
  test('GET /api/products Not authorized', async () => {
    await supertest(app).get('/api/products').expect(401);
  });

  test('GET /api/products', async () => {
    const category = await Category.create({
      code: 'code1',
      description: 'Code  1',
    });
    const product = await Product.create({
      code: 'Code1',
      name: 'Product 1',
      brand: 'Brand 1',
      category: category._id,
    });

    // procedemos con el test
    await supertest(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toEqual(1);

        expect(response.headers['x-total-count']).toBe('1');

        expect(response.body[0].code).toBe(product.code);
        expect(response.body[0].name).toBe(product.name);
      });
  });

  test('POST /api/products', async () => {
    const category = await Category.create({
      code: 'code1',
      description: 'Code  1',
    });
    const toInsert = {
      code: 'code111',
      name: 'tthe name',
      brand: 'brand 1',
      category: category._id,
    };

    // procedemos con el test
    await supertest(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send(toInsert)
      .expect(201)
      .then((response) => {
        expect(!Array.isArray(response.body)).toBeTruthy();

        expect(response.body.code).toBe(toInsert.code);
        expect(response.body.name).toBe(toInsert.name);
      });
  });

  test('PUT /api/products/:id', async () => {
    const category = await Category.create({
      code: 'code1',
      description: 'Code  1',
    });
    const toInsert = {
      code: 'code111',
      name: 'tthe name',
      brand: 'brand 1',
      category: category._id,
    };

    const toUpdate = {
      code: 'code111',
      name: 'tthe name 2',
      brand: 'brand 12',
      isActive: false,
      category: category._id,
    };
    const product = await Product.create(toInsert);

    await supertest(app)
      .put(`/api/products/${product._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(toUpdate)
      .expect(200)
      .then((response) => {
        expect(!Array.isArray(response.body)).toBeTruthy();

        expect(response.body.code).toBe(toUpdate.code);
        expect(response.body.name).toBe(toUpdate.name);
        expect(response.body.brand).toBe(toUpdate.brand);
        expect(response.body.isActive).toBe(toUpdate.isActive);
      });
  });

  test('PATCH /api/products/:id', async () => {
    const category = await Category.create({
      code: 'code1',
      description: 'Code  1',
    });
    const toInsert = {
      code: 'code111',
      name: 'tthe name',
      brand: 'brand 1',
      category: category._id,
    };

    const toUpdate = {
      isActive: false,
    };
    const product = await Product.create(toInsert);

    await supertest(app)
      .patch(`/api/products/${product._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(toUpdate)
      .expect(200)
      .then((response) => {
        expect(!Array.isArray(response.body)).toBeTruthy();

        expect(response.body.code).toBe(toInsert.code);
        expect(response.body.name).toBe(toInsert.name);
        expect(response.body.brand).toBe(toInsert.brand);
        expect(response.body.isActive).toBe(toUpdate.isActive);
      });
  });

  test('DELETE SUCCESS /api/products/:id', async () => {
    const category = await Category.create({
      code: 'code1',
      description: 'Code  1',
    });
    const toInsert = {
      code: 'code111',
      name: 'tthe name',
      brand: 'brand 1',
      category: category._id,
    };

    const product = await Product.create(toInsert);

    // procedemos con el test
    await supertest(app)
      .delete(`/api/products/${product._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        expect(response.body.code).toBeUndefined();
      });
  });

  test('DELETE FAILED BECAUSE EXISTENCE /api/products/:id', async () => {
    const category = await Category.create({
      code: 'code1',
      description: 'Code  1',
    });
    const toInsert = {
      code: 'code111',
      name: 'tthe name',
      brand: 'brand 1',
      category: category._id,
    };

    const product = await Product.create(toInsert);

    // procedemos con el test
    await supertest(app)
      .delete(`/api/products/${product._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });

  test('GET /api/products/:id', async () => {
    const category = await Category.create({
      code: 'code1',
      description: 'Code  1',
    });
    const toInsert = {
      code: 'code111',
      name: 'tthe name',
      brand: 'brand 1',
      category: category._id,
    };

    const product = await Product.create(toInsert);

    // procedemos con el test
    await supertest(app)
      .get(`/api/products/${product._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        expect(!Array.isArray(response.body)).toBeTruthy();

        expect(response.body.code).toBe(product.code);
        expect(response.body.name).toBe(product.name);
      });
  });
});
