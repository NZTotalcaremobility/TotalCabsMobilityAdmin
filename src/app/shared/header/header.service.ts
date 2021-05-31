import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment  } from "../../../environments/environment";
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }
  showMessageNotification(): Observable<any> {
    const uri = environment.api_url + 'admin/showMessageNotification';
    return this.http.post(uri,{});
  }

  showSystemNotification(): Observable<any> {
    const uri = environment.api_url + 'admin/showSystemNotification';
    return this.http.post(uri,{});
  }
}
