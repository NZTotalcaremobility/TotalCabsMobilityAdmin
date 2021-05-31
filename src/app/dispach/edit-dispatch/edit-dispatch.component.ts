import { environment } from '../../../environments/environment';
import { AppService } from './../../app.service';
import { async } from '@angular/core/testing';
import { MapsAPILoader } from '@agm/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DispachService } from '../dispach.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FLOAT } from 'html2canvas/dist/types/css/property-descriptors/float';
import { UserService } from '../../user/user.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import * as moment from 'moment';
// import { threadId } from 'worker_threads';


@Component({
  selector: 'app-edit-dispatch',
  templateUrl: './edit-dispatch.component.html',
  styleUrls: ['./edit-dispatch.component.scss']
})
export class EditDispatchComponent implements OnInit {
  @ViewChild('Pickuplocation', { static: false })
  public PickuplocationElementRef: ElementRef;
  @ViewChild('DropLocation', { static: false })
  public DropLocationElementRef: ElementRef;
  @ViewChild('Location', { static: false })
  public LocationElementRef: ElementRef;
  // @ViewChild('Location', { static: false })
  // public LocationElementRef: ElementRef;

  isEdit: boolean = false;
  activatedJob: any = null;
  minDate = new Date();
  minTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  // minDate = moment(new Date()).subtract(18, "years");
  disabled = false;
  ShowFilter = false;
  limitSelection = false;
  delModal: boolean = false;
  count: number = 0
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
  dd: any; // drop distance
  mini: any;
  mailbyMsg: string;

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
  pickdata: any;

  imagePath: string = environment.imageurl;
  time: any;
  searchResult: any = [];
  isAutoCompleteShown: boolean = false;
  isUser: boolean = false;
  keyword = 'name';
  isOver: boolean = false;
  isDisabled: boolean = false;

  guests: any;
  zoom: number = 3;

  show: boolean = false;
  driverName: any;
  carType: any;
  baseFare: any = 0;
  price :any;

  midlocation(): FormArray {
    return this.userForm.get('midlocation') as FormArray;
  }

  constructor(
    private service: DispachService,
    private http: HttpClient,
    private fb: FormBuilder,
    private navRoute: Router,
    private route: ActivatedRoute,
    private _toastr: ToastrService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private UserService: UserService,
    private api: AppService
  ) {
    this.userForm = this.fb.group({
      userID: [''],
      name: ['', Validators.compose([Validators.required])],
      email: [''],
      phonenumber: ['', Validators.compose([Validators.pattern(/^[0][1-9]\d{9}$|^[1-9]\d{9}$/)])],
      dateOfJourney: ['', Validators.compose([Validators.required])],
      // 'dateOfJourney': ['', Validators.compose([Validators.required])],
      timeOfJourney: ['', Validators.compose([Validators.required])],
      driverdetails: ['', Validators.compose([Validators.required])],
      pickUpLocation: ['', Validators.compose([Validators.required])],
      dropUpLocation: ['', Validators.compose([Validators.required])],
      midlocation: this.fb.array([]),
       'recursiveBooking': this.rbData,
       'dayOfJourney': [this.selectedItems],
      price: ['', Validators.compose([Validators.required])],
      mailby: ['']
    });
    this.td = 0;
    this.dd = 0;
    const current = new Date();
    const { snapshot } = route;
    const { params } = snapshot;

    if (params._id) {
      this.isEdit = true;
      this.activatedJob = params._id;
    } else {
      this.isEdit = false;
      this.activatedJob = null;
    }
  }

