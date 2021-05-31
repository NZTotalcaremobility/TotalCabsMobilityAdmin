import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DateOfBirth, OnlyCharFieldValidator } from 'src/app/shared/validation/validations.validator';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss']
})
export class AddUsersComponent implements OnInit {

  steps: number = 1;
  userForm: FormGroup;
  imageUrl: any;
  image: any;
  croppedImage: any;
  imageChangedEvent: string;
  imageSelected: boolean;
  imageInpt: any;
  userFormTab1: FormGroup;
  userFormTab2: FormGroup;
  formData1: any;
  formData2: any;
  isDisabled: boolean = false
  constructor(
    private service: UserService,
    private http: HttpClient,
    fb: FormBuilder,
    private navRoute: Router,
    private route: ActivatedRoute,
    private _toastr: ToastrService
  ) {
    this.userFormTab1 = fb.group({
      'name': ['', Validators.compose([Validators.required, OnlyCharFieldValidator.validOnlyCharField])],
      // 'userType': ['', Validators.compose([Validators.required])],
      'userType': 'Normal',
      'email': [null, Validators.compose([Validators.required, Validators.pattern(/^(\d{10}|\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/)])],
      'phonenumber': ['', Validators.compose([Validators.required, Validators.pattern(/^[0][1-9]\d{6}$|^[1-9]\d{5,9}$/)])],
      'password': ['', Validators.compose([Validators.required])],
      //'dob': ['', Validators.compose([Validators.required,DateOfBirth.dobValidator])],
      'filename': ['', Validators.compose([Validators.required])]
    });
    this.userFormTab2 = fb.group({
      'street': ['', Validators.compose([Validators.required])],
      'city': ['', Validators.compose([Validators.required, OnlyCharFieldValidator.validOnlyCharField])],
      'state': ['', Validators.compose([Validators.required, OnlyCharFieldValidator.validOnlyCharField])],
      'postcode': ['', Validators.compose([Validators.required, Validators.pattern(/^[0][1-9]\d{9}$|^[1-9]\d{3}$/)])],
      'country': ['', Validators.compose([Validators.required])]
    });
    // this.userForm = fb.group({
    //   'name': ['', Validators.compose([Validators.required])],
    //   // 'lastName': ['', Validators.compose([Validators.required])],
    //   'email': [null, Validators.compose([Validators.required, Validators.pattern(/^(\d{10}|\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/)])],
    //   'phonenumber': ['', Validators.compose([Validators.required])],
    //   'password': ['', Validators.compose([Validators.required])],
    //   'dob': ['', Validators.compose([Validators.required])],
    //   'street': ['', Validators.compose([Validators.required])],
    //   'city': ['', Validators.compose([Validators.required])],
    //   'state': ['', Validators.compose([Validators.required])],
    //   'postcode': ['', Validators.compose([Validators.required])],
    //   'country': ['', Validators.compose([Validators.required])],
    //   // 'userType': ['', Validators.compose([Validators.required])],
    //   'filename': null
    // });
  }

  ngOnInit(): void {

  }
  submitFormTab1() {
    this.markFormTouched(this.userFormTab1);
    console.log("data", this.userFormTab1.value);
    if (this.userFormTab1.valid) {
      this.formData1 = this.userFormTab1.value;
      console.log("forData1", this.formData1);
    }
  }
  submitFormTab2() {
    this.markFormTouched(this.userFormTab2);
    console.log("data", this.userFormTab2.value);
    if (this.userFormTab2.valid) {
      this.formData2 = this.userFormTab2.value;
      console.log("formData2", this.formData2);
      this.submitForm();
    }
  }


  submitForm() {
    if (this.userFormTab1.valid && this.userFormTab2.valid) {
      this.isDisabled = true
      let formModel = this.prepareSave();
      console.log("formModel", formModel);
      this.service.addUser(formModel).subscribe(res => {
        this.isDisabled = false
        if (res && res.code == 200) {
          this.navRoute.navigate(['/users']);
          this.reset();
          this._toastr.success(res.message, "User");
        } else {
          this._toastr.info(res.message, "User");
        }
      }
      );

    }
  };

  private prepareSave(): any {
    let inputData = new FormData();
    // inputData.append('_id', this.id);
    inputData.append('name', this.userFormTab1.get('name').value);
    inputData.append('email', this.userFormTab1.get('email').value);
    inputData.append('phonenumber', this.userFormTab1.get('phonenumber').value);
    inputData.append('password', this.userFormTab1.get('password').value);
    // inputData.append('dob', this.userFormTab1.get('dob').value);
    inputData.append('userType', this.userFormTab1.get('userType').value);
    inputData.append('filename', this.userFormTab1.get('filename').value);
    inputData.append('street', this.userFormTab2.get('street').value);
    inputData.append('city', this.userFormTab2.get('city').value);
    inputData.append('state', this.userFormTab2.get('state').value);
    inputData.append('country', this.userFormTab2.get('country').value);
    inputData.append('postcode', this.userFormTab2.get('postcode').value);
    return inputData;
  }

  markFormTouched(group: FormGroup | FormArray) {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.controls[key];
      if (control instanceof FormGroup || control instanceof FormArray) { control.markAsTouched(); this.markFormTouched(control); }
      else { control.markAsTouched(); };
    });
  };


  step1() {
    if (this.userFormTab1.valid) {
      this.steps = (this.steps == 2 ? 2 : this.steps + 1)
      console.log("steps", this.steps);
    }
  }
  onSelectFile(event) {

    console.log(event, 'error')
    if (event && event.target && event.target.files[0].size > 5072000) {
      // this.toastr.error("File Size should be less then 5 MB");
      this.imageInpt.nativeElement.value = "";
    }
    else {
      let file = event.target.files[0];
      let re = /(\.jpg|\.jpeg|\.bmp|\.gif|\.png)$/i;
      if (!re.exec(file.name)) {
        this._toastr.error("File type not supported!");
        return;
      }
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.imageUrl = (<FileReader>event.target).result;
        this.image = this.imageUrl;
        console.log("-------------", this.image);

      }

      reader.onloadend = (event: ProgressEvent) => {
      }
      reader.readAsDataURL(event.target.files[0]);

      this.userFormTab1.get('filename').setValue(file);
    }
  }
  base64ToFile(data, filename) {
    const arr = data.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }


  reset() {
    this.userFormTab1.reset();
    this.userFormTab2.reset();
  }



}

