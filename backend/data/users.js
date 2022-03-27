import bcrypt from 'bcrypt';

const users = [
  {
    name: 'Admin',
    email: 'mail@josealonso.dev',
    password: bcrypt.hashSync(
      'passw0rd#',
      Number(process.env.PASSWORD_HASH_LENGTH)
    ),
    isAdmin: true,
  },
];

export default users;
