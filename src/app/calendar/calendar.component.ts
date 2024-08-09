import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatCalendar, MatCalendarCellCssClasses } from '@angular/material/datepicker';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements AfterViewInit {
  @ViewChild('calendar')  calendar: MatCalendar<Date> | undefined;

  datesToHighlight = ["2022-05-07T18:00:00.000Z","2022-05-10T18:30:00.000Z"];

  constructor() {
  }

  ngAfterViewInit(): void {
  }

  dateClass() {
    return (date: Date): MatCalendarCellCssClasses => {
      const highlightDate = this.datesToHighlight
        .map(strDate => new Date(strDate))
        .some(d => d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear());
      
      return highlightDate ? 'special-date' : '';
    };
  }
}
