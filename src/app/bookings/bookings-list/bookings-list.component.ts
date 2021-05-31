import { NgxSpinnerService } from 'ngx-spinner';
import { AppService } from './../../app.service';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { JobService } from 'src/app/job/job.service';

@Component({
  selector: 'app-bookings-list',
  templateUrl: './bookings-list.component.html',
  styleUrls: ['./bookings-list.component.scss']
})
export class BookingsListComponent implements OnInit {
  bookingsList: any;
  page: number = 1;
  imageURL: string = environment.imageurl
  name: any;
  email: any;
  phonenumber: any;
  profileModal: boolean;
  cabList: any;
  searchedKeyword: string;

  constructor(private api: AppService, 
    private service: JobService,
    private _spinner: NgxSpinnerService) { }


  ngOnInit(): void {
    this.getbookingsList();
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
  data(arg0: string, data: any) {
    throw new Error('Method not implemented.');
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
  
    this.profileModal = false;
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
  getbookingsList() {
    this._spinner.show()
    this.api.callApi(`${environment.backendBaseURL}/api/admin/listBookings`, 'POST', {}, {}).subscribe(res => {
      this.bookingsList = res['data'].data;
      console.log('totalr count of llist', this.bookingsList.length, res['data'].data.length, res['data'])
      this._spinner.hide()
    })
  }

}
