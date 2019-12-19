import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-lang-dialog',
  templateUrl: './lang-dialog.component.html',
  styleUrls: ['./lang-dialog.component.css']
})
export class LangDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<LangDialogComponent>,
    private translate: TranslateService
  ) { }

  ngOnInit() {
  }

  changeLang(newLang: string) {
    this.translate.use(newLang);
    localStorage.setItem('defaultLang', newLang);
  }
}
