import { Component } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { SharedService } from '../service/shared.service';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'dailytracking';

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver, 
    private router: Router, 
    private sharedService: SharedService) {}

  choseMenuItem(sideNavigation: MatSidenav): void{
    if(sideNavigation.mode !== 'side')
    {
      sideNavigation.close();
    }      
  }

  isMeetingsPage(){
    return this.router.url === '/meetings' || this.router.url === '/';
  }

  isLoginPage(){
    return this.router.url === '/login';
  }

  toolbarButtonClicked(buttonName: string){
    this.sharedService.toolbarButtonClicked.next(buttonName);
  }
}
