import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { MembroFamilia } from '../model/familia.interface';
import { MeetingService } from '../services/meeting.service';

@Injectable({
  providedIn: 'root'
})
export class GetFamilyMemberResolver implements Resolve<MembroFamilia[]> 
{
  constructor(
    private meetingService: MeetingService,
  ) { }

  resolve(): Observable<MembroFamilia[]> 
  {    
    return this.meetingService.getFamilyMembers();      
  }
}
