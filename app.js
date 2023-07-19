require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const connectDB = require("./db/connect");
const authRouter = require("./routes/auth");
const anRouter = require("./routes/an");
const epRouter = require("./routes/ep");
const userRouter = require("./routes/user");
const authenticate = require("./middlewares/authentificate");
const notFound = require("./middlewares/not-found");
const errorHandler = require("./middlewares/error-handler");
const cors = require("cors");
const xss = require("xss");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
app.set("trust proxy", 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);

app.use(express.json());
app.use(cookieParser());
const html = xss('<script>alert("xss");</script>');
app.use(cors());
app.use(helmet());

const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDoc = YAML.load("./swagger.yaml");

app.get("/", (req, res) => {
  res.send(
    "<h1>Welcome To Anime Api</h1> <a href='/api-docs'>Documentation </a>"
  );
});
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", authenticate, userRouter);
app.use("/api/v1/anime", anRouter);
app.use("/api/v1/episode", epRouter);
app.use(notFound);
app.use(errorHandler);
const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    app.listen(port, () => console.log(`Server Listening On Port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
