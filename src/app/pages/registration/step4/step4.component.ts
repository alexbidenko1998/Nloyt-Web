import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
declare var $;

@Component({
  selector: 'app-step4',
  templateUrl: './step4.component.html',
  styleUrls: ['./step4.component.css']
})
export class Step4Component implements OnInit {

  services = [{}];

  constructor(
    public router: Router
  ) { }

  ngOnInit() {
  }

  cloneNewRow() {
    this.services.push({});
  }

  removeRow() {
    this.services.splice(this.services.length - 1, 1);
  }
}
