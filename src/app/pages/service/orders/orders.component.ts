import {Component, HostListener, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {MatDialog, MatDialogConfig, MatTableDataSource} from '@angular/material';
import {ServiceService} from '../../../services/service.service';
import {Device, Order, OrderFile} from '../../../models/interfaces';
import {FormControl} from '@angular/forms';
import {DownloadListDialogComponent} from '../../../ui/modals/download-list-dialog/download-list-dialog.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, OnChanges {

  service = JSON.parse(localStorage.getItem('service'));
  page = 1;
  isFinish = false;
  isLoading = false;

  activeFilters = {
    acceptNow: false,
    connection: false,
    rejectedByWS: false,
    cancelledByC: false,
    interruptedByWS: false,
    interruptedByC: false,
    receiptApproval: false,
    overdue: false,
    scheduled: false,
    done: false
  };

  date1 = new FormControl({disabled: true});
  date2 = new FormControl({disabled: true});

  displayedColumns = [
    'checkbox',
    'make',
    'model',
    'type',
    'modification',
    'year',
    'millage',
    'warranty',
    'service',
    'edt',
    'catalog',
    'total',
    'status',
    'files',
    'fake'
  ];

  ordersData: MatTableDataSource<Device> = new MatTableDataSource([]);
  activeOrders: number[] = [];
  acceptNowOrderId = 0;
  typeOrdersDate = 6;

  isCardInCost = false;

  isActiveBackground = false;

  constructor(
    private serviceService: ServiceService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getOrders();

    this.serviceService.channel.bind('order-service-' + this.service.id, data => {
      this.updateOrderBind(data);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (document.documentElement.scrollHeight - document.documentElement.scrollTop < 400 + window.innerHeight) {
      this.getOrders();
    }
  }

  getOrders() {
    if (!this.isFinish && !this.isLoading) {
      this.isLoading = true;
      this.serviceService.getOrders(this.page).subscribe(devices => {
        if (devices.data.length === 0) {
          this.isFinish = true;
        }
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < devices.data.length; i++) {
          devices.data[i].fullYear = new Date(devices.data[i].date * 1000).getFullYear();
        }
        this.ordersData.data = this.ordersData.data.concat(devices.data);
        this.page++;
        this.isLoading = false;
        if (document.documentElement.scrollHeight - window.innerHeight < 400 && !this.isFinish) {
          this.getOrders();
        }
      });
    }
  }

  updateOrderBind(bindData: {order: Order, device: Device}) {
    let isFound = false;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.ordersData.data.length; i++) {
      if (this.ordersData.data[i].order.id === bindData.order.id) {
        this.ordersData.data[i].order.status = bindData.order.status;
        this.ordersData.data[i].order.duration = bindData.order.duration;
        this.ordersData.data[i].order.timeStart = bindData.order.timeStart;
        this.ordersData.data[i].order.isStarted = bindData.order.isStarted;
        isFound = true;
      }
    }
    if (!isFound) {
      bindData.device.order = bindData.order;
      bindData.device.fullYear = new Date(bindData.device.date * 1000).getFullYear();
      const tableData = this.ordersData.data;
      tableData.unshift(bindData.device);
      this.ordersData.data = tableData;
    }
  }

  onChangeCheckbox(el, id: number) {
    if (el.checked) {
      this.activeOrders.push(id);
    } else {
      this.activeOrders = this.activeOrders.filter(order => {
        return order !== id;
      });
    }
  }

  clearFilters(key: string = null) {
    // tslint:disable-next-line:forin
    for (const filterKey in this.activeFilters) {
      this.activeFilters[filterKey] = false;
    }
    setTimeout(() => {
      if (key) {
        this.activeFilters[key] = true;
      }
    }, 10);
  }

  getCountOrders(status: number): number {
    if (this.serviceService.ordersCount) {
      return this.serviceService.ordersCount['status_' + status];
    } else {
      return 0;
    }
  }

  getIsShow(data: Device): boolean {
    let isInDate;
    if (!(typeof this.date1.value === 'string' && this.date1.value) || !(typeof this.date2.value === 'string' && this.date2.value)) {
      isInDate = true;
    } else {
      isInDate = new Date(data.order.updated_at).getTime() > new Date(this.date1.value).getTime() &&
        new Date(data.order.updated_at).getTime() < new Date(this.date2.value).getTime() + 60 * 1000 * 60 * 24;
    }

    let isNotHidden = true;
    // tslint:disable-next-line:forin
    for (const prepare in this.activeFilters) {
      isNotHidden = isNotHidden && !this.activeFilters[prepare];
    }
    if (isNotHidden) {
      return isNotHidden && isInDate;
    }
    switch (data.order.status) {
      case 1:
        return !this.activeFilters.acceptNow && isInDate;
      case 2:
        return !this.activeFilters.connection && isInDate;
      case 3:
        return !this.activeFilters.cancelledByC && isInDate;
      case 4:
        return !this.activeFilters.rejectedByWS && isInDate;
      case 5:
        return !this.activeFilters.interruptedByC && isInDate;
      case 6:
        return !this.activeFilters.interruptedByWS && isInDate;
      case 7:
        return !this.activeFilters.receiptApproval && isInDate;
      case 8:
        return !this.activeFilters.done && isInDate;
      case 9:
        return !this.activeFilters.scheduled && isInDate;
      case 10:
        return !this.activeFilters.overdue && isInDate;
      default:
        return isInDate;
    }
  }

  onLongClickRow(id: number) {
    this.acceptNowOrderId = id;
    setTimeout(() => {
      this.isActiveBackground = id !== 0;
    }, 50);
  }

  checkAll() {
    if (this.activeOrders.length !== this.ordersData.filteredData.filter(el => {
      return this.getIsShow(el);
    }).length) {
      this.activeOrders = [];
      this.ordersData.filteredData.forEach(el => {
        if (this.getIsShow(el)) {
          this.activeOrders.push(el.order.id);
        }
      });
    } else {
      this.activeOrders = [];
    }
  }

  getMillage(miliage: number): string {
    const num = miliage.toString();
    return num.substring(0, num.length - 4) + ' ' + num.substring(num.length - 4, num.length - 1);
  }

  getIsWarrantyError(device: Device): number {
    if (new Date().getTime() - device.date * 1000 > 1000 * 60 * 60 * 24 * 365 * 2) {
      return 2;
    } else if (new Date().getTime() - device.date * 1000 > 1000 * 60 * 60 * 24 * 365 * 1.5) {
      return 1;
    } else {
      return 0;
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (document.documentElement.scrollHeight - document.documentElement.scrollTop < 400 + window.innerHeight) {
      this.getOrders();
    }
  }

  openFilesModal(files: OrderFile[]) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      files
    };

    this.dialog.open(DownloadListDialogComponent, dialogConfig);
  }
}
