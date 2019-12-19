import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
declare var $;

@Component({
  selector: 'app-step8',
  templateUrl: './step8.component.html',
  styleUrls: ['./step8.component.css']
})
export class Step8Component implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  sendPurchase() {
    fetch('http://194.182.85.89/api/admin/purchase', {
      method: 'POST',
      mode: 'cors',
      headers: {
        Authorization: localStorage.getItem('userToken'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        gleemCount1: $('input[name=gleemCount1]').val(),
        gleemCount2: $('input[name=gleemCount2]').val(),
        address: $('input[name=address]').val(),
        payType: $('input[name=payType]').val()
      })
    }).then(response => response.json()).then(() => {
      alert('Покупка успешно оформлена');
      this.router.navigateByUrl('/service/notifications').then();
    });
  }
}
