import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {OrderFile} from '../../../models/interfaces';
import {ServiceService} from '../../../services/service.service';

@Component({
  selector: 'app-download-list-dialog',
  templateUrl: './download-list-dialog.component.html',
  styleUrls: ['./download-list-dialog.component.css']
})
export class DownloadListDialogComponent implements OnInit {

  files: OrderFile[];

  constructor(
    public dialogRef: MatDialogRef<DownloadListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    public serviceService: ServiceService
  ) {
    this.files = data.files;
  }

  ngOnInit() {
  }

}
