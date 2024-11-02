import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  startWith,
} from 'rxjs';
import { CompteState, CustomHttpResponse } from '../../interfaces/appstates';
import { DataState } from '../../enum/datastate.enum';
import { State } from '../../interfaces/state';
import { Compte } from '../../interfaces/compte';
import { SettingForm } from '../../interfaces/setting';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comptes',
  templateUrl: './comptes.component.html',
  styleUrl: './comptes.component.scss',
})
export class ComptesComponent implements OnInit {
  compteState$: Observable<State<CustomHttpResponse<CompteState>>> =
    new Observable();
  private dataSubject =
    new BehaviorSubject<CustomHttpResponse<CompteState> | null>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly dataState = DataState;
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.compteState$ = this.userService.comptes$().pipe(
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

  public viewDetail(compte: Compte): void {
    this.router.navigate([`/comptes/${compte.id}`]);
  }
}
