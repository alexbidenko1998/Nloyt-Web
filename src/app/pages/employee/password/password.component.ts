import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {

  password: string;
  repeatPassword: string;

  getParams: any = window
    .location
    .search
    .replace('?', '')
    .split('&')
    .reduce(
      (p, e) => {
        const a = e.split('=');
        p[decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
        return p;
      },
      {}
    );

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  confirmPassword() {
    if (this.password !== this.repeatPassword) {
      alert('Not confirm password');
    } else {
      fetch('http://194.182.85.89/api/employee/password', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Password-Key': this.getParams.key,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({password: this.password})
      }).then(response => response.json()).then(data => {
        if (data.success) {
          localStorage.setItem('userToken', data.data.token);
          localStorage.setItem('service', JSON.stringify(data.data.service));

          alert('Password creating success');
          this.router.navigateByUrl('/service/notifications').then();
        } else {
          alert(JSON.stringify(data.error));
        }
      });
    }
  }
}
