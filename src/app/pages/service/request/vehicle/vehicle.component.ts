import { Component, OnInit } from '@angular/core';
import {ServiceService} from '../../../../services/service.service';
import {Telemetry} from '../../../../models/interfaces';
import {RequestService} from '../request.service';
import {max} from 'rxjs/operators';

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
    private serviceService: ServiceService
  ) { }

  ngOnInit() {
    this.serviceService.getServiceConfig().subscribe(config => {
      this.requestService.serviceConfig = config.data.config;
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

  getTimeAgo(): string {
    if (this.requestService.device) {
      const time = Math.round((new Date().getTime()
        - new Date(this.requestService.device.data.updated_at).getTime()
        + 1000 * 60 * 60 * 3) / 1000);
      const second = time % 60;
      return `${Math.floor((time - time % 60) / 60 / 60)}:${second < 10 ? '0' + second : second}`;
    } else {
      return '';
    }
  }

  getSector(value: number, maxValue: number): string {
    const width = 2 * Math.PI * 25;
    return '' + (width / maxValue * value) + ',' + width;
  }

  getColor(value: number, maxValue: number, revers: boolean = false): string {
    const percent = 1 - value / maxValue;
    return 'hsl('
      + ((revers ? 1 : -1) * (percent - 0.5) * 110 + 65)
      + ',100%,'
      + ((revers ? -1 : 1) * (percent - 0.5) * 10 + 40)  + '%)';
  }

  getPrepareForTableError(error: Telemetry): any[] {
    const result = [];
    const permissibleValues = ['TP', 'CL', 'OL', 'FL', 'BV'];
    permissibleValues.forEach(type => {
      this.requestService.serviceConfig.forEach(config => {
        if (config.type === type && (config.min > error[config.type] || config.max < error[config.type])) {
          result.push({
            type: config.type,
            treshold: (config.min > error[config.type] ? config.min : config.max).toString() + this.getValueSuffix(config.type),
            value: error[config.type].toString() + this.getValueSuffix(config.type),
            date: error.created_at
          });
        }
      });
    });
    return result;
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

  getMathRound(value: number): number {
    return value < 0 ? 0 : Math.round(value);
  }
}
