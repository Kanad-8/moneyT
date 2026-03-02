import { Component } from '@angular/core';
import { SideBarToggle } from '../services/side-bar-toggle';
import { SideBar } from "../components/side-bar/side-bar";
import { TopBar } from "../components/top-bar/top-bar";
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [CommonModule, SideBar, TopBar, RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  public isOpen$:Observable<boolean>;

  constructor(private sideBarService:SideBarToggle){
    this.isOpen$=sideBarService.isSideBarOpen$;
  }

  onToggle():void{
    this.sideBarService.toggleSideBar();
  }
}
