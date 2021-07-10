require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const rfs = require("rotating-file-stream");
const path = require("path");
const SocketServer = require("./socketServer");
const { ExpressPeerServer } = require("peer");
const config = require("./config/config");
const rateLimit = require("express-rate-limit");

const app = express();

const port = process.env.PORT || 5000;
const URI = process.env.MONGODB_URL;
const isProduction = process.env.NODE_ENV === "production";
const accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "log"),
});
const limiter = rateLimit(config.rateLimit);

app.use(express.json());
app.use(
  isProduction ? morgan("combined", { stream: accessLogStream }) : morgan("dev")
);
app.use(cors());
app.use(cookieParser());
app.use(helmet());
app.use(limiter);

// Socket.io
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: config.socketCors,
});

io.on("connection", (socket) => {
  SocketServer(socket);
});

//Create peer server
ExpressPeerServer(http, { path: "/" });

//Routes
app.use("/api", require("./routes/authRouter"));
app.use("/api", require("./routes/userRouter"));
app.use("/api", require("./routes/postRouter"));
app.use("/api", require("./routes/commentRouter"));
app.use("/api", require("./routes/notifyRouter"));
app.use("/api", require("./routes/messageRouter"));

mongoose.connect(URI, config.mongodbConfig, (err) => {
  if (err) throw err;
  console.log("🔥[mongo]:Connected to Mongoose");
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

http.listen(port, () => {
  console.log("❤️ [express]:Server listening on port: " + port);
});
