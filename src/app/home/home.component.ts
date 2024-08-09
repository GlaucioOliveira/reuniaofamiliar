import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MembroFamilia } from '../model/familia.interface';
import { Hino } from '../model/hino.interface';
import { ReuniaoFamiliar } from '../model/reuniao.interface';
import { MeetingService } from '../services/meeting.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { format, parse, parseISO, toDate } from 'date-fns'
import { SharedService } from '../services/shared.service';
import { Subscription } from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import { DeleteDialogComponent } from '../dialog/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  reuniaoFamiliar: ReuniaoFamiliar = new ReuniaoFamiliar();
  hinosArray: Hino[] = [];
  familiaArray: MembroFamilia[] = [];
  nomeDoHino: string = '';
  dataReuniao: any;

  constructor(
    private fb: FormBuilder,
    private meetingService: MeetingService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private sharedService: SharedService,
    public dialog: MatDialog) 
  {
    this.dataReuniao = this.route.snapshot.paramMap.get('data-reuniao');
    
    this.familiaArray = this.route.snapshot.data['familyMember'];    
    this.hinosArray = this.route.snapshot.data['hinos'];

    if(this.dataReuniao)
      this.getMeeting(parse(this.dataReuniao, 'yyyy-MM-dd', new Date()));
    else
    this.getMeeting(new Date(), true);
  }

  btnSaveSubscription: Subscription = new Subscription();
  ngOnInit(): void 
  {
    this.btnSaveSubscription = this.sharedService.getButtonClicked().subscribe((x) => 
    {
      if(x === "save") this.SalvarReuniao();
      if(x === "history") this.ListarReunioes();
      if(x === "delete" && this.reuniaoFamiliar.Id > 0) this.confirmDelete();
    
    });
  }
  ListarReunioes() {
    this.router.navigate(['/meetings']);
  }

  confirmDelete() {
    const dialogRef = this.dialog.open(DeleteDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if(result === true){
        this.meetingService.delete(this.reuniaoFamiliar.Id).subscribe(x=> {
          this.router.navigate(['/meetings']);
        }
        );
      }
    });
  }

  ngOnDestroy(): void
  {
    this.btnSaveSubscription.unsubscribe();
  }

  getMeeting(Date: Date, getNextMeetingNumber: boolean = false): void{
    const date = format(Date, 'yyyy-MM-dd'); 
    this.reuniaoFamiliar = new ReuniaoFamiliar(date, this.reuniaoFamiliar.numero);
    this.nomeDoHino = '';
    
    this.meetingService.get(date)
    .subscribe(x=> {
      if(x !== null && x?.Id > 0)
      {
        this.reuniaoFamiliar = x;

        if(this.reuniaoFamiliar?.primeiro_hino !== undefined && this.reuniaoFamiliar?.primeiro_hino > 0)
          this.nomeDoHino = this.hinosArray.filter(x => x.number == this.reuniaoFamiliar?.primeiro_hino)[0]?.title;
      }
      else{
        if(getNextMeetingNumber){
          this.meetingService.nextMeetingNumber().subscribe(
            x=> {
              this.reuniaoFamiliar.numero = x.numero;
            }
          );
        }
      }
    });
  }

  obterNomeDoHino(nomeHino: HTMLInputElement): void{
    let hinoDigitado = parseInt(nomeHino.value);    
    let hino = this.hinosArray.find(x=> x.number === hinoDigitado);    
    
    this.reuniaoFamiliar.primeiro_hino = hinoDigitado;
    this.reuniaoFamiliar.primeiro_hino_nome = hino?.title || '';

    this.nomeDoHino = this.formatarNomeDoHino(this.reuniaoFamiliar.primeiro_hino_nome);
  }

  private formatarNomeDoHino(nomeHino: string): string
  {
    if(nomeHino !== undefined)
    {
      return `- ${nomeHino}`;
    }
    else
    {
      return '';
    }
  }

  onSelectDate(event: any)
  {    
    const date = parseISO(event.value.toISOString());
    this.getMeeting(date, true);
  }

  btnSalvarReuniaoLabel(): string{
    return this.reuniaoFamiliar.Id > 0 ? 'Atualizar' : 'Salvar';
  }

  SalvarReuniao(): void{
    if(this.reuniaoFamiliar.Id <= 0)
    {
      this.meetingService.save(this.reuniaoFamiliar).subscribe({
        next: (response) => {
          this.popupMessage('Reunião salva com sucesso!');
          this.reuniaoFamiliar.Id = response.Id;
        },
        error: (e) => this.popupMessage('Oops, algo deu errado ao salvar o registro :|')
      });
    }
    else{
      this.meetingService.update(this.reuniaoFamiliar).subscribe({
        next: (response) => {
          this.popupMessage('Reunião atualizada com sucesso!');
        },
        error: (e) => this.popupMessage('Oops, algo deu errado ao atualizar o registro :|')
      });
    }
  }

  popupMessage(message: string, duration = 2*1000): void
  {
    this.snackBar.open(message, undefined, {duration: duration});
  }

  listaFamilia(){
    if(this.reuniaoFamiliar.naomembro)
    {
      return this.familiaArray;
    }
    else{
      return this.familiaArray.filter(x=> x.membro == true);
    }
  }

  dateFormatted(date?: any){
    return date?.split('T')[0];
  }
}
