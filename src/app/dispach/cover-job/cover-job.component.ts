import { AppService } from './../../app.service';
import { environment } from './../../../environments/environment';
import { JobService } from './../../job/job.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-cover-job',
  templateUrl: './cover-job.component.html',
  styleUrls: ['./cover-job.component.scss']
})
export class CoverJobComponent implements OnInit {

  p: number = 1;
  modalRef: BsModalRef;
  tempData: any;
  imagefile: any;
  data: any;
  showModal: boolean;
  profileModal: boolean;
  name: any;
  email: any;
  phonenumber: any;
  searchedKeyword: string;
  constructor(
    private modalService: BsModalService,
    private service: JobService,
    private _toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private api: AppService

  ) { }
  ngOnInit(): void {
    this.getCoverJobList();
  }

  getCoverJobList() {
    this.spinner.show();

    this.service.getAllCoverJob().subscribe(res => {
      console.log("coverrr---", res);

      if (res && res.code == 200) {
        this.spinner.hide();
        this.tempData = res.data
        this.imagefile = `${environment.imageurl}`;
      } else {
        console.log('Error');

      }
    }
    );
  }
  getUserById() {
    console.log("id", this.data)
    var data = { "_id": this.data }
    this.service.getUserById(data).subscribe(res => {
      if (res && res.code == 200) {
        console.log(res)
        this.name = res.data.data.name;
        this.email = res.data.data.email;
        this.phonenumber = res.data.data.phonenumber;
        console.log("name", this.name);

      } else {
        console.log('Error');

      }
    }
    );
  }

  getId(rowData: any) {
    this.data = rowData;
    console.log("data", this.data);

    this.showModal = true;
  }
  editJob() {
    var data = { "_id": this.data }
    console.log("id",data);
    this.service.editjob(data).subscribe(res => {
        if (res && res.status == 200) {
        console.log(res);
        this._toastr.success("Job has been updated Successfully !!", "Cover Job");
        this.close();
       // this.getCabList();
      } else {
        this._toastr.info("Error", "Dispatch Job");

      }
    })
  }
  callRequest(rowData: any) {
    this.data = rowData;
    console.log(this.data);
    
    this.api.callApi(`${environment.backendBaseURL}/api/adminRiderequest`, "POST", { riderid: rowData }, {}).subscribe((res) => {
      if (res['code'] === 200) {
        this._toastr.success(res['message'])
      } else {
        this._toastr.error(res['message'])
      }
    })
  }

  getUID(rowData: any) {
    this.data = rowData;
    console.log("data", this.data);
    this.profileModal = true;
    if (this.data != null) {
      this.getUserById();
    }
  }

  close() {
    this.showModal = false;
    this.profileModal = false;
  }
  asignJob() {
    console.log("id", this.data)
    var data = { "_id": this.data }
    this.service.asignJobs(data).subscribe(res => {
      if (res && res.status == 200) {
        setTimeout(function () {
          this._toastr.success("Job asign has been  Successfully !!", "Cover Job");
          this.getCoverJobList();
          this.close();
          console.log(res);

        }, 3000);
        this.close();
        this._toastr.warning("Driver not found that location ", "Cover Job");

      } else {
        this._toastr.warning("Driver not found that location ", "Cover Job");

      }
    })
    setTimeout(function () {

    }, 3000);
    this.close();
    this._toastr.warning("Driver not found that location ", "Cover Job");
  }
  deleteJob() {
    var data = { "_id": this.data }
    console.log("id", data);
    this.service.deleteJob(data).subscribe(res => {
      console.log("delres--", res);

      if (res && res.code == 200) {
        console.log(res);
        this._toastr.success("Job has been delete Successfully !!", "Dispatch Job");
        this.close();
        this.getCoverJobList();
      } else {
        this._toastr.info("Error", "Dispatch Job");

      }
    })
  }

}
