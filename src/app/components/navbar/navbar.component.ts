import { Component, Input } from '@angular/core';
import { User } from '../../interfaces/User';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  @Input() user?: User;

  constructor(private router: Router, private userService: UserService) {}

  public logOut(): void {
    this.userService.logOut();
    this.router.navigate([`/login`]);
  }

  public createAccount(): void {}
}
