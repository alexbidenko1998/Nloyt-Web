import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {LangDialogComponent} from '../../ui/modals/lang-dialog/lang-dialog.component';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {

  user = JSON.parse(localStorage.getItem('userData'));
  isOpenLeftBar = false;

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) {
    if (!localStorage.getItem('userToken')) {
      this.router.navigateByUrl('/').then();
    }
  }

  ngOnInit() {
  }

  toggleBar() {
    if (this.isOpenLeftBar) {
      this.isOpenLeftBar = false;
      document.getElementById('left-bar').classList.remove('open');

      document.getElementById('main-container').style.width = 'calc(100% - 68px)';
      document.getElementById('main-container').style.marginLeft = '68px';
    } else {
      this.isOpenLeftBar = true;
      document.getElementById('left-bar').classList.add('open');

      document.getElementById('main-container').style.width = 'calc(100% - 68px)';
      document.getElementById('main-container').style.marginLeft = '254px';
    }
  }

  getAvatar(): string {
    return this.user.photo ?
      '/images/employee/' + this.user.photo :
      'https://www.fourthwallevents.com/wp-content/uploads/2016/04/default-avatar.png';
  }

  changeLang() {
    const dialogConfig = new MatDialogConfig();
    this.dialog.open(LangDialogComponent, dialogConfig);
  }
}
