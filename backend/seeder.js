import colors from 'colors';
import dotenv from 'dotenv';
import User from './models/userModel.js';
import users from './data/users.js';
import connectDb from './config/db.js';

dotenv.config();

connectDb();

// Limpia la base de datos e importa los datos de prueba
const importData = async () => {
  try {
    // Limpiar las tablas
    await User.deleteMany();

    // Insertamos los usuarios de prueba
    const importedUsers = await User.insertMany(users);

    console.log('Datos importados'.green.inverse);
    process.exit();
  } catch (error) {
    console.log(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    // Limpiar las tablas
    await User.deleteMany();

    console.log('Datos eliminados'.green.inverse);
    process.exit();
  } catch (error) {
    console.log(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
