import { async } from '@angular/core/testing';
import { element } from 'protractor';
import { environment } from './../../environments/environment';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AppService } from './../app.service';
import { Component, OnInit, ViewChild, TemplateRef, ElementRef, NgZone } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, BaseChartDirective, Label, MultiDataSet } from 'ng2-charts';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { MapsAPILoader } from '@agm/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../user/user.service';
import { interval } from 'rxjs';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    @ViewChild('Pickuplocation', { static: false })
    public PickuplocationElementRef: ElementRef;
    @ViewChild('DropLocation', { static: false })
    public DropLocationElementRef: ElementRef;
    @ViewChild('staticTabs', { static: false }) staticTabs: TabsetComponent;

    public lineChartData: ChartDataSets[] = [
        { data: [65, 59, 80, 81, 56, 55, 40], label: 'No. of Passenger' },
        { data: [28, 48, 40, 19, 86, 27, 90], label: 'Earning' },
        { data: [180, 480, 770, 90, 1000, 270, 400], label: 'Cab Drivers', yAxisID: 'y-axis-1' }
    ];
    public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    public lineChartOptions: (ChartOptions & { annotation: any }) = {
        responsive: true,
        scales: {
            // We use this empty structure as a placeholder for dynamic theming.
            xAxes: [{}],
            yAxes: [
                {
                    id: 'y-axis-0',
                    position: 'left',
                },
                {
                    id: 'y-axis-1',
                    position: 'right',
                    gridLines: {
                        color: 'rgba(255,0,0,0.3)',
                    },
                    ticks: {
                        fontColor: 'red',
                    }
                }
            ]
        },
        annotation: {
            annotations: [
                {
                    type: 'line',
                    mode: 'vertical',
                    scaleID: 'x-axis-0',
                    value: 'March',
                    borderColor: 'orange',
                    borderWidth: 2,
                    label: {
                        enabled: true,
                        fontColor: 'orange',
                        content: 'LineAnno'
                    }
                },
            ],
        },
    };
    public lineChartColors: Color[] = [
        { // grey
            backgroundColor: 'rgba(239, 83, 80,0.2)',
            borderColor: 'rgba(239, 83, 80,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        },
        { // dark grey
            backgroundColor: 'rgba(25, 118, 210,0.2)',
            borderColor: 'rgba(25, 118, 210,1)',
            pointBackgroundColor: 'rgba(77,83,96,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(77,83,96,1)'
        },
        { // red
            backgroundColor: 'rgba(38, 198, 218,0.3)',
            borderColor: 'rgb(38, 198, 218)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        }
    ];
    public lineChartLegend = true;
    public lineChartType: ChartType = 'line';

    @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;
    @ViewChild('infoWindow', { static: false })
    public infoWindow: ElementRef;



    public doughnutChartLabels: Label[] = ['Pending', 'Delivered', 'Order'];
    public doughnutChartData: MultiDataSet = [
        [350, 450, 100]
    ];
    public doughnutChartType: ChartType = 'doughnut';

    public barChartOptions: ChartOptions = {
        responsive: true,
        // We use these empty structures as placeholders for dynamic theming.
        scales: { xAxes: [{}], yAxes: [{}] },
        plugins: {
            datalabels: {
                anchor: 'end',
                align: 'end',
            }
        }
    };
    public barChartLabels: Label[] = ['2018', '2019', '2020'];
    public barChartType: ChartType = 'bar';
    public barChartLegend = false;

    public barChartData: ChartDataSets[] = [
        { data: [35, 29, 15], label: '' }
    ];

    public CompletedbarChartData: ChartDataSets[] = [
        { data: [10, 19, 15], label: '' }
    ];
    locationIcon = "../../assets/images/ic_mini.png"
    modalRef: BsModalRef;
    selectDriver: string;
    driver: string[] = [
        'Andrew',
        "Brett",
        "Cane",
        "Douggle"
    ]
    public months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    public page: number = 1;
    public pageTab1: number = 1;
    public pageTab2: number = 1;
    public activeTab: number = 0;

    public declinedofJobsPage: number = 1;
    public allocatedjobsPage: number = 1;
    public allocatedJobs: any = [];
    public listOfJobs: any = [];
    public declinedofJobs: any = [];
    public userByType: any = [];
    public totalVehicles: any = 0;
    public freeVehicles: any = 0;


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
    show: boolean = false;
    start_end: any;
    alldriver = [];
    entry = [];
    ;
    // lat = -43.5118004;
    // lng = 172.3188185;
    zoom: number = 10;
    start_end_mark = [];
    webbaseURL: string = environment.webBaseURL
    public renderOptions = {
        suppressMarkers: true,
    }

    public markerOptions = {
        origin: {
            infoWindow: "Origin",
            icon: 'https://www.shareicon.net/data/32x32/2017/02/01/877364_miscellaneous_512x512.png',

        },
        destination: {
            infoWindow: "destination",
            icon: 'https://www.shareicon.net/data/32x32/2017/02/01/877364_miscellaneous_512x512.png',
        },
    }

    point: Array<any> = [
    ]
    constructor(
        private modalService: BsModalService,
        private api: AppService,
        private service: UserService,
        private formBuilder: FormBuilder,
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone,
        private _toastr: ToastrService,
    ) {
        this.fairForm = this.formBuilder.group({
            'pickupLocation': ['', Validators.compose([Validators.required])],
            'dropLocation': ['', Validators.compose([Validators.required])],
            'carType': ['', Validators.compose([Validators.required])]
        });

        this.currentlocation();

        this.latitude = -43.5118004;
        this.longitude = 172.3188185;

    }
    public markerOptions = {
        origin: {
            infoWindow: "Origin",
            icon: 'https://www.shareicon.net/data/32x32/2017/02/01/877364_miscellaneous_512x512.png',

        },
        destination: {
            infoWindow: "destination",
            icon: 'https://www.shareicon.net/data/32x32/2017/02/01/877364_miscellaneous_512x512.png',
        },
    }

    ngOnInit() {
        interval(10000).subscribe(() => this.getDriverLocation());
        // this.getAllDriver()
        // this.getDriverLocation();
        this.getPaymentList()

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

                    this.showmarker();

                    // for (var i = 0; i < place.address_components.length; i++) {
                    // var addressType = place.address_components[i].types[0];
                    // if (addressType == "country") {
                    // console.log(place.address_components[i].short_name);

                    // }
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
                    this.showmarker();
                });
            });
        });
    }

    onHandleClick() {
        this.staticTabs.tabs.forEach((tab, index) => {
            if (tab.active === true) {
                this.activeTab = index
            }
        })
    }
    getAllDriver() {
        this.service.getAlldriver1().subscribe(res => {

            const totalDrivers: any = res.data.data;
            console.log("res--", typeof totalDrivers);

            this.start_end_mark = [];
            let jobs = [];
            for (let index = 0; index < totalDrivers.length; index++) {
                console.log("array--", totalDrivers[index]);

                const element = totalDrivers[index];
                let temp = {}
                if (element.currentLocation && element.currentLocation.coordinates) {
                    console.log("element dta---", element.currentLocation.coordinates);
                    temp = {
                        coordinate: element.currentLocation.coordinates,
                        name: element.name,
                        carRegNo: element.carRegNo,
                        status: "Avilable",
                        pickcoordinates: element?.currentJob ? element?.currentJob[0]?.pickupLocation?.coordinates : null,
                        dropcoordinates: element?.currentJob ? element?.currentJob[0]?.dropLocation?.coordinates : null
                    }
                    this.start_end_mark.push(temp)
                }
                if (element.currentJob) {
                    const pickcoordinates = element.currentJob[0].pickupLocation.coordinates;
                    const dropcoordinates = element.currentJob[0].dropLocation.coordinates;
                    if (pickcoordinates.length > 0 && dropcoordinates.length > 0) {
                        this.point.push({
                            start: { lat: pickcoordinates[0] || 0, lng: dropcoordinates[1] || 0 },
                            end: { lat: dropcoordinates[0] || 0, lng: dropcoordinates[1] || 0 },
                            name: element.name,
                            carRegNo: element.carRegNo
                        })
                    }


                }
            }



        })


    }
    getDriverLocation() {

        console.log("in driverLoc");

        this.api.callApi(`${environment.backendBaseURL}/api/admin/getDrivers`, 'POST', {}, {}).subscribe(res => {
            if (res['code'] === 200) {
                const totalDrivers: any = res['data'];
                this.start_end_mark = [];
                let jobs = [];
                for (let index = 0; index < totalDrivers.length; index++) {
                    const element = totalDrivers[index];
                    let temp = {}
                    if (element.currentLocation && element.currentLocation.coordinates) {
                        // this.start_end_mark.push(element.currentLocation.coordinates);
                        temp = {
                            coordinate: element.currentLocation.coordinates,
                            name: element.name,
                            carRegNo: element.carRegNo,
                            status: "Booked",
                            pickcoordinates: element?.currentJob ? element?.currentJob[0]?.pickupLocation?.coordinates : null,
                            dropcoordinates: element?.currentJob ? element?.currentJob[0]?.dropLocation?.coordinates : null
                        }
                        this.start_end_mark.push(temp)
                    }
                    if (element.currentJob) {
                        const pickcoordinates = element?.currentJob[0]?.pickupLocation?.coordinates.reverse();
                        const dropcoordinates = element?.currentJob[0]?.dropLocation?.coordinates.reverse();
                        if (pickcoordinates.length > 0 && dropcoordinates.length > 0) {
                            this.point.push({
                                start: { lat: pickcoordinates[0] || 0, lng: dropcoordinates[1] || 0 },
                                end: { lat: dropcoordinates[0] || 0, lng: dropcoordinates[1] || 0 },
                                name: element.name,
                                carRegNo: element.carRegNo
                            })
                        }

                        let from = { lat: element?.currentLocation?.coordinates[1] || 0, lng: element?.currentLocation?.coordinates[0] || 0 }
                        let to = { lat: dropcoordinates[0], lng: dropcoordinates[1] };

                        this.getDistanceClient([from], [to]).then((res) => {
                            this.start_end_mark[index] = { ...this.start_end_mark[index], estTime: res.text || 0 }
                            console.log('sdfsdgdfgdfg', this.start_end_mark)
                        })
                    }
                }
            }
        }, (err) => { console.log(err, "err from api") })

    }



    showmarker() {
        this.start_end_mark = [];
        if (this.dropLocation && this.pickuplocation) {
            var latlng1 = [this.latitude, this.longitude];
            var latlng2 = [this.lat, this.lng];
            this.start_end.push(latlng1);
            this.start_end.push(latlng2);
            console.log("df", this.start_end_mark);
        }
    }


    currentlocation() {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition((position) => {
                console.log("pos", position)
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                var latlng1 = [this.latitude, this.longitude];
                this.start_end_mark.push({ coordinate: latlng1 });
            });
        } else {
            this._toastr.warning("Geolocation is not supported by this browser.");
        }
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
                    // this.mini=`$${this.kilometerdistance*3.5+3}`
                    this.mini = `$${(parseFloat(this.kilometerdistance) * 3.5 + 3).toFixed(2)}`
                    this.Wheelchair = `$${(parseFloat(this.kilometerdistance) * 4.5 + 3).toFixed(2)}`

                    // console.log(this.fairForm.value);
                    // this.navRoute.navigate(['/dispach']);
                    // this.reset();
                    // this._toastr.success(res.message, "Dashboard");
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

    public randomize(): void {
        for (let i = 0; i < this.lineChartData.length; i++) {
            for (let j = 0; j < this.lineChartData[i].data.length; j++) {
                this.lineChartData[i].data[j] = this.generateNumber(i);
            }
        }
        this.chart.update();
    }

    private generateNumber(i: number): number {
        return Math.floor((Math.random() * (i < 2 ? 100 : 1000)) + 1);
    }

    // events
    public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
        console.log(event, active);
    }

    public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
        console.log(event, active);
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }


    getPaymentList(params?: any) {
        this.api.callApi(`${environment.backendBaseURL}/api/admin/dashboard`, 'POST', {}, { params }).subscribe(res => {
            this.allocatedJobs = res['data'].allocatedJobs;
            this.listOfJobs = res['data'].listOfJobs;
            this.declinedofJobs = res['data'].declinedJob;
            this.userByType = res['data'].userByType;
            this.totalVehicles = res['data'].TotalVehicles;
            this.freeVehicles = res['data'].freevehciles;
            console.log('this is lee', this.listOfJobs.length)
        });
    }

    handleSelect() {
        const { value } = this.filterForm;
        console.log('cllic', value)
        this.getPaymentList(value)
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


    async onclick(ele, condition, index) {
        if (condition === 'on') {
            let { from, to } = ele;
            // from = { lat: from[1], lng: from[0] }
            // to = { lat: to[0], lng: to[1] }
            // console.log([from], [to], 'nahi')
            // let res = await this.getDistanceClient([from], [to]);
            // this.start_end_mark[index] = { ...this.start_end_mark[index], estTime: res }
        } else {
            // this.infoWindow.close();

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
                        return reject({ error: 'Something Went Wrong!' })
                    } else {
                        console.log('res', response)
                        const { rows } = response;
                        let value = rows[0]?.elements[0]?.duration || {}
                        return resolve(value);
                    }
                }
            );

        });
    }

}