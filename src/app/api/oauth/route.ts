import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { HOST_URI } from "@/config/env";

export async function GET(request: NextRequest) {
  const scopes = ['https://www.googleapis.com/auth/calendar'];
  const oauth2Client = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID ,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: `${HOST_URI}/api/oauth/callback/`
});
  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    include_granted_scopes: true
  });
  
  return NextResponse.redirect(new URL(authorizationUrl, request.url));
}