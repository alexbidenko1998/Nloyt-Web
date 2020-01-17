import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Nloyt-Web';

  constructor(private translate: TranslateService) {
    if (localStorage.getItem('defaultLang')) {
      translate.setDefaultLang(localStorage.getItem('defaultLang'));
    } else {
      switch (window.navigator.language ||
      // @ts-ignore
      window.navigator.systemLanguage || window.navigator.userLanguage) {
        case 'en-US':
          translate.setDefaultLang('en-US');
          break;
        case 'ru-RU':
          translate.setDefaultLang('ru-RU');
          break;
        default:
          translate.setDefaultLang('en-US');
      }
    }
  }
}
