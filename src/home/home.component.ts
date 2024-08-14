import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MembroFamilia } from '../model/familia.interface';
import { ReuniaoFamiliar } from '../model/reuniao.interface';
import { MeetingService } from '../service/meeting.service';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { SharedService } from '../service/shared.service';
import { Hymn } from '../model/hymn.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  dataSource = new MatTableDataSource<ReuniaoFamiliar>([]); //: ReuniaoFamiliar[] = [];
  displayedColumns: string[] = ['numero', 'datareuniao', 'mensagem'];
  expandedElement: string = '';
  familiaArray: MembroFamilia[] = [];
  hymnsArray: Hymn[] = [];

  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  constructor(
    private meetingService: MeetingService, 
    private router: Router, 
    private sharedService: SharedService, 
    private route: ActivatedRoute) 
  {
    this.familiaArray = this.route.snapshot.data['familyMember'];
    this.hymnsArray = this.route.snapshot.data['hymns'];
  }

  btnAddSubscription: Subscription = new Subscription();

  ngOnDestroy(): void
  {
    this.btnAddSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.familiaArray = this.route.snapshot.data['familyMember'];  
    this.btnAddSubscription = this.sharedService.getButtonClicked().subscribe((x) => {if(x === "add") this.NovaReuniao()});

    this.meetingService.listAll().subscribe(x => { 
      if(x) 
      {
        this.dataSource = new MatTableDataSource<ReuniaoFamiliar>(x); 
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  formatarData(data: string): string{
  return data.substring(0, data.indexOf('T'));
  }

  getFamilyMemberName(id: string): string{
    return this.familiaArray?.filter((x) => x?.id == id)[0]?.name;
  }

  rowClicked(row: any){
    if(row.datareuniao){
      const data = row.datareuniao.substring(0, row.datareuniao.indexOf('T'));
      this.router.navigate(['/ata', data]);
    }
  }

  NovaReuniao(){
    this.router.navigate(['/reuniao']);
  }
}
