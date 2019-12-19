import {Inject, Injectable} from '@angular/core';
import {Device, OrderConclusion, OrderFile, ResponseModel} from '../../../models/interfaces';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {ResultDialogComponent} from '../../../ui/modals/result-dialog/result-dialog.component';
import {ConfirmDialogComponent} from '../../../ui/modals/confirm-dialog/confirm-dialog.component';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  orderId: number;

  device: Device;
  serviceConfig: any[];

  constructor(
    private httpClient: HttpClient,
    private dialog: MatDialog,
    @Inject('BASE_URL') private baseUrl: string
  ) { }

  uploadFilesToOrder(event) {
    if (event.target.files) {
      const dialogConfig = new MatDialogConfig();

      dialogConfig.data = {
        title: 'Are you sure want to upload ' + event.target.files.length + ' files?',
        confirm: () => {
          const form = new FormData();
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < event.target.files.length; i++) {
            form.append('file' + i, event.target.files[i]);
          }
          form.append('filesCount', event.target.files.length);
          this.uploadFiles(this.device.order.id, form).subscribe(files => {
            this.device.order.files = this.device.order.files.concat(files.data);
            const config = new MatDialogConfig();
            config.data = {success: true, title: 'Success upload files'};
            this.dialog.open(ResultDialogComponent, config);
          });
        },
        close: () => {
          event.target.files = null;
        }
      };

      this.dialog.open(ConfirmDialogComponent, dialogConfig);
    }
  }

  uploadFiles(orderId: number, body: FormData): Observable<ResponseModel<OrderFile[]>> {
    return this.httpClient.post<ResponseModel<OrderFile[]>>(this.baseUrl + 'api/service/order/file/' + orderId, body, {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem('userToken')
      })
    });
  }

  deleteOrderFile(filename: string) {
    return this.httpClient.delete<ResponseModel<any>>(this.baseUrl + 'api/service/order/file/' + filename, {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem('userToken')
      })
    });
  }

  addOrderConclusions(orderId: number, conclusion: {text: string, risk: number}): Observable<ResponseModel<OrderConclusion>>  {
    return this.httpClient.post<ResponseModel<OrderConclusion>>(this.baseUrl + 'api/service/order/conclusion/' + orderId, conclusion, {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem('userToken')
      })
    });
  }

  updateOrderConclusions(conclusionId: number, conclusion: OrderConclusion) {
    this.httpClient.put<ResponseModel<OrderConclusion>>(this.baseUrl + 'api/service/order/conclusion/' + conclusionId, conclusion, {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem('userToken')
      })
    }).subscribe();
  }

  deleteOrderConclusion(conclusionId: number): Observable<ResponseModel<any>> {
    return this.httpClient.delete<ResponseModel<any>>(this.baseUrl + 'api/service/order/conclusion/' + conclusionId, {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem('userToken')
      })
    });
  }
}
