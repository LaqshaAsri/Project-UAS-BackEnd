import bcrypt from 'bcrypt';

const password = 'password123'; // ganti dengan password yang kamu mau

bcrypt.hash(password, 10, (err, hash) => {
  if (err) throw err;
  console.log('Hash untuk "' + password + '":');
  console.log(hash);
});
