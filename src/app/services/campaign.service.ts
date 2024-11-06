import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import {
  CustomHttpResponse,
  HomeState,
  MessageState,
  Page,
  PaginationMessageState,
} from '../interfaces/appstates';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Message } from '../interfaces/message';
import { Campaign } from '../interfaces/campaign';
import { environment } from '../../environments/environment';

@Injectable()
export class CampaignService {
  private readonly server: string = environment.API_BASE_URL + '/secureapi';
  /**
   * How to install it
   * npm install @auth0/angular-jwt
   */
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {}

  home$ = () =>
    <Observable<CustomHttpResponse<HomeState>>>(
      this.http
        .get<CustomHttpResponse<HomeState>>(`${this.server}/message/home`)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  newCampaign$ = () =>
    <Observable<CustomHttpResponse<MessageState>>>(
      this.http
        .get<CustomHttpResponse<MessageState>>(`${this.server}/campaign/new`)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  /**
   * Fonctionality to create new Campaign
   * @param campaignForm
   * @returns
   */
  createCampaign$ = (campaignForm: Campaign) =>
    <Observable<CustomHttpResponse<MessageState>>>this.http
      .post<CustomHttpResponse<MessageState>>(
        `${this.server}/campaign/create`,
        campaignForm,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .pipe(tap(console.log), catchError(this.handleError));

  newMessage$ = (campaign_id: number, id_user: number, page: number = 0) =>
    <Observable<CustomHttpResponse<PaginationMessageState>>>(
      this.http
        .get<CustomHttpResponse<PaginationMessageState>>(
          `${this.server}/message/${campaign_id}/${id_user}/new?pageNo=${page}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  newMessageBroadCast$ = (
    campaign_id: number,
    id_user: number
  ): Observable<CustomHttpResponse<MessageState>> => {
    return this.http
      .get<CustomHttpResponse<MessageState>>(
        `${this.server}/message/${campaign_id}/${id_user}/add`
      )
      .pipe(
        tap((response) => console.log(response)),
        catchError(this.handleError)
      );
  };

  newUnicastMessage$ = (campaign_id: number, id_user: number) =>
    <Observable<CustomHttpResponse<MessageState>>>(
      this.http
        .get<CustomHttpResponse<MessageState>>(
          `${this.server}/message/${campaign_id}/${id_user}/createUnicastMessage/new`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  searchCampaignByStatus$ = (
    campaign_id: number,
    id_user: number,
    status: string,
    page: number = 0
  ) =>
    <Observable<CustomHttpResponse<PaginationMessageState>>>(
      this.http
        .get<CustomHttpResponse<PaginationMessageState>>(
          `${this.server}/message/${campaign_id}/${id_user}/search?status=${status}&pageNo=${page}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  /**
   * Method to upload Excel file and consume Spring Boot service
   * @param campaign_id
   * @param id_user
   * @param file
   * @returns
   */
  importFileMessage$ = (
    campaign_id: number,
    id_user: number,
    file: File
  ): Observable<CustomHttpResponse<MessageState>> => {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http
      .post<CustomHttpResponse<MessageState>>(
        `${this.server}/message/${campaign_id}/${id_user}/create`,
        formData,
        {
          headers: new HttpHeaders({}),
        }
      )
      .pipe(tap(console.log), catchError(this.handleError));
  };

  createUnicastMessage$ = (messageForm: Message) =>
    <Observable<CustomHttpResponse<MessageState>>>this.http
      .post<CustomHttpResponse<MessageState>>(
        `${this.server}/message/createUnicastMessage`,
        messageForm,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .pipe(tap(console.log), catchError(this.handleError));

  updataMessageCampaign$ = (campaign_id: number, form: { message: string }) =>
    <Observable<CustomHttpResponse<MessageState>>>this.http
      .patch<CustomHttpResponse<MessageState>>(
        `${this.server}/campaign/${campaign_id}/updateCampaignName`,
        form,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .pipe(tap(console.log), catchError(this.handleError));

  downloadReport$ = (campaignId: number) =>
    <Observable<HttpEvent<Blob>>>this.http
      .get(`${this.server}/message/download/report/${campaignId}`, {
        reportProgress: true,
        observe: 'events',
        responseType: 'blob',
      })
      .pipe(tap(console.log), catchError(this.handleError));
  /**
   * Error Handler fonctionnality
   * @param error
   * @returns
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      console.log(error.error);
      errorMessage = `A client error occured - ${error.error.message}`;
    } else {
      if (error.error.message) {
        errorMessage = error.error.message;
        console.log(error.error.reason);
      } else if (error.error) {
        const errorKeys = Object.keys(error.error);
        if (errorKeys.length > 0) {
          const key = errorKeys[0];
          errorMessage = error.error[key];
          console.log(`${key}: ${error.error[key]}`);
        } else {
          errorMessage = `An error occurred - Error status ${error.status}`;
        }
      } else {
        errorMessage = `An error Occurred - Error status ${error.status}`;
      }
    }
    return throwError(() => errorMessage);
  }
}
