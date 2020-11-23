const fs = require('fs');
const ncp = require('ncp').ncp;

exports.newLogEntry = (today) => {
  //set a new entry for the logs
  fs.appendFileSync(__dirname + '/logs.txt', '\n\n' + today + ' Logs');
};

exports.appendLog = (logText) => {
  fs.appendFileSync(__dirname + '/logs.txt', logText);
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
    this.appendLog('\n\nError while creating new directory:');
    this.logAndKill(err);
  }

  return path;
};

exports.cleanUp = (dirPath) => {
  try {
    fs.rmdirSync(dirPath, { recursive: true });
    fs.rmSync(dirPath + '.zip');
  } catch (err) {
    this.appendLog('\n\nError while cleaning up:');
    this.logAndKill(err);
  }
};

exports.logSuccess = (date) => {
  const message = 'Successful backup on ' + date.toUTCString();
  fs.appendFileSync(__dirname + '/logs.txt', '\n' + message);
};

exports.cp = (source, destination) => {
  return new Promise((resolve, reject) => {
    ncp(source, destination, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};
