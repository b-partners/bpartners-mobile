import { ApiResponse } from 'apisauce';

import { Event } from '../../models/entities/calendar/calendar';
import { Api } from './api';
import { getGeneralApiProblem } from './api-problem';
import { GetCalendarResult, GetEventResult, InitiateConsentResult, InitiateTokenResult, RedirectUrls, RedirectionStatusUrls } from './api.types';

export class CalendarApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  async initiateConsent(userId: string, payload: RedirectionStatusUrls): Promise<InitiateConsentResult> {
    const response: ApiResponse<InitiateConsentResult> = await this.api.apisauce.post(`users/${userId}/calendars/oauth2/consent`, payload);

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }

    return response.data;
  }

  async initiateToken(userId: string, code: string, redirectUrls: RedirectUrls): Promise<InitiateTokenResult> {
    const payload = {
      code: code,
      redirectUrls: redirectUrls,
    };
    const response: ApiResponse<InitiateTokenResult> = await this.api.apisauce.post(`users/${userId}/calendars/oauth2/auth`, payload);

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }

    return response.data;
  }

  async getCalendars(userId: string): Promise<GetCalendarResult> {
    const response: ApiResponse<GetCalendarResult> = await this.api.apisauce.get(`users/${userId}/calendars`);

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }

    const calendar = response.data;
    // @ts-ignore
    return { kind: 'ok', calendar: calendar };
  }

  async getCalendarsEvents(userId: string, calendarId: string, provider: string, from: string, to: string): Promise<GetEventResult> {
    const payload = {
      provider: provider,
      from: from,
      to: to,
    };
    const response: ApiResponse<GetCalendarResult> = await this.api.apisauce.get(`users/${userId}/calendars/${calendarId}/events`, payload);

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }

    const events = response.data;
    // @ts-ignore
    return { kind: 'ok', events: events };
  }

  async updateCalendarsEvent(userId: string, calendarId: string, event: Event): Promise<GetEventResult> {
    const payload = [event];
    const response: ApiResponse<GetCalendarResult> = await this.api.apisauce.put(`users/${userId}/calendars/${calendarId}/events`, payload);

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }

    const events = response.data;
    // @ts-ignore
    return { kind: 'ok', events: events };
  }
}
