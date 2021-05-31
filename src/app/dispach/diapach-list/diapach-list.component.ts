import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DispachService } from '../dispach.service';

@Component({
  selector: 'app-diapach-list',
  templateUrl: './diapach-list.component.html',
  styleUrls: ['./diapach-list.component.scss']
})
export class DiapachListComponent implements OnInit {
  cabList: any;
  p: number = 1;
  data: any;
  showModal: boolean;
  searchedKeyword: string;
  constructor(
    private service: DispachService,
    private http: HttpClient,
    private fb: FormBuilder,
    private navRoute: Router,
    private route: ActivatedRoute,
    private _toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getCabList();
  }
 getCabList(){
    this.service.getCabList().subscribe(res => {
      if (res && res.code == 200) {
        console.log("list data-----",res)
        this.cabList = res.data
        console.log("guest", this.cabList);
      } else {
        console.log('Error');

      }
    }
    );
  }

  getId(rowData: any) {
    this.data = rowData;
    console.log("data",this.data);
    this.showModal=true;
    
    // this.getBankDetailsByUserId();
  }
  close() {
    this.showModal = false;
  }

  deleteJob() {
    var data = { "_id": this.data }
    console.log("id",data);
    this.service.deleteJob(data).subscribe(res => {
        if (res && res.code == 200) {
        console.log(res);
        this._toastr.success("Job has been delete Successfully !!", "Dispatch Job");
        this.close();
        this.getCabList();
      } else {
        this._toastr.info("Error", "Dispatch Job");

      }
    })
  }
  editJob() {
    var data = { "_id": this.data }
    console.log("id",data);
    this.service.editJob(data).subscribe(res => {
        if (res && res.status == 200) {
        console.log(res);
        this._toastr.success("Job has been updated Successfully !!", "Dispatch Job");
        this.close();
        this.getCabList();
      } else {
        this._toastr.info("Error", "Dispatch Job");

      }
    })
  }
}
