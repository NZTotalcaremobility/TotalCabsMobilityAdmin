import { environment } from '../../../environments/environment';
import { AppService } from './../../app.service';
import { async } from '@angular/core/testing';
import { MapsAPILoader } from '@agm/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnlyCharFieldValidator } from 'src/app/shared/validation/validations.validator';
import { DispachService } from '../dispach.service';
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { FLOAT } from 'html2canvas/dist/types/css/property-descriptors/float';
import { UserService } from '../../user/user.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { DeeplinkserviceService } from '../../deeplink/deeplinkservice.service';
import * as moment from 'moment';
//import { threadId } from 'worker_threads';
declare var google: any;
@Component({
  selector: 'app-add-dispach',
  templateUrl: './add-dispach.component.html',
  styleUrls: ['./add-dispach.component.scss']
})
export class AddDispachComponent implements OnInit {
  guests: any;
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
  count: number = 0;
  cities: any = [];
  selectedItems: any = [];
  dropdownSettings: any = {};
  mailbyMsg: string;

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
  // rbData: Boolean = false;
  firstdis: any[] = [];
  td: any;
  tod: any[] = [];
  dd: any; // drop distance
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
  pickdata: any;

  imagePath: String = environment.imageurl
  time: any;
  searchResult: any = [];
  isAutoCompleteShown: boolean = false
  isUser: boolean = false
  keyword = 'name';
  isOver: boolean = false
  blockUI: any;
  errorflag: boolean=false;
  currentUser: any;
  rbData: any;

  midlocation(): FormArray {
    return this.userForm.get("midlocation") as FormArray
  }

  //guests: any;
 // @ViewChild('Pickuplocation', { static: false })
 // public PickuplocationElementRef: ElementRef;
//  @ViewChild('DropLocation', { static: false })
 // public DropLocationElementRef: ElementRef;
 // @ViewChild('Location', { static: false })
 // public LocationElementRef: ElementRef;
  // @ViewChild('Location', { static: false })
  // public LocationElementRef: ElementRef;
  zoom: number = 3;
  show: boolean = false;
  driverName: any;
  carType: any;
  isDisabled: boolean = false;
  baseFare: any = 0;
  price :any =0;

