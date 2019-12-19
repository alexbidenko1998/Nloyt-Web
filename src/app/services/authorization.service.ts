import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor(
    private httpClient: HttpClient,
    @Inject('BASE_URL') private baseUrl: string
  ) { }

  login(body: {email: string, password: string}): Observable<any> {
    return this.httpClient.post(this.baseUrl + 'api/admin/login', body);
  }
}
