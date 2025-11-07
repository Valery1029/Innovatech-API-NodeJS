// archivo: bcryptUtils.js
import bcrypt from 'bcryptjs';

const saltRounds = 10;

// Encriptar password
export const encryptPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error('Error encrypt:', error);
    throw error;
  }
};

// Comparar password plano con hash
export const comparePassword = async (password, hashedPassword) => {
  try {
    // Reemplazar $2y$ por $2b$ para compatibilidad con bcrypt de Node.js
    const fixedHash = hashedPassword.replace("$2y$", "$2b$");
    const match = await bcrypt.compare(password, fixedHash);
    return match;
  } catch (error) {
    console.error('Error compare:', error);
    throw error;
  }
};
