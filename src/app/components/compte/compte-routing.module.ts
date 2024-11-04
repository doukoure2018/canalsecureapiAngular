import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from '../../guard/authentication.guard';
import { ComptesComponent } from './comptes/comptes.component';
import { DetailCompteComponent } from './detail-compte/detail-compte.component';
import { NewCompteComponent } from './new-compte/new-compte.component';

const compteRoutes: Routes = [
  {
    path: 'comptes',
    component: ComptesComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'comptes/new',
    component: NewCompteComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'comptes/:id',
    component: DetailCompteComponent,
    canActivate: [AuthenticationGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(compteRoutes)],
  exports: [RouterModule],
})
export class CompteRoutingModule {}
