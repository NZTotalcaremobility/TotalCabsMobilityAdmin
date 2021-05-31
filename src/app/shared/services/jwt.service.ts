import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor() { }
  getToken(): String {
    return window.localStorage['token'];
  }
  saveToken(token: String, role:String) {
    window.localStorage['token'] = token;
    window.localStorage['role'] = role;
  }
  setIsLogin() {
    localStorage.setItem('isLoggedin', 'true');
  }
  destroyToken() {
    window.localStorage.removeItem('token');
  }
  logoutUser() {
    this.destroyToken();
    localStorage.removeItem('isLoggedin');
    localStorage.removeItem('tca');
  }
}
