import { Component, OnInit } from '@angular/core';
import { Hymn } from '../../model/hymn.interface';

@Component({
  selector: 'app-lyric-dialog',
  templateUrl: './lyric-dialog.component.html',
  styleUrls: ['./lyric-dialog.component.scss']
})
export class LyricDialogComponent implements OnInit {
  hymnSelected?: Hymn;
  constructor() { }

  ngOnInit(): void {
    this.hymnSelected = JSON.parse(sessionStorage.getItem("hymn") || "");
  }

}
