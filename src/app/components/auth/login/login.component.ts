import { Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  startWith,
} from 'rxjs';
import { LoginState } from '../../../interfaces/appstates';
import { DataState } from '../../../enum/datastate.enum';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { NgForm } from '@angular/forms';
import { Key } from '../../../enum/key.enum';
import { error } from 'console';
import { response } from 'express';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginState$: Observable<LoginState> = of({ dataState: DataState.LOADED });
  private phoneSubject = new BehaviorSubject<string>('');
  private emailSubject = new BehaviorSubject<string>('');

  readonly DataState = DataState;
  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.userService.isAuthenticated()
      ? this.router.navigate(['/'])
      : this.router.navigate(['/login']);
  }

  public login(loginForm: NgForm): void {
    this.loginState$ = this.userService
      .login$(loginForm.value.email, loginForm.value.password)
      .pipe(
        map((response) => {
          console.log(response);
          // if isUsingMfa is true
          if (response.data?.user?.usingMfa) {
            // get the phone and the email
            this.phoneSubject.next(response.data.user.phone ?? '');
            this.emailSubject.next(response.data.user.email ?? '');
            return {
              dataState: DataState.LOADED,
              isUsingMfa: true,
              loginSuccess: false,
              phone: this.phoneSubject.value.substring(
                this.phoneSubject.value.length - 4
              ),
            };
          } else {
            // we get to the home component
            // set the access token and the refresh token
            localStorage.setItem(Key.TOKEN, response.data?.access_token ?? '');
            localStorage.setItem(
              Key.REFRESH_TOKEN,
              response.data?.refresh_token ?? ''
            );
            this.router.navigate(['/']);
            return {
              dataState: DataState.LOADED,
              isUsingMfa: false,
              loginSuccess: true,
            };
          }
        }),
        startWith({
          dataState: DataState.LOADING,
          loginSuccess: false,
          isUsingMfa: false,
        }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR, loginSuccess: false, error });
        })
      );
  }

  public verifyCode(verifyCodeForm: NgForm): void {
    this.loginState$ = this.userService
      .verifyCode$(this.emailSubject.value, verifyCodeForm.value.code)
      .pipe(
        map((response) => {
          const access_token = response.data?.access_token ?? '';
          const refresh_token = response.data?.refresh_token ?? '';
          localStorage.setItem(Key.TOKEN, access_token);
          localStorage.setItem(Key.REFRESH_TOKEN, refresh_token);
          this.router.navigate(['/']);
          return { dataState: DataState.LOADED, loginSuccess: true };
        }),
        startWith({
          dataState: DataState.LOADING,
          isUsingMfa: true,
          loginSuccess: false,
          phone: this.phoneSubject.value.substring(
            this.phoneSubject.value.length - 4
          ),
        }),
        catchError((error: string) => {
          return of({
            dataState: DataState.ERROR,
            isUsingMfa: true,
            loginSuccess: false,
            error,
            phone: this.phoneSubject.value.substring(
              this.phoneSubject.value.length - 4
            ),
          });
        })
      );
  }

  public logingPage(): void {
    this.loginState$ = of({ dataState: DataState.LOADED });
  }
}
