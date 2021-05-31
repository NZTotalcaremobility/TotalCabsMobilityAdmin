import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import io from "socket.io-client";
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../user/user.service';
import { environment } from './../../environments/environment';
import { DriverServiceService } from './../driver/driver-service.service';
import { MessageService } from './../message.service';
import * as moment from 'moment';
import $ from 'jquery';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})

export class MessageComponent implements OnInit {
  // @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  socket;
  message: string;
  messageArray: any;
  search = '';
  timeout = null;
  show = false;

  paramsData: any;
  currentUser: any;
  selectedUser: any;
  imageUrl = `${environment.imageurl}`;
  filter: boolean = false;
  driverList: any;
  driverData: any;
  userList: any;
  userData: any;
  // currentId: string;

  constructor(
    private route: ActivatedRoute,
    private userservice: UserService,
    private driverservice: DriverServiceService,
    private toastr: ToastrService,
    private msgService: MessageService,
  ) {
    this.msgService.newMessageRecevied()
      .subscribe(data => {
        this.messageArray.push({
          sender: { _id: data.senderid },
          receiver: { _id: data.receiverid },
          message: data.message,
        })
      })
    //this.messageArray.sort()
    this.route.queryParams.subscribe(params => {
      this.paramsData = { type: params['type'], userId: params['userId'] };
      if (params.type === 'Normal') this.filter = true;
      if (this.driverList && this.userList) {
        if (this.paramsData && this.paramsData.type === 'Normal') {
          const result = this.userData.find(({ _id }) => _id === this.paramsData.userId);
          this.changeUser(result._id, result.name);
        } else if (this.paramsData && this.paramsData.type === 'Driver') {
          const result = this.driverData.find(({ _id }) => _id === this.paramsData.userId);
          this.changeUser(result._id, result.name);
        } else {
          this.changeUser(this.driverList[0]._id, this.driverList[0].name);
        }
      }
    });


  }

  ngOnInit(): void {
    this.currentUser = {
      _id: localStorage.getItem('cuserid'),
      name: localStorage.getItem('cusername'),
      image: localStorage.getItem('cuserimg')
    }
    // this.currentId = localStorage.getItem('currentId')
    this.getInitialData();
    console.log("imge",this.currentUser.image);
    
  }

  async getInitialData() {
    this.driverList = await this.getDriverList();
    this.driverData = this.driverList;
    console.log('driverList----------', this.driverList);
    this.userList = await this.getCustomerList();
    this.userData = this.userList;
    console.log('customerList----------', this.userList);

    if (this.paramsData && this.paramsData.type === 'Normal') {
      const result = this.userData.find(({ _id }) => _id === this.paramsData.userId);
      this.changeUser(result._id, result.name);
    } else if (this.paramsData && this.paramsData.type === 'Driver') {
      const result = this.driverData.find(({ _id }) => _id === this.paramsData.userId);
      this.changeUser(result._id, result.name);
    } else {
      this.changeUser(this.driverList[0]._id, this.driverList[0].name);
    }
  }

  getDriverList() {
    return new Promise(resolve => {
      this.driverservice.getAlldriver().subscribe(res => {
        if (res && res.code === 200 && res.data && res.data.length > 0) {
          console.log("in driver");
          
          resolve(res.data);
        } else {
          resolve([]);
        }
      });
    });
  }

  getCustomerList() {
    return new Promise(resolve => {
      this.userservice.getAlluser().subscribe(res => {
        if (res && res.code === 200 && res.data && res.data.length > 0) {
          resolve(res.data);
        } else {
          resolve([]);
        }
      });
    });
  }

  filterData() {
    this.filter = !this.filter; // this will change value of it true and false

    if (this.filter) {
      this.changeUser(this.userList[0]._id, this.userList[0].name);
    } else {
      this.changeUser(this.driverList[0]._id, this.driverList[0].name);
    }
  }

  sendMessage() {
    const data = {
      sender: this.currentUser._id,
      receiver: this.selectedUser._id,
      message: this.message
    }
    const latestMessage = {
      created_on: moment().toISOString(),
      image: this.currentUser.image,
      message: this.message,
      receiver: { _id: this.selectedUser._id, name: this.selectedUser.name },
      receiverStatus: true,
      sender: { _id: this.currentUser._id, name: this.currentUser.name },
      senderStatus: true
    }
    this.messageArray.push(latestMessage);
    setTimeout(this.scrollToBottom, 500);
    this.msgService.sendMessage(data);
    this.message = '';
  }

  changeUser(id, name) {
    console.log({ id }, { name })
    $('#msgloader').css({ 'display': 'block' });
    this.messageArray = [];
    this.selectedUser = {
      _id: id,
      name: name
    };
    console.log('ChangeUser---', id);
    const data = {
      sender: this.currentUser._id,
      receiver: id,
      page: "1",
      limit: "10"
    }
    this.getMessage(data);
  }

  getMessage(data) {
    this.msgService.getMessage(data).subscribe(res => {
      console.log('res-data+++++++++++++++++++----', res);
      if (res && res.code === 200) {
        const sortedMessage = res.data.sort((x, y) => +new Date(x.created_on) - +new Date(y.created_on));
        this.messageArray = sortedMessage;
      //  console.log("recever pic ---",this.messageArray[0].receiver.imagefile);
        

        $('#msgloader').css({ 'display': 'none' });
        setTimeout(this.scrollToBottom, 500);
      }
    });
  }

  scrollToBottom() {
    var height = 0;
    $('.msgli').each(function (i, value) {
      height += parseInt($(this).height());
    });
    // console.log('Scroll-----', height);
    $('.chat-list').animate({ scrollTop: height });
  }

  searchFunc(val) {
    // console.log('searchVal---', val);
    this.search = val;
    if (val != '') {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.show = true
        this.fetchResults(this.search, 10);
      }, 500);
    } else {
      this.driverList = this.driverData;
      this.userList = this.userData;
    }
  }

  fetchResults(symbol, count) {
    if (!symbol) this.hide();

    if (this.filter) {
      let filteredData = [];
      this.userData.forEach(function (result) {
        const txtValue = result.name;
        if (txtValue.toLowerCase().indexOf(symbol.toLowerCase()) > -1) {
          filteredData.push(result);
        }
      });
      this.userList = filteredData;
    } else {
      let filteredData = [];
      this.driverData.forEach(function (result) {
        const txtValue = result.name;
        if (txtValue.toLowerCase().indexOf(symbol.toLowerCase()) > -1) {
          filteredData.push(result);
        }
      });
      this.driverList = filteredData;
    }

  }

  hide() {
    this.show = false
  }

}
