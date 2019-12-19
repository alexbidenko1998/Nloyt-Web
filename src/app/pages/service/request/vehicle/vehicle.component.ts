import { Component, OnInit } from '@angular/core';
import {ServiceService} from '../../../../services/service.service';
import {ActivatedRoute} from '@angular/router';
import {Telemetry} from '../../../../models/interfaces';
import {RequestService} from '../request.service';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit {

  isShowFirstTable = true;
  isShowSecondTable = true;

  isMilesOrMonths = true;
  isMilesOrMonthsColor = true;

  errorTimeOlderThan = Math.round(new Date().getTime() / 1000);
  prepareErrorsTableData: Telemetry[] = [];
  errorsTableData = [];
  isFinish = false;
  isLoaded = false;

  constructor(
    public requestService: RequestService,
    private serviceService: ServiceService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.serviceService.getServiceConfig().subscribe(config => {
      this.requestService.serviceConfig = config.data;
      if (this.prepareErrorsTableData) {
        this.calcTable();
      }
    });

    this.loadMore();
  }

  calcTable() {
    this.prepareErrorsTableData.forEach(error => {
      this.errorsTableData = this.errorsTableData.concat(this.getPrepareForTableError(error));
    });
    this.prepareErrorsTableData = [];
    this.isLoaded = false;
  }

  getPrepareForTableError(error: Telemetry): any[] {
    const result = [];
    const permissibleValues = ['TP', 'CL', 'OL', 'FL', 'BV'];
    permissibleValues.forEach(type => {
      this.requestService.serviceConfig.forEach(config => {
        if (config.type === type && (config.min > error[config.type] || config.max < error[config.type])) {
          result.push({
            title: this.getTitle(config.type),
            treshold: (config.min > error[config.type] ? config.min : config.max).toString() + this.getValueSuffix(config.type),
            value: error[config.type].toString() + this.getValueSuffix(config.type),
            date: error.created_at
          });
        }
      });
    });
    return result;
  }

  getTitle(type: string) {
    switch (type) {
      case 'TP':
        return 'Tyre pressure';
      case 'CL':
        return 'Colling liquid';
      case 'OL':
        return 'Oil level';
      case 'FL':
        return 'Fuel level';
      case 'BV':
        return 'Battary voltage';
      default:
        return '';
    }
  }

  getValueSuffix(type: string) {
    if (type === 'CL') {
      return ' C';
    } else {
      return '';
    }
  }

  loadMore() {
    if (!this.isLoaded && !this.isFinish) {
      this.isLoaded = true;
      this.serviceService.getOrderDeviceErrors(this.requestService.orderId, this.errorTimeOlderThan).subscribe(errors => {
        this.isFinish = errors.data.isFinish;
        if (errors.data.errors) {
          this.errorTimeOlderThan =
            Math.round(new Date(errors.data.errors[errors.data.errors.length - 1].created_at).getTime() / 1000) + 60 * 60 * 6;
          this.prepareErrorsTableData = this.prepareErrorsTableData.concat(errors.data.errors);
          if (this.requestService.serviceConfig) {
            this.calcTable();
          }
        }
      });
    }
  }

  getDate(): number {
    return new Date(this.requestService.device.date * 1000).getFullYear();
  }

  getVin(): string {
    let vin = 'WBAFH';
    for (let i = this.requestService.device.pin.length - 1; i >= 0; i--) {
      vin += this.requestService.device.pin[i];
    }
    return vin;
  }

  getMillage(max: number = 0): string {
    let num = this.requestService.device.data.miliage.toString();
    if (max > 0) {
      if (+num > max) {
        return '0';
      } else {
        num = (max - +num).toString();
        return num.substring(0, num.length - 4) + ' ' + num.substring(num.length - 4, num.length - 1);
      }
    }
    return num.substring(0, num.length - 4) + ' ' + num.substring(num.length - 4, num.length - 1);
  }

  getWarranty(): number {
    const date = 1000 * 60 * 60 * 24 * 365 * 2 - (new Date().getTime() - this.requestService.device.date * 1000);
    return date < 0 ? 0 : Math.round(date / (1000 * 60 * 60 * 24 * 30));
  }

  mmSwitch(toVariant: number) {
    switch (toVariant) {
      case 0:
        this.isMilesOrMonths = !this.isMilesOrMonths;
        break;
      case 1:
        this.isMilesOrMonths = true;
        break;
      case 2:
        this.isMilesOrMonths = false;
        break;
    }
    setTimeout(() => {
      this.isMilesOrMonthsColor = this.isMilesOrMonths;
    }, 150);
  }
}
