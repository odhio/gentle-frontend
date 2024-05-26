"use server"
import { auth } from "@/auth"
import {google, calendar_v3} from 'googleapis'
import Calendar = calendar_v3.Calendar
import { HOST_URI } from "@/config/env"

export const insertCalendar =async(data:FormData)=>{ 
    const session = await auth()
    if (session === null) {
        return null
    }
    const oauth2Client = new google.auth.OAuth2({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redirectUri: `${HOST_URI}/lounge`
    })
    
    const accessToken: any = session.accessToken?.accessToken
    oauth2Client.setCredentials({access_token: accessToken})
    
    const calendar: Calendar = google.calendar({version: 'v3', auth: oauth2Client})

    const requestBody = {
        start: {
            dateTime: `${data.get('start.dateTime')}:00Z`,
            timeZone: 'Asia/Tokyo'
        },
        end: {
            dateTime: `${data.get('end.dateTime')}:00Z`,
            timeZone: 'Asia/Tokyo'
        },
        summary: data.get('summary'),
        location: data.get('location'),
        description: data.get('description')
    }

    const res = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: requestBody as any
    })
    return res.data.htmlLink
}