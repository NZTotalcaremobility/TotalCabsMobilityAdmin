import { Label, Color, BaseChartDirective, MultiDataSet } from 'ng2-charts';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { MapsAPILoader } from '@agm/core';
import { UserService } from './../user/user.service';
import { AppService } from './../app.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { environment } from './../../environments/environment';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-calculate-fare',
  templateUrl: './calculate-fare.component.html',
  styleUrls: ['./calculate-fare.component.scss']
})
export class CalculateFareComponent implements OnInit {

  @ViewChild('Pickuplocation', { static: false })
  public PickuplocationElementRef: ElementRef;
  @ViewChild('DropLocation', { static: false })
  public DropLocationElementRef: ElementRef;


  public months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  public page: number = 1;
  public declinedofJobsPage: number = 1;
  public allocatedjobsPage: number = 1;
  public allocatedJobs: any = [];
  public listOfJobs: any = [];
  public declinedofJobs: any = [];
  public userByType: any = [];
  public totalVehicles: any = 0;
  public freeVehicles: any = 0;
  show: boolean = false;

  filterForm = new FormGroup({
    type: new FormControl('')
  }); data: any;
  showBox: any;
  showConfirmTaxiDialog: any;
  pickup: any;
  driversdata: any[];
  fairForm: FormGroup;
  latitude: number;
  longitude: number;
  pickuplocation: string;
  lat: number;
  lng: number;
  dropLocation: string;
  distance: any;
  kilometerdistance: any = 0;
  duration: any = 0;
  mini: any = 0;
  Wheelchair: any = 0;
  selected: any;
  webbaseURL: string = environment.webBaseURL;
  start: any;
  end: any;
  renderOptions = {
    suppressMarkers: true,
  }

  markerOptions = {
    origin: {
      infoWindow: "Origin",
      icon: 'https://www.shareicon.net/data/32x32/2017/02/01/877364_miscellaneous_512x512.png',

    },
    destination: {
      infoWindow: "destination",
      icon: 'https://www.shareicon.net/data/32x32/2017/02/01/877364_miscellaneous_512x512.png',
    },
  }



  constructor(
    private service: UserService,
    private formBuilder: FormBuilder,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private _toastr: ToastrService,
  ) {
    this.fairForm = this.formBuilder.group({
      'pickUpLocation': ['', Validators.compose([Validators.required])],
      'dropUpLocation': ['', Validators.compose([Validators.required])],
      'carType': ['', Validators.compose([Validators.required])]
    });

  }

