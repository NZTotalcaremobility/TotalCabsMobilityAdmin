import { Router } from '@angular/router';
import { AppService } from './../../app.service';
import { JwtService } from './../services/jwt.service';
import { AppComponent } from './../../app.component';
import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  // currentuser = ''
  // permissionList: any = [];
  // role = ''

  @Input() public permissionList: Array<any> = [];
  @Input() public role: String = '';
  @Input() public currentuser: any = [];

  constructor(
  ) {
  }



  ngOnInit(): void {
  }

}
