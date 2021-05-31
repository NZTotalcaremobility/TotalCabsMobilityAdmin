import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DateOfBirth, OnlyCharFieldValidator } from 'src/app/shared/validation/validations.validator';
import { environment } from 'src/environments/environment';
import { UserService } from '../user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  userForm: FormGroup;
  steps: number = 1;
  userId: number = 0;
  objData: any;
  imageInpt: any;
  imageUrl: any;
  image: any;
  userFormTab1: any;
  userFormTab2: any;
  formData1: any;
  formData2: any;
  dob1: string;
  isDisabled: any = false
  constructor(
    private service: UserService,
    private fb: FormBuilder,
    private navRoute: Router,
    private route: ActivatedRoute,
    private _toastr: ToastrService) {
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'];
    });

  }

  ngOnInit(): void {
    this.getUserById();
    this.createdDoctorRegForm();
  }
  // ngAfterViewInit() {
  //   this.createdDoctorRegForm();
  // }
  createdDoctorRegForm() {

    this.userFormTab1 = this.fb.group({
      '_id': [0],
      'name': ['', Validators.compose([Validators.required, OnlyCharFieldValidator.validOnlyCharField])],
      'email': [null, Validators.compose([Validators.required, Validators.pattern(/^(\d{10}|\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/)])],
      'phonenumber': ['', Validators.compose([Validators.required, Validators.pattern(/^[0][1-9]\d{9}$|^[1-9]\d{9}$/)])],
      'dob': ['', Validators.compose([Validators.required, DateOfBirth.dobValidator])],
      'filename': ['', Validators.compose([Validators.required])],
      'userType': 'Normal'
    });
    this.userFormTab2 = this.fb.group({
      'street': ['', Validators.compose([Validators.required])],
      'city': ['', Validators.compose([Validators.required, OnlyCharFieldValidator.validOnlyCharField])],
      'state': ['', Validators.compose([Validators.required, OnlyCharFieldValidator.validOnlyCharField])],
      'postcode': ['', Validators.compose([Validators.required, Validators.pattern(/^[0][1-9]\d{9}$|^[1-9]\d{3}$/)])],
      'country': ['', Validators.compose([Validators.required])]
    });
    // this.userForm = this.fb.group({

    //   'name': ['', Validators.compose([Validators.required, OnlyCharFieldValidator.validOnlyCharField])],
    //   'email': [null, Validators.compose([Validators.required, Validators.pattern(/^(\d{10}|\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/)])],
    //   'phonenumber': ['', Validators.compose([Validators.required, Validators.pattern(/^[0][1-9]\d{9}$|^[1-9]\d{9}$/)])],
    //   'dob': ['', Validators.compose([Validators.required])],
    //   'street': ['', Validators.compose([Validators.required])],
    //   'city': ['', Validators.compose([Validators.required, OnlyCharFieldValidator.validOnlyCharField])],
    //   'state': ['', Validators.compose([Validators.required, OnlyCharFieldValidator.validOnlyCharField])],
    //   'postcode': ['', Validators.compose([Validators.required, Validators.pattern(/^[0][1-9]\d{9}$|^[1-9]\d{5}$/)])],
    //   'country': ['', Validators.compose([Validators.required])],
    //   'userType': 'Normal',
    //   'filename': ['', Validators.compose([Validators.required])]
    // });
  }


  getUserById() {
    let _id = { _id: this.userId };
    // console.log("obj", _id);
    this.service.getUserById(_id).subscribe(res => {
      if (res) {
        this.image = `${environment.imageurl}${res.data.data.imagefile}`;
        // console.log("rcBcak", this.image);

        this.objData = res.data.data;
        console.log("objData", this.objData.name);
        if (this.objData.dob != null) {

          console.log("dob", this.objData.dob);
          let dob = new Date(res.data.data.dob);
          this.dob1 = dob.toISOString().slice(0, 10)

        }
        // console.log(dob.toISOString().slice(0, 10));
        this.userFormTab1.controls['_id'].setValue(this.objData._id);
        this.userFormTab1.controls['name'].setValue(this.objData.name);
        this.userFormTab1.controls['email'].setValue(this.objData.email);
        this.userFormTab1.controls['phonenumber'].setValue(this.objData.phonenumber);
        this.userFormTab1.controls['userType'].setValue(this.objData.userType);
        this.userFormTab2.controls['street'].setValue(this.objData.street);
        this.userFormTab2.controls['city'].setValue(this.objData.city);
        this.userFormTab2.controls['state'].setValue(this.objData.state);
        this.userFormTab2.controls['postcode'].setValue(this.objData.postcode);
        this.userFormTab2.controls['country'].setValue(this.objData.country);
        this.userFormTab1.controls['dob'].setValue(this.dob1);
        this.userFormTab1.controls['filename'].setValue(this.image);
      } else {
        this._toastr.info("Error", "User");
      }
    }
    );
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
      this.service.editUser(formModel).subscribe(res => {
        this.isDisabled = false
        if (res && res.code == 200) {
          this.navRoute.navigate(['/users']);
          this.reset();
          this._toastr.success("User Updated Successfully ");
        } else {
          this._toastr.info("Error", "Something Wrong");
        }
      }
      );

    }
  };

  private prepareSave(): any {
    let inputData = new FormData();
    inputData.append('_id', this.userFormTab1.get('_id').value);
    inputData.append('name', this.userFormTab1.get('name').value);
    inputData.append('email', this.userFormTab1.get('email').value);
    inputData.append('phonenumber', this.userFormTab1.get('phonenumber').value);
    inputData.append('dob', this.userFormTab1.get('dob').value);
    inputData.append('userType', this.userFormTab1.get('userType').value);
    inputData.append('filename', this.userFormTab1.get('filename').value);
    inputData.append('street', this.userFormTab2.get('street').value);
    inputData.append('city', this.userFormTab2.get('city').value);
    inputData.append('state', this.userFormTab2.get('state').value);
    inputData.append('country', this.userFormTab2.get('country').value);
    inputData.append('postcode', this.userFormTab2.get('postcode').value);
    return inputData;
  }



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
        this.image = (<FileReader>event.target).result;
        // this.image = this.imageUrl;
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

  markFormTouched(group: FormGroup | FormArray) {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.controls[key];
      if (control instanceof FormGroup || control instanceof FormArray) { control.markAsTouched(); this.markFormTouched(control); }
      else { control.markAsTouched(); };
    });
  };

  reset() {
    this.userFormTab1.reset();
    this.userFormTab2.reset();
  }
}


