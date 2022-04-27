import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import colors from 'colors';

import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRouters from './routes/productRouters.js';
import warehouseRoutes from './routes/warehouseRoutes.js';
import movementTypeRoutes from './routes/movementTypeRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const app = express();

dotenv.config();

connectDB();

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRouters);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/movementtypes', movementTypeRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

export default app;
