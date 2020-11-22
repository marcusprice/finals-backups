require('dotenv').config();
const execFile = require('child_process').execFile;

module.exports = (path, date) => {
  const fileName = '/' + date + '_database_backup';
  path = path += fileName;

  return new Promise((resolve, reject) => {
    execFile('./backup.sh', [process.env.DB_NAME, path], (error) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        resolve(true);
      }
    });
  });
};
