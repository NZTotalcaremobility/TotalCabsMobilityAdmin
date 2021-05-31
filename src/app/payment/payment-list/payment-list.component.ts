import { NgxSpinnerService } from 'ngx-spinner';
import { AppService } from './../../app.service';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss']
})
export class PaymentListComponent implements OnInit {
  page: number = 1;
  constructor(private api: AppService, private _spinner: NgxSpinnerService) { }


  paymentList: any

  ngOnInit(): void {
    this.getPaymentList();
  }

  getPaymentList() {
    this._spinner.show()
    this.api.callApi(`${environment.backendBaseURL}/api/admin/adminListTransaction/`, 'POST', {}, {}).subscribe(res => {
      this._spinner.hide()
      this.paymentList = res['data']
    })
  }

}
