import { Component, OnInit } from '@angular/core';
import {ServiceService} from '../../../services/service.service';
import {ActivatedRoute} from '@angular/router';
import {RequestService} from './request.service';
import {MatDialog} from '@angular/material';
import {ResultDialogComponent} from '../../../ui/modals/result-dialog/result-dialog.component';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmDialogComponent} from '../../../ui/modals/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {

  constructor(
    public requestService: RequestService,
    public serviceService: ServiceService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.requestService.orderId = +this.route.snapshot.paramMap.get('orderId');
    this.serviceService.getOrderById(this.requestService.orderId).subscribe(response => {
      this.requestService.device = response.data;

      this.serviceService.channel.bind('order-service-' + this.requestService.device.order.serviceId, data => {
        const cash = this.requestService.device.data;
        this.requestService.device = data.device;
        this.requestService.device.order = data.order;
        this.requestService.device.data = cash;
      });
    });
  }

  updateStatus(newStatus: number) {
    this.serviceService.updateStatus(this.requestService.device.order.id, newStatus, localStorage.getItem('userToken'))
      .subscribe(newOrder => {
        this.requestService.device.order.status = newOrder.data.status;
        this.requestService.device.order.duration = newOrder.data.duration;
        this.requestService.device.order.timeStart = newOrder.data.timeStart;
        this.requestService.device.order.isStarted = newOrder.data.isStarted;
      });
  }

  isStatus(status: number = -1): boolean {
    switch (this.requestService.device.order.status) {
      case 1:
      case 2:
      case 9:
      case 11:
      case 12:
        return this.requestService.device.order.status === status;
      default:
        return -1 === status;
    }
  }

  saveAndClose() {
    let countTasks = this.requestService.saveTasksList.length;
    this.requestService.saveTasksList.forEach(toSave => {
      toSave.task.subscribe(() => {
        this.requestService.saveTasksList =
          this.requestService.saveTasksList.filter(el => el.id !== toSave.id);
      }, () => {}, () => {
        countTasks--;
        if (countTasks === 0 && this.requestService.saveTasksList.length === 0) {
          this.dialog.open(
            ResultDialogComponent,
            {data: {success: true, title: this.translate.instant('service.modal.success_save_and_close')}});
        } else if (countTasks === 0) {
          this.dialog.open(ConfirmDialogComponent, {data: {
            title: this.translate.instant('service.modal.sure_repeat_save_and_close'),
            confirm: () => {
              this.saveAndClose();
            },
            close: () => {}
          }});
        }
      });
    });
  }
}
