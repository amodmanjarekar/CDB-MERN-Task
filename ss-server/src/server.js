const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const profileRouter = require("./routes/profileRouter");
const authRouter = require('./routes/authRouter');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(
  () => { console.log("Connected to MongoDB") },
  (err) => { console.log(err) }
);

app.use("/api/profiles", profileRouter);
app.use("/api/auth", authRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
