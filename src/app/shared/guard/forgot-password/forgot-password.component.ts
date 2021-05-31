import { environment } from './../../../../environments/environment';
import { Router } from '@angular/router';
import { AppService } from './../../../app.service';
import { JwtService } from './../../services/jwt.service';
import { ToastrService } from 'ngx-toastr';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgetPasswordForm: FormGroup;
  isSubmittng: boolean = false

  constructor(
    private api: AppService,
    private formBuilder: FormBuilder,
    private jwtService: JwtService,
    private route: Router,
    private toaste: ToastrService
  ) {
    this.forgetPasswordForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(/^(\d{10}|\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/)])],
    });
  }

  ngOnInit(): void {

  }
  markFormTouched(group: FormGroup) {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.controls[key];
      if (control instanceof FormGroup) { control.markAsTouched(); this.markFormTouched(control); }
      else { control.markAsTouched(); };
    });
  }

  afterSubmit() {
    this.markFormTouched(this.forgetPasswordForm);
    if (this.forgetPasswordForm.valid) {
      let value = this.forgetPasswordForm.value;
      let { email } = value
      this.isSubmittng = true;
      this.api.callApi(`${environment.backendBaseURL}/api/admin/forgotPassword`, 'POST', { email }, {}).subscribe(res => {
        this.isSubmittng = false;
        if (res['code'] === 200) {
          this.toaste.success(res['message'])
          // this.route.navigateByUrl('/login');
        } else {
          this.toaste.error(res['message'])
          return false
        }
      })
    }
  }

  openLink(link: string) {
    // this.route.navigate([link])
    location.href = link
  }

}
