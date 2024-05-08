const { createLogger, format, transports } = require("winston");
require("winston-mongodb");
const dotenv = require('dotenv');
dotenv.config()
const logger = createLogger({
  level: 'info',
  transports: [
    new transports.MongoDB({
      level: "error",
      db: process.env.DB_URL,
      options: { useUnifiedTopology: true },
      collection: "logs",
      format: format.combine(
        format.timestamp(),
        format.printf(info => {
          const data = `${info.timestamp} - ${info.level}: ${info.message}`;
          return data;
        })
      ),
    }),
    new transports.MongoDB({
      level: "info",
      db: process.env.DB_URL,
      options: { useUnifiedTopology: true },
      collection: "logs",
      format: format.combine(
        format.timestamp(),
        format.printf(info => {
          const data = `${info.timestamp} - ${info.level}: ${info.message}`;
          return data;
        })
      ),
    }),
  ],
});

module.exports = logger;