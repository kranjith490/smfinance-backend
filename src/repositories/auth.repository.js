const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

exports.findByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};

exports.createUser = async (user) => {
  const id = uuidv4(); // Generate a unique ID
  const { name, email, password, role } = user;

  await db.query(
    "INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)",
    [id, name, email, password, role]
  );

  return { id, name, email, role };
};

exports.findById = async (id) => {
  const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
};
