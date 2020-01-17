import {Inject, Injectable} from '@angular/core';
import {Device, OrderConclusion, OrderFile, ResponseModel} from '../../../models/interfaces';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {ResultDialogComponent} from '../../../ui/modals/result-dialog/result-dialog.component';
import {ConfirmDialogComponent} from '../../../ui/modals/confirm-dialog/confirm-dialog.component';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  service = JSON.parse(localStorage.getItem('service'));
  orderId: number;

  device: Device;
  serviceConfig: any[];

  saveTasksList: {id: number, task: Observable<any>}[] = [];

  constructor(
    private httpClient: HttpClient,
    private dialog: MatDialog,
    @Inject('BASE_URL') private baseUrl: string,
    private translate: TranslateService
  ) { }

  uploadFilesToOrder(event) {
    if (event.target.files) {
      const dialogConfig = new MatDialogConfig();

      dialogConfig.data = {
        title: this.translate.instant('service.modal.sure_upload', {count: event.target.files.length}),
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
            config.data = {success: true, title: this.translate.instant('service.modal.success_upload')};
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
    return this.httpClient.put<ResponseModel<OrderConclusion>>(this.baseUrl + 'api/service/order/conclusion/' + conclusionId, conclusion, {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem('userToken')
      })
    });
  }

  deleteOrderConclusion(conclusionId: number): Observable<ResponseModel<any>> {
    return this.httpClient.delete<ResponseModel<any>>(this.baseUrl + 'api/service/order/conclusion/' + conclusionId, {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem('userToken')
      })
    });
  }
}
