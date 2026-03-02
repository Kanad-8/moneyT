import { Component } from '@angular/core';
import { UserCard } from '../../components/user-card/user-card';

@Component({
  selector: 'app-user-profile-page',
  imports: [UserCard],
  templateUrl: './user-profile-page.html',
  styleUrl: './user-profile-page.scss',
})
export class UserProfilePage {

}
