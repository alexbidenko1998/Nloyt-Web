import { Component, OnInit } from '@angular/core';
import {RequestService} from '../request.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  isShowTable = {
    requester: true,
    driver: true,
    owner: true
  };

  constructor(
    public requestService: RequestService
  ) { }

  ngOnInit() {
  }

}
