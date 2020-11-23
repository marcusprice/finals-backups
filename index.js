require('dotenv').config();
const date = new Date();
const today =
  date.getMonth() + 1 + '-' + date.getDate() + '-' + date.getFullYear();
const runSQLBackup = require('./runSQLBackup');
const compressDirectory = require('./compressDirectory');
const {
  cp,
  newLogEntry,
  createNewDir,
  cleanUp,
  appendLog,
  logAndKill,
  logSuccess,
} = require('./fsHelpers');

const runProgram = async () => {
  //set a new entry for the logs
  newLogEntry(today);

  //make a temporary folder to store backups - name is timestamped with today's date
  const dirPath = createNewDir(today);

  //back up the database and put the sql file in the temp folder
  try {
    await runSQLBackup(process.env.DB_NAME, dirPath, today);
  } catch (err) {
    appendLog('\n\n Error while backing up database:');
    logAndKill(err);
  }

  //make a copy of the strapi public folder and move it into the temp folder
  try {
    await cp(process.env.PUBLIC_PATH, dirPath + '/public');
  } catch (err) {
    appendLog('\n\nError while copying public folder:');
    logAndKill(err);
  }
  //compress the temp folder
  try {
    await compressDirectory(dirPath, dirPath + '.zip');
  } catch (err) {
    appendLog('\n\nError while compressing public directory:');
    logAndKill(err);
  }

  //upload the compressed folder to drive

  //delete temp folder and compressed file
  cleanUp(dirPath);
  //delete any drive files > 60 days old

  //log success
  logSuccess(date);
  process.exit(0);
};

runProgram();
