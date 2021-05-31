import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { JwtService } from './../../services/jwt.service';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AppService } from './../../../app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoggedin: boolean = false;
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  currentUser: any;

  constructor(
    private api: AppService,
    private formBuilder: FormBuilder,
    private jwtService: JwtService,
    private route: Router,
    private toaste: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
  }

  openLink(link: string) {
    this.route.navigateByUrl(link);
  }

  markFormTouched(group: FormGroup) {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.controls[key];
      if (control instanceof FormGroup) { control.markAsTouched(); this.markFormTouched(control); }
      else { control.markAsTouched(); };
    });
  }


  afterSubmit() {
    this.markFormTouched(this.loginForm);
    if (this.loginForm.valid) {
      this.spinner.show();
      const { value } = this.loginForm
      this.api.callApi(`${environment.backendBaseURL}/api/admin/login`, 'POST', value, {}).subscribe(res => {
        this.spinner.hide();
        if (res['code'] !== 200) {
          this.toaste.error(res['message'])
          return false
        }
        this.toaste.success(res['message'])
        const data = res['data'];

        this.jwtService.saveToken(data['token'], data['userType'])
        this.jwtService.setIsLogin();

        const temp = {
          companyname: data['companyname'],
          email: data['email'],
          imagefile: data['imagefile'],
          logintime: "4:27:57 PM",
          name: data['name'],
          phonenumber: data['phonenumber'],
          userId: data['userId'],
          userType: data['userType'],
        }
        this.currentUser = temp;
        console.log('let seee', this.currentUser)
        localStorage.setItem("cuserid", data['userId']);
        localStorage.setItem("cusername", data['name']);
        localStorage.setItem("cuserimg", data['imagefile']);
        location.href = '/'
      })
    }
  }

}
