import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DriverServiceService {


  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }


  getAlldriver(): Observable<any> {
    const url = environment.api_url + 'adminGetDriver';
    return this.http.post(url, {});
  }

  addDriver(data): Observable<any> {
    const url = environment.api_url + 'adminAddDriver';
    return this.http.post(url, data);
  }

  getReviewAndRating(data): Observable<any> {
    const url = environment.api_url + 'getReviewAndRating';
    return this.http.post(url, data);
  }
  deleteDriver(id): Observable<any> {
    console.log("ser", id);
    const url = environment.api_url + 'adminDeleteDriver';
    return this.http.post(url, id);
  }
  blockUser(id): Observable<any> {
    console.log("ser", id);
    const url = environment.api_url + 'adminBlockDriver';
    return this.http.post(url, id);
  }

  getCurrentData(id): Observable<any> {
    const url = environment.api_url + 'adminGetDriverByid';
    return this.http.post(url, id);
  }

  // getCurrentData(id): Observable<any> {
  //   const url = environment.api_url + 'adminGetDriverByIdWithReview';
  //   return this.http.post(url, id);
  // }
  
  updatedriverdetails(data):Observable<any> {

    const url = environment.api_url + 'adminUpdateDriver';
    return this
      .http
      .post(url,data);
  }














}
