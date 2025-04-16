const { google } = require('googleapis');
require('dotenv').config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

function getAuthUrl() {
  return oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
}

function setCredentialsFromCode(code) {
  return oAuth2Client.getToken(code).then(res => {
    oAuth2Client.setCredentials(res.tokens);
    return oAuth2Client;
  });
}

module.exports = {
  oAuth2Client,
  getAuthUrl,
  setCredentialsFromCode
};
