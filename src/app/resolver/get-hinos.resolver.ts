import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { Hino } from '../model/hino.interface';
import { MeetingService } from '../services/meeting.service';

@Injectable({
  providedIn: 'root'
})
export class GetHinosResolver implements Resolve<Hino[]> 
{
  constructor(
    private meetingService: MeetingService,
  ) { }

  resolve(): Observable<Hino[]> 
  {    
    return this.meetingService.getHinosTitle(); 
  }
}