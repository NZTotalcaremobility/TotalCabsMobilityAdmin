import { FormGroup, FormControl } from '@angular/forms';
import { AppService } from './../../../app.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as moment from 'moment'

@Component({
  selector: 'app-companyjobs',
  templateUrl: './companyjobs.component.html',
  styleUrls: ['./companyjobs.component.scss']
})
export class CompanyjobsComponent implements OnInit {

  userTab: any = 'upcoming'
  imagePath: String = environment.imageurl

  userDetails: any = {};
  upComingJob: any = [];
  onGoingJobs: any = [];
  completedJob: any = [];
  canceledJob: any = [];

  filterForm = new FormGroup({
    daterange: new FormControl('')
  });

  selected: any;


  constructor(
    private activateRoute: ActivatedRoute,
    private api: AppService
  ) { }

  ngOnInit(): void {
    const { snapshot } = this.activateRoute;
    const { params } = snapshot;
    const { _id } = params;
    this.getUserJobs(_id)
  }

  getUserJobs(_id?: String, params?: any) {
    this.api.callApi(`${environment.backendBaseURL}/api/admin/user/${_id}/jobs`, 'POST', {}, { params }).subscribe(res => {
      if (res['data']) {
        this.userDetails = { ...res['data'].userDetails, imagefile: `${environment.imageurl}${res['data']?.userDetails?.imagefile || 'profile-pic.jpg'}` }
        this.upComingJob = res['data'].upComingJob
        this.onGoingJobs = res['data'].onGoingJobs
        this.completedJob = res['data'].completedJob
        this.canceledJob = res['data'].canceledJob
      }
    })
  }

  getFilterJobs() {
    let params: any = {};

    const { snapshot } = this.activateRoute;
    const { params: urlParams } = snapshot;
    const { _id } = urlParams;

    const { value } = this.filterForm

    if (value.daterange.endDate) {
      params["endDate"] = value.daterange.endDate
    }
    if (value.daterange.startDate) {
      params['startDate'] = value.daterange.startDate
    }
    this.getUserJobs(_id, params);
  }

}
