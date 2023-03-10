const { format, createLogger, transports } = require("winston");
const { combine, timestamp, align, printf } = format;

const logger = createLogger({
  format: combine(
    timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
    align(),
    printf((err) => `${[err.timestamp]}: ${err.message}`)
  ),
  transports: [
    new transports.File({
      filename: "logs/errors.log",
      level: "error",
    }),
    new transports.File({
      filename: "logs/combined.log",
      level: "info",
    }),
  ],
});

module.exports = logger;
