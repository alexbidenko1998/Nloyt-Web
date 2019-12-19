import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {RouterModule, Routes} from '@angular/router';
import { NotificationsComponent } from './pages/service/notifications/notifications.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Step1Component } from './pages/registration/step1/step1.component';
import { Step2Component } from './pages/registration/step2/step2.component';
import { Step3Component } from './pages/registration/step3/step3.component';
import { Step4Component } from './pages/registration/step4/step4.component';
import { Step5Component } from './pages/registration/step5/step5.component';
import { Step6Component } from './pages/registration/step6/step6.component';
import { Step7Component } from './pages/registration/step7/step7.component';
import { Step8Component } from './pages/registration/step8/step8.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { TopBarComponent } from './ui/top-bar/top-bar.component';
import { OrdersComponent } from './pages/service/orders/orders.component';
import { ServiceComponent } from './pages/service/service.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RequestComponent } from './pages/service/request/request.component';
import {
  MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule, MatNativeDateModule, MatRadioModule,
  MatRippleModule, MatSelectModule,
  MatTableModule
} from '@angular/material';
import { StatusComponent } from './ui/status/status.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { PasswordComponent } from './pages/employee/password/password.component';
import { VehicleComponent } from './pages/service/request/vehicle/vehicle.component';
import { ConfirmDialogComponent } from './ui/modals/confirm-dialog/confirm-dialog.component';
import { ResultDialogComponent } from './ui/modals/result-dialog/result-dialog.component';
import { ServicesComponent } from './pages/service/request/services/services.component';
import { CustomerComponent } from './pages/service/request/customer/customer.component';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { LangDialogComponent } from './ui/modals/lang-dialog/lang-dialog.component';
import { DownloadListDialogComponent } from './ui/modals/download-list-dialog/download-list-dialog.component';

const appRoutes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'service', component: ServiceComponent,
    children: [
      { path: 'notifications', component: NotificationsComponent },
      { path: 'orders', component: OrdersComponent},
      { path: 'orders/:orderId/request', component: RequestComponent,
        children: [
          { path: '', redirectTo: 'services', pathMatch: 'full' },
          { path: 'services', component: ServicesComponent},
          { path: 'vehicle', component: VehicleComponent },
          { path: 'customer', component: CustomerComponent }
        ]
      }
    ]
  },
  { path: 'registration', component: RegistrationComponent,
    children: [
      { path: '1', component: Step1Component },
      { path: '2', component: Step2Component },
      { path: '3', component: Step3Component },
      { path: '4', component: Step4Component },
      { path: '5', component: Step5Component },
      { path: '6', component: Step6Component },
      { path: '7', component: Step7Component },
      { path: '8', component: Step8Component }
    ]
  },
  { path: 'employee/password', component: PasswordComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NotificationsComponent,
    WelcomeComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component,
    Step5Component,
    Step6Component,
    Step7Component,
    Step8Component,
    RegistrationComponent,
    TopBarComponent,
    OrdersComponent,
    ServiceComponent,
    RequestComponent,
    StatusComponent,
    PasswordComponent,
    VehicleComponent,
    ConfirmDialogComponent,
    ResultDialogComponent,
    ServicesComponent,
    CustomerComponent,
    LangDialogComponent,
    DownloadListDialogComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatRippleModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatSelectModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MatRadioModule
  ],
  providers: [
    { provide: 'BASE_URL', useValue: 'http://194.182.85.89/' }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ConfirmDialogComponent,
    LangDialogComponent,
    ResultDialogComponent,
    DownloadListDialogComponent
  ]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
