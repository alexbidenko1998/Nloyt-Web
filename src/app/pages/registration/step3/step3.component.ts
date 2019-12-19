import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.css']
})
export class Step3Component implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  addDevice() {
    // @ts-ignore
    fetch('http://194.182.85.89/api/service/device/' + document.getElementById('devicePin').value, {
      method: 'GET',
      mode: 'cors',
      headers: {
        Authorization: localStorage.getItem('userToken')
      }
    }).then(response => response.json()).then(data => {
      if (data.success) {
        this.router.navigateByUrl('registration/4');
      } else if (data.error.code === 400) {
        alert('Устройство уже добавлено Вами');
      } else if (data.error.code === 403) {
        alert('Устройство уже добавлено другим СЦ');
      } else {
        this.router.navigateByUrl('/');
      }
    });
  }
}
