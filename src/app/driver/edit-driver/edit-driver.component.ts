import { Component, OnInit } from '@angular/core';
import { DriverServiceService } from '../driver-service.service';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TextFieldValidator, OnlyCharFieldValidator, NumericFieldValidator, DateOfBirth } from "src/app/shared/validation/validations.validator"
@Component({
  selector: 'app-edit-driver',
  templateUrl: './edit-driver.component.html',
  styleUrls: ['./edit-driver.component.scss']
})
export class EditDriverComponent implements OnInit {
  userForm: FormGroup;
  steps: number = 1;
  userId: number = 0;
  objData: any;
  guests: any;
  selectedValue: any;
  form1: boolean;
  picLB: string | ArrayBuffer;
  picLF: string | ArrayBuffer;
  ptofilepic: any;
  imageInpt: any;
  imageChangedEvent: string;

  picRF: string | ArrayBuffer;
  picRB: string | ArrayBuffer;
  imagefile: string | ArrayBuffer;
  profilepic: any;
  dlfront: any;
  dlback: any;
  rcback: any;
  rcfront: any;
  picDM: string | ArrayBuffer;
  picHSP: string | ArrayBuffer;
  picdm: any;
  pichsp: any;

  userFormTab1: FormGroup;
  userFormTab2: FormGroup;
  userFormTab3: FormGroup;
  userFormTab4: FormGroup;
  formData1: any;
  formData2: any;
  formData3: any;
  formData4: any;
  isDisabled: boolean = false;

