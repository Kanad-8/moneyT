import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SideBarToggle {
  private isOpen = new BehaviorSubject<boolean>(false);
  isSideBarOpen$ = this.isOpen.asObservable();

  public toggleSideBar(){
    this.isOpen.next(!this.isOpen.value);
  }

  public OpenSideBar(){
    this.isOpen.next(true);
  }

  public CloseSideBar(){
    this.isOpen.next(false);
  }
}
