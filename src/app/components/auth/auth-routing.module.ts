import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { VerifyComponent } from './verify/verify.component';

const Authroutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'resetpassword',
    component: ResetpasswordComponent,
  },
  {
    path: 'auth/secureapi/verify/account/:key',
    component: VerifyComponent,
  },
  {
    path: 'auth/secureapi/verify/password/:key',
    component: VerifyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(Authroutes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
