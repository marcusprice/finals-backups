const date = new Date();
const today =
  date.getMonth() + 1 + '-' + date.getDate() + '-' + date.getFullYear();
const runBackup = require('./runBackup');
const {
  newLogEntry,
  logAndKill,
  createNewDir,
  cleanUp,
  logSuccess,
} = require('./fsHelpers');

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
  cleanUp(dirPath);
  //delete any drive files > 60 days old

  //log success
  logSuccess(date);
};

runProgram();
