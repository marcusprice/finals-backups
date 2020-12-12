global.__basedir = __dirname;
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/.env' });
const runSQLBackup = require('./lib/runSQLBackup');
const compressDirectory = require('./lib/compressDirectory');
const googleDrive = require('./lib/googleDrive');
const {
  cp,
  newLogEntry,
  createNewDir,
  cleanUp,
  appendLog,
  logAndKill,
  logSuccess,
} = require('./lib/fsHelpers');

const dbName = process.env.DB_NAME;
const publicPath = process.env.PUBLIC_PATH;
const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n');
const folderID = process.env.GOOGLE_BACKUPS_FOLDER_ID;
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
    await runSQLBackup(dbName, dirPath, today);
  } catch (err) {
    appendLog('\n\n Error while backing up database:');
    logAndKill(err);
  }

  //make a copy of the strapi public folder and move it into the temp folder
  try {
    await cp(publicPath, dirPath + '/public');
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
      clientEmail,
      privateKey
    );

    await googleDrive.uploadFile(
      jwtClient,
      today + ' backup',
      dirPath + '.zip',
      folderID
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
