import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DispachService {

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }
  getAlldriver(): Observable<any> {
    const url = environment.api_url + 'adminGetDriver';
    return this.http.post(url, {});
  }
  getAlluser(): Observable<any> {
    const uri = environment.api_url + 'adminGetCustomer';
    return this.http.post(uri,{});
  }
  getUserById(data): Observable<any> {
    console.log(data);
    const uri = environment.api_url + 'adminGetCustomerByid';
    return this.http.post(uri,data);
  }
  
  addDespatchJob(data):Observable<any> {
    console.log("data",data);
    
    const url = environment.api_url + 'adminAddDespatchJobs';
    return this.http.post(url, data);
  }
  getCurrentData(id): Observable<any> {
    const url = environment.api_url + 'adminGetDriverByid';
    return this.http.post(url, id);
  }
  getCabList(): Observable<any> {
    const url = environment.api_url + 'adminGetDespatchJobs';
    return this.http.post(url, {});
  }
  
  deleteJob(id): Observable<any> {
    console.log("ser", id);
    const uri = environment.api_url + 'adminDeleteDispatchJob';
    return this.http.post(uri, id);
  }
  editJob(id): Observable<any> {
    console.log("ser", id);
    const uri = environment.api_url + 'adminGetCoverJob';
    return this.http.post(uri, id);
  }


  

}
