import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { JobService } from '../job.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-ongoing-jobs',
  templateUrl: './ongoing-jobs.component.html',
  styleUrls: ['./ongoing-jobs.component.scss']
})
export class OngoingJobsComponent implements OnInit {
p:number=1;
  imagefile: string;
  tempData: any;
  data: any;
  name: any;
  email: any;
  phonenumber: any;
  profileModal: boolean;

  constructor(
    private modalService: BsModalService,
    private service: JobService,
    private _toastr: ToastrService,
    private spinner: NgxSpinnerService

  ) { }

  ngOnInit(): void {
    this.getCompletedJobList();
  }

  getCompletedJobList() {
    this.spinner.show();

    this.service.getAllOngoingJob().subscribe(res => {
      if (res && res.code == 200) {

        this.spinner.hide();
        setTimeout(() => {
          console.log(res)
          this.tempData = res.data
          this.imagefile = `${environment.imageurl}`;
          console.log("tempData", this.imagefile);
        }, 5000)
      } else {
        console.log('Error');

      }
    }
    );
  }
  close() {
       this.profileModal = false;
  }
  getUID(rowData: any) {
    this.data = rowData;
    console.log("data", this.data);
    this.profileModal = true;
    if(this.data!=null){
      this.getUserById();
    }
  }
  getUserById() {
    console.log("id", this.data)
    var data = { "_id": this.data }
    this.service.getUserById(data).subscribe(res => {
      if (res && res.code == 200) {
        console.log(res)
        this.name = res.data.data.name;
        this.email=res.data.data.email;
        this.phonenumber=res.data.data.phonenumber;
        console.log("name", this.name);

      } else {
        console.log('Error');

      }
    }
    );
  }
}