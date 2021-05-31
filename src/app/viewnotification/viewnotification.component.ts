import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user/user.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-viewnotification',
  templateUrl: './viewnotification.component.html',
  styleUrls: ['./viewnotification.component.scss']
})
export class ViewnotificationComponent implements OnInit {
  
  paramsData: any;
  jobid: any;
  pickupAddress: any;
  dropAddress: any;
  trackid: any;
  message: any;
  name: any;
  image: any;
  imagefile: string;
  email: any;
  phonenumber: any;

  constructor(
    private route: ActivatedRoute,
    private userservice:UserService
  ) {
    this.route.queryParams.subscribe(params => {
      this.paramsData = { type: params['type'], userId: params['userId'],jobid :params['jobid'] };
    

  })
  console.log("notification params----",this.paramsData.jobid);
   this.jobid = this.paramsData.jobid
  }
  ngOnInit(): void {
    this.jobdetail();

  }
  jobdetail(){

   this.userservice.adminGetJobByid({id:this.jobid}).subscribe(res => {
    console.log("jobdetail res--",res.data);
    this.jobid = res.data.jobdetail._id
    this.name = res.data.jobdetail.user.name
    this.email = res.data.jobdetail.user.email
    this.phonenumber = res.data.jobdetail.user.phonenumber
    this.imagefile = `${environment.imageurl}${res.data.jobdetail.user.imagefile}`;
    this.pickupAddress = res.data.jobdetail.pickupLocation.address
    this.dropAddress = res.data.jobdetail.dropLocation.address
    this.trackid = res.data.jobdetail.jobid;
    this.message = res.data.notification.message
   })
  }

}
