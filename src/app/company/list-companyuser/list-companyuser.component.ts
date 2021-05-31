import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list-companyuser',
  templateUrl: './list-companyuser.component.html',
  styleUrls: ['./list-companyuser.component.scss']
})
export class ListCompanyuserComponent implements OnInit {

  p: number = 1;
  guests: any;
  image_url: any;
  data: any;
  showModal: boolean;
  blockModal: boolean;
  unblockModal: boolean;
  searchedKeyword: string;
  constructor(private service: UserService,
    private http: HttpClient,
    private _toastr: ToastrService,
    private navRoute: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.getuserList();
    this.image_url = `${environment.imageurl}`;


  }



  getuserList() {
    this.spinner.show();
    this.service.getAllcomuser().subscribe(res => {
      if (res && res.code == 200) {
        this.spinner.hide();
        this.guests = res.data
      } else {
        console.log('Error');

      }
    }
    );
  }
  close() {
    this.showModal = false;
    this.blockModal = false;
    this.unblockModal = false
  }


  getId(rowData: any) {
    this.data = rowData;
    console.log("data", this.data);
    this.showModal = true;

    // this.getBankDetailsByUserId();
  }

  Edit(id: number) {
    // console.log("hhhhh", id);
    //  id=Id;
    this.navRoute.navigate(['/company/edit/'], { queryParams: { userId: id } });
  }
  veiw(id: number) {
    console.log("hhhhh", id);
    this.navRoute.navigate(['/users/details/'], { queryParams: { userId: id } });
  }
  Booking(id :number) {
    console.log("hhhhh",id);
    localStorage.setItem("userID",JSON.stringify(id));
    return this.navRoute.navigate(['/jobs/addDispatch'])
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

  blockUser() {
    var data = { "_id": this.data }
    console.log("-------------", data);
    this.service.block(data).subscribe(res => {
      if (res && res.code == 200) {
        if (res.data.data.isBlock == true) {
          this._toastr.success("User has been block Successfully !!", "User");
          this.getuserList();
          this.close();
        } else if (res.data.data.isBlock == false) {
          this._toastr.success("User has been unblock Successfully !!", "User");
          this.getuserList();
          this.close();
        } else {
          this._toastr.info("Error", "User");
        }
      } else {
        this._toastr.info("Error", "User");
      }

    })
  }
  deleteuserList() {
    // this.showModal=true;

    console.log("id", this.data)
    var data = { "_id": this.data }
    this.service.deleteUser(data).subscribe(res => {
      if (res && res.status == 200) {
        console.log(res);
        this._toastr.success("User has been delete Successfully !!", "User");
        this.close();
        this.getuserList();
      } else {
        this._toastr.info("Error", "Doctor");

      }
    })
  }
}
