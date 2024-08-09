import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { SharedService } from './services/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private sharedService: SharedService) {}

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
