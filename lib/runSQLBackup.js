const execFile = require('child_process').execFile;

module.exports = (dbName, path, date) => {
  const fileName = '/' + date + '_database_backup';
  path = path += fileName;

  return new Promise((resolve, reject) => {
    execFile(__basedir + '/bin/backup.sh', [dbName, path], (error) => {
      if (error) {
        reject(error);
      } else {
        resolve(true);
      }
    });
  });
};
