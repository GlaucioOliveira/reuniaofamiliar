import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Hino } from '../model/hino.interface';
import { MembroFamilia } from '../model/familia.interface';
import { ReuniaoFamiliar } from '../model/reuniao.interface';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  private MeetingDataKey: string = 'meeting-data';
  private EmptyObject: string = '{}';
  urlBase: string = '';

  constructor(
    private http: HttpClient
  ) { 
    this.urlBase = environment.ApiService;
  }

  private getDefaultHeader(): HttpHeaders{
    return new HttpHeaders({'Content-Type': 'application/json'}) ;
  }

  public get(date: string) : Observable<any> {
    return this.http.get<any>(`${this.urlBase}getByDate/${date}`, {headers: this.getDefaultHeader()});
  }

  public delete(Id: number) : Observable<any> {
    return this.http.delete<any>(`${this.urlBase}${Id}`, {headers: this.getDefaultHeader()});
  }

  public listAll() : Observable<ReuniaoFamiliar[]>
  {
    return this.http.get<ReuniaoFamiliar[]>(`${this.urlBase}listAll`, {headers: this.getDefaultHeader()});    
  }

  public nextMeetingNumber() : Observable<{numero: number}>
  {
    return this.http.get<{numero: number}>(`${this.urlBase}nextMeetingNumber`, {headers: this.getDefaultHeader()});    
  }

  public save(reuniao: ReuniaoFamiliar) : Observable<ReuniaoFamiliar>
  {
    return this.http.post<ReuniaoFamiliar>(`${this.urlBase}`, reuniao, {headers: this.getDefaultHeader()});    
  }

  public update(reuniao: ReuniaoFamiliar) : Observable<ReuniaoFamiliar>
  {
    return this.http.put<ReuniaoFamiliar>(`${this.urlBase}${reuniao.Id}`, reuniao, {headers: this.getDefaultHeader()});    
  }

  public getFamilyMembers(){
    return this.http.get<MembroFamilia[]>('./assets/familia.json');
  }

  public getHinosTitle(){
    return this.http.get<Hino[]>('./assets/hinos.json');
  }

  public setMeetingDataLocal(reuniao: ReuniaoFamiliar): void
  {
    localStorage.setItem(this.MeetingDataKey, JSON.stringify(reuniao));
  }

  public getMeetingDataLocal(): ReuniaoFamiliar
  {
    return JSON.parse(localStorage.getItem(this.MeetingDataKey) || this.EmptyObject);
  }

  // public getPoliciesResponse(): ReuniaoFamiliar {
  //   return JSON.parse(localStorage.getItem(this.MeetingDataKey) ? localStorage.getItem(this.MeetingDataKey)  : '');
  // }

  // public setAgencyProducts(agencyProducts: AgencyProducts): void {
  //   localStorage.setItem(this.AGENCY_PRODUCTS_KEY, JSON.stringify(agencyProducts));
  // }
}

