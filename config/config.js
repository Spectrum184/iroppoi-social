const config = {
  mongodbConfig: {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },

  socketCors: {
    origin: "*",
    methods: ["GET", "POST"],
  },

  rateLimit: {
    windowMs: 1000,
    max: 100,
    message:
      "Too many accounts created from this IP, please try again after one minute",
  },
};

module.exports = config;
