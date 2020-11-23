const fs = require('fs');

exports.newLogEntry = (today) => {
  //set a new entry for the logs
  fs.appendFileSync(__dirname + '/logs.txt', '\n\n' + today + ' Logs');
};

exports.logAndKill = (err) => {
  fs.appendFileSync(__dirname + '/logs.txt', '\n' + err.toString());
  process.exit(1);
};

exports.createNewDir = (today) => {
  const path = __dirname + '/' + today + ' backup';

  try {
    fs.mkdirSync(path);
  } catch (err) {
    this.logAndKill(err);
  }

  return path;
};

exports.cleanUp = (dirPath) => {
  try {
    fs.rmdirSync(dirPath, { recursive: true });
  } catch (err) {
    this.logAndKill(err);
  }
};

exports.logSuccess = (date) => {
  const message = 'Successful backup on ' + date.toUTCString();
  fs.appendFileSync(__dirname + '/logs.txt', '\n' + message);
};
