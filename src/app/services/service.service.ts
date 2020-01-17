import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Device, Order, ResponseModel, Telemetry} from '../models/interfaces';
import * as FileSaver from 'file-saver';
import Pusher from 'pusher-js';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  isBusy = false;
  activeOrdersCount = 0;
  channel: any;
  ordersCount: any;

  constructor(
    private httpClient: HttpClient,
    @Inject('BASE_URL') private baseUrl: string
  ) {
    Pusher.logToConsole = true;

    const pusher = new Pusher('f0076b29a03e5e7c3997', {
      cluster: 'eu',
      forceTLS: false
    });

    this.channel = pusher.subscribe('service-channel');
  }

  getServiceConfig(): Observable<ResponseModel<any>> {
    return this.httpClient.get<ResponseModel<any>>(this.baseUrl + 'api/service/config', {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem('userToken')
      })
    });
  }

  getAllDataCounts(): Observable<ResponseModel<any>> {
    return this.httpClient.get<ResponseModel<any>>(this.baseUrl + 'api/service/counts', {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem('userToken')
      })
    });
  }

  getOrders(page: number): Observable<ResponseModel<Device[]>> {
    return this.httpClient.get<ResponseModel<Device[]>>(this.baseUrl + 'api/service/order/page/' + page + '/10', {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem('userToken')
      })
    });
  }

  updateStatus(orderId: number, newStatus: number, token: string, duration: number = 0): Observable<ResponseModel<Order>> {
    return this.httpClient.put<ResponseModel<Order>>(this.baseUrl + 'api/service/order/' + orderId, {
      newStatus,
      duration: Math.round(duration)
    }, {
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }

  getOrderById(id: number): Observable<ResponseModel<Device>> {
    return this.httpClient.get<ResponseModel<Device>>(this.baseUrl + 'api/service/order/' + id, {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem('userToken')
      })
    });
  }

  getOrderDeviceErrors(id: number, olderThan: number): Observable<ResponseModel<{errors: Telemetry[], isFinish: boolean}>> {
    return this.httpClient.get<ResponseModel<{errors: Telemetry[], isFinish: boolean}>>(
      this.baseUrl + 'api/service/order/' + id + '/error?olderThan=' + olderThan, {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem('userToken')
      })
    });
  }

  downloadFile(filename: string) {
    this.httpClient.get(this.baseUrl + 'api/service/order/file/' + filename, {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('userToken')
        }), responseType: 'blob' })
      .toPromise()
      .then(blob => {
        FileSaver.saveAs(blob, filename);
      })
      .catch(error => console.log(error.error));
  }
}
