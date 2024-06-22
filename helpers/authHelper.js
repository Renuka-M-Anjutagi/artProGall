import bcrypt from 'bcrypt';

export const hashPassword = async(password) => {
try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
} catch (error) {
    console.log(error);
}
}

export const comparePassword = (password, hashed_Password) => {
  return bcrypt.compare(password, hashed_Password);
}
