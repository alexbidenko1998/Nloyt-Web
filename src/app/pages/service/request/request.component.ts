import { Component, OnInit } from '@angular/core';
import {ServiceService} from '../../../services/service.service';
import {ActivatedRoute} from '@angular/router';
import {RequestService} from './request.service';
import Pusher from 'pusher-js';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {

  nowTime = new Date().getTime();

  constructor(
    public requestService: RequestService,
    private serviceService: ServiceService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.requestService.orderId = +this.route.snapshot.paramMap.get('orderId');
    this.serviceService.getOrderById(this.requestService.orderId).subscribe(response => {
      this.requestService.device = response.data;

      Pusher.logToConsole = true;

      const pusher = new Pusher('f0076b29a03e5e7c3997', {
        cluster: 'eu',
        forceTLS: false
      });

      const channel = pusher.subscribe('orders');
      channel.bind('order-service-' + this.requestService.device.order.serviceId, data => {
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
        this.requestService.device.order = newOrder.data;
      });
  }

  reject() {
    if (this.requestService.device.order.status === 1 || this.requestService.device.order.status === 9) {
      this.updateStatus(4);
    } else if (this.requestService.device.order.status === 2) {
      this.updateStatus(6);
    }
  }

  getPageTitle(): string {
    switch (this.requestService.device.order.status) {
      case 1:
        return 'REQUESTED';
      case 2:
        return 'OPEN';
      case 3:
        return 'CANCELLED';
      case 4:
        return 'REJECTED';
      case 5:
      case 6:
        return 'INTERRUPTED';
      case 7:
        return 'RECEIPT APPROVAL';
      case 8:
        return 'DONE';
      case 9:
        return 'RESCHEDULED';
      case 10:
        return 'OVERDUE';
    }
  }
}
