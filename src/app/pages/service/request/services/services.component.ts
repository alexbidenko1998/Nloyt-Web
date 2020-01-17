import { Component, OnInit } from '@angular/core';
import {RequestService} from '../request.service';
import {MatDialog, MatDialogConfig, MatTableDataSource} from '@angular/material';
import {ConfirmDialogComponent} from '../../../../ui/modals/confirm-dialog/confirm-dialog.component';
import {ServiceService} from '../../../../services/service.service';
import {OrderConclusion} from '../../../../models/interfaces';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {

  ordersData = [{}];
  displayedColumns = [
    'checkbox',
    'serviceDescription',
    'approval',
    'edt',
    'price',
    'discount',
    'total'
  ];

  conclusions: MatTableDataSource<OrderConclusion>;
  conclusionsColumns = ['checkbox', 'conclusion', 'risk'];
  checkedConclusions: number[] = [];
  isRedactConclusion = false;
  newConclusion: OrderConclusion;

  filesColumns = ['checkbox', 'file', 'uploadDate'];
  checkedFiles: number[] = [];

  isCheckedOrder = false;

  constructor(
    public requestService: RequestService,
    public serviceService: ServiceService,
    private dialog: MatDialog,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.newConclusion = {
      id: -1,
      serviceId: this.requestService.service.id,
      text: '',
      risk: 0,
      orderId: this.requestService.orderId,
      timestamp: 0
    };
  }

  addConclusionToCheck(conclusionId: number) {
    if (this.checkedConclusions.indexOf(conclusionId) > -1) {
      this.checkedConclusions.splice(this.checkedConclusions.indexOf(conclusionId), 1);
    } else {
      this.checkedConclusions.push(conclusionId);
    }
  }

  saveConclusion() {
    if (this.newConclusion.text && this.newConclusion.risk !== 0) {
      this.requestService.device.order.conclusions.push(Object.assign({}, this.newConclusion));
      this.requestService.saveTasksList.push(
        {
          id: new Date().getTime(),
          task: this.requestService.addOrderConclusions(this.requestService.orderId,
            this.requestService.device.order.conclusions[this.requestService.device.order.conclusions.length - 1])
        }
      );
      this.isRedactConclusion = false;
      this.newConclusion.id--;
      this.newConclusion.text = '';
      this.newConclusion.risk = 0;
    } else {
      this.isRedactConclusion = false;
      this.newConclusion.risk = 0;
    }
  }

  getConclusionsSource(): MatTableDataSource<OrderConclusion> {
    this.conclusions = new MatTableDataSource(this.requestService.device.order.conclusions);
    return this.conclusions;
  }

  deleteConclusions() {
    if (this.checkedConclusions.length > 0) {
      const dialogConfig = new MatDialogConfig();

      dialogConfig.data = {
        title: this.translate.instant('service.modal.sure_delete_conclusions', {count: this.checkedConclusions.length}),
        confirm: () => {
          this.checkedConclusions.forEach(id => {
            if (id > 0) {
              this.requestService.saveTasksList.push(
                {
                  id: new Date().getTime(),
                  task: this.requestService.deleteOrderConclusion(id)
                }
              );
            }
          });
          this.requestService.device.order.conclusions =
            this.requestService.device.order.conclusions.filter(conclusion => this.checkedConclusions.indexOf(conclusion.id) === -1);
          this.checkedConclusions = [];
        },
        close: () => {
        }
      };

      this.dialog.open(ConfirmDialogComponent, dialogConfig);
    }
  }

  updateConclusion(conclusionId: number, conclusion: OrderConclusion) {
    this.requestService.saveTasksList.push(
      {
        id: new Date().getTime(),
        task: this.requestService.updateOrderConclusions(conclusionId, conclusion)
      }
    );
  }

  addFileToCheck(fileId: number) {
    if (this.checkedFiles.indexOf(fileId) > -1) {
      this.checkedFiles.splice(this.checkedFiles.indexOf(fileId), 1);
    } else {
      this.checkedFiles.push(fileId);
    }
  }

  checkAllFiles() {
    if (this.checkedFiles.length === this.requestService.device.order.files.length) {
      this.checkedFiles = [];
    } else {
      this.checkedFiles = [];
      this.checkedFiles = this.requestService.device.order.files.map(file => file.id);
    }
  }

  deleteFiles() {
    if (this.checkedFiles.length > 0) {
      const dialogConfig = new MatDialogConfig();

      dialogConfig.data = {
        title: this.translate.instant('service.modal.sure_delete_files', {count: this.checkedFiles.length}),
        confirm: () => {
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.checkedFiles.length; i++) {
            const fileToDelete = this.requestService.device.order.files.find(file => file.id === this.checkedFiles[i]);
            this.requestService.deleteOrderFile(fileToDelete.filename).subscribe();
          }
          this.requestService.device.order.files =
            this.requestService.device.order.files.filter(file => this.checkedFiles.indexOf(file.id) === -1);
          this.checkedFiles = [];
        },
        close: () => {
        }
      };

      this.dialog.open(ConfirmDialogComponent, dialogConfig);
    }
  }
}
