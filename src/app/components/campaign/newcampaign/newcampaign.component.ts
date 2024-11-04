import { Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  startWith,
} from 'rxjs';
import { State } from '../../../interfaces/state';
import {
  CustomHttpResponse,
  MessageState,
} from '../../../interfaces/appstates';
import { DataState } from '../../../enum/datastate.enum';
import { Router } from '@angular/router';
import { CampaignService } from '../../../services/campaign.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-newcampaign',
  templateUrl: './newcampaign.component.html',
  styleUrl: './newcampaign.component.scss',
})
export class NewcampaignComponent implements OnInit {
  campaignState$: Observable<State<CustomHttpResponse<MessageState>>> =
    new Observable();
  private dataSubject =
    new BehaviorSubject<CustomHttpResponse<MessageState> | null>(null);
  private loadingDataSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loadingDataSubject.asObservable();

  // observable for dataSaving
  private dataSaved = new BehaviorSubject<boolean>(false);
  isDataSaved$ = this.dataSaved.asObservable();
  readonly DataState = DataState;

  mode: string = 'BROADCAST';
  totalSms!: number;

  private isTotalMessage = new BehaviorSubject<boolean>(false);
  showMessageBalance$ = this.isTotalMessage.asObservable();

  // check for balance observer
  private isBalanceSmsAvalaible = new BehaviorSubject<number>(0);
  balanceSms$ = this.isBalanceSmsAvalaible.asObservable();

  constructor(
    private router: Router,
    private campaignService: CampaignService
  ) {}

  onTotalSmsChange(): void {
    this.balanceSms$.subscribe((balance) => {
      console.log('balance available ' + balance);
      if (this.totalSms > balance) {
        this.isTotalMessage.next(true);
      } else {
        this.isTotalMessage.next(false);
      }
    });
  }

  ngOnInit(): void {
    this.campaignState$ = this.campaignService.newCampaign$().pipe(
      map((response) => {
        console.log(response);
        this.dataSubject.next(response);
        // get the balance sms
        this.isBalanceSmsAvalaible.next(response.data?.balanceSms ?? 0);
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
  }

  onModeChange(): void {
    if (this.mode == 'UNICAST') {
      this.totalSms = 1;
    } else {
      this.totalSms = 0;
    }
  }
  createNewCampaign(campaignForm: NgForm): void {
    this.loadingDataSubject.next(true);
    this.campaignState$ = this.campaignService
      .createCampaign$(campaignForm.value)
      .pipe(
        map((response) => {
          console.log(response);
          this.dataSubject.next(response);
          this.loadingDataSubject.next(false);
          this.dataSaved.next(true);
          this.router.navigate(['/']);
          return {
            dataState: DataState.LOADED,
            appData: this.dataSubject.value ?? undefined,
          };
        }),
        startWith({
          dataState: DataState.LOADING,
          appData: this.dataSubject.value ?? undefined,
        }),
        catchError((error: string) => {
          this.loadingDataSubject.next(false);

          return of({
            dataState: DataState.ERROR,
            error,
            appData: this.dataSubject.value ?? undefined,
          });
        })
      );
  }
}
