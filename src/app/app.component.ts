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
    translate.setDefaultLang(localStorage.getItem('defaultLang') || window.navigator.language ||
      // @ts-ignore
      window.navigator.systemLanguage || window.navigator.userLanguage);
  }
}
