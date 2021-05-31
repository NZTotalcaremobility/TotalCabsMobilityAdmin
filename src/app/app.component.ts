import { JwtService } from './shared/services/jwt.service';
import { environment } from 'src/environments/environment';
import { AppService } from './app.service';
import { Component, OnInit, HostListener, Input } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'totalcab-admin';
  preloader = true;
  miniHeight: number = 2;
  currentUrl: any;
  freeRoutes: any = ['/login', '/calculateFare', '/forgotPassword', '/resetPassword', '/verifyAccount'];

  currentuser = ''
  permissionList: any = [];
  role = ''


  constructor(
    private router: Router,
    private jwtService: JwtService,
    private api: AppService
  ) {
    this.getCurrentuser()
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        //  console.log("current url",event.url); // event.url has current url

        this.currentUrl = `/${event.url.split('/')[1]}`;
       // console.log("currenturl", this.currentUrl);
      }
    });
  }

  ngOnInit(): void {
    this.setMiniHeight();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setMiniHeight();
  }

  preloaderToggle() {
    setTimeout(function () {
      return false;
    }, 7000)
  }

  setMiniHeight() {
    this.miniHeight = window.innerHeight - 56;
    console.log(this.miniHeight);
  }

  getCurrentuser() {
    let option = {
      headers: {
        Authorization: `${this.jwtService.getToken()}`
      }
    }

    this.api.callApi(`${environment.backendBaseURL}/api/currentUser`, "POST", {}, option).subscribe(res => {
      if (res['code'] !== 200) {
        this.jwtService.logoutUser();
        return this.router.navigate(['/login'])
      } else {
        this.jwtService.setIsLogin();
        localStorage.setItem('tca', JSON.stringify({ ...res['data'], imagefile: `${environment.imageurl}${res['data'].imagefile}` }));
        this.currentuser = { ...res['data'], imagefile: `${environment.imageurl}${res['data'].imagefile}` };
        this.role = res['data'].userType;
        this.permissionList = res['data'].permissions;
        if (res['data'].userType !== 'Admin') {
          if (this.freeRoutes.includes(this.currentUrl)) {
            this.router.navigate([`/${res['data'].permissions[0]}`])
          }
          this.router.navigate([`/${res['data'].permissions[0]}`])
        }
      }
    })
  }
}
