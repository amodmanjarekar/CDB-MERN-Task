const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Admin.findOne({ username });
    if (!user) return res.status(400).json({ message: "Admin not found" });

    if (password != user.password) return res.status(401).json({ message: "Incorrect password" });

    jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '8h' }, function (err, token) {
      res.status(200).json({ token });
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { login };
