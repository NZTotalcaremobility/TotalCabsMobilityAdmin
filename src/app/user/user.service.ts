import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
providedIn: 'root'
})
export class UserService {

constructor(private http: HttpClient,
private router: Router,) { }

getAlluser(): Observable<any> {
const uri = environment.api_url + 'adminGetCustomer';
return this.http.post(uri,{});
}
getAllcomuser(): Observable<any> {
  const uri = environment.api_url + 'CompanyUserList';
  return this.http.post(uri,{});
  }
getCurrentData(id): Observable<any> {
  const url = environment.api_url + 'adminGetDriverByid';
  return this.http.post(url, id);
}

getAlldriver1(): Observable<any> {
  const url = environment.api_url + 'getAlldriver1';
  return this.http.post(url, {});
}
coverJob(data): Observable<any> {
  //console.log("hittd",data);
  
  const url = environment.api_url + 'coverJob';
  return this.http.post(url, data);
}
deleteUser(id): Observable<any> {
//console.log("ser", id);
const uri = environment.api_url + 'adminDeleteUser';
return this.http.post(uri, id);
}

addUser(data): Observable<any> {
const uri = environment.api_url + 'adminAddCustomer';
return this.http.post(uri, data);
}
addCompanyUser(data): Observable<any> {
  const uri = environment.api_url + 'adminAddCompanyUser';
  return this.http.post(uri, data);
  }
editUser(data): Observable<any> {
const uri = environment.api_url + 'adminUpdateCustomer';
return this.http.post(uri, data);
}
editcompanyuser(data): Observable<any> {
  const uri = environment.api_url + 'UpdatecompanyCustomer';
  return this.http.post(uri, data);
  }
  

getUserById(id): Observable<any> {
console.log(id);
const uri = environment.api_url + 'adminGetCustomerByid';
return this.http.post(uri,id);
}
adminGetJobByid(id): Observable<any> {
  console.log(id);
  const uri = environment.api_url + 'adminGetJobByid';
  return this.http.post(uri,id);
  }
messageList(data): Observable<any> {
console.log("service data--",data);
const uri = environment.api_url + 'message_list';
return this.http.post(uri,data);
}
messageHistory(data): Observable<any> {
console.log(data);
const uri = environment.api_url + 'message_history';
return this.http.post(uri,data);
}
getDistence(data):Observable<any>{
const uri = environment.api_url + 'adminGetDistance';
return this.http.post(uri,data);
}

block(id): Observable<any> {
console.log("ser", id);
const url = environment.api_url + 'adminBlockDriver';
return this.http.post(url, id);
}
}