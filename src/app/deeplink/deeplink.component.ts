import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-deeplink',
  templateUrl: './deeplink.component.html',
  styleUrls: ['./deeplink.component.scss']
})
export class DeeplinkComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.deeplink()
  }
  deeplink() {
    console.log("in deep linking");
    
    let ua = navigator.userAgent.toLowerCase();
    let isAndroid = ua.indexOf("android") > -1; // android check
    let isIphone = ua.indexOf("iphone") > -1; // ios check
    if (isIphone == true) {
     let app = { 
       launchApp: function() {
        setTimeout(function() {
          window.location.href = "https://itunes.apple.com/us/app/appname/appid";
        }, 25);
        window.location.href = "bundlename://TotalCabs"; //which page to open(now from mobile, check its authorization)
       },
       openWebApp: function() {
        window.location.href = "https://itunes.apple.com/us/app/appname/appid";
       }
   };
   app.launchApp();
  } else if (isAndroid== true) {
     let app = { 
       launchApp: function() {
         window.location.replace("bundlename://TotalCabs"); //which page to open(now from mobile, check its authorization)
         setTimeout(this.openWebApp, 500);
       },
       openWebApp: function() {
         window.location.href =  "https://play.google.com/store/apps/details?id=packagename";
       }
   };
   app.launchApp();
  }else{
   //navigate to website url
  }
 }

}
