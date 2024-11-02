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
import { State } from '../../interfaces/state';
import {
  CustomHttpResponse,
  DetailCompteState,
} from '../../interfaces/appstates';
import { DataState } from '../../enum/datastate.enum';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { EventType } from '../../enum/event-type.enum';
import { response } from 'express';

@Component({
  selector: 'app-detail-compte',
  templateUrl: './detail-compte.component.html',
  styleUrl: './detail-compte.component.scss',
})
export class DetailCompteComponent implements OnInit {
  detailCompteState$: Observable<State<CustomHttpResponse<DetailCompteState>>> =
    new Observable();
  private dataSubject =
    new BehaviorSubject<CustomHttpResponse<DetailCompteState> | null>(null);
  private isLoadingDataSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingDataSubject.asObservable();
  readonly DataState = DataState;
  private readonly COMPTE_ID: string = 'id';
  readonly EventType = EventType;

  // Showlogs
  private showLogsSubject = new BehaviorSubject<boolean>(false);
  showLogs$ = this.showLogsSubject.asObservable();

  // is ROLE_ADMIN OR ROLE_SYSADMIN\
  private isRoleAdminOrSysAdmin = new BehaviorSubject<boolean>(false);
  isAdminOrSys$ = this.isRoleAdminOrSysAdmin.asObservable();

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.isRoleAdminOrSysAdmin.next(false);
    this.detailCompteState$ = this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.userService.compte$(+params.get(this.COMPTE_ID)!).pipe(
          map((response) => {
            console.log(response);
            this.dataSubject.next(response);
            if (
              response.data?.user?.roleName === 'ROLE_ADMIN' ||
              response.data?.user?.roleName === 'ROLE_SYSADMIN'
            ) {
              this.isRoleAdminOrSysAdmin.next(true);
            } else {
              this.isRoleAdminOrSysAdmin.next(false);
            }
            return {
              dataState: DataState.LOADED,
              appData: this.dataSubject.value ?? undefined,
            };
          }),
          startWith({ dataState: DataState.LOADING }),
          catchError((error: string) => {
            this.isRoleAdminOrSysAdmin.next(false);
            return of({ dataState: DataState.ERROR, error });
          })
        );
      })
    );
  }

  updateAccountSettings(settingForm: NgForm): void {
    console.log(settingForm.value);
    this.isLoadingDataSubject.next(true);
    this.detailCompteState$ = this.userService
      .updateAccountSettingAdmin$(settingForm.value)
      .pipe(
        map((response) => {
          console.log(response);
          this.dataSubject.next({ ...response, data: response.data });
          this.isLoadingDataSubject.next(false);
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
          this.isLoadingDataSubject.next(false);
          return of({
            dataState: DataState.ERROR,
            error,
            appData: this.dataSubject.value ?? undefined,
          });
        })
      );
  }

  updateRole(roleForm: NgForm): void {
    this.isLoadingDataSubject.next(true);
    this.detailCompteState$ = this.userService
      .updateRoleByAdmin$(roleForm.value.roleName, roleForm.value.idCompte)
      .pipe(
        map((response) => {
          console.log(response);
          this.dataSubject.next({ ...response, data: response.data });
          this.isLoadingDataSubject.next(false);
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
          this.isLoadingDataSubject.next(false);
          return of({
            dataState: DataState.ERROR,
            error,
            appData: this.dataSubject.value ?? undefined,
          });
        })
      );
  }

  toggleLogs(): void {
    this.showLogsSubject.next(!this.showLogsSubject.value);
  }

  canModifyRole(roleName: string): boolean {
    if (roleName === 'ROLE_ADMIN' || roleName === 'ROLE_SYSADMIN') {
      return true;
    } else {
      return false;
    }
  }

  getEventBadgeClass(eventType: EventType): string {
    if (eventType === EventType.LOGIN_ATTEMPT_SUCCESS) {
      return 'bg-success';
    } else if (eventType === EventType.LOGIN_ATTEMPT) {
      return 'bg-warning';
    } else if (eventType === EventType.PROFILE_UPDATE) {
      return 'bg-primary';
    } else if (eventType === EventType.LOGIN_ATTEMPT_FAILURE) {
      return 'bg-danger';
    } else if (eventType === EventType.PROFILE_PICTURE_UPDATE) {
      return 'bg-primary';
    } else if (eventType === EventType.ROLE_UPDATE) {
      return 'bg-info';
    } else if (eventType === EventType.ACCOUNT_SETTINGS_UPDATE) {
      return 'bg-warning';
    } else if (eventType === EventType.PASSWORD_UPDATE) {
      return 'bg-warning';
    } else if (eventType === EventType.MFA_UPDATE) {
      return 'bg-info';
    } else {
      return 'none';
    }
  }
}
