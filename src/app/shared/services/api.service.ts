import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { JwtService } from './jwt.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
   
  constructor(private http: HttpClient,
    private jwtService: JwtService,
    private toastr: ToastrService,
    private router: Router) { }

  private user = new BehaviorSubject<any>({ name: 'Admin' });
  private updateRoute = new Subject<any>();
  public myUser = this.user.asObservable();
  public myUpdateRoute = this.updateRoute.asObservable();
  getUserData(): Observable<any> {
    return this.user.asObservable();
  }
  sendUserData(data) {
    this.user.next(data);
  }

  getRouteUpdate(): Observable<any> {
    return this.updateRoute.asObservable();
  }

  sendRouteUpdate(data) {
    this.updateRoute.next(data);
  }

  sendError(err: string) {
    this.toastr.error(err);
  }
  formatErrors(error: any) {
    console.log(error, 'err got here ++++');
    let errorText = '';
    if (error.error && error.error.error) {
      errorText = error.error.error;
    } else if (error.statusText === 'Unknown Error' || error.statusText === 'Not Found') {
      errorText = 'Something went wrong try again';
    }
    if (error.status === 401) {
      errorText = 'Session expire, Please login again.';
    }
    this.sendError(errorText);
    if (error.status === 401) {
      this.jwtService.logoutUser();
      this.router.navigate(['/login']);
    }
    return throwError(error.error);
  }
  private setHeaders(headers: any = {}): HttpHeaders {
    return new HttpHeaders(headers);
  }

  get(path: string, headers: Object = {}): Observable<any> {
    return this.http.get(`${environment.api_url}${path}`, { headers: this.setHeaders(headers) })
      .pipe(catchError((err) => this.formatErrors(err)));
  }

  put(path: string, body: Object = {}, headers: Object = {}): Observable<any> {
    return this.http.put(
      `${environment.api_url}${path}`,
      body, { headers: this.setHeaders(headers) }
    ).pipe(catchError((err) => this.formatErrors(err)));
  }

  post(path: string, body: Object = {}): Observable<any> {
    return this.http.post(
      `${environment.api_url}${path}`,
      body
    ).pipe(catchError((err) => this.formatErrors(err)));
  }

  delete(path): Observable<any> {
    return this.http.delete(
      `${environment.api_url}${path}`
    ).pipe(catchError((err) => this.formatErrors(err)));
  }
}
