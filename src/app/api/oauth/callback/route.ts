import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET(request: NextRequest) {
const oauth2Client = new google.auth.OAuth2({
        clientId: process.env.GOOGLE_CLIENT_ID ,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redirectUri: "http://localhost:3000/api/oauth/callback/"
    });

  const url = require('url');
  const q = url.parse(request.url, true).query;
  if (q.error) {
    console.log('Error:' + q.error);
    return NextResponse.redirect(new URL("/", request.url));
  }
  const { tokens } = await oauth2Client.getToken(q.code);
  
  oauth2Client.setCredentials(tokens);
  if (!tokens.access_token || !tokens.refresh_token) {
    console.error('No access or refresh token');
  }
  const userCredential = {access_token: tokens.access_token, refresh_token: tokens.refresh_token};

  return userCredential;
}