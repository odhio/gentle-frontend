import { HOST_URI } from '@/config/env';
import axios from 'axios';
import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
    const credentials = await axios.get(`${HOST_URI}/api/oauth`);
    const user = await credentials.data;
    
    const oauth2Client = new google.auth.OAuth2({
        clientId: process.env.GOOGLE_CLIENT_ID ,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redirectUri: `${HOST_URI}/lounge`
    });
    oauth2Client.setCredentials({ access_token: user.accessToken });

    
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const reader = req.body?.getReader();
    const result = await reader?.read();
    const decoder = new TextDecoder();
    const dataStr = decoder.decode(result?.value);

    const data = JSON.parse(dataStr);
    const requestBody = {
        start: {
            dateTime: `${data.start.dateTime}:00Z`,
            timeZone: 'Asia/Tokyo'
        },
        end: {
            dateTime: `${data.end.dateTime}:00Z`,
            timeZone: 'Asia/Tokyo'
        },
        summary: data.summary,
        location: data.location,
        description: data.description
    }
    const insertItem = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: requestBody
    });
    return NextResponse.json({ data: insertItem.data }, { status: 200 })
}
