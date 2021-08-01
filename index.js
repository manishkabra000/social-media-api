const express = require("express");
const app = express();

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");

const UserRouter = require("./routes/users");
const AuthRouter = require("./routes/auth");
const PostRouter = require("./routes/posts");

dotenv.config();

mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Connected to MongoDB");
  }
);

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", UserRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/posts", PostRouter);

app.listen(3000, () => {
  console.log("Backend Server is up & running.");
});