  constructor(
    private service: DriverServiceService,
    private fb: FormBuilder,
    private navRoute: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private _toastr: ToastrService) {
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'];
    });
  }

  ngOnInit(): void {
    this.getDriverById();
    this.createdDoctorRegForm();
  }

  createdDoctorRegForm() {
    this.userFormTab1 = this.fb.group({
      '_id': [0],
      'name': ['', Validators.compose([Validators.required, OnlyCharFieldValidator.validOnlyCharField])],
     // 'userType': ['', Validators.compose([Validators.required])],
     // 'email': ['', Validators.compose([Validators.required, Validators.pattern(/^(\d{10}|\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/)])],
     'phonenumber': ['', Validators.compose([Validators.required, Validators.pattern(/^[0][1-9]\d{6}$|^[1-9]\d{5,9}$/)])],
      'dob': ['', Validators.compose([Validators.required, DateOfBirth.dobValidator])],
      'imagefile': ['']
    });
    this.userFormTab2 = this.fb.group({
      'street': ['', Validators.compose([Validators.required])],
      'city': ['', Validators.compose([Validators.required, OnlyCharFieldValidator.validOnlyCharField])],
      'state': ['', Validators.compose([Validators.required, OnlyCharFieldValidator.validOnlyCharField])],
      'postcode': ['', Validators.compose([Validators.required, Validators.pattern(/^[0-9]\d{3}$|^[1-9]\d{3}$/)])],
      'country': ['', Validators.compose([Validators.required])]
    });
    this.userFormTab3 = this.fb.group({
      'carBrand': ['', Validators.compose([Validators.required, OnlyCharFieldValidator.validOnlyCharField])],
      'carType': ['', Validators.compose([Validators.required])],
       'carModel': ['', Validators.compose([Validators.required])],
       'carRegNo': ['', Validators.compose([Validators.required])],
       //'carFuelType': ['', Validators.compose([Validators.required])],
       'licencenumber': ['', Validators.compose([Validators.required])],
       //'licenseValid': ['', Validators.compose([Validators.required])],
     //  'carOwner': ['', Validators.compose([Validators.required])],
    });
    this.userFormTab4 = this.fb.group({
      'driverLicence': ['', Validators.compose([Validators.required])],
      'trainingDoc': ['', Validators.compose([Validators.required])],
      'hoistManual': ['', Validators.compose([Validators.required])],
      'pEndorsement': ['', Validators.compose([Validators.required])],
      'driverManual': ['', Validators.compose([Validators.required])],
      'healthSafetyPolicy': ['', Validators.compose([Validators.required])],
    });
  }

  getDriverById() {
    let _id = { _id: this.userId };
    console.log("obj", _id);

    this.service.getCurrentData(_id).subscribe(res => {
      if (res && res.code == 200) {
        this.selectedValue = res.data.data.carOwner
        console.log("selectedValue", this.selectedValue);

        this.objData = res.data.data;
        console.log("=====================", this.objData);

        // this.image =`${environment.imageurl}${res.data.data.imagefile}`;
        this.profilepic = res.data.data.imagefile;
        console.log("this.profilepic", this.profilepic);

        this.dlfront = res.data.data.documents.driverLicence;
        this.dlback = res.data.data.documents.trainingDoc;
        this.rcback = res.data.data.documents.hoistManual;
        this.rcfront = res.data.data.documents.pEndorsement;
        this.picdm = res.data.data.documents.driverManual;
        this.pichsp = res.data.data.documents.healthSafetyPolicy;

        this.picLF = `${environment.imageurl}${res.data.data.documents.driverLicence}`;
        console.log("picLF", this.picLF);

        this.picLB = `${environment.imageurl}${res.data.data.documents.trainingDoc}`;
        this.picRF = `${environment.imageurl}${res.data.data.documents.pEndorsement}`;
        this.picRB = `${environment.imageurl}${res.data.data.documents.hoistManual}`;
        this.picDM = `${environment.imageurl}${res.data.data.documents.driverManual}`;
        this.picHSP = `${environment.imageurl}${res.data.data.documents.healthSafetyPolicy}`;
        this.imagefile = `${environment.imageurl}${res.data.data.imagefile}`;
        console.log("this.imagefile", this.imagefile);


        let dob = new Date(res.data.data.dob);
        let dob1 = dob.toISOString().slice(0, 10)
        console.log(dob.toISOString().slice(0, 10));
        this.userFormTab1.controls['_id'].setValue(this.objData._id);
        this.userFormTab1.controls['name'].setValue(this.objData.name);
        //this.userFormTab1.controls['userType'].setValue(this.objData.userType);
        //this.userFormTab1.controls['email'].setValue(this.objData.email);
        this.userFormTab1.controls['phonenumber'].setValue(this.objData.phonenumber);
        this.userFormTab1.controls['dob'].setValue(dob1);
        
        this.userFormTab2.controls['street'].setValue(this.objData.street);
        this.userFormTab2.controls['city'].setValue(this.objData.city);
        this.userFormTab2.controls['state'].setValue(this.objData.state);
        this.userFormTab2.controls['country'].setValue(this.objData.country);
        this.userFormTab2.controls['postcode'].setValue(this.objData.postcode);

       // this.userFormTab3.controls['carOwner'].setValue(this.objData.carOwner);
        this.userFormTab3.controls['carBrand'].setValue(this.objData.carBrand);
        this.userFormTab3.controls['carType'].setValue(this.objData.carType);
       // this.userFormTab3.controls['carFuelType'].setValue(this.objData.carFuelType);
        this.userFormTab3.controls['carModel'].setValue(this.objData.carModel);
        this.userFormTab3.controls['carRegNo'].setValue(this.objData.carRegNo);
        this.userFormTab3.controls['licencenumber'].setValue(this.objData.licencenumber);
       // this.userFormTab3.controls['licenseValid'].setValue(this.objData.licenseValid);

        this.userFormTab4.controls['driverLicence'].setValue(this.dlfront);
        this.userFormTab4.controls['trainingDoc'].setValue(this.dlback);
        this.userFormTab4.controls['pEndorsement'].setValue(this.rcfront);
        this.userFormTab4.controls['hoistManual'].setValue(this.rcback);
        this.userFormTab4.controls['driverManual'].setValue(this.picdm);
        this.userFormTab4.controls['healthSafetyPolicy'].setValue(this.pichsp);
        this.userFormTab1.controls['imagefile'].setValue(this.profilepic);
      } else {
        this._toastr.info("Error", "Driver");
      }
    }
    );
  }
  submitFormTab1() {
    this.markFormTouched(this.userFormTab1);
   // this.userFormTab1.value.imagefile=this.profilepic
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
      this.isDisabled = true;
      let fromData = this.prepareSave();
      // this.service.addDriver(fromData).subscribe(res => {
      this.service.updatedriverdetails(fromData).subscribe(res => {
        this.isDisabled = false;
        if (res && res.code == 200) {
          this.navRoute.navigate(['/drivers']);
         // this.reset();
          this._toastr.success(res.message, "Driver updated successfully");
        } else if (res.code == 402) {
          this._toastr.info(res.message, "Issue on Driver ");
        } else {
          this._toastr.info("All feild reqired", "Dirver not updated ");
        }
      }
      );
    }
  };
  private prepareSave(): any {
    let inputData = new FormData();
    inputData.append('_id', this.userFormTab1.get('_id').value);
    inputData.append('name', this.userFormTab1.get('name').value);
   // inputData.append('userType', this.userFormTab1.get('userType').value)
    //inputData.append('email', this.userFormTab1.get('email').value);
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
   // inputData.append('licenseValid', this.userFormTab3.get('licenseValid').value)
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

    console.log("data------------", this.userFormTab1.value);

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
  // reset() {
  //   this.userFormTab1.reset();
  //   this.userFormTab2.reset();
  //   this.userFormTab3.reset();
  //   this.userFormTab4.reset();
  // }
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
        this.imagefile = (<FileReader>event.target).result;
        this.profilepic = this.imagefile
        console.log("imagefile", this.profilepic);

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
        this.dlfront = this.picLF;

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
        this.dlback = this.picLB;
        console.log("picLB", this.picLB);
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
        this.rcfront = this.picRF;
        console.log("picRF", this.picRF);
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
        this.rcback = this.picRB;
        console.log("picRB", this.picRB);
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
        this.picdm = this.picDM;
        console.log("picDM", this.picDM);
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
        this.pichsp = this.picHSP;
        console.log("picHSP", this.picHSP);
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


