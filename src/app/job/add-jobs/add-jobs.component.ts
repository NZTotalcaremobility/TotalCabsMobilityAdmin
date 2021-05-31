import { AppService } from './../../app.service';
import { environment } from './../../../environments/environment';
import { async } from '@angular/core/testing';
import { MapsAPILoader } from '@agm/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnlyCharFieldValidator } from 'src/app/shared/validation/validations.validator';
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { FLOAT } from 'html2canvas/dist/types/css/property-descriptors/float';
import { UserService } from '../../user/user.service';
import { nullSafeIsEquivalent, THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import * as moment from 'moment';


@Component({
  selector: 'app-add-jobs',
  templateUrl: './add-jobs.component.html',
  styleUrls: ['./add-jobs.component.scss']
})
export class AddJobsComponent implements OnInit {
  guests: any;
  @ViewChild('Pickuplocation', { static: false })
  public PickuplocationElementRef: ElementRef;
  @ViewChild('DropLocation', { static: false })
  public DropLocationElementRef: ElementRef;
  @ViewChild('Location', { static: false })
  public LocationElementRef: ElementRef;
  // @ViewChild('Location', { static: false })
  // public LocationElementRef: ElementRef;

  minDate = new Date();
  minTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  // minDate = moment(new Date()).subtract(18, "years");
  disabled = false;
  ShowFilter = false;
  limitSelection = false;
  cities: any = [];
  selectedItems: any = [];
  dropdownSettings: any = {};

  userForm: FormGroup;
  lat: number;
  lng: number;
  dropLocation: string;
  latitude: number;
  longitude: number;
  pickuplocation: string;
  latLocation: number;
  lngLocation: number;
  location: string;
  midlocationcount: number;
  rbData: Boolean = false;
  firstdis: any[] = [];
  td: any;
  tod: any[] = [];
  dd: any; //drop distance
  mini: any;

  distance: any;
  duration: any;
  kilometerdistance: any;
  // user: any;
  userEmail: any;
  userPhone: any;
  hide: boolean = false;
  driver: { _id: string; };
  userData: { _id: string; };
  tempData: any;
  value: any;

  imagePath: string = environment.imageurl;
  time: any;
  searchResult: any = [];
  isAutoCompleteShown: boolean = false;
  isUser: boolean = false;
  keyword = 'name';
  isOver: boolean = false;
  isDisabled: boolean = false;
  mailbyMsg: string;
  currentUser: any;
  zoom: number = 3;
  show: boolean = false;
  driverName: any;
  carType: any;
  myDateValue: Date;
  baseFare: any = 0;
  prie: any =0

  // midlocation(): FormArray {
  //   return this.userForm.get("midlocation") as FormArray
  // }

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private navRoute: Router,
    private route: ActivatedRoute,
    private _toastr: ToastrService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private UserService: UserService,
    private api: AppService,
  ) {
    this.userForm = this.fb.group({
      'userID': [''],
      'name': ['', Validators.compose([Validators.required])],
      'email': ['', Validators.compose([Validators.pattern(/^(\d{10}|\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/)])],
      'phonenumber': ['', Validators.compose([Validators.pattern(/^[0][1-9]\d{9}$|^[1-9]\d{9}$/)])],
      'dateOfJourney': [''],
      // 'dateOfJourney': ['', Validators.compose([Validators.required,Validators.pattern(/ ( ( (0|1) [0-9]|2 [0-9]|3 [0-1])\/ (0 [1-9]|1 [0-2])\/ ( (19|20)\d\d))$/)])],
      'timeOfJourney': ['', Validators.compose([Validators.required])],
      'carType': ['', Validators.compose([Validators.required])],
      'pickUpLocation': ['', Validators.compose([Validators.required])],
      'dropUpLocation': ['', Validators.compose([Validators.required])],
      'recursiveBooking': this.rbData,
      'dayOfJourney': [this.selectedItems],
      'price': ['', Validators.compose([Validators.required])],
      'mailby': ['']
    });
    this.td = 0;
    this.dd = 0;
  }


  ngOnInit(): void {
    console.log('minTime', this.minTime);
    this.reset();
    this.myDateValue = new Date();
    // this.currentUser =JSON.parse(localStorage.getItem("userID"));
    // console.log("currentuser-----",this.currentUser);
    // this.getDispatchJob() ;

    // this.userForm.controls['price'].setValue(23.13);
    // this.midlocation().push(this.newContainer());
    // this.getLocation(this.midlocation().length);
    this.getdriverList();
    this.getUserList();
    this.cities = [
      { id: 1, day: 'Monday' },
      { id: 2, day: 'Tuesday' },
      { id: 3, day: 'Wednesday' },
      { id: 4, day: 'Thursday' },
      { id: 5, day: 'Friday' },
      { id: 6, day: 'Saturday' }
    ];
    this.dropdownSettings = {
      "singleSelection": false,
      "defaultOpen": false,
      "idField": "id",
      "textField": "day",
      "selectAllText": "Select All",
      "unSelectAllText": "UnSelect All",
      "enableCheckAll": false,
      "itemsShowLimit": 3,
      "allowSearchFilter": true
    };
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.PickuplocationElementRef.nativeElement, {
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.pickuplocation = place.name + ',' + place.formatted_address;
          // Below code added by nayan for distance and fare calculation when change pickup location.
          if (this.pickuplocation && this.dropLocation) {
            if (this.latitude && this.longitude && this.lat && this.lng) {
              const points = [];
              let previous = {};
              if (this.firstdis.length > 0) {
                this.firstdis.forEach(async (location, index) => {
                  if (index === 0) {
                    points.push({
                      origin: [{ lat: this.latitude, lng: this.longitude }],
                      destination: [{ lat: location.lat, lng: location.lng }],
                      loc: location.loc
                    });
                  } else {
                    points.push({
                      origin: [previous],
                      destination: [{ lat: location.lat, lng: location.lng }],
                      loc: location.loc
                    });
                  }
                  previous = { lat: location.lat, lng: location.lng };
                });
                points.push({
                  origin: [previous],
                  destination: [{ lat: this.lat, lng: this.lng }],
                });
              } else {
                points.push({
                  origin: [{ lat: this.latitude, lng: this.longitude }],
                  destination: [{ lat: this.lat, lng: this.lng }],
                });
              }
              this.td = 0;
              this.duration = 0;
              if (points) {
                points.forEach(async (point) => {
                  const { text, value, time } = await this.getDistanceClient(point.origin, point.destination);
                  this.td += value;
                  this.duration += time;
                  this.kilometerdistance = this.td;
                  this.fareCalculate();
                });
              }
            }
          }
          // eof distance and fare calculation when change pickup location.
        });
      });
    });
  }
  onItemSelect(item: any) {
    console.log('onItemSelect', item);

  }
  toogleShowFilter() {
    this.ShowFilter = !this.ShowFilter;
    this.dropdownSettings = Object.assign({}, this.dropdownSettings, { allowSearchFilter: this.ShowFilter });
  }

  ngAfterViewChecked() {
    // viewChild is updated after the view has been checked

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
          this.dropadd();
        });
      });
    });
  }

  dropadd() {
    const init = async () => {
      if (this.latitude && this.longitude && this.lat && this.lng) {
        let points = [];
        let previous = {}
        if (this.firstdis.length > 0) {
          this.firstdis.forEach(async (location, index) => {
            if (index === 0) {
              points.push({
                origin: [{ lat: this.latitude, lng: this.longitude }],
                destination: [{ lat: location.lat, lng: location.lng }],
                loc: location.loc
              })
            } else {
              points.push({
                origin: [previous],
                destination: [{ lat: location.lat, lng: location.lng }],
                loc: location.loc
              })
            }
            previous = { lat: location.lat, lng: location.lng }
          });
          points.push({
            origin: [previous],
            destination: [{ lat: this.lat, lng: this.lng }],
          })
        } else {
          points.push({
            origin: [{ lat: this.latitude, lng: this.longitude }],
            destination: [{ lat: this.lat, lng: this.lng }],
          })
        }
        this.td = 0;
        this.duration = 0
        if (points) {
          points.forEach(async (point) => {
            let { text, value, time } = await this.getDistanceClient(point.origin, point.destination)
            this.td += value;
            this.duration += time;
            this.kilometerdistance = this.td;
            this.fareCalculate();
          })
        }
      }
    }
    init();
  }

  long(arg0: string, long: any) {
    throw new Error('Method not implemented.');
  }
  getDispatchJob(): void {
    console.log("current user--", this.currentUser);
    let id = this.currentUser
    this.UserService.getUserById({id:id}).subscribe(res => {
      console.log("Dispatch data--",res.data);
      if (res.code === 200) {
     
        
       // const { user } = res.data

       
        const finalIntdata = {
          name: res.data.name,
          email: res.data.email || null,
          phonenumber: res.data.phonenumber || null,
          userID: res.data._id,
          timeOfJourney: null,
        carType:null,
          pickUpLocation:  null,
          dropUpLocation:  null,
          price: null,
          dateOfJourney: null,
         // midlocation: null,
          recursiveBooking: null,
          dayOfJourney:null,
          mailby: null,
        
                  };

        this.userForm.setValue(finalIntdata)
      } else {
        this._toastr.error(res['message'])
      }
    })
  }

  getLocation(count?) {
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.LocationElementRef.nativeElement, {
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          // this.midlocation().controls[count - 1].get('latitude').setValue(place.geometry.location.lat())
          // this.midlocation().controls[count - 1].get('longitude').setValue(place.geometry.location.lng())
          // this.midlocation().controls[count - 1].get('location').setValue(place.name + ',' + place.formatted_address)
          this.latLocation = place.geometry.location.lat();
          console.log("latitude", this.latLocation);
          this.lngLocation = place.geometry.location.lng();
          console.log("long", this.lngLocation);
          this.location = place.name + ',' + place.formatted_address;
          console.log("location", this.location);
        });
      });
    });
  }

  newContainer(): FormGroup {
    return this.fb.group({
      location: '',
      latitude: '',
      longitude: '',
    })
  }

  rm(item) {
    const index: number = this.firstdis.indexOf(item);
    if (index !== -1) {
      this.firstdis.splice(index, 1);
    }

    const init = async () => {
      if (this.latitude && this.longitude && this.lat && this.lng) {
        let points = [];
        let previous = {}
        if (this.firstdis.length > 0) {
          this.firstdis.forEach(async (location, index) => {
            if (index === 0) {
              points.push({
                origin: [{ lat: this.latitude, lng: this.longitude }],
                destination: [{ lat: location.lat, lng: location.lng }],
                loc: location.loc
              })
            } else {
              points.push({
                origin: [previous],
                destination: [{ lat: location.lat, lng: location.lng }],
                loc: location.loc
              })
            }
            previous = { lat: location.lat, lng: location.lng }
          });
          points.push({
            origin: [previous],
            destination: [{ lat: this.lat, lng: this.lng }],
          })
        } else {
          points.push({
            origin: [{ lat: this.latitude, lng: this.longitude }],
            destination: [{ lat: this.lat, lng: this.lng }],
          })
        }
        this.td = 0;
        this.duration = 0
        if (points) {
          points.forEach(async (point) => {
            let { text, value, time } = await this.getDistanceClient(point.origin, point.destination)
            this.td += value;
            this.duration += time
            this.kilometerdistance = this.td;
            // this.mini = (parseFloat(this.td) * 3.5 + 3).toFixed(2);
            this.fareCalculate();
          })
        }
      }
    }
    init();
  }

  // removeContainer(i: number) {
  //   this.midlocation().removeAt(i);
  // }
  getdriverList() {
    this.UserService.getAlldriver1().subscribe(res => {
      if (res && res.code == 200) {
        console.log(res)
        this.guests = res.data
        console.log("guest", this.guests);
      } else {
        console.log('Error');

      }
    }
    );
  }


  getUserList() {
    this.UserService.getAlluser().subscribe(res => {
      if (res && res.code == 200) {
        console.log(res)
        this.tempData = res.data
        console.log("tempData", this.tempData);
      } else {
        console.log('Error');

      }
    }
    );
  }
  FieldsChange(values: any) {
    this.rbData = values.currentTarget.checked;
    console.log("rbData", this.rbData);
  }

  submitForm() {
    console.log("hit", this.userForm.value);

    this.markFormTouched(this.userForm);
    if (this.userForm.valid) {
      if (this.userForm.value.mailby === 'Email') {
        if (this.userForm.value.email === '' || this.userForm.value.email === null || this.userForm.value.email === undefined) {
          this.mailbyMsg = 'This user cannot be notified via email.';
          return false;
        }
      } else if (this.userForm.value.mailby === 'Phone') {
        if (this.userForm.value.phonenumber === '' || this.userForm.value.phonenumber === null || this.userForm.value.phonenumber === undefined) {
          this.mailbyMsg = 'This user cannot be notified via phone.';
          return false;
        }
      }

      this.isDisabled = true;

      // let date = new Date(this.userForm.value.dateOfJourney).toISOString()

      this.duration = `${moment.duration(this.duration, "seconds").hours().toFixed()} hours ${this.duration % 60} mins`;

      let finalData = {
        user: {
          name: this.userForm.value.name,
          phonenumber: this.userForm.value.phonenumber,
          email: this.userForm.value.email
        },
        dateOfJourney: new Date(this.userForm.value.dateOfJourney),
        timeOfJourney: this.userForm.value.timeOfJourney,
        // dayOfJourney: this.userForm.value.dayOfJourney,
        mailby: this.userForm.value.mailby,
        fare: this.baseFare ? this.userForm.value.price :0,
        price: this.mini ? this.userForm.value.price :0,
        carType: this.userForm.value.carType,
        pickupLocation: {
          latitude: this.latitude,
          longitude: this.longitude,
          address: this.pickuplocation
        },
        dropLocation: {
          latitude: this.lat,
          longitude: this.lng,
          address: this.dropLocation
        },
        //midlocation: this.firstdis,
        duration: this.duration,
        totaldistance: this.td,
        distance: this.td
      }
      console.log("finalData", finalData.user.email);

      this.UserService.coverJob(finalData).subscribe(res => {
        this.isDisabled = false;
        if (res && res.code === 200) {
          this.reset();
          this._toastr.success(res.message);
          return this.navRoute.navigate(['/jobs/cover']);
        } else if (res && res.code == 402) {
          this._toastr.info(res.message, "cover Jobs ");
        } else {
          this._toastr.info(res.message, "Cover Jobs");
        }
      });
    }
    else {
      this._toastr.info("All Feild are required", "Cover Jobs");
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
    this.userForm.reset();

  }
  onOptionsSelected(value: string) {
    console.log('sdfsdfsd', value)
    this.carType = value
  }

  onSelected(value: string) {
    this.userData = { _id: value };
    console.log("obj", this.userData);
    this.UserService.getUserById(this.userData).subscribe(res => {
      if (res && res.code == 200) {
        console.log(res);
        this.userEmail = res.data.data.email;
        console.log(this.userEmail);
        this.userPhone = res.data.data.phonenumber;
        console.log(this.userPhone);
        this.hide = true;

      }
    })
  }

  fareCalculate() {
    if (this.carType == "9 Seater Van") {
      let baseFare = parseFloat(this.td) * 4.5;
      this.mini = (baseFare + 3).toFixed(2);
      this.baseFare = baseFare.toFixed(2)
      this.userForm.controls['price'].setValue(this.mini);

    } else if (this.carType == "wheelChair Van") {

      let baseFare = parseFloat(this.td) * 4.5;
      this.mini = (baseFare + 3).toFixed(2);
      this.baseFare = baseFare.toFixed(2)
      this.userForm.controls['price'].setValue(this.mini);

    } else if (this.carType == "Mini") {


      let baseFare = parseFloat(this.td) * 3.5;
      this.mini = (baseFare + 3).toFixed(2);
      this.baseFare = baseFare.toFixed(2)
      this.userForm.controls['price'].setValue(this.mini);

    } else {
      console.log("Not selected");

    }
  }

  getDistanceClient(origin, destination): any {
    return new Promise((resolve, reject) => {
      const service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: origin,
          destinations: destination,
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false,
        },
        (response, status) => {
          if (status !== "OK") {
            return reject('Please try again')
          } else {
            const { rows } = response;
            const data = {
              text: '',
              value: 0,
              time: 0
            }

            this.value = rows[0]?.elements[0]?.distance.value
            let time = rows[0]?.elements[0]?.duration.value
            this.value = (Number(this.value) / 1000).toFixed(0)
            data.text = `${this.value} Km`;
            data.value = Number(this.value)
            data.time = time;
            return resolve(data);
          }
        }
      );


    });
  }
  handleSearch() {
    let str1 = this.userForm.value.name;
    let params = {}
    if (/^[0-9]/.test(str1)) {
      params['key'] = Number(this.userForm.value.name)
    } else {
      params['name'] = this.userForm.value.name
    }

    this.hide = false;
    clearTimeout(this.time);
    this.time = setTimeout(() => {
      this.api.callApi(`${environment.backendBaseURL}/api/admin/user`, "POST", {}, { params }).subscribe(res => {
        console.log('final', res['data'])
        let result = res['data'];
        console.log("rsult--", result);

        if (result.status) {
          this.searchResult = result.data
          this.isAutoCompleteShown = true
        }
      })
    }, 250);
  }

  // onhandleFocus() {
  //   this.isAutoCompleteShown = false
  //   this.isUser = true

  // }


  onHandleSelect(type: string, data: any) {
    this.isAutoCompleteShown = false
    if (type === 'click') {
      this.userForm.controls['name'].setValue(data.name)
      this.userForm.controls['userID'].setValue(data?._id)
      this.userForm.controls['phonenumber'].setValue(data?.phonenumber)
      this.userForm.controls['email'].setValue(data?.email)
    }

  }
}