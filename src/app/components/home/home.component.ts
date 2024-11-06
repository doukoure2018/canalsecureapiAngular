import { Component, OnInit, ViewChild } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  startWith,
} from 'rxjs';
import { State } from '../../interfaces/state';
import { CustomHttpResponse, HomeState } from '../../interfaces/appstates';
import { DataState } from '../../enum/datastate.enum';
import { UserService } from '../../services/user.service';
import { Campaign } from '../../interfaces/campaign';
import { Router } from '@angular/router';
import { CampaignService } from '../../services/campaign.service';
import { User } from '../../interfaces/User';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  homeState$: Observable<State<CustomHttpResponse<HomeState>>> =
    new Observable();
  private dataSubject =
    new BehaviorSubject<CustomHttpResponse<HomeState> | null>(null);

  readonly DataState = DataState;

  // this for material in angular
  // for material table
  public dataSource: MatTableDataSource<Campaign> = new MatTableDataSource();
  //dataSource = new MatTableDataSource<any>([]);
  // displayedColomns
  displayedColumns: string[] = [
    'index',
    'createdAt',
    'name',
    'status',
    'mode',
    'totalSms',
    'action',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // this is optional
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  constructor(
    private router: Router,
    private campaignService: CampaignService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.homeState$ = this.campaignService.home$().pipe(
      map((response) => {
        this.notification.onSuccess(response.message!);
        console.log(response);
        this.dataSubject.next(response);
        this.dataSource.data = response.data?.campaigns ?? [];
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
        return {
          dataState: DataState.LOADED,
          appData: this.dataSubject.value ?? undefined,
        };
      }),
      startWith({ dataState: DataState.LOADING }),
      catchError((error: string) => {
        this.notification.onError(error);
        return of({ dataState: DataState.ERROR, error });
      })
    );
  }

  selectCampaign(campaign: Campaign, user: User, mode: string): void {
    if (mode === 'BROADCAST') {
      this.router.navigate([`/campaigns/broadcast/${campaign.id}/${user.id}`]);
    } else {
      this.router.navigate([`/campaigns/${campaign.id}/${user.id}`]);
    }
  }
}
