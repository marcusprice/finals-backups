const fs = require('fs');
const { google } = require('googleapis');

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
