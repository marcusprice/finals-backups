# finals-backups

This is a script that backs up the finals database and user-uploads, and then uploads the backup to google drive.

## Required Environment Variables

For these scripts to work you will need to add some environment variables. Create a .env file at the project's root directory with the following:

```
DB_NAME = (name of the strapi database)
PUBLIC_PATH = (path of the strapi public folder)
GOOGLE_CLIENT_EMAIL = (google client email - more details in the google drive section)
GOOGLE_PRIVATE_KEY = (google private key for service account - more details in the google drive section)
GOOGLE_BACKUPS_FOLDER_ID = (backups folder ID - more details in the google drive section)
```

## Google Drive

In order to gain access to google drive, you need to log into the account where you want to save the backups and then access the google console. Here you will need to make a service account. After you have created the service account you will be given a file to download which contains the client email and private key.

You will also need to create a directory to store the backups in and make a note of the folder ID. Lastly, make sure you add the service account to the list of authorized users for the backups file using the client email for the service account.

## TODO

Create a function that collects a list of file IDs that are more than n days old and deletes them.
