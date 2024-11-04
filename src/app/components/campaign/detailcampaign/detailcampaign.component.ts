import { Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  startWith,
  switchMap,
} from 'rxjs';

import { ActivatedRoute, ParamMap } from '@angular/router';
import { NgForm } from '@angular/forms';
import { State } from '../../../interfaces/state';
import {
  CustomHttpResponse,
  MessageState,
} from '../../../interfaces/appstates';
import { DataState } from '../../../enum/datastate.enum';
import { CampaignService } from '../../../services/campaign.service';

@Component({
  selector: 'app-detailcampaign',
  templateUrl: './detailcampaign.component.html',
  styleUrl: './detailcampaign.component.scss',
})
export class DetailcampaignComponent implements OnInit {
  messageState$: Observable<State<CustomHttpResponse<MessageState>>> =
    new Observable();
  private dataSubject =
    new BehaviorSubject<CustomHttpResponse<MessageState> | null>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;

  private readonly CAMPAIGN_ID: string = 'campaignId';
  private readonly USER_ID: string = 'userId';

  constructor(
    private activatedRouter: ActivatedRoute,
    private campaignService: CampaignService
  ) {}
  ngOnInit(): void {
    this.loadDataUnicast();
  }

  private loadDataUnicast(): void {
    this.messageState$ = this.activatedRouter.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const campaign_id = params.get(this.CAMPAIGN_ID);
        const userId = params.get(this.USER_ID);
        return this.campaignService
          .newUnicastMessage$(+campaign_id!, +userId!)
          .pipe(
            map((response) => {
              console.log(response);
              this.dataSubject.next(response);
              return {
                dataState: DataState.LOADED,
                appData: this.dataSubject.value ?? undefined,
              };
            }),
            startWith({ dataState: DataState.LOADING }),
            catchError((error: string) => {
              return of({ dataState: DataState.ERROR, error });
            })
          );
      })
    );
  }

  sendMessageUnicast(messageForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.messageState$ = this.campaignService
      .createUnicastMessage$(messageForm.value)
      .pipe(
        map((response) => {
          console.log(response);
          this.isLoadingSubject.next(false);
          this.loadDataUnicast();
          return {
            dataState: DataState.LOADED,
            appData: response,
          };
        }),
        startWith({
          dataState: DataState.LOADING,
          appData: this.dataSubject.value ?? undefined,
        }),
        catchError((error: string) => {
          this.isLoadingSubject.next(false);
          return of({
            dataState: DataState.ERROR,
            error,
            appData: this.dataSubject.value ?? undefined,
          });
        })
      );
  }

  validateNumberInput(event: KeyboardEvent): void {
    const inputChar = event.key;
    if (!/^[0-9]$/.test(inputChar) && event.key !== 'Backspace') {
      event.preventDefault();
    }
  }
}
