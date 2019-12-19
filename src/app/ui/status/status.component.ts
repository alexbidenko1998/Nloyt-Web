import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Order} from '../../models/interfaces';
import {Router} from '@angular/router';
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
  timer: number;
  clickTimer: number;
  nowTime: number;

  timerCheckInterval: number;

  constructor(
    private router: Router,
    private serviceService: ServiceService
  ) { }

  ngOnInit() {
    this.timerCheck();
    this.timerCheckInterval = setInterval(() => {
      this.timerCheck();
    }, 60000);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.onChange();
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
      this.order = newOrder.data;
      this.onChange();
    });
  }

  onChange() {
    if (this.time !== 0) {
    } else if (this.order.status === 2) {
      const nowTime = new Date().getTime();
      this.time = (nowTime - nowTime % 1000) / 1000 - this.order.timeStart;
      this.timeString = this.getTimeString();
      this.timer = setInterval(() => {
        this.time++;
        this.timeString = this.getTimeString();
      }, 1000);
    } else {
      clearInterval(this.timer);
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

  ngOnDestroy(): void {
    clearTimeout(this.timerCheckInterval);
  }

  timerCheck() {
    this.nowTime = new Date().getTime();
    if ((this.order.status === 1 || this.order.status === 9) && this.nowTime - this.order.timeStart * 1000 > 60 * 60 * 1000 * 24) {
      this.updateStatus(10);
    }
  }
}
