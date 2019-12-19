import { Component, OnInit } from '@angular/core';
import {RequestService} from '../request.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  isShowFirstTable = true;
  isShowSecondTable = true;

  constructor(
    public requestService: RequestService
  ) { }

  ngOnInit() {
  }

}
