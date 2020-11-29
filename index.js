require('dotenv').config();
const runSQLBackup = require('./runSQLBackup');
const compressDirectory = require('./compressDirectory');
const googleDrive = require('./googleDrive');
const {
  cp,
  newLogEntry,
  createNewDir,
  cleanUp,
  appendLog,
  logAndKill,
  logSuccess,
} = require('./fsHelpers');

const date = new Date();
const today =
  date.getMonth() + 1 + '-' + date.getDate() + '-' + date.getFullYear();

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
  try {
    const jwtClient = await googleDrive.authorizeAndConnect(
      process.env.GOOGLE_CLIENT_EMAIL,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n')
    );
    await googleDrive.uploadFile(
      jwtClient,
      today + ' backup',
      dirPath + '.zip',
      process.env.GOOGLE_BACKUPS_FOLDER_ID
    );
  } catch (err) {
    appendLog('\n\nError while uploading to google drive:');
    logAndKill(err);
  }

  //delete temp folder and compressed file
  cleanUp(dirPath);
  //delete any drive files > 60 days old

  //log success
  logSuccess(date);
  process.exit(0);
};

runProgram();
