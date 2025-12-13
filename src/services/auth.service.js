const AuthRepo = require("../repositories/auth.repository");
const { generateToken } = require("../utils/jwt");
const { hashPassword, comparePassword } = require("../utils/password");

exports.register = async (data) => {
  const existing = await AuthRepo.findByEmail(data.email);
  if (existing) throw new Error("Email already exists");

  data.password = await hashPassword(data.password); // Ensure this line uses the correct function

  const user = await AuthRepo.createUser(data);

  return {
    success: true,
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: new Date().toISOString(),
    },
    token: generateToken(user.id),
  };
};

exports.login = async (data) => {
  const user = await AuthRepo.findByEmail(data.email);
  if (!user) throw new Error("Invalid email or password");

  const isPasswordValid = await comparePassword(data.password, user.password);
  if (!isPasswordValid) throw new Error("Invalid email or password");

  return {
    success: true,
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    token: generateToken(user.id),
  };
};
