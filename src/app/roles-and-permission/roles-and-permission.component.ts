import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { environment } from '../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OnlyCharFieldValidator } from '../shared/validation/validations.validator';

@Component({
  selector: 'app-roles-and-permission',
  templateUrl: './roles-and-permission.component.html',
  styleUrls: ['./roles-and-permission.component.scss']
})
export class RolesAndPermissionComponent implements OnInit {
  isSubmittng: boolean = false;
  page: number = 1;
  userList: any = [];
  toggleModal: boolean = false
  RoletoggleModal: boolean = false
  registeForm: FormGroup;
  permissionForm: FormGroup;
  _id: String = '';
  permissionList: Array<any> = [];
  permission: Array<any> = [];
  dropdownSettings: any = {};


  constructor(
    private api: AppService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private _toastr: ToastrService
  ) {
    this.getlist();

    this.permissionForm = formBuilder.group({
      permissions: ['', Validators.compose([Validators.required])],
    });

    this.registeForm = formBuilder.group({
      name: ['', Validators.compose([Validators.required, OnlyCharFieldValidator.validOnlyCharField])],
      permissions: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.pattern(/^(\d{10}|\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/)])],
      phonenumber: ['', Validators.compose([Validators.required, Validators.pattern(/^[0][1-9]\d{9}$|^[1-9]\d{9}$/)])],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.permissionList = [
      { id: "dashboard", text: 'Dashboard' },
      { id: 'maps', text: 'Locations' },
      { id: "drivers", text: 'Drivers' },
      { id: "users", text: 'Users' },
      { id: "chat", text: 'Chats' },
      { id: "bookings", text: 'Bookings' },
      { id: "jobs", text: 'Dispatch Job' },
      { id: "payment", text: 'Payments' },
      { id: "reports", text: 'Reports' }
    ]

    this.dropdownSettings = {
      "singleSelection": false,
      "defaultOpen": false,
      "idField": "id",
      "textField": "text",
      "selectAllText": "Select All",
      "unSelectAllText": "UnSelect All",
      "itemsShowLimit": 3,
    }

  }

  openModal(data: any) {
    this.toggleModal = true;
    this._id = data._id;
    this.permission = data?.permissions?.map((e: any) => (this.permissionList.filter((f: any) => e === f.id))[0])
  }

  markFormTouched(group: FormGroup) {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.controls[key];
      if (control instanceof FormGroup) { control.markAsTouched(); this.markFormTouched(control); }
      else { control.markAsTouched(); };
    });
  }

  afterSubmit() {
    this.markFormTouched(this.permissionForm);
    if (this.permissionForm.valid) {
      this.spinner.show();
      let value = this.permissionForm.value;
      let { permissions } = value
      permissions = permissions?.map((e) => (e.id))
      this.api.callApi(`${environment.backendBaseURL}/api/admin/updateSubAdmin/${this._id}`, 'POST', { permissions }, {}).subscribe(res => {
        this.spinner.hide();
        if (res['data'].status === true) {
          this.toggleModal = false
          this.getlist();
          this._toastr.success('permission successfully Updated')
        } else {
          this._toastr.error(res['message'])
        }
      })
    }
  }

  registerSubAdmin() {
    this.markFormTouched(this.registeForm);
    if (this.registeForm.valid) {
      this.spinner.show();
      let value = this.registeForm.value;
      let { permissions, name, phonenumber, password, email } = value
      permissions = permissions?.map((e) => (e.id))
      this.api.callApi(`${environment.backendBaseURL}/api/admin/registerSubAdmin`, 'POST', { permissions, name, phonenumber, password, email }, {}).subscribe(res => {
        this.spinner.hide();
        if (res['code'] === 200) {
          this.toggleModal = false
          this.getlist();
          this._toastr.success(res['message'])
          this.registeForm.reset();
          this.RoletoggleModal = false
        } else {
          this._toastr.error(res['message'])
        }
      })
    }
  }

  getlist() {
    this.spinner.show();
    this.api.callApi(`${environment.backendBaseURL}/api/admin/subAdminList/`, 'POST', {}, {}).subscribe(res => {
      this.userList = res['data']
      this.spinner.hide();
    })
  }

  deleteUser(id: any) {
    this.spinner.show();
    this.api.callApi(`${environment.backendBaseURL}/api/admin/deleteSubadmin/${id}/`, 'POST', {}, {}).subscribe(res => {
      if (res['code'] === 200) {
        this.getlist();
        this._toastr.success(res['message'])
      } else {
        this._toastr.error(res['message'])
      }
    })
  }
}
