import { Component, OnInit } from '@angular/core';
import { ChildActivationStart } from '@angular/router';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss']
})
export class JobComponent implements OnInit {
  userTab='Requested';
  constructor() { }

  ngOnInit(): void {
  }

  selectData(){
    this.userTab='Requested';
  }
  selectData1(){
    this.userTab='Ongoing';
  }
  selectData2(){
    this.userTab='Completed';
  }
  selectData3(){
    this.userTab='AddCoverJob';
  }
}