  ngOnInit(): void {
    // this.userForm.controls['mailby'].setValue('Email');
    this.userForm.controls['mailby'].patchValue('');
    if (this.isEdit) {
      const { snapshot } = this.route;
      const { params } = snapshot;
      this.getDispatchJob(params._id);
      this.fareCalculate();
    }

    // this.userForm.controls['price'].setValue(23.13);
    this.midlocation().push(this.newContainer());
    this.getLocation(this.midlocation().length);
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
      singleSelection: false,
      defaultOpen: false,
      idField: 'id',
      textField: 'day',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: false,
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.PickuplocationElementRef.nativeElement, { });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          console.log('place', place);
          this.latitude = place.geometry.location.lat();
          console.log('latitude', this.latitude);

          this.longitude = place.geometry.location.lng();
          console.log('longitude', this.longitude);
          this.pickuplocation = place.name + ',' + place.formatted_address;
          console.log('pickuplocation', this.pickuplocation);
          this.pickadd();
        });
      });
    });
  }

  getDispatchJob(id: any): void {
    this.api.callApi(`${environment.backendBaseURL}/api/adminAddDespatchJobs/job/${id}`, 'POST', {}, {}).subscribe((res) => {
      if (res['code'] === 200) {
        console.log('Dispatch data--', res);
        const {
          user, driverdetails, duration, dropLocation, pickupLocation, midlocation,
          dateOfJourney, pickUptime, distance, fare, mailby, ...rest
        } = res['data'];
        console.log('mailby----', fare);
        this.userForm.controls['mailby'].patchValue(mailby);
        this.td = distance;
        this.distance = distance;
        this.carType = driverdetails?.carType;
        this.show = true;
        this.mini = fare;

        this.lat = dropLocation.coordinates[1];
        this.lng = dropLocation.coordinates[0];
        this.dropLocation = dropLocation.address;

        this.latitude = pickupLocation.coordinates[1];
        this.longitude = pickupLocation.coordinates[0];
        this.pickuplocation = pickupLocation.address;

        this.firstdis = midlocation?.map((location) => ({
          lat: location.coordinates[0], lng: location.coordinates[1], loc: location.location
        }));
//console.log('firstdis-----', this.firstdis);
        const finalIntdata = {
          name: user.name || null,
          email: user.email || null,
          phonenumber: user.phonenumber || null,
          userID: user._id,
          timeOfJourney: pickUptime ,
          pickUpLocation: pickupLocation.address || null,
          dropUpLocation: dropLocation.address || null,
          price: fare || 0,
          dateOfJourney: dateOfJourney ? dateOfJourney : '' ,
        
          driverdetails: driverdetails?  driverdetails._id : '',
        
          mailby: mailby ? mailby : '',
          recursiveBooking: rest.recursiveBooking || false,
          dayOfJourney: rest.dayOfJourney || false,
          midlocation: midlocation || null,
         // price:  this.mini ? this.mini :'',
       
         
        };
      //   name: user.name,
      //   email: user.email || null,
      //   phonenumber: user.phonenumber || null,
      //   userID: user._id,
      //   timeOfJourney: pickUptime,
      //   pickUpLocation: pickupLocation.address || null,
      //   dropUpLocation: dropLocation.address || null,
      //   price: fare || 0,
      //   dateOfJourney: dateOfJourney ? dateOfJourney : '',
      //   midlocation: midlocation ? midlocation : '',
      //   recursiveBooking: rest.recursiveBooking || false,
      //   mailby: mailby ? mailby : '',
      //   driverdetails: driverdetails ? driverdetails._id : ''
      // };
        console.log("final--",finalIntdata);
        
        this.userForm.setValue(finalIntdata);
      } else {
        this._toastr.error(res['message']);
      }
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
    if (this.midlocation().length !== this.midlocationcount) {
      this.midlocationcount = this.midlocation().length;
      this.getLocation(this.midlocation().length);
    }
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
        this.duration = 0;
        if (points) {
          points.forEach(async (point) => {
            let { text, value, time } = await this.getDistanceClient(point.origin, point.destination)
            this.td += value;
            console.log("line320--",this.td);
            
            this.duration += time;
            this.kilometerdistance = this.td;
            this.fareCalculate();
          })
        }
      }
    }
    init();

  }

  pickadd() {
    const init = async () => {
      console.log('Nayan----');
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
            previous = { lat: location.lat, lng: location.lng }
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
        console.log('Points-----', points);
        if (points) {
          console.log('AAAAAAAAAAAAAAAAAAAAAAAa');
          points.forEach(async (point) => {
            const { text, value, time } = await this.getDistanceClient(point.origin, point.destination)
            this.td += value;
            console.log('line373--', this.td);
            this.duration += time;
            this.kilometerdistance = this.td;
            this.fareCalculate();
          });
        }
      }
    };
    init();
  }

  long(arg0: string, long: any) {
    throw new Error('Method not implemented.');
  }

  getLocation(count?) {
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.LocationElementRef.nativeElement, {
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          this.midlocation().controls[count - 1].get('latitude').setValue(place.geometry.location.lat())
          this.midlocation().controls[count - 1].get('longitude').setValue(place.geometry.location.lng())
          this.midlocation().controls[count - 1].get('location').setValue(place.name + ',' + place.formatted_address)
          this.latLocation = place.geometry.location.lat();
          console.log('latitude', this.latLocation);
          this.lngLocation = place.geometry.location.lng();
          console.log('long', this.lngLocation);
          this.location = place.name + ',' + place.formatted_address;
          console.log('location', this.location);
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

  addDispatchJob() {
    var input = document.getElementById("pac-input") as HTMLInputElement;
    console.log("input", input.value);
    if (input.value) {
      this.firstdis.push({
        lat: this.latLocation,
        lng: this.lngLocation,
        loc: this.location
      });
      this.caldis(this.firstdis);
      input.value = "";
    }
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
        this.dd = 0;
        if (points) {
          points.forEach(async (point) => {
            let { text, value, time } = await this.getDistanceClient(point.origin, point.destination)
            this.td += value;
            this.dd += time;
            this.kilometerdistance = this.td;
            console.log("distance",this.td);
            
            // this.mini = (parseFloat(this.td) * 3.5 + 3).toFixed(2);
            this.fareCalculate();
          })
        }
      }
    }
    init();

    // if (this.firstdis.length == 0) {
    //   console.log("this.lat", this.lat);
    //   if (this.lat) {
    //     // let finalData = {
    //     //   origin: {
    //     //     latitude: this.latitude,
    //     //     longitude: this.longitude
    //     //   },
    //     //   destination: {
    //     //     latitude: this.lat,
    //     //     longitude: this.lng,
    //     //   }
    //     // }

    //     let finalData = {
    //       origin: `${this.latitude},${this.latitude}`,
    //       destination: `${this.lat},${this.lng}`,
    //     }

    //     if (this.userForm.value.midlocation) {
    //       this.userForm.value.midlocation.forEach(location => {
    //         if (location.latitude && location.longitude) {
    //           finalData.origin += `|${location.latitude},${location.longitude}`
    //         }
    //       });
    //     }
    //     this.UserService.getDistence(finalData).subscribe(res => {
    //       console.log("res", res)
    //       this.distance = res.data.rows[0].elements[0].distance.text;
    //       this.duration = res.data.rows[0].elements[0].duration.text;
    //       this.kilometerdistance = this.distance;

    //       let [dist, type] = this.distance.split(" ")
    //       this.td = Number(type === 'm' ? dist / 1000 : dis);
    //       console.log("km--", this.td);
    //     });
    //   } else {
    //     this.userForm.controls['price'].setValue(0 + '$');
    //   }
    // } else {
    //   var dis = this.tod;
    //   for (let i = 0; i < dis.length; i++) {
    //     if (dis[i].location == item.loc) {
    //       console.log("enter", "this.td", this.td, "dis", dis[i].dis)
    //       this.td = ((this.td) - (dis[i].dis)).toFixed(2);
    //     }
    //   }
    // }
  }
  caldis(item) {
    const init = async () => {
      if (this.latitude && this.longitude && this.lat && this.lng) {
        let points = [];
        let previous = {}
        if (item) {
          item.forEach(async (location, index) => {
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

        }
        this.td = 0
        this.dd = 0;
        if (points) {
          points.forEach(async (point) => {
            let { text, value, time } = await this.getDistanceClient(point.origin, point.destination)
            this.td += value;
            this.dd += time;
            this.kilometerdistance = this.td;
            this.mini = (parseFloat(this.td) * 3.5 + 3).toFixed(2);
            this.tod.push({
              location: point.loc,
              dis: this.td,
              price: this.mini
            });
            this.fareCalculate();
          })
        }
      }
    }
    init();

    // if (item.length == 1) {

    // let finalData = {
    //   origin: {
    //     latitude: this.latitude,
    //     longitude: this.longitude
    //   },
    //   destination: {
    //     latitude: item[0].lat,
    //     longitude: item[0].lng,
    //   }
    // }


    // start :my code


    // this.UserService.getDistence(finalData).subscribe(res => {
    //   console.log("ponse", res)
    //   this.distance = res.data.rows[0].elements[0].distance.text;
    //   this.duration = res.data.rows[0].elements[0].duration.text;
    //   let [dis, type] = this.distance.split(" ")

    //   this.td = (Number(type === 'm' ? dis / 1000 : dis) + this.dd).toFixed(2);
    //   this.kilometerdistance = this.td;

    //   this.mini = (parseFloat(this.td) * 3.5 + 3).toFixed(2);
    //   this.tod.push({
    //     location: item[0].loc,
    //     dis: this.td,
    //     price: this.mini
    //   });
    //   console.log("km--", this.mini);
    // });



    // end:my code



    // } else {
    //   const last2Item = item[item.length - 2];
    //   const lastItem = item[item.length - 1];
    //   // let finalsData = {
    //   //   origin: {
    //   //     latitude: last2Item.lat,
    //   //     longitude: last2Item.lng,
    //   //   },
    //   //   destination: {
    //   //     latitude: lastItem.lat,
    //   //     longitude: lastItem.lng,
    //   //   }
    //   // }

    //   let finalsData = {
    //     origin: `${this.latitude},${this.latitude}`,
    //     destination: `${lastItem.lat},${lastItem.lng}`,
    //   }

    //   if (this.userForm.value.midlocation) {
    //     this.userForm.value.midlocation.forEach(location => {
    //       if (location.latitude && location.longitude) {
    //         finalsData.origin += `|${location.latitude},${location.longitude}`
    //       }
    //     });
    //   }


    //   this.UserService.getDistence(finalsData).subscribe(res => {
    //     this.distance = res.data.rows[0].elements[0].distance.text;
    //     this.duration = res.data.rows[0].elements[0].duration.text;
    //     let [dist, type] = this.distance.split(" ")
    //     this.kilometerdistance = Number(type === 'm' ? dist / 1000 : dis);
    //     this.tod.push({
    //       location: lastItem.loc,
    //       dis: this.kilometerdistance.toFixed(2),
    //       price: (parseFloat(dist) * 3.5 + 3).toFixed(2)
    //     });
    //     console.log(console.log("this tod 2", this.tod))
    //     var dis = this.tod;
    //     var t = 0;
    //     var pri = 0;
    //     var p: any;
    //     var num: any;
    //     for (let i = 0; i < dis.length; i++) {
    //       t += parseFloat(dis[i].dis)
    //       pri += parseFloat(dis[i].price);
    //       console.log("pric", dis[i].price);
    //       console.log("i", t);
    //     }
    //     console.log("pri", pri);
    //     num = t + this.dd;
    //     p = pri;
    //     this.td = parseFloat(num).toFixed(2);
    //   });
    // }
  }

  removeContainer(i: number) {
    this.midlocation().removeAt(i);
  }

  getdriverList() {
    this.service.getAlldriver().subscribe(res => {
      if (res && res.code == 200) {
        this.guests = res.data
      } else {
        console.log('Error');
      }
    });
  }

  getUserList() {
    this.service.getAlluser().subscribe(res => {
      if (res && res.code == 200) {
        this.tempData = res.data
      } else {
        console.log('Error');
      }
    });
  }

  FieldsChange(values: any) {
    this.rbData = values.currentTarget.checked;
    console.log("rbData", this.rbData);
  }

  onHnadleSubmit(): any {
    if (this.isEdit) {
      this.updateJob();
    } else {
      this.submitForm();
    }
  }

  submitForm() {
    this.markFormTouched(this.userForm);
    this.mailbyMsg = '';
    if (this.userForm.valid) {
      // if (this.userForm.value.mailby === 'Email') {
      //   if (this.userForm.value.email === '' || this.userForm.value.email === null || this.userForm.value.email === undefined) {
      //     this.mailbyMsg = 'This user cannot be notified via email.';
      //     return false;
      //   }
      // } else if (this.userForm.value.mailby === 'Phone') {
      //   if (this.userForm.value.phonenumber === '' || this.userForm.value.phonenumber === null || this.userForm.value.phonenumber === undefined) {
      //     this.mailbyMsg = 'This user cannot be notified via phone.';
      //     return false;
      //   }
      // }

      this.isDisabled = true;

      this.distance = moment.duration(this.distance, "seconds").asHours();

      let finalData = {
        user: {
          name: this.userForm.value.name,
          phonenumber: this.userForm.value.phonenumber,
          email: this.userForm.value.email
        },
        dateOfJourney: new Date(this.userForm.value.dateOfJourney),
        timeOfJourney: this.userForm.value.timeOfJourney,
        dayOfJourney: this.userForm.value.dayOfJourney,
        mailby: this.userForm.value.mailby,
        price: this.mini ? this.userForm.value.price :0,
        fare: this.baseFare ? this.userForm.value.price :0,
        driverdetails: this.userForm.value.driverdetails,
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
        midlocation: this.firstdis,
        totaldistance: this.td

      }

      this.service.addDespatchJob(finalData).subscribe(res => {
        this.isDisabled = false;
        if (res && res.code == 200) {
          this.count = this.count + 1;

          if (this.count < 2) {
            this.delModal = true;
          } else {
            this.reset();
            return this.navRoute.navigate(['/jobs'])
          }
          console.log(this.userForm.value);
          this._toastr.success(res.message, "Job added successfully");
        } else if (res && res.code == 402) {
          this._toastr.info(res.message, "Despatch Jobs ");
        } else {
          this._toastr.info(res.message, "Despatch Jobs");
        }
      });
    }
    else {
      this._toastr.info("All Feild are required", "Despatch Jobs");
    }
  }

  updateJob(): any {
    console.log("formvslue--",this.userForm.value);
    
    this.markFormTouched(this.userForm);
    this.mailbyMsg = '';
    if (this.userForm.valid) {
      // if (this.userForm.value.mailby === 'Email') {
      //   if (this.userForm.value.email === '' || this.userForm.value.email === null || this.userForm.value.email === undefined) {
      //     this.mailbyMsg = 'This user cannot be notified via email.';
      //     return false;
      //   }
      // } else if (this.userForm.value.mailby === 'Phone') {
      //   if (this.userForm.value.phonenumber === '' || this.userForm.value.phonenumber === null || this.userForm.value.phonenumber === undefined) {
      //     this.mailbyMsg = 'This user cannot be notified via phone.';
      //     return false;
      //   }
      // }
      console.log("in valid forms",this.userForm.value.price);
      
      this.isDisabled = true;

      this.duration = this.dd ? `${moment.duration(this.dd, "seconds").hours().toFixed()} hours ${this.dd % 60} mins` : this.duration;

      let finalData = {
        _id: this.activatedJob,
        user: {
          name: this.userForm.value.name,
          phonenumber: this.userForm.value.phonenumber ? this.userForm.value.phonenumber :null,
          email: this.userForm.value.email ? this.userForm.value.email :null
        },
        dateOfJourney: new Date(this.userForm.value.dateOfJourney),
        timeOfJourney: this.userForm.value.timeOfJourney,
        mailby: this.userForm.value.mailby ? this.userForm.value.mailby :'',
        price: this.mini ||this.userForm.value.price,
        fare: this.baseFare ||this.userForm.value.price,
        driverdetails: this.userForm.value.driverdetails,
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
        midlocation: this.firstdis,
        totaldistance: this.td,
        distance: this.td,
        duration: this.duration
      };
 console.log("final value ===",finalData);
 
      this.api.callApi(`${environment.backendBaseURL}/api/updateDispatchJob/edit/${this.activatedJob}`, "POST", finalData, {}).subscribe(res => {
        this.isDisabled = false
        if (res && res['code'] == 200) {
          this.reset();
          this._toastr.success(res['message'], "Job  Updated");
          return this.navRoute.navigate(['/jobs'])
        } else if (res && res['code'] == 402) {
          this._toastr.info(res['message'], "Despatch Jobs ");
        } else {
          this._toastr.info(res['message'], "Despatch Jobs");
        }
      });
    }
    else {
      this._toastr.info("All Feild are required", "Despatch Jobs");
    }
  }

  markFormTouched(group: FormGroup | FormArray) {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.controls[key];
      if (control instanceof FormGroup || control instanceof FormArray) { control.markAsTouched(); this.markFormTouched(control); }
      else { control.markAsTouched(); }
    });
  }

  reset() {
    this.userForm.reset();

  }

  onOptionsSelected(value: string) {
    this.driver = { _id: value };
    console.log('Driver ID---', this.driver);
    this.service.getCurrentData(this.driver).subscribe(res => {
      if (res && res.code === 200) {
        console.log(res);
        this.driverName = res.data.data.name;
        console.log('driverName---', this.driverName);

        this.carType = res.data.data.carType;
        console.log('carType---', this.carType);
        this.show = true;
      }
    });
  }

  onSelected(value: string) {
    this.userData = { _id: value };
    console.log("obj", this.userData);
    this.service.getUserById(this.userData).subscribe(res => {
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

    } else if (this.carType == "Wheelchair Van") {

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
      this.userForm.controls['price'].setValue('');
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

            let value = rows[0].elements[0].distance.value
            let time = rows[0].elements[0].duration.value
            value = Number(value) / 1000
            data.text = `${value} Km`;
            data.value = Number(value.toFixed(0));
            data.time = time;
            return resolve(data);
          }
        }
      );


    });
  }

  accept() {
    this.latitude = this.lat;
    this.longitude = this.lng;
    // this.pickuplocation = this.dropLocation
    this.delModal = false;
    console.log("pickup---", this.pickuplocation);
    var input = document.getElementById("pickuploc") as HTMLInputElement;
    input.value = '';
    input.value = this.dropLocation;
    var input1 = document.getElementById("droploc") as HTMLInputElement;
    input1.value = '';
    input1.value = this.pickuplocation;

    this.userForm.controls['timeOfJourney'].reset();
    this.userForm.controls['dateOfJourney'].reset();
  }
  decline() {
    console.log("indecline");
    this.delModal = false;
    return this.navRoute.navigate(['/jobs']);
  }
  dmhide() {
    this.delModal = false
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
    this.isAutoCompleteShown = false;
    if (type === 'click') {
      this.userForm.controls['name'].setValue(data.name);
      this.userForm.controls['userID'].setValue(data?._id);
      this.userForm.controls['phonenumber'].setValue(data?.phonenumber);
      this.userForm.controls['email'].setValue(data?.email);
    }

  }
}