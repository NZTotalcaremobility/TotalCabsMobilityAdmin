import { NgxSpinnerService } from 'ngx-spinner';
import { AppService } from './../../app.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  filter: boolean = true;

  userTab = 'timeline';
  userId: any;
  objData: any;
  name: any;
  phonenumber: any;
  email: any;
  // lastName: any;
  dob: any;
  street: any;
  city: any;
  state: any;
  postcode: any;
  country: any;
  userType: any;
  carBrand: any;
  carType: any;
  carFuelType: any;
  licenseNo: any;
  carRegNo: any;
  carModel: any;
  licenseValid: any;
  carOwner: any;
  licenseFornt: any;
  licenseBcak: any;
  rcFront: any;
  rcBcak: any;
  imagefile: any;
  keyStatus: any
  constructor(
    private service: UserService,
    private fb: FormBuilder,
    private navRoute: Router,
    private route: ActivatedRoute,
    private api: AppService,
    private http: HttpClient,
    private _toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'];
      console.log("userId", this.userId);

    });

  }

  ngOnInit(): void {
    this.getUserById();
  }




  getUserById() {
    let _id = { _id: this.userId };
    console.log("obj", _id);
    this.service.getUserById(_id).subscribe(res => {
      console.log("useres--",res);
      
      if (res && res.code == 200) {
        this.objData = res.data.data;
        this.name = res.data.name;
        // this.lastName = res.data.data.lastName;
        this.email = res.data.email;
        this.phonenumber = res.data.phonenumber;
        this.dob = res.data.dob;
        this.street = res.data.street;
        this.city = res.data.city;
        this.state = res.data.state;
        this.postcode = res.data.postcode;
        this.country = res.data.country;
        this.userType = res.data.userType;
        this.carBrand = res.data.carBrand;
        this.carType = res.data.carType;
        this.carFuelType = res.data.carFuelType;
        this.carModel = res.data.carModel;
        this.carRegNo = res.data.carRegNo;
        this.licenseNo = res.data.licenseNo;
        this.licenseValid = res.data.licenseValid;
        this.carOwner = res.data.carOwner;
        this.licenseFornt = res.data?.documents?.dlFront;
        this.licenseBcak = res.data?.documents?.dlBack;
        this.rcFront = res.data?.documents?.rcFront;
        this.rcBcak = res.data?.documents?.rcBack;
        this.imagefile = `${environment.imageurl}${res.data.imagefile}`;
        this.keyStatus = res.data.keyStatus
        console.log('gjer', this.keyStatus)
      } else {
        this._toastr.info("Error", "Driver");
      }
    });
  }

  toggleKey() {
    console.log('aaaa',this.userId)
    this.keyStatus = !this.keyStatus
    this.spinner.show();
    this.api.callApi(`${environment.backendBaseURL}/api/admin/user/${this.userId}/updateKeyStatus`, 'POST', { keyStatus: this.keyStatus,userId:this.userId }, {}).subscribe(res => {
      this.spinner.hide();
      if (res['code'] === 200) {
        this._toastr.success(res['message'])
      } else {
        this._toastr.error(res['message'])
      }
    })
  }
}
