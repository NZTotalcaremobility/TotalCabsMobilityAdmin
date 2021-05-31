import { Injectable } from '@angular/core';
import { environment  } from "../../environments/environment";
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private http: HttpClient,
    private router: Router,) { }

    getAllCoverJob(): Observable<any> {
      const uri = environment.api_url + 'AdminGetAllCoverJob';
      return this.http.post(uri,{});
    }
    getCabList(): Observable<any> {
      const url = environment.api_url + 'adminGetDespatchJobs';
      return this.http.post(url, {});
    }
   
    getAllOngoingJob(): Observable<any> {
      const uri = environment.api_url + 'adminGetAllOngoingJob';
      return this.http.post(uri,{});
    }
    getAllCompletedJob(): Observable<any> {
      const uri = environment.api_url + 'AdminGetAllCompletedJob';
      return this.http.post(uri,{});
    }

    getUserById(data): Observable<any> {
      console.log(data);
      const uri = environment.api_url + 'adminGetCustomerByid';
      return this.http.post(uri,data);
    }
    asignJobs(data): Observable<any> {
      console.log(data);
      const uri = environment.api_url + 'adminRiderequest';
      return this.http.post(uri,data);
    }
    deleteJob(id): Observable<any> {
      console.log("ser", id);
      const uri = environment.api_url + 'adminDeleteDispatchJob';
      return this.http.post(uri, id);
    }
    editjob(id): Observable<any> {
      console.log("ser", id);
      const uri = environment.api_url + 'adminDeleteDispatchJob';
      return this.http.post(uri, id);
    }
    getAlldriver(): Observable<any> {
      const url = environment.api_url + 'adminGetDriver';
      return this.http.post(url, {});
    }
    getAlluser(): Observable<any> {
      const uri = environment.api_url + 'adminGetCustomer';
      return this.http.post(uri,{});
    }
    coverJob(data): Observable<any> {
      //console.log("hittd",data);
      
      const url = environment.api_url + 'coverJob';
      return this.http.post(url, data);
    }
  
}
