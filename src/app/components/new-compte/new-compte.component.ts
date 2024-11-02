import { Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  filter,
  map,
  Observable,
  of,
  startWith,
} from 'rxjs';
import { State } from '../../interfaces/state';
import { CompteState, CustomHttpResponse } from '../../interfaces/appstates';
import { DataState } from '../../enum/datastate.enum';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { response } from 'express';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-new-compte',
  templateUrl: './new-compte.component.html',
  styleUrl: './new-compte.component.scss',
})
export class NewCompteComponent implements OnInit {
  compteState$: Observable<State<CustomHttpResponse<CompteState>>> =
    new Observable();
  private dataSubject =
    new BehaviorSubject<CustomHttpResponse<CompteState> | null>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;
  // is Role Admin or sysAdmin

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.compteState$ = this.userService.newAccount$().pipe(
      map((response) => {
        console.log(response);

        this.dataSubject.next(response);
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
  }

  public register(registerForm: NgForm): void {
    console.log(registerForm.value);
    this.isLoadingSubject.next(true);
    this.compteState$ = this.userService
      .createUserAccount$(registerForm.value)
      .pipe(
        map((response) => {
          console.log(response);
          registerForm.reset();
          this.dataSubject.next(response);
          this.isLoadingSubject.next(false);
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
          this.isLoadingSubject.next(false);
          return of({
            dataState: DataState.ERROR,
            error,
            appData: this.dataSubject.value ?? undefined,
          });
        })
      );
  }

  canModifyRole(roleName: string): boolean {
    if (roleName === 'ROLE_ADMIN' || roleName === 'ROLE_SYSADMIN') {
      return true;
    } else {
      return false;
    }
  }
}
