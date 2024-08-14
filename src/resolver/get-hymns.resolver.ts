import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { Hymn } from '../model/hymn.interface';
import { MeetingService } from '../service/meeting.service';

@Injectable({
  providedIn: 'root'
})
export class GetHymnsResolver implements Resolve<Hymn[]> 
{
  constructor(
    private meetingService: MeetingService,
  ) { }

  resolve(): Observable<Hymn[]> 
  {    
    return this.meetingService.getHinos(); 
  }
}