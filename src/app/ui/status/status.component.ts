import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Order} from '../../models/interfaces';
import {ServiceService} from '../../services/service.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit, OnChanges, OnDestroy {

  @Input() order: Order;
  @Output() onLongClick = new EventEmitter<number>();
  time = 0;
  timeString: string;
  timer: any;
  clickTimer: any;
  nowTime: number;

  constructor(
    private serviceService: ServiceService
  ) { }

  ngOnInit() {
    this.timer = setInterval(() => {
      this.nowTime = new Date().getTime();
      if (this.order.status === 11) {
        this.time++;
        this.timeString = this.getTimeString();
      }
    }, 1000);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.onChange();
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  getTimeString(): string {
    let hours: any = Math.floor(this.time / 3600);
    let minutes: any = Math.floor((this.time - (hours * 3600)) / 60);
    let seconds: any = Math.round(this.time - (hours * 3600) - (minutes * 60));

    if (hours < 10) { hours = '0' + hours; }
    if (minutes < 10) {minutes = '0' + minutes; }
    if (seconds < 10) {seconds = '0' + seconds; }
    return hours + ':' + minutes + ':' + seconds;
  }

  updateStatus(newStatus: number) {
    this.serviceService.updateStatus(this.order.id, newStatus, localStorage.getItem('userToken')).subscribe(newOrder => {
      this.order.status = newOrder.data.status;
      this.order.duration = newOrder.data.duration;
      this.order.timeStart = newOrder.data.timeStart;
      this.order.isStarted = newOrder.data.isStarted;
      this.onChange();
    });
  }

  onChange() {
    if (this.time !== 0) {
    } else if (this.order.status === 11) {
      const nowTime = new Date().getTime();
      this.time = (nowTime - nowTime % 1000) / 1000 - this.order.timeStart;
      this.timeString = this.getTimeString();
    } else if (this.order.status === 12) {
      this.time = this.order.duration;
      this.timeString = this.getTimeString();
    }
  }

  onMouseDown() {
    this.onLongClick.emit(this.order.id);
    this.clickTimer = setTimeout(() => {
      this.onMouseUp();
      this.serviceService.updateStatus(this.order.id, 2, localStorage.getItem('userToken')).subscribe(newOrder => {
        this.order = newOrder.data;
        this.onChange();
      });
    }, 3000);
  }

  onMouseUp() {
    this.onLongClick.emit(0);
    clearTimeout(this.clickTimer);
  }
}
