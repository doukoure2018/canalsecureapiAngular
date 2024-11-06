import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  map,
  Observable,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { saveAs } from 'file-saver';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { State } from '../../../interfaces/state';
import {
  CustomHttpResponse,
  MessageState,
} from '../../../interfaces/appstates';
import { DataState } from '../../../enum/datastate.enum';
import { Message } from '../../../interfaces/message';
import { CampaignService } from '../../../services/campaign.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.component.html',
  styleUrl: './broadcast.component.scss',
})
export class BroadcastComponent implements OnInit, AfterViewInit {
  messageState$: Observable<State<CustomHttpResponse<MessageState>>> =
    new Observable();

  private dataSubject =
    new BehaviorSubject<CustomHttpResponse<MessageState> | null>(null);

  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  // for the report
  private isLoadingReportSubject = new BehaviorSubject<boolean>(false);
  isLoadingReport$ = this.isLoadingReportSubject.asObservable();

  // for pagination
  // private currentPageSubject = new BehaviorSubject<number>(0);
  // currentPage$ = this.currentPageSubject.asObservable();

  // this is for material
  // dataSources for table
  public dataSource: MatTableDataSource<Message> = new MatTableDataSource();
  // displayedColomns
  displayedColumns: string[] = [
    'index',
    'message',
    'recipientNumber',
    'sentAt',
    'status',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  readonly DataState = DataState;
  private readonly CAMPAIGN_ID: string = 'campaignId';
  private readonly USER_ID: string = 'userId';

  // to make sur the file is selected
  selectedFile: File | null = null;
  selectedItem: string = '';

  private fileStatusSubject = new BehaviorSubject<{
    status: string;
    type: string;
    percent: number;
  }>({ status: '', type: '', percent: 0 });
  fileStatus$ = this.fileStatusSubject.asObservable();

  constructor(
    private activatedRouter: ActivatedRoute,
    private campaignService: CampaignService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadCampaignData();
  }

  // Load campaign data on page load
  private loadCampaignData(): void {
    this.messageState$ = this.activatedRouter.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const campaign_id = params.get(this.CAMPAIGN_ID);
        const user_id = params.get(this.USER_ID);
        if (campaign_id && user_id) {
          return this.campaignService
            .newMessageBroadCast$(+campaign_id, +user_id)
            .pipe(
              map((response) => {
                console.log(response);
                this.dataSubject.next(response);
                this.dataSource.data = response.data?.messages ?? [];
                // to add pagination for material
                setTimeout(() => {
                  this.dataSource.paginator = this.paginator;
                  this.dataSource.sort = this.sort;
                });
                return {
                  dataState: DataState.LOADED,
                  appData: response,
                };
              }),
              startWith({ dataState: DataState.LOADING }),
              catchError((error: string) => {
                return of({ dataState: DataState.ERROR, error });
              })
            );
        } else {
          return EMPTY;
        }
      })
    );
  }

  // Apply the filter when the user types in the input
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Method to handle file selection
  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }
  // Method to upload the selected file
  onFileSubmit(): void {
    if (this.selectedFile) {
      console.log(this.dataSubject.value);
      this.isLoadingSubject.next(true);
      const campaignId = +this.activatedRouter.snapshot.paramMap.get(
        this.CAMPAIGN_ID
      )!;
      const userId = +this.activatedRouter.snapshot.paramMap.get(this.USER_ID)!;
      this.messageState$ = this.campaignService
        .importFileMessage$(campaignId, userId, this.selectedFile)
        .pipe(
          map((response) => {
            this.notification.onSuccess(response.message!);
            console.log('File uploaded successfully:', response);
            this.selectedFile = null;
            this.isLoadingSubject.next(false);
            this.loadCampaignData();
            return {
              dataState: DataState.LOADED,
              appData: response,
            };
          }),
          startWith({
            dataState: DataState.LOADED,
            appData: this.dataSubject.value ?? undefined,
          }),
          catchError((error: string) => {
            console.error('Error uploading file:', error);
            this.isLoadingSubject.next(false);
            this.notification.onError(error);
            return of({
              dataState: DataState.LOADED,
              appData: this.dataSubject.value ?? undefined,
              error,
            });
          })
        );
    }
  }

  // searchCampaigns(searchForm: NgForm): void {
  //   const statusValue = searchForm.value.status;
  //   console.log('first: ' + statusValue);
  //   this.currentPageSubject.next(0);
  //   this.messageState$ = this.activatedRouter.paramMap.pipe(
  //     switchMap((params: ParamMap) => {
  //       const campaign_id = params.get(this.CAMPAIGN_ID);
  //       const user_id = params.get(this.USER_ID);
  //       console.log('after' + statusValue);
  //       if (campaign_id && user_id && statusValue) {
  //         return this.campaignService
  //           .searchCampaignByStatus$(+campaign_id, +user_id, statusValue)
  //           .pipe(
  //             map((response) => {
  //               console.log(response);
  //               this.dataSubject.next(response);

  //               this.selectedItem = statusValue;
  //               return {
  //                 dataState: DataState.LOADED,
  //                 appData: response,
  //               };
  //             }),
  //             startWith({ dataState: DataState.LOADING }),
  //             catchError((error: string) => {
  //               return of({
  //                 dataState: DataState.ERROR,
  //                 error,
  //               });
  //             })
  //           );
  //       } else {
  //         return EMPTY;
  //       }
  //     })
  //   );
  // }

  // goToPage(pageNumber?: number): void {
  //   this.messageState$ = this.activatedRouter.paramMap.pipe(
  //     switchMap((params: ParamMap) => {
  //       const campaign_id = params.get(this.CAMPAIGN_ID);
  //       const user_id = params.get(this.USER_ID);
  //       if (campaign_id && user_id) {
  //         return this.campaignService
  //           .newMessage$(+campaign_id, +user_id!, pageNumber)
  //           .pipe(
  //             map((response) => {
  //               console.log(response);
  //               this.dataSubject.next(response);
  //               this.currentPageSubject.next(pageNumber!);
  //               return {
  //                 dataState: DataState.LOADED,
  //                 appData: response,
  //               };
  //             }),
  //             startWith({
  //               dataState: DataState.LOADED,
  //               appData: this.dataSubject.value ?? undefined,
  //             }),
  //             catchError((error: string) => {
  //               return of({
  //                 dataState: DataState.ERROR,
  //                 error,
  //                 appData: this.dataSubject.value ?? undefined,
  //               });
  //             })
  //           );
  //       } else {
  //         return EMPTY;
  //       }
  //     })
  //   );
  // }

  // goToNextOrPreviousPage(direction?: string): void {
  //   this.goToPage(
  //     direction === 'forward'
  //       ? this.currentPageSubject.value + 1
  //       : this.currentPageSubject.value - 1
  //   );
  // }

  downloadMessage(): void {
    this.isLoadingReportSubject.next(true);
    const campaign_id = +this.activatedRouter.snapshot.paramMap.get(
      this.CAMPAIGN_ID
    )!;
    this.campaignService
      .downloadReport$(campaign_id)
      .pipe(
        tap((httpEvent: HttpEvent<Blob>) => this.reportProgress(httpEvent)),
        catchError((error: string) => {
          this.isLoadingReportSubject.next(false);
          this.fileStatusSubject.next({
            status: 'error',
            type: 'Error',
            percent: 0,
          });
          // Return an empty observable for consistent type handling
          return of<HttpEvent<Blob>>();
        })
      )
      .subscribe((httpEvent: HttpEvent<Blob>) => {
        if (httpEvent.type === HttpEventType.Response) {
          this.isLoadingReportSubject.next(false);
        }
      });
  }

  private reportProgress(httpEvent: HttpEvent<Blob>): void {
    switch (httpEvent.type) {
      case HttpEventType.DownloadProgress:
        const total = httpEvent.total ?? 1;
        const percent = Math.round((100 * httpEvent.loaded) / total);
        this.fileStatusSubject.next({
          status: 'progress',
          type: 'Downloading...',
          percent: percent,
        });
        break;

      case HttpEventType.Response:
        const fileName =
          httpEvent.headers.get('File-Name') || 'unknown-filename';
        const contentType =
          httpEvent.headers.get('Content-Type') || 'application/octet-stream';

        saveAs(
          new File([httpEvent.body as Blob], fileName, {
            type: `${contentType};charset=utf-8`,
          })
        );

        this.fileStatusSubject.next({
          status: 'completed',
          type: 'Completed',
          percent: 100,
        });
        break;

      default:
        break;
    }
  }
}
