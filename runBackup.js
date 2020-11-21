require('dotenv').config();
const execFile = require('child_process').execFile;

exports = (date) => {
  const backupFileName = `export_${date}`;
  const backupScript = `pg_dump --username=${process.env.DB_USER} ${process.env.DB_NAME}`;

  return new Promise((resolve, reject) => {
    execFile(
      './backup.sh',
      [backupScript, backupFileName, process.env.DB_PASS],
      (error, stdout, stderr) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      }
    );
  });
};
