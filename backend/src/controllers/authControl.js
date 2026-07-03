import pool from "../config/db.js";

const memoryUsers = [];

export const signupUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please complete all fields." });
  }

  try {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);

    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "An account with that email already exists." });
    }

    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, password]
    );

    res.status(201).json({
      message: "Account created successfully",
      user: result.rows[0],
    });
  } catch (err) {
    console.warn("Database unavailable, using fallback auth storage:", err.message);

    const existingUser = memoryUsers.find((user) => user.email === email);

    if (existingUser) {
      return res.status(409).json({ message: "An account with that email already exists." });
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
    };

    memoryUsers.unshift(newUser);

    res.status(201).json({
      message: "Account created successfully",
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      user: result.rows[0],
    });
  } catch (err) {
    console.warn("Database unavailable, using fallback auth storage:", err.message);

    const user = memoryUsers.find((item) => item.email === email && item.password === password);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email },
    });
  }
};
