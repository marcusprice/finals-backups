const fs = require('fs');
const { google } = require('googleapis');
const { resolve } = require('path');

exports.authorizeAndConnect = (clientEmail, privateKey) => {
  const jwtClient = new google.auth.JWT(clientEmail, null, privateKey, [
    'https://www.googleapis.com/auth/drive',
  ]);

  return new Promise((resolve, reject) => {
    jwtClient.authorize((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(jwtClient);
      }
    });
  });
};

exports.uploadFile = (jwtClient, fileName, filePath, parentID) => {
  const drive = google.drive({ version: 'v3', auth: jwtClient });
  const metaData = {
    name: fileName,
    parents: [parentID],
  };

  const file = {
    mimeType: 'application/zip',
    body: fs.createReadStream(filePath),
  };

  return new Promise((resolve, reject) => {
    drive.files.create(
      {
        resource: metaData,
        media: file,
        fields: 'id',
      },
      (err) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(true);
        }
      }
    );
  });
};

exports.getFileIDs = (jwtClient, query) => {
  const drive = google.drive({ version: 'v3', auth: jwtClient });

  return new Promise((resolve, reject) => {
    drive.files.list({ q: query, fields: ['id'] }, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

exports.deleteOldBackups = async (jwtClient, today) => {
  //get the unix timestamp of 60 days ago and covnert it to ISO format for g-drive
  let cutoffDate = today.setDate(today.getDate() - 60);
  cutoffDate = new Date(cutoffDate).toISOString();

  //save the file ID's into an array
  const oldFiles = exports.getFileIDs(jwtClient, 'createdTime>' + cutoffDate);

  //delete every file that's in the array
};
