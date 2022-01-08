/* eslint-disable @typescript-eslint/no-var-requires */
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GoogleCalendarApiHelper {
  private readonly google: { private_key: string; client_email: string };
  constructor() {
    if (process.env.NODE_ENV !== 'test') {
      this.google = JSON.parse(
        fs.readFileSync(path.resolve(__dirname, '../keys/google-service.json')),
      );
    } else {
      this.google = {
        private_key: '',
        client_email: '',
      };
    }
  }

  private async getAccessToken(): Promise<string> {
    const jwt = jsonwebtoken.sign(
      {
        scope:
          'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
      },
      this.google.private_key,
      {
        expiresIn: '2m',
        algorithm: 'RS256',
        audience: 'https://oauth2.googleapis.com/token',
        issuer: this.google.client_email,
      },
    );

    const { data } = await axios.post('https://oauth2.googleapis.com/token', {
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    });

    return data.access_token.replace(/[.]{2,}$/g, '');
  }

  private getCalendarId(state: string): string | null {
    switch (state.trim().toUpperCase()) {
      case 'UTAH':
      case 'UT':
        return 'c_65tvmh0808uvddgmbfc6m6vpgo@group.calendar.google.com';

      case 'NEVADA':
      case 'NV':
        return 'c_ameghovg4faeehmfpj73j0eojc@group.calendar.google.com';

      case 'ARIZONA':
      case 'AZ':
        return 'c_gdjtf478aaf1hs8nhherb1tdfo@group.calendar.google.com';

      default:
        return null;
    }
  }

  createGoogleCalendarEvent = async ({
    state,
    description,
    title,
    start,
    end,
  }) => {
    const calendarId = this.getCalendarId(state);
    return axios.post(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
      {
        start: {
          dateTime: start,
        },
        end: {
          dateTime: end,
        },
        summary: title,
        description: description,
      },
      {
        headers: {
          Authorization: `Bearer ${await this.getAccessToken()}`,
        },
      },
    );
  };

  updateGoogleCalendarEvent = async ({
    state,
    description,
    title,
    start,
    end,
    eventId,
  }) => {
    const calendarId = this.getCalendarId(state);
    return axios.put(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
      {
        start: {
          dateTime: start,
        },
        end: {
          dateTime: end,
        },
        summary: title,
        description: description,
      },
      {
        headers: {
          Authorization: `Bearer ${await this.getAccessToken()}`,
        },
      },
    );
  };

  deleteGoogleCalendarEvent = async ({ state, eventId }) => {
    const calendarId = this.getCalendarId(state);
    return axios.delete(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
      {
        headers: {
          Authorization: `Bearer ${await this.getAccessToken()}`,
        },
      },
    );
  };
}
