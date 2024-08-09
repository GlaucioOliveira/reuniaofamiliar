import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { ReuniaoFamiliar } from '../model/reuniao.interface';
import { MeetingService } from '../services/meeting.service';
import { format, parse, parseISO } from "date-fns";
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.css']
})
export class MeetingsComponent implements AfterViewInit, OnInit {
  dataSource = new MatTableDataSource<ReuniaoFamiliar>([]); //: ReuniaoFamiliar[] = [];
  displayedColumns: string[] = ['numero', 'datareuniao'];
  expandedElement: string = '';

  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  constructor(private meetingService: MeetingService, private router: Router, private sharedService: SharedService) {
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