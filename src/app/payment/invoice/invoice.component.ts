import { ToastrService } from 'ngx-toastr';
import { environment } from './../../../environments/environment';
import { AppService } from './../../app.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import Jspdf from "jspdf";

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})


export class InvoiceComponent implements OnInit {
  constructor(
    private activateRoute: ActivatedRoute,
    private api: AppService,
    private toastr: ToastrService
  ) { }

  paymentDetails: any
  transactionId: String
  env: any = environment.imageurl

  @ViewChild('printableArea') printableArea: ElementRef;


  ngOnInit(): void {
    const { snapshot } = this.activateRoute;
    const { params } = snapshot;
    const { id } = params;
    this.transactionId = id
    this.getPaymentDetails(id)
  }

  getPaymentDetails(id: String) {
    this.api.callApi(`${env.backendBaseURL}/api/admin/adminTransaction/${id}`, 'POST', {}, {}).subscribe(res => {
      if (res['code'] === 200) {
        const { type, status, fare, tax, Amount, jobid, _id: transactionID } = res['data'];
        let { pickupLocation, duration, dropLocation, distance, dateOfJourney, pickUptime, riderdetails, driverdetails, } = jobid
        dateOfJourney = dateOfJourney ? new Date(dateOfJourney).toDateString() : '';
        this.paymentDetails = { duration, transactionID, type, status, fare, tax, Amount, distance, dateOfJourney, pickUptime, pickupLocation, dropLocation, riderdetails, driverdetails }
      } else {
        this.toastr.error(res['message'])
        return false
      }
    })
  }

  printInvoice() {
    this.api.callApi(`${environment.backendBaseURL}/api/admin/adminGenerateInvoice/${this.transactionId}`, 'POST', {}, {}).subscribe(res => {
      if (res['code'] === 200) {
        console.log('sdfsdf', res['data'].url)
        window.open(env.backendBaseURL + res['data'].url)
        return false
      }
      this.toastr.error(res['message'])
      return false

    })
    // console.log('aaa', id)
    // var data = this.printableArea.nativeElement
    // const option = {
    //   margin: [-1, .5, .5, .5],
    //   filename: 'invoice.pdf',
    //   image: { type: 'jpeg', quality: .98 },
    //   html2canvas: { scale: 1, height: 1000 },
    //   jsPDF: { unit: 'in', format: 'a4', orientation: 'p' }
    // }

    // // const content: Element = document.getElementById('printableArea');
    // console.log('hello', this.printableArea.nativeElement)
    // html2pdf().from(this.printableArea.nativeElement).set(option).save();
    // html2canvas(data).then(canvas => {  
    //   // Few necessary setting options  
    //   var imgWidth = 208;   
    //   var pageHeight = 900;    
    //   var imgHeight = canvas.height * imgWidth / canvas.width;  
    //   var heightLeft = imgHeight;  
    //   const contentDataURL = canvas.toDataURL('image/png')  
    //   let pdf = new Jspdf('p', 'in', 'a4'); // A4 size page of PDF  
    //   var position = 0;  
    //   pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
    //   pdf.save('MYPdf.pdf'); // Generated PDF   
    // }); 

  }

  sendInvoice() {
    const url = `${env.backendBaseURL}/api/admin/adminSendInvociceToMail/${this.transactionId}`
    this.api.callApi(url, 'POST', {}, {}).subscribe(res => {
      if (res['data'] === 200) {
        this.toastr.success(res['message'])
        return false
      }
      this.toastr.error(res['message'])
      return false
    })
  }

}
