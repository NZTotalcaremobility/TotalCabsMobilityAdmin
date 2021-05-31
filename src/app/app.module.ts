import { UserJobsComponent } from './user/user-detail/user-jobs/user-jobs.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxPaginationModule } from 'ngx-pagination';
import { AgmCoreModule } from '@agm/core';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { DriverComponent } from './driver/driver.component';

import { UserComponent } from './user/user.component';
import { DriverDetailComponent } from './driver/driver-detail/driver-detail.component';
import { DriversListComponent } from './driver/drivers-list/drivers-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserDetailComponent } from './user/user-detail/user-detail.component';
import { AddDriverComponent } from './driver/add-driver/add-driver.component';
import { PaymentComponent } from './payment/payment.component';
import { PaymentListComponent } from './payment/payment-list/payment-list.component';
import { InvoiceComponent } from './payment/invoice/invoice.component';
import { JobComponent } from './job/job.component';
import { JobListComponent } from './job/job-list/job-list.component';
import { OngoingJobsComponent } from './job/ongoing-jobs/ongoing-jobs.component';
import { CompletedJobsComponent } from './job/completed-jobs/completed-jobs.component';
import { DispachComponent } from './dispach/dispach.component';
import { AddDispachComponent } from './dispach/add-dispach/add-dispach.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DiapachListComponent } from './dispach/diapach-list/diapach-list.component';

import { AddUsersComponent } from './user/add-users/add-users.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './shared/guard/login/login.component';
import { EditDriverComponent } from './driver/edit-driver/edit-driver.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MapsComponent } from './maps/maps.component';
import { ReportsComponent } from './reports/reports.component';
import { EditUserComponent } from './user/edit-user/edit-user.component';
import { BookingsComponent } from './bookings/bookings.component';
import { BookingsListComponent } from './bookings/bookings-list/bookings-list.component';
import { BookingDetailsComponent } from './bookings/booking-details/booking-details.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { CalculateFareComponent } from './calculate-fare/calculate-fare.component';
import { RolesAndPermissionComponent } from './roles-and-permission/roles-and-permission.component';
import { ForgotPasswordComponent } from './shared/guard/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './shared/guard/reset-password/reset-password.component';

import { MessageComponent } from './message/message.component';
import { AgmDirectionModule } from 'agm-direction';

import { AddJobsComponent } from './job/add-jobs/add-jobs.component';
import { AutocompleteLibModule } from "angular-ng-autocomplete";

import { BsDatepickerModule, DatepickerModule } from "ngx-bootstrap/datepicker";
import { TimepickerModule } from "ngx-bootstrap/timepicker";
import { CoverJobComponent } from './dispach/cover-job/cover-job.component';
import { DeeplinkComponent } from './deeplink/deeplink.component';
import { EditDispatchComponent } from './dispach/edit-dispatch/edit-dispatch.component';
import { EditcoverComponent } from './job/editcover/editcover.component';
import {Ng2SearchPipeModule} from 'ng2-search-filter';
import { CompanyComponent } from './company/company.component';
import { AddcompanyuserComponent } from './company/addcompanyuser/addcompanyuser.component';
import { EditCompanyuserComponent } from './company/edit-companyuser/edit-companyuser.component';
import { DetailCompanyuserComponent } from './company/detail-companyuser/detail-companyuser.component';
import { ListCompanyuserComponent } from './company/list-companyuser/list-companyuser.component';
import { CompanyjobsComponent } from './company/detail-companyuser/companyjobs/companyjobs.component';
import { ViewnotificationComponent } from './viewnotification/viewnotification.component';



@NgModule({
    declarations: [
        BookingsComponent,
        BookingDetailsComponent,
        BookingsListComponent,
        MessageComponent,
        AppComponent,
        HeaderComponent,
        SidebarComponent,
        DriverComponent,
        UserComponent,
        DriverDetailComponent,
        DriversListComponent,
        UserListComponent,
        UserDetailComponent,
        AddDriverComponent,
        PaymentComponent,
        PaymentListComponent,
        InvoiceComponent,
        DashboardComponent,
        EditDriverComponent,
        MapsComponent,
        ReportsComponent,
        AddUsersComponent,
        EditUserComponent,
        LoginComponent,
        JobComponent,
        JobListComponent,
        OngoingJobsComponent,
        CompletedJobsComponent,
        DispachComponent,
        AddDispachComponent,
        DiapachListComponent,
        UserJobsComponent,
        CalculateFareComponent,
        RolesAndPermissionComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,

        AddJobsComponent,
        CoverJobComponent,
        DeeplinkComponent,
        EditDispatchComponent,
        EditcoverComponent,
        CompanyComponent,
        AddcompanyuserComponent,
        EditCompanyuserComponent,
        DetailCompanyuserComponent,
        ListCompanyuserComponent,
        CompanyjobsComponent,
        ViewnotificationComponent,

    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        Ng2SearchPipeModule,
        HttpClientModule,
        NgxPaginationModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        AccordionModule.forRoot(),
        AlertModule.forRoot(),
        TooltipModule.forRoot(),
        ModalModule.forRoot(),
        BsDropdownModule.forRoot(),
        ChartsModule,
        ToastrModule.forRoot(),
        NgxSpinnerModule,
        NgxPaginationModule,
        AgmDirectionModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyAPtxJJdDVQUUW_PKvnIHaPuH6YOgGnjGA',
            libraries: ['places', "geometry"],
        }),
        NgMultiSelectDropDownModule.forRoot(),
        TabsModule.forRoot(),
        NgxDaterangepickerMd.forRoot(),
        AutocompleteLibModule,
        BsDatepickerModule.forRoot(),
        DatepickerModule.forRoot()
    ],

    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }

