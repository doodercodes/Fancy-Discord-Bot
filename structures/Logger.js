const winston = require("winston");
const colors = require("colors");

class Logger {
  constructor(LoggingFile) {
    this.d = new Date();
    this.logger = winston.createLogger({
      transports: [new winston.transports.File({ filename: LoggingFile })],
    });
  }

  logInfo(Text) {
    this.logger.log({
      level: "info",
      message:
        `${this.d.getHours()}:${this.d.getMinutes()} - ${this.d.getMonth()}:${this.d.getDate()}:${this.d.getFullYear()} | Info: ` +
        Text,
    });
    console.log(
      colors.green(
        `${this.d.getMonth()}:${this.d.getDate()}:${this.d.getFullYear()} - ${this.d.getHours()}:${this.d.getMinutes()}`
      ) + colors.yellow(" | Info: " + Text)
    );
  }
  logReady(Text) {
    this.logger.log({
      level: "info",
      message: Text,
    });
    console.log(
      colors.green(
        `${this.d.getMonth()}:${this.d.getDate()}:${this.d.getFullYear()} - ${this.d.getHours()}:${this.d.getMinutes()}` +
          ` ${colors.yellow("|")} ` +
          Text
      )
    );
  }
}

module.exports = Logger;
