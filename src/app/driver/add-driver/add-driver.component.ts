import { OnlyCharFieldValidator, DateOfBirth } from './../../shared/validation/validations.validator';
import { Component, OnInit } from '@angular/core';
import { DriverServiceService } from '../driver-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-driver',
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.scss']
})
export class AddDriverComponent implements OnInit {
  steps: number = 1;
  selectedValue: any;
  form1: boolean;
  imageInpt: any;
  picLB: string | ArrayBuffer;
  picLF: string | ArrayBuffer;
  picRF: string | ArrayBuffer;
  picRB: string | ArrayBuffer;
  image: string | ArrayBuffer;
  picDM: string | ArrayBuffer;
  picHSP: string | ArrayBuffer;
  userFormTab1: FormGroup;
  userFormTab2: FormGroup;
  userFormTab3: FormGroup;
  userFormTab4: FormGroup;
  formData1: any;
  formData2: any;
  formData3: any;
  formData4: any;
  pic1: boolean = false;
  lb: boolean = false;
  rf: boolean = false;
  rb: boolean = false;
  dm: boolean = false;
  hsp: boolean = false;
  isDisabled: boolean = false
  constructor(
    private service: DriverServiceService,
    private http: HttpClient,
    private fb: FormBuilder,
    private navRoute: Router,
    private route: ActivatedRoute,
    private _toastr: ToastrService
  ) {
    this.userFormTab1 = fb.group({
      'name': ['', Validators.compose([Validators.required, OnlyCharFieldValidator.validOnlyCharField])],
      //'userType': ['', Validators.compose([Validators.required])],
     // 'email': ['', Validators.compose([Validators.required, Validators.pattern(/^(\d{10}|\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/)])],
      'phonenumber': ['', Validators.compose([Validators.required, Validators.pattern(/^[0][1-9]\d{6}$|^[1-9]\d{5,9}$/)])],
      'dob': ['', Validators.compose([Validators.required, DateOfBirth.dobValidator])],
      //'password': ['', Validators.compose([Validators.required])],
      'imagefile': ['']
    });
    this.userFormTab2 = fb.group({
      'street': ['', Validators.compose([Validators.required])],
      'city': ['', Validators.compose([Validators.required, OnlyCharFieldValidator.validOnlyCharField])],
      'state': ['', Validators.compose([Validators.required, OnlyCharFieldValidator.validOnlyCharField])],
      'postcode': ['', Validators.compose([Validators.required, Validators.pattern(/^[0-9]\d{3}$|^[1-9]\d{3}$/)])],
      'country': ['', Validators.compose([Validators.required])]
    });
    this.userFormTab3 = fb.group({
      'carBrand': ['', Validators.compose([Validators.required, OnlyCharFieldValidator.validOnlyCharField])],
     'carType': ['', Validators.compose([Validators.required])],
      'carModel': ['', Validators.compose([Validators.required])],
      'carRegNo': ['', Validators.compose([Validators.required])],
      //'carFuelType': ['', Validators.compose([Validators.required])],
      'licencenumber': ['', Validators.compose([Validators.required])],
      //'licenseValid': ['', Validators.compose([Validators.required])],
    //  'carOwner': ['', Validators.compose([Validators.required])],
    });
    this.userFormTab4 = fb.group({
      'driverLicence': ['', Validators.compose([Validators.required])],
      'trainingDoc': ['', Validators.compose([Validators.required])],
      'hoistManual': ['', Validators.compose([Validators.required])],
      'pEndorsement': ['', Validators.compose([Validators.required])],
      'driverManual': ['', Validators.compose([Validators.required])],
      'healthSafetyPolicy': ['', Validators.compose([Validators.required])],

    });
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
    } else {
      // this._toastr.info("All feild are required of Addresss", "Dirver ");
    }
  }
  submitFormTab3() {
    this.markFormTouched(this.userFormTab3);
    console.log("data", this.userFormTab3.value);
    if (this.userFormTab3.valid) {
      this.formData2 = this.userFormTab3.value;
      console.log("userFormTab3", this.userFormTab3);
    } else {
      // this._toastr.info("All feild are required of Car & Licence Information", "Dirver ");
    }
  }
  submitFormTab4() {
    this.markFormTouched(this.userFormTab4);
    console.log("data", this.userFormTab4.value);
    if (this.userFormTab4.valid) {
      this.formData4 = this.userFormTab4.value;
      console.log("formData4", this.formData4);
      this.submitForm();
    } else {
      // this._toastr.info("All feild are required of Document Information", "Dirver ");
    }

  }
  submitForm() {
    if (this.userFormTab1.valid && this.userFormTab2.valid && this.userFormTab3.valid && this.userFormTab4.valid) {
      this.isDisabled = true
      let fromData = this.prepareSave();
      console.log("fromData", fromData);
      this.service.addDriver(fromData).subscribe(res => {
        this.isDisabled = false
        if (res && res.code == 200) {
          console.log(this.userFormTab1.value);
          console.log(this.userFormTab2.value);
          console.log(this.userFormTab3.value);
          console.log(this.userFormTab4.value);
          this.navRoute.navigate(['/drivers']);
          this.reset();
          this._toastr.success(res.message, "Driver");
        } else if (res && res.code == 402) {
          this._toastr.info(res.message, "Dirver ");
        } else {
          this._toastr.info(res.message, "Dirver ");
        }
      });
    } else {
      this._toastr.info("All feild are required", "Dirver ");
    }

  };
  private prepareSave(): any {
    let inputData = new FormData();
    inputData.append('name', this.userFormTab1.get('name').value);
   // inputData.append('userType', this.userFormTab1.get('userType').value)
   // inputData.append('email', this.userFormTab1.get('email').value);
    //inputData.append('password', this.userFormTab1.get('password').value)
    inputData.append('phonenumber', this.userFormTab1.get('phonenumber').value);
    inputData.append('dob', this.userFormTab1.get('dob').value)
    inputData.append('imagefile', this.userFormTab1.get('imagefile').value)
    inputData.append('street', this.userFormTab2.get('street').value)
    inputData.append('city', this.userFormTab2.get('city').value)
    inputData.append('state', this.userFormTab2.get('state').value)
    inputData.append('country', this.userFormTab2.get('country').value)
    inputData.append('postcode', this.userFormTab2.get('postcode').value)
   // inputData.append('carOwner', this.userFormTab3.get('carOwner').value)
    inputData.append('carBrand', this.userFormTab3.get('carBrand').value)
    inputData.append('carType', this.userFormTab3.get('carType').value)
    inputData.append('carModel', this.userFormTab3.get('carModel').value)
    inputData.append('carRegNo', this.userFormTab3.get('carRegNo').value)
    //inputData.append('carFuelType', this.userFormTab3.get('carFuelType').value)
    inputData.append('licencenumber', this.userFormTab3.get('licencenumber').value)
    //inputData.append('licenseValid', this.userFormTab3.get('licenseValid').value)
    inputData.append('driverLicence', this.userFormTab4.get('driverLicence').value)
    inputData.append('trainingDoc', this.userFormTab4.get('trainingDoc').value)
    inputData.append('hoistManual', this.userFormTab4.get('hoistManual').value)
    inputData.append('pEndorsement', this.userFormTab4.get('pEndorsement').value)
    inputData.append('driverManual', this.userFormTab4.get('driverManual').value)
    inputData.append('healthSafetyPolicy', this.userFormTab4.get('healthSafetyPolicy').value)
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
  step2() {
    if (this.userFormTab2.valid) {
      this.steps = (this.steps == 3 ? 3 : this.steps + 1)
      console.log("steps", this.steps);
    }
  }
  step3() {
    if (this.userFormTab3.valid) {
      this.steps = (this.steps == 4 ? 4 : this.steps + 1)
      console.log("steps", this.steps);
    }
  }
  reset() {
    this.userFormTab1.reset();
    this.userFormTab2.reset();
    this.userFormTab3.reset();
    this.userFormTab4.reset();
  }
  selectChangeHandler(event: any) {
    this.selectedValue = event.target.value;
    console.log("selected value", this.selectedValue);

    if (this.selectedValue == "Yes") {
      this.form1 = true;
    }
    else if (this.selectedValue == "No") {
      this.form1 = false;

    } else {
      this._toastr.success("Error!!", "Driver");
    }
  }

  onSelectProfile(event) {
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
        console.log("imagefile", this.image);
      }
      reader.onloadend = (event: ProgressEvent) => {
      }
      reader.readAsDataURL(event.target.files[0]);
      this.userFormTab1.get('imagefile').setValue(file);
    }
  }

  onSelectLF(event) {
    console.log(event, 'error')
    if (event && event.target && event.target.files[0].size > 5072000) {
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
        this.picLF = (<FileReader>event.target).result;
        this.pic1 = true
        console.log("picLF", this.picLF);
      }
      reader.onloadend = (event: ProgressEvent) => {
      }
      reader.readAsDataURL(event.target.files[0]);
      this.userFormTab4.get('driverLicence').setValue(file);
    }
  }
  onSelectLB(event) {
    console.log(event, 'error')
    if (event && event.target && event.target.files[0].size > 5072000) {
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
        this.picLB = (<FileReader>event.target).result;
        console.log("picLB", this.picLB);
        this.lb = true;
      }
      reader.onloadend = (event: ProgressEvent) => {
      }
      reader.readAsDataURL(event.target.files[0]);

      this.userFormTab4.get('trainingDoc').setValue(file);
    }
  }
  onSelectRF(event) {
    console.log(event, 'error')
    if (event && event.target && event.target.files[0].size > 5072000) {
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
        this.picRF = (<FileReader>event.target).result;
        console.log("picRF", this.picRF);
        this.rf = true;
      }
      reader.onloadend = (event: ProgressEvent) => {
      }
      reader.readAsDataURL(event.target.files[0]);
      this.userFormTab4.get('pEndorsement').setValue(file);
    }
  }
  onSelectRB(event) {
    console.log(event, 'error')
    if (event && event.target && event.target.files[0].size > 5072000) {
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
        this.picRB = (<FileReader>event.target).result;
        console.log("picRB", this.picRB);
        this.rb = true;
      }
      reader.onloadend = (event: ProgressEvent) => {
      }
      reader.readAsDataURL(event.target.files[0]);
      this.userFormTab4.get('hoistManual').setValue(file);
    }
  }
  onSelectDM(event) {
    console.log(event, 'error')
    if (event && event.target && event.target.files[0].size > 5072000) {
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
        this.picDM = (<FileReader>event.target).result;
        console.log("picDM", this.picDM);
        this.dm = true;
      }
      reader.onloadend = (event: ProgressEvent) => {
      }
      reader.readAsDataURL(event.target.files[0]);
      this.userFormTab4.get('driverManual').setValue(file);
    }
  }
  onSelectHSP(event) {
    console.log(event, 'error')
    if (event && event.target && event.target.files[0].size > 5072000) {
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
        this.picHSP = (<FileReader>event.target).result;
        console.log("picHSP", this.picHSP);
        this.hsp = true
      }
      reader.onloadend = (event: ProgressEvent) => {
      }
      reader.readAsDataURL(event.target.files[0]);
      this.userFormTab4.get('healthSafetyPolicy').setValue(file);
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


}

