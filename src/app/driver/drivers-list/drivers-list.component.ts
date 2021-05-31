import { Component, OnInit } from '@angular/core';
import { DriverServiceService } from '../driver-service.service';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { ToastrService } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-drivers-list',
  templateUrl: './drivers-list.component.html',
  styleUrls: ['./drivers-list.component.scss']
})
export class DriversListComponent implements OnInit {
  p: number = 1;
  guests: any;
  showModal: boolean;
  data: any;
  image_url: string;
  blockModal: boolean;
  unblockModal: boolean;
  isDataLoaded: boolean = false;
  searchedKeyword: string;

  constructor(private service: DriverServiceService,
    private http: HttpClient,
    private _toastr: ToastrService,
    private navRoute: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    console.log('hhhhhhh')
    this.getdriverList();
    this.image_url = `${environment.imageurl}`;

  }

  getdriverList() {
    // this.spinner.show();
    this.service.getAlldriver().subscribe(res => {
      console.log("response----",res);
      
      if (res && res.code == 200) {
        this.guests = res.data;
        this.isDataLoaded = true;
        // this.spinner.hide();
        // setTimeout(() => {
        //   console.log(res)
        //   this.guests = res.data
        //   console.log("guest", this.guests);
        // }, 5000)
      } else {
        console.log('Error');

      }
    }
    );
  }

  close() {
    this.showModal = false;
    this.blockModal = false;
    this.unblockModal=false
  }

  getId(rowData: any) {
    this.data = rowData;
    this.showModal = true;
  }
  Edit(id: number) {
    // console.log("hhhhh", id);
    //  id=Id;
    this.navRoute.navigate(['/drivers/edit/'], { queryParams: { userId: id } });
  }
  Block(rowData: any) {
    console.log("hhhhh", rowData);
    this.data = rowData;
    this.blockModal = true;
  }
  Unclock(rowData: any) {
    console.log("hhhhh", rowData);
    this.data = rowData;
    this.unblockModal = true;
  }
  veiwDriver(id: number) {
    console.log("hhhhh", id);
    this.navRoute.navigate(['/drivers/details/'], { queryParams: { userId: id } });
  }
  blockDriver() {
    var data = { "_id": this.data }
    console.log("-------------", data);
    this.service.blockUser(data).subscribe(res => {
      if (res && res.code == 200) {
            if (res.data.data.isBlock == true) {
          this._toastr.success("Driver has been block Successfully !!", "Driver");
          this.getdriverList();
          this.close();
        } else if (res.data.data.isBlock == false) {
          this._toastr.success("Driver has been unblock Successfully !!", "Driver");
          this.getdriverList();
          this.close();
        } else {
          this._toastr.info("Error", "Driver");
        }
      } else {
        this._toastr.info("Error", "Driver");
      }

    })
  }
  deleteDriver() {
    console.log("id", this.data)
    var data = { "_id": this.data }
    this.service.deleteDriver(data).subscribe(res => {
      if (res && res.status == 200) {
        console.log(res);
        this._toastr.success("Driver has been delete Successfully !!", "Driver");
        this.getdriverList();
        this.close();
      } else {
        this._toastr.info("Error", "Driver");

      }
    })
  }
}