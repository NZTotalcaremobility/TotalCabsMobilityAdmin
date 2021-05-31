import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dispach',
  templateUrl: './dispach.component.html',
  styleUrls: ['./dispach.component.scss']
})
export class DispachComponent implements OnInit {

  userTab = 'dispatch';
  constructor() { }

  ngOnInit(): void {
  }

  selectData(tab: string = 'dispatch') {
    this.userTab = tab;
  }
  // selectData1(){
  //   this.userTab='cover';
  // }
  // selectData2(){
  //   this.userTab='addCover';
  // }
  // selectData3(){
  //   this.userTab='addDispatch';
  // }
}
