import { FormGroup, FormControl } from '@angular/forms';
import { AppService } from './../../app.service';
import { Router } from '@angular/router';
import { JwtService } from './../services/jwt.service';
import { HeaderService } from '../header/header.service'
import { Component, OnInit, HostListener, Input } from '@angular/core';
import $ from 'jquery';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  image_url: any;
  searchField = false;
  toggleBodyClass = false;
  time: any;
  searchResult: any = [];
  imagePath: String = environment.imageurl

  searchForm = new FormGroup({
    string: new FormControl(''),
  });
  id: Object;

  @Input() public permissionList: Array<any> = [];
  @Input() public role: String = '';
  @Input() public currentuser: any = [];
  temp: any;
  msgLenth: any;
  tempData: any;
  notiLenth: any;
  notificationId: any;

  constructor(private jwtService: JwtService,
    private service: HeaderService,
    private router: Router,
    private api: AppService) {
  }


  public get width() {
    return window.innerWidth;
  }


  ngOnInit(): void {
    this.image_url = `${environment.imageurl}`;
    this.setWindowClass();
    setInterval(() => {
      this.showMessageNotification();
      this.showSystemNotification();
       }, 10000)
     
 
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setWindowClass();
  }

  toggleSidebar() {
    let body = document.getElementsByTagName('body')[0];
    if (!this.toggleBodyClass) {
      body.classList.add('mini-sidebar');
    } else {
      body.classList.remove('mini-sidebar');
    }
    this.toggleBodyClass = !this.toggleBodyClass
  }

  setWindowClass() {
    var width = window.innerWidth;
    var topOffset = 70;
    let body = document.getElementsByTagName('body')[0];
    if (width < 1170) {
      body.classList.add("mini-sidebar");
      $('.navbar-brand span').hide();
      $(".sidebartoggler i").addClass("ti-menu");
    } else {
      body.classList.remove("mini-sidebar");
      $('.navbar-brand span').show();
    }

    var height = window.innerHeight - 1;
    height = height - topOffset;
    if (height < 1) height = 1;
    if (height > topOffset) {
      $(".page-wrapper").css("min-height", (height) + "px");
    }

  };
  Edit(_id, type, userId) {
    console.log("hhhhh", _id, type, userId);
    this.id = _id
   // this.markRead(this.id)
    this.api.callApi(`${environment.backendBaseURL}/api/notificationMarkRead`, 'POST', { _id: this.id }, {}).subscribe(res => {
      console.log('final------', res);
    
    });
    localStorage.setItem("currentId",_id);
    // this.navRoute.navigate(['/user/page/recipt'], { queryParams: { userId: _id } });
    this.router.navigate(['/chat/'], { queryParams: { type: type, userId: userId } });
  }
  logout() {
    this.jwtService.logoutUser();
  }
  showMessageNotification() {
    this.service.showMessageNotification().subscribe(res => {
      if (res) {
        console.log("in res notification ---",res);
        
        this.temp = res.data
        this.msgLenth = res.data.length;

      } else {
        console.log('Error');

      }
    }
    );
  }

  showSystemNotification() {
    this.service.showSystemNotification().subscribe(res => {
      console.log("notification res--",res);
      
      if (res.code === 200) {
        const finalData = [];
        if (res.data.length > 0) {
          res.data.forEach((value, index) => {
            if (value.message.search('CoverJob request') > 0) {
              res.data[index]['msgType'] = 'jobs/cover';
            } else if (value.message.search('dispatchJob request') > 0) {
              res.data[index]['msgType'] = 'jobs';
            }
          });
        }
        this.tempData = res.data;
        this.notiLenth = res.data.length;
        console.log('Notifications ---- ', res.data);
      }
    });
  }

  handleSearch() {
    const params = { name: this.searchForm.value.string }
    clearTimeout(this.time);
    this.time = setTimeout(() => {
      this.api.callApi(`${environment.backendBaseURL}/api/admin/user`, "POST", {}, { params }).subscribe(res => {
        console.log('final', res['data'])
        let result = res['data'];
        console.log("rsult--", result);

        if (result.status) {
          this.searchResult = result.data
        }
      })
    }, 250);
  }

  markRead(id,type, userId,jobid){
    console.log('id-----', id,type,userId,jobid);

    this.notificationId = id
    this.api.callApi(`${environment.backendBaseURL}/api/notificationMarkRead`, 'POST', { _id: id }, {}).subscribe(res => {
      console.log('final------', res);
     
    });
    this.router.navigate(['/viewNotification/'], { queryParams: { type: type, userId: userId, jobid: jobid } });
    this.notificationView();
  }
  notificationView(){
    console.log("notification---",this.notificationId);
    
  }
}
