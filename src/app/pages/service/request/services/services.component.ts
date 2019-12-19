import { Component, OnInit } from '@angular/core';
import {RequestService} from '../request.service';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {ConfirmDialogComponent} from '../../../../ui/modals/confirm-dialog/confirm-dialog.component';
import {ServiceService} from '../../../../services/service.service';

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

  conclusionsColumns = ['checkbox', 'conclusion', 'risk'];
  checkedConclusions: number[] = [];
  isRedactConclusion = false;
  newConclusion = {text: '', risk: 1};

  filesColumns = ['checkbox', 'file', 'uploadDate'];
  checkedFiles: number[] = [];

  constructor(
    public requestService: RequestService,
    public serviceService: ServiceService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  addConclusionToCheck(conclusionId: number) {
    if (this.checkedConclusions.indexOf(conclusionId) > -1) {
      this.checkedConclusions.splice(this.checkedConclusions.indexOf(conclusionId), 1);
    } else {
      this.checkedConclusions.push(conclusionId);
    }
  }

  saveConclusion() {
    if (this.newConclusion.text) {
      this.requestService.addOrderConclusions(this.requestService.orderId, this.newConclusion).subscribe(result => {
        this.requestService.device.order.conclusions.push(result.data);
        this.isRedactConclusion = false;
        this.newConclusion.text = '';
        this.newConclusion.risk = 1;
      });
    } else {
      this.isRedactConclusion = false;
      this.newConclusion.risk = 1;
    }
  }

  deleteConclusions() {
    if (this.checkedConclusions) {
      const dialogConfig = new MatDialogConfig();

      dialogConfig.data = {
        title: 'Are you sure want to delete ' + this.checkedConclusions.length + ' conclusions?',
        confirm: () => {
          this.checkedConclusions.forEach(id => {
            this.requestService.deleteOrderConclusion(id).subscribe();
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
    if (this.checkedFiles) {
      const dialogConfig = new MatDialogConfig();

      dialogConfig.data = {
        title: 'Are you sure want to delete ' + this.checkedFiles.length + ' files?',
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
