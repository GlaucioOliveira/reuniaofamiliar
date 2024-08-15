import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { parseISO } from 'date-fns/parseISO';
import { Subscription } from 'rxjs';
import { DeleteDialogComponent } from '../dialog/delete-dialog/delete-dialog.component';
import { LyricDialogComponent } from '../dialog/lyric-dialog/lyric-dialog.component';
import { MembroFamilia } from '../model/familia.interface';
import { Hino } from '../model/hino.interface';
import { Hymn } from '../model/hymn.interface';
import { ReuniaoFamiliar } from '../model/reuniao.interface';
import { MeetingService } from '../service/meeting.service';
import { SharedService } from '../service/shared.service';

@Component({
  templateUrl: './reuniao.component.html',
  styleUrl: './reuniao.component.scss'
})
export class ReuniaoComponent implements OnInit, OnDestroy {
  reuniaoFamiliar: ReuniaoFamiliar = new ReuniaoFamiliar();
  hinosArray: Hino[] = [];
  familiaArray: MembroFamilia[] = [];
  nomeDoHino: string = '';
  dataReuniao: any;
  btnSaveSubscription: Subscription = new Subscription();
  musicPlaying: boolean = false;
  hymnsArray: Hymn[] = [];
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
    this.hymnsArray = this.route.snapshot.data['hymns'];

    if(this.dataReuniao)
      this.getMeeting(parse(this.dataReuniao, 'yyyy-MM-dd', new Date()));
    else
    this.getMeeting(new Date(), true);
  }

  hymnsArrayFilter(){
      return this.hymnsArray.filter((x) => x.uri == this.reuniaoFamiliar.tipo_hinario);
  }

  hymnSelected(): Hymn | null{
    if(this.reuniaoFamiliar.primeiro_hino)
      return this.hymnsArrayFilter().filter((x) => x.number == this.reuniaoFamiliar.primeiro_hino?.toString())[0];
    else
      return null;
  }

  clearHymnSelected(){
    this.reuniaoFamiliar.primeiro_hino = undefined;
  }

  ngOnInit(): void {
    this.btnSaveSubscription = this.sharedService.getButtonClicked().subscribe((x) => 
    {
      if(x === "save") this.SalvarReuniao();
      if(x === "history") this.ListarReunioes();
      if(x === "delete" && this.reuniaoFamiliar.Id > 0) this.confirmDelete();
    
    });
  }

  ListarReunioes() {
    this.router.navigate(['/']);
  }

  confirmDelete() {
    const dialogRef = this.dialog.open(DeleteDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if(result === true){
        this.meetingService.delete(this.reuniaoFamiliar.Id).subscribe(x=> {
          this.router.navigate(['/']);
        }
        );
      }
    });
  }

  
  showLyric(event: MouseEvent) {
    event.stopPropagation();

    sessionStorage.setItem("hymn", JSON.stringify(this.hymnSelected()));

    const dialogRef = this.dialog.open(LyricDialogComponent,
      {
        autoFocus: false,
        width: '90vw',
        height: '80vh',
        maxWidth: '90vw',
        maxHeight: '90vh',
        panelClass: 'full-screen-dialog'
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if(result === true){
      }
    });
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
        
        if(x.regras_de_fe)
          this.reuniaoFamiliar.regras_de_fe = x.regras_de_fe.split(", ").map(Number);     
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

  SalvarReuniao(): void{
    this.reuniaoFamiliar.regras_de_fe_str = this.reuniaoFamiliar.regras_de_fe?.join(", ");

    if(this.reuniaoFamiliar.Id <= 0)
    {
      this.meetingService.save(this.reuniaoFamiliar).subscribe({
        next: (response: any) => {
          this.popupMessage('Reunião salva com sucesso!');
          this.reuniaoFamiliar.Id = response.Id;
        },
        error: (e: any) => this.popupMessage('Oops, algo deu errado ao salvar o registro :|')
      });
    }
    else{
      this.meetingService.update(this.reuniaoFamiliar).subscribe({
        next: (response: any) => {
          this.popupMessage('Reunião atualizada com sucesso!');
        },
        error: (e: any) => this.popupMessage('Oops, algo deu errado ao atualizar o registro :|')
      });
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
  
  ngOnDestroy(): void
  {
    this.btnSaveSubscription.unsubscribe();
  }
}
