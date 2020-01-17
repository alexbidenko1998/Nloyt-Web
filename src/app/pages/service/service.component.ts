import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {LangDialogComponent} from '../../ui/modals/lang-dialog/lang-dialog.component';
import {ServiceService} from '../../services/service.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {

  service = JSON.parse(localStorage.getItem('service'));
  user = JSON.parse(localStorage.getItem('userData'));
  isOpenLeftBar = false;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private serviceService: ServiceService
  ) {
    if (!localStorage.getItem('userToken')) {
      this.router.navigateByUrl('/').then();
    }
  }

  ngOnInit() {
    this.serviceService.getServiceConfig().subscribe(config => {
      this.serviceService.isBusy = config.data.isBusy;
      this.serviceService.activeOrdersCount = config.data.activeOrdersCount;
      this.serviceService.ordersCount = config.data.ordersCount;
    });

    this.serviceService.channel.bind('service-is-busy-' + this.service.id, data => {
      this.serviceService.isBusy = data.isBusy;
      this.serviceService.activeOrdersCount = data.activeOrdersCount;
    });
  }

  toggleBar() {
    if (this.isOpenLeftBar) {
      this.isOpenLeftBar = false;
      document.getElementById('left-bar').classList.remove('open');

      document.getElementById('main-container').style.paddingLeft = '68px';
    } else {
      this.isOpenLeftBar = true;
      document.getElementById('left-bar').classList.add('open');

      document.getElementById('main-container').style.paddingLeft = '254px';
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
