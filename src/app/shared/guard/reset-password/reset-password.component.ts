import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from './../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { JwtService } from './../../services/jwt.service';
import { AppService } from './../../../app.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  isSubmittng: boolean = false;
  resetPasswordForm: FormGroup;
  token: string;
  isSubmitted: boolean;
  urlPath: string;

  constructor(
    private api: AppService,
    private formBuilder: FormBuilder,
    private jwtService: JwtService,
    private route: Router,
    private toaste: ToastrService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.resetPasswordForm = formBuilder.group({
      password: ['', Validators.required],
      ConfirmPassword: ['', Validators.required],
    }, { validator: this.passwordConfirming });

    const { snapshot } = activatedRoute;
    const { params, routeConfig } = snapshot;
    const { token } = params;
    const { path } = routeConfig;
    this.token = token;
    this.urlPath = path.split('/')[0];
    console.log('okay', this.urlPath)
  }

  ngOnInit(): void {
    if (this.urlPath === "verifyAccount") {
      this.spinner.show();
      this.api.callApi(`${environment.backendBaseURL}/api/admin/verifyAccount`, 'POST', { token: this.token }, {}).subscribe(res => {
        this.isSubmittng = false;
        if (res['code'] === 200) {
          let tokenn = res['data'].token;
          this.token = tokenn
          this.spinner.hide();
          this.route.navigateByUrl(`/resetPassword/${tokenn}`);
          this.toaste.success(res['message'])
          this.toaste.success('now reset your password here!');
        } else {
          this.spinner.hide();
          this.toaste.error(res['message'])
          return false
        }
      })
    }

  }


  passwordConfirming(c: AbstractControl): any {
    if (c.get('password').value !== c.get('ConfirmPassword').value) {
      // return {invalid: true};
      return c.get('ConfirmPassword').setErrors({ 'confirmError': true });
    }
  }


  markFormTouched(group: FormGroup) {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.controls[key];
      if (control instanceof FormGroup) { control.markAsTouched(); this.markFormTouched(control); }
      else { control.markAsTouched(); };
    });
  }

  afterSubmit() {
    this.isSubmitted = true;
    this.markFormTouched(this.resetPasswordForm);
    if (this.resetPasswordForm.valid) {
      this.spinner.show();
      this.isSubmittng = true
      this.isSubmitted = false;
      let value = this.resetPasswordForm.value;
      let { ConfirmPassword } = value
      let data = { ConfirmPassword, token: this.token }
      this.api.callApi(`${environment.backendBaseURL}/api/admin/resetPassword`, 'POST', data, {}).subscribe(res => {
        this.spinner.hide();
        this.isSubmittng = false
        if (res['code'] === 200) {
          this.toaste.success(res['message'])
          window.location.href = '/login'
        } else {
          this.toaste.error(res['message'])
          return false
        }
      })
    }
    return true
  }

  openLink(link: string) {
    // this.route.navigate([link])
    location.href = link
  }

}