  ngOnInit() {

    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.PickuplocationElementRef.nativeElement, {
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          console.log("place", place);
          this.latitude = place.geometry.location.lat();
          console.log("latitude", this.latitude);

          this.longitude = place.geometry.location.lng();
          console.log("longitude", this.longitude);
          this.pickuplocation = place.name + ',' + place.formatted_address;
          console.log("pickuplocation", this.pickuplocation);

          // for (var i = 0; i < place.address_components.length; i++) {
          //   var addressType = place.address_components[i].types[0];
          //   if (addressType == "country") {
          //     console.log(place.address_components[i].short_name);

          //   }
          // }
        });
      });
    });
    let data = JSON.parse(localStorage.getItem('user_login'));
    // this.socket = io.connect(`http://localhost:3531/?userId=${data.userId}`)


    // this.data.searchBox.subscribe(res =>{
    // this.showBox = res;
    // })
    // this.data.confirmtaxidialog.subscribe(res=>{
    // console.log(res,'res in confirmtaxidialog')
    // this.showConfirmTaxiDialog=res
    // })
    // this.data.getDestinationLoc.subscribe((marker: any) =>{
    // console.log(marker,'its reached here at marker')
    // if(marker.driver){

    // let apidata = {origin:this.pickup,destination:marker}
    // console.log(apidata,'apidata++++')
    // this.userservice.getdistance1(apidata).subscribe(res =>{

    // console.log("resdta//////",res);

    // this.markerOptions.destination.infoWindow=res.data.rows[0].elements[0].duration.text;
    // // console.log("res data--++----->",res.data.rows[0].elements[0].duration.text);
    // // this.distancedata.AddDistanceData(res.data)


    // this.ngZone.run(()=>{
    // console.log(res,'getdistance')
    // this.driversdata = [];
    // // this.showWindow=true
    // this.driversdata.push({lat:marker.latitude,long:marker.longitude,eta:res.data.rows[0].elements[0].duration.text})

    // console.log(this.driversdata,'this.driversdata+++++')



    // this.data.changeTaxiEta(res.data.rows[0].elements[0].duration.text)

    // // this.markerOptions.destination.icon = 'assets/images/car.png';
    // this.markerOptions.destination.infoWindow=`<p>ETA:${res.data.rows[0].elements[0].duration.text}</p>`
    // console.log({latitude:this.latitude,longitude:this.longitude},'old and new lat',{latitude:marker.latitude,longitude:marker.longitude})
    // // console.log("res data--++----->",res.data.rows[0].elements[0].duration.text);
    // // this.distancedata.AddDistanceData(res.data)
    // this.markerOptions.destination.icon ='assets/images/car.png'
    // this.end = { lat: marker.latitude, lng: marker.longitude }
    // })
    // },err=>{console.log(err);
    // }
    // );


    // }
    // else{
    // console.log('its reached here at searchmarker+++')
    // this.destination= marker
    // this.latitude = marker.latitude;
    // this.longitude = marker.longitude;
    // this.end = { lat: marker.latitude, lng: marker.longitude }
    // }
    // } )

    // this.data.getPickupLoc.subscribe((marker: any)=>{
    // console.log("markerr--",marker);

    // if(marker.driver){
    // this.driversdata = [];
    // let apidata = {origin:marker,destination:this.destination}

    // this.userservice.getdistance1(apidata).subscribe(res =>{
    // this.markerOptions.origin.infoWindow=res.data.rows[0].elements[0].duration.text;
    // // console.log("res data--++----->",res.data.rows[0].elements[0].duration.text);
    // // this.distancedata.AddDistanceData(res.data)

    // },err=>{console.log(err);
    // }
    // );

    // this.markerOptions.destination.icon = 'assets/images/car.png';
    // }
    // this.pickup = marker
    // this.latitude = marker.latitude;
    // this.longitude = marker.longitude;
    // this.start = { lat: marker.latitude, lng: marker.longitude }
    // });
    // this.data.getAlldriver.subscribe((marker: any)=>

    // {this.driver =marker
    // this.latitude = marker.latitude;
    // this.longitude = marker.longitude;
    // this.start = { lat: marker.latitude, lang: marker.longitude }
    // console.log("driverrrr--->",this.start);

    // });
    //load Places Autocomplete
    // this.mapsAPILoader.load().then(() => {
    // this.setCurrentLocation();
    // this.getdriverlist();
    // this.geoCoder = new google.maps.Geocoder;

    // let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
    // autocomplete.addListener("place_changed", () => {
    // this.ngZone.run(() => {
    // //get the place result
    // let place: google.maps.places.PlaceResult = autocomplete.getPlace();

    // //verify result
    // if (place.geometry === undefined || place.geometry === null) {
    // return;
    // }

    // //set latitude, longitude and zoom
    // this.latitude = place.geometry.location.lat();
    // this.longitude = place.geometry.location.lng();
    // this.zoom = 12;
    // this.getDriverData(this.latitude,this.longitude);
    // });
    // });
    // });
  }

  ngAfterViewInit() {
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.DropLocationElementRef.nativeElement, {
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          this.lat = place.geometry.location.lat();
          console.log("latitude", this.lat);
          this.lng = place.geometry.location.lng();
          console.log("long", this.lng);
          this.dropLocation = place.name + ',' + place.formatted_address;
          console.log("dropLocation", this.dropLocation);

        });
      });
    });
  }
  onOptionsSelected(event) {
    const value = event.target.value;
    this.selected = value;
    console.log(value);
  }
  submitForm() {
    this.markFormTouched(this.fairForm);
    console.log("fairData", this.fairForm.value);

    if (this.fairForm.valid) {
      let finalData = {
        origin: {
          latitude: this.latitude,
          longitude: this.longitude,
          address: this.pickuplocation
        },
        destination: {
          latitude: this.lat,
          longitude: this.lng,
          address: this.dropLocation
        },

      }
      console.log("finalData", finalData);

      this.service.getDistence(finalData).subscribe(res => {
        if (res && res.code == 200) {

          this.show = true
          console.log("distancedata---+", res)
          this.distance = res.data.rows[0].elements[0].distance.text;
          this.duration = res.data.rows[0].elements[0].duration.text;
          this.distance = this.distance.split(" ", 1);

          this.kilometerdistance = parseFloat(this.distance) / 0.621371;
          this.kilometerdistance = this.kilometerdistance.toFixed(2)
          console.log("km--", this.kilometerdistance);
          this.mini = `$${(parseFloat(this.kilometerdistance) * 3.5 + 3).toFixed(2)}`
          this.Wheelchair = `$${(parseFloat(this.kilometerdistance) * 4.5 + 3).toFixed(2)}`

          //   console.log(this.fairForm.value);
          //   this.navRoute.navigate(['/dispach']);
          this.reset();
          this._toastr.success(res.message, "Dashboard");
        } else if (res && res.code == 402) {
          this._toastr.info(res.message, "Dashboard ");
        } else {
          this._toastr.info("Error", "Dashboard");
        }
      });
    }
    else {
      this._toastr.info("Enter Origin and Destination", "Dashboard");
    }

  }
  markFormTouched(group: FormGroup | FormArray) {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.controls[key];
      if (control instanceof FormGroup || control instanceof FormArray) { control.markAsTouched(); this.markFormTouched(control); }
      else { control.markAsTouched(); };
    });
  };
  reset() {
    this.fairForm.reset();

  }
}
