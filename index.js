const fs = require('fs');
const date = new Date();
const runBackup = require('./runBackup');
const today =
  date.getMonth() + 1 + '-' + date.getDate() + '-' + date.getFullYear();
let continueProgram = true;

const newLogEntry = (today) => {
  //set a new entry for the logs
  fs.appendFileSync(__dirname + '/logs.txt', '\n\n' + today + ' Logs');
};

const logAndKill = (err) => {
  fs.appendFileSync(__dirname + '/logs.txt', '\n' + err.toString());
  process.exit(1);
};

const createNewDir = (today) => {
  const path = __dirname + '/' + today + ' backup';

  try {
    fs.mkdirSync(path);
  } catch (err) {
    logAndKill(err);
  }

  return path;
};

const cleanUp = (dirPath) => {
  try {
    fs.rmdirSync(dirPath);
  } catch (err) {
    logAndKill(err);
  }
};

const logSuccess = () => {
  const message = 'Successful backup on ' + date.toUTCString();
  fs.appendFileSync(__dirname + '/logs.txt', '\n' + message);
};

const runProgram = async () => {
  //set a new entry for the logs
  newLogEntry(today);

  //make a temporary folder to store backups - name is timestamped with today's date
  const dirPath = createNewDir(today);

  //back up the database and put the sql file in the temp folder

  runBackup(dirPath, today);

  //make a copy of the strapi public folder and move it into the temp folder

  //compress the temp folder

  //upload the compressed folder to drive

  //delete temp folder and compressed file
  //cleanUp(dirPath);
  //delete any drive files > 60 days old

  //log success
  logSuccess();
};

runProgram();
