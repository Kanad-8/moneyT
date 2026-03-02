import { Component, Input } from '@angular/core';
import { AuthService } from '../../../../core/services/auth-service';
import { UserF } from '../../../../core/models/UserF';

@Component({
  selector: 'app-user-card',
  imports: [],
  templateUrl: './user-card.html',
  styleUrl: './user-card.scss',
})
export class UserCard {

  user :UserF;

  constructor(
    private authService: AuthService
  ){
    this.user = authService.getUser();
  }

  onSignOut(){
    this.authService.logout();
  }

  

}
