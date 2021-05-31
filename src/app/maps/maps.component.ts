import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {
  miniHeight: number = 2;

  constructor() { }

  @HostListener('window:resize', ['$event'])

  onResize(event) {
    this.setMiniHeight();
  }

  ngOnInit(): void {
    this.setMiniHeight();
  }

  setMiniHeight(){
    this.miniHeight = window.innerHeight - 220; // 230
    console.log(this.miniHeight);
  }

}