  // midlocation(): FormArray {
  //   return this.userForm.get("midlocation") as FormArray;
  // }

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
    private api: AppService,
    private deeplinkService: DeeplinkserviceService
  ) {
    this.userForm = this.fb.group({
      'userID': [''],
      'name': ['', Validators.compose([Validators.required])],
      'email': ['', Validators.compose([Validators.pattern(/^(\d{10}|\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/)])],
      'phonenumber': ['', Validators.compose([Validators.pattern(/^[0][1-9]\d{9}$|^[1-9]\d{9}$/)])],
      'dateOfJourney': ['', Validators.compose([Validators.required])],
      // 'dateOfJourney': ['', Validators.compose([Validators.required])],
      'timeOfJourney': ['', Validators.compose([Validators.required])],
      'driverdetails': ['', Validators.compose([Validators.required])],
      'pickUpLocation': ['', Validators.compose([Validators.required])],
      'dropUpLocation': ['', Validators.compose([Validators.required])],
      'midlocation': this.fb.array([]),
     'recursiveBooking': this.rbData,
    'dayOfJourney': [this.selectedItems],
      'price': ['', Validators.compose([Validators.required])],
      'mailby': ['']
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
    this.currentUser =JSON.parse(localStorage.getItem("userID"))
 console.log("currentuser-----",this.currentUser);
    if (this.isEdit) {
      const { snapshot } = this.route;
      const { params } = snapshot;
     
    }
   
    //this.userForm.controls['price'].setValue(23.13);
    this.midlocation().push(this.newContainer());
    this.getLocation(this.midlocation().length);
    this.getdriverList();
    this.getUserList();
    this.getDispatchJob();
    this.fareCalculate();
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
      const autocomplete = new google.maps.places.Autocomplete(this.PickuplocationElementRef.nativeElement, {
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.pickuplocation = place.name + ',' + place.formatted_address;
          // Below code added by nayan for distance and fare calculation when change pickup location.
          if (this.pickuplocation && this.dropLocation && this.carType) {
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
  // handleTripDetail(params){
  //   this.deeplinkService.deeplink(params);
  // }

  dropadd() {
    const init = async () => {
      if (this.latitude && this.longitude && this.lat && this.lng) {
        const points = [];
        let previous = {};
        console.log('this.firstdis---', this.firstdis);
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
          console.log('I m here...');
          points.forEach(async (point) => {
            const { text, value, time } = await this.getDistanceClient(point.origin, point.destination);
            this.td += value;
            console.log('line320--', this.td);
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
  getDispatchJob() {
    console.log("current user+++--",this.currentUser);
    let id =this.currentUser
    console.log({id});
    
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
          driverdetails:null,
          dateOfJourney: null,
         midlocation: null,
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
      const autocomplete = new google.maps.places.Autocomplete(
        this.LocationElementRef.nativeElement, {}
      );
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          this.midlocation().controls[count - 1].get('latitude').setValue(place.geometry.location.lat())
          this.midlocation().controls[count - 1].get('longitude').setValue(place.geometry.location.lng())
          this.midlocation().controls[count - 1].get('location').setValue(place.name + ',' + place.formatted_address)
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
    });
  }

  addDispatchJob() {
    const input = document.getElementById('pac-input') as HTMLInputElement;
    console.log('input---', input.value);
    if (input.value) {
      this.firstdis.push({
        lat: this.latLocation,
        lng: this.lngLocation,
        loc: this.location
      });
      this.caldis(this.firstdis);
      input.value = '';
    }
  }

  /*rm(item) {
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
        this.duration = 0;
        if (points) {
          points.forEach(async (point) => {
            let { text, value, time } = await this.getDistanceClient(point.origin, point.destination)
            this.td += value;
            this.duration += time
            this.kilometerdistance = this.td;
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
  }*/

  caldis(item) {
    const init = async () => {
      if (this.latitude && this.longitude && this.lat && this.lng) {
        const points = [];
        let previous = {};
        if (item) {
          item.forEach(async (location, index) => {
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
        }
        this.td = 0;
        this.duration = 0;
        if (points) {
          points.forEach(async (point) => {
            const { text, value, time } = await this.getDistanceClient(point.origin, point.destination)
            this.td += value;
            console.log('516 td--', this.td);
            this.duration += time;
            this.kilometerdistance = this.td;
            this.mini = (parseFloat(this.td) * 3.5 + 3).toFixed(2);
            this.tod.push({
              location: point.loc,
              dis: this.td,
              price: this.mini
            });
            this.fareCalculate();
          });
        }
      }
    };
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
      if (res && res.code === 200) {
        console.log(res);
        this.guests = res.data;
        console.log('Driver---', this.guests);
      } else {
        console.log('Error');
      }
    });
  }


  getUserList() {
    this.service.getAlluser().subscribe(res => {
      if (res && res.code == 200) {
        console.log(res)
        this.tempData = res.data
       // console.log("tempData", this.tempData);
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

  onHnadleSubmit(): any {
    if (this.isEdit) {
      this.updateJob();
    } else {
      this.submitForm();
    }
  }


  submitForm() {
    this.mailbyMsg = '';
    this.markFormTouched(this.userForm);
    console.log('fare---735---',this.userForm.value.price);
    
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
      this.duration = `${moment.duration(this.duration, "seconds").hours().toFixed(0)} hours ${this.duration % 60} mins`;
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
        totaldistance: this.td,
        duration: this.duration,
        distance: this.distance
      };

      this.service.addDespatchJob(finalData).subscribe(res => {
        this.isDisabled = false;
        if (res && res.code == 200) {
          this.count = this.count + 1;

          if (this.count < 2) {
            this.delModal = true;
          } else {
            this.reset();
            return this.navRoute.navigate(['/jobs']);
          }
          console.log(this.userForm.value);
          this._toastr.success(res.message, "Job added successfully");
        } else if (res && res.code == 402) {
          this._toastr.info(res.message, "Despatch Jobs ");
        } else {
          this._toastr.info(res.message, "Despatch Jobs");
        }
      });
    } else {
      this._toastr.info("All Feild are required", "Despatch Jobs");
    }
  }

  updateJob(): any {
    this.markFormTouched(this.userForm);
    this.mailbyMsg = '';
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

      let finalData = {
        _id: this.activatedJob,
        user: {
          name: this.userForm.value.name,
          phonenumber: this.userForm.value.phonenumber,
          email: this.userForm.value.email
        },
        dateOfJourney: new Date(this.userForm.value.dateOfJourney),
        timeOfJourney: this.userForm.value.timeOfJourney,
        mailby: this.userForm.value.mailby,
        price: this.mini,
        fare: this.baseFare ,
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

      this.api.callApi(`${environment.backendBaseURL}/api/adminAddDespatchJobs/edit/${this.activatedJob}`, "POST", finalData, {}).subscribe(res => {
        if (res && res['code'] == 200) {
          this.reset();
          this._toastr.success(res['message'], "Job added Updated");
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
      else { control.markAsTouched(); };
    });
  }

  reset() {
    this.userForm.reset();
  }

  onOptionsSelected(value: string) {
    console.log('value---', value);
    if (value) {
      this.driver = { _id: value };
      this.service.getCurrentData(this.driver).subscribe(res => {
        if (res && res.code === 200) {
          this.driverName = res.data.data.name;
          this.carType = res.data.data.carType;
          this.show = true;
          if (this.pickuplocation && this.dropLocation) {
            this.fareCalculate();
          }
        }
      });
    } else {
      this.userForm.controls['price'].setValue('');
    }
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
    console.log("fare-----------",this.userForm.value.price);
    
    if (this.carType === '9 Seater Van') {
      const baseFare = parseFloat(this.td) * 4.5;
      this.mini = (baseFare + 3).toFixed(2);
      this.baseFare = baseFare.toFixed(2);
      this.userForm.controls['price'].setValue(this.mini);
    } else if (this.carType === 'Wheelchair Van') {
      const baseFare = parseFloat(this.td) * 4;
      this.mini = (baseFare + 3).toFixed(2);
      this.baseFare = baseFare.toFixed(2);
      this.userForm.controls['price'].setValue(this.mini);
    } else if (this.carType === 'mini') {
      const baseFare = parseFloat(this.td) * 3.5;
      this.mini = (baseFare + 3).toFixed(2);
      this.baseFare = baseFare.toFixed(2);
      this.userForm.controls['price'].setValue(this.mini);
    } else {
      console.log('Not selected');
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
          console.log('res', origin, destination, response.rows)
          console.log('review', this.mini, this.td, this.lat, this.lng, this.dropLocation, this.latitude, this.longitude, this.pickuplocation);

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
            value = (Number(value) / 1000).toFixed(0)
            data.text = `${value} Km`;
            data.value = Number(value)
            data.time = time
            return resolve(data);
          }
        }
      );


    });
  }
  accept() {

    this.latitude = this.lat
    this.longitude = this.lng
    // this.pickuplocation = this.dropLocation
    this.delModal = false
    console.log("pickup---", this.pickuplocation);
    var input = document.getElementById("pickuploc") as HTMLInputElement;
    input.value = ''
    input.value = this.dropLocation
    console.log("droplocatioon---", input.value);
    
    var input1 = document.getElementById("droploc") as HTMLInputElement;
    input1.value = ''
    input1.value = this.pickuplocation;

    this.userForm.controls['timeOfJourney'].reset()
    this.userForm.controls['dateOfJourney'].reset()
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
      this.userForm.controls['name'].setValue(data.name)
      this.userForm.controls['userID'].setValue(data?._id)
      this.userForm.controls['phonenumber'].setValue(data?.phonenumber)
      this.userForm.controls['email'].setValue(data?.email)
    }

  }
}