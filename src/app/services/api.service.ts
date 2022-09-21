import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  public getDateTime(): Observable<any> {
    return this.http.get(environment.apiHost + '/datetime');
  }

  public getAllMessages(page = 1): Observable<any> {
    let parms = new HttpParams().set("page", String(page));

    return this.http.get(environment.apiHost + '/messages/', { params: parms });
  }

  public storeNewMessage(message): Observable<any> {
    return this.http.post(environment.apiHost + '/messages/store', { message });
  }
}
