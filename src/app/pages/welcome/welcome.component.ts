import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthorizationService} from '../../services/authorization.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  email: string;
  password: string;

  constructor(
    private router: Router,
    private authorizationService: AuthorizationService
  ) { }

  ngOnInit() {}

  singIn() {
    if (this.email && this.password) {
      this.authorizationService.login({
        email: this.email,
        password: this.password
      }).subscribe(data => {
        if (data.success) {
          localStorage.setItem('userData', JSON.stringify(data.data));
          localStorage.setItem('userId', data.data.id);
          localStorage.setItem('userToken', data.data.token);
          localStorage.setItem('service', JSON.stringify(data.data.service));

          this.router.navigateByUrl('service/notifications').then();
        } else {
          alert('Неверные логин или пароль');
        }
      });
    }
  }
}
