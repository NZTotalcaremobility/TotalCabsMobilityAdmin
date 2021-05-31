import { EditDispatchComponent } from './dispach/edit-dispatch/edit-dispatch.component';
import { CoverJobComponent } from './dispach/cover-job/cover-job.component';
import { ResetPasswordComponent } from './shared/guard/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './shared/guard/forgot-password/forgot-password.component';
import { CalculateFareComponent } from './calculate-fare/calculate-fare.component';
import { UserJobsComponent } from './user/user-detail/user-jobs/user-jobs.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DriverComponent } from './driver/driver.component';
import { UserComponent } from './user/user.component';
import { DriverDetailComponent } from './driver/driver-detail/driver-detail.component';
import { DriversListComponent } from './driver/drivers-list/drivers-list.component';
import { AddDriverComponent } from './driver/add-driver/add-driver.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserDetailComponent } from './user/user-detail/user-detail.component';
import { PaymentComponent } from './payment/payment.component';
import { PaymentListComponent } from './payment/payment-list/payment-list.component';
import { InvoiceComponent } from './payment/invoice/invoice.component';
import { EditDriverComponent } from './driver/edit-driver/edit-driver.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MapsComponent } from './maps/maps.component';
import { MessageComponent } from './message/message.component';
import { ReportsComponent } from './reports/reports.component';
import { AddUsersComponent } from './user/add-users/add-users.component'
import { EditUserComponent } from './user/edit-user/edit-user.component';
import { LoginComponent } from './shared/guard/login/login.component';
import { JobComponent } from './job/job.component';
import { JobListComponent } from './job/job-list/job-list.component';
import { OngoingJobsComponent } from './job/ongoing-jobs/ongoing-jobs.component';
import { CompletedJobsComponent } from './job/completed-jobs/completed-jobs.component';
import { DispachComponent } from './dispach/dispach.component';
import { DiapachListComponent } from './dispach/diapach-list/diapach-list.component';
import { AddDispachComponent } from './dispach/add-dispach/add-dispach.component';
import { BookingDetailsComponent } from './bookings/booking-details/booking-details.component';
import { BookingsListComponent } from './bookings/bookings-list/bookings-list.component';
import { BookingsComponent } from './bookings/bookings.component';
import { RolesAndPermissionComponent } from './roles-and-permission/roles-and-permission.component';


import { AddJobsComponent } from './job/add-jobs/add-jobs.component';
import { DeeplinkComponent } from './deeplink/deeplink.component';
import { EditcoverComponent } from './job/editcover/editcover.component';
import { CompanyComponent } from './company/company.component';
import { ListCompanyuserComponent } from './company/list-companyuser/list-companyuser.component';
import { DetailCompanyuserComponent } from './company/detail-companyuser/detail-companyuser.component';
import { CompanyjobsComponent } from './company/detail-companyuser/companyjobs/companyjobs.component';
import { AddcompanyuserComponent } from './company/addcompanyuser/addcompanyuser.component';
import { EditCompanyuserComponent } from './company/edit-companyuser/edit-companyuser.component';
import { ViewnotificationComponent } from './viewnotification/viewnotification.component';


const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'forgotPassword',
        component: ForgotPasswordComponent,
    },
    {
        path: 'resetPassword/:token',
        component: ResetPasswordComponent,
    },
    {
        path: 'verifyAccount/:token',
        component: ResetPasswordComponent,
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'calculateFare',
        component: CalculateFareComponent,
        // canActivate: [AuthGuard]
    },
    {
        path: 'chat',
        component: MessageComponent,
        canActivate: [AuthGuard]

    },
    {
        path: 'viewNotification',
        component: ViewnotificationComponent,
        canActivate: [AuthGuard]

    },
    {
        path: 'maps',
        component: MapsComponent,
        canActivate: [AuthGuard]

    },
    {
        path: 'reports',
        component: ReportsComponent,
        canActivate: [AuthGuard]

    },
    {
        path: 'drivers',
        component: DriverComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                component: DriversListComponent
            },
            {
                path: 'details',
                component: DriverDetailComponent
            },
            {
                path: 'add',
                component: AddDriverComponent
            },
            {
                path: 'edit',
                component: EditDriverComponent
            },


            {
                path: '**',
                component: DriversListComponent
            }
        ]
    },
    {
        path: 'users',
        component: UserComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                component: UserListComponent
            },
            {
                path: 'details',
                component: UserDetailComponent
            },
            {
                path: 'details/:_id/jobs',
                component: UserJobsComponent
            },
            {
                path: 'add',
                component: AddUsersComponent
            },
            {
                path: 'edit',
                component: EditUserComponent
            }
        ]

    },
    {
        path: 'company',
        component: CompanyComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                component: ListCompanyuserComponent
            },
            {
                path: 'details',
                component: DetailCompanyuserComponent
            },
            {
                path: 'details/:_id/jobs',
                component: CompanyjobsComponent
            },
            {
                path: 'add',
                component: AddcompanyuserComponent
            },
            {
                path: 'edit',
                component: EditCompanyuserComponent
            }
        ]

    },
    // {
    //     path: 'jobs',
    //     component: JobComponent,
    //     canActivate: [AuthGuard],
    //     children: [
    //         {
    //             path: '',
    //             component: JobListComponent
    //         },
    //         {
    //             path: 'add',
    //             component:AddCoverJobComponent
    //         },
    //         {
    //             path: 'ongoing',
    //             component: OngoingJobsComponent
    //         },
    //         {
    //             path: 'add-jobs',
    //             component: AddJobsComponent
    //         },

    //         {
    //             path: 'completed',
    //             component: CompletedJobsComponent
    //         },
    //         {
    //             path: '**',
    //             component: JobListComponent

    //         }
    //     ]
    // },
    {
        path: 'jobs/dispatch/:_id',
        canActivate: [AuthGuard],
        component: EditDispatchComponent
    },
    {
        path: 'jobs',
        component: DispachComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'dispatch',
                component: DiapachListComponent
            },
            {
                path: 'bookings',
            
                canActivate: [AuthGuard],
                children: [
                    {
                        path: '',
                        component: BookingsListComponent
                    },
                    {
                        path: ':id',
                        component: InvoiceComponent
                    }
                ]
            },
           
            {
                path: 'deeplink',
                component: DeeplinkComponent
            },
            {
                path: 'cover',
                component: CoverJobComponent
            },
            {
                path: 'cover/:_id',
                component: EditcoverComponent
            },
            {
                path: 'addCover',
                component: AddJobsComponent
            },
            {
                path: 'addDispatch',
                component: AddDispachComponent
            },
            {
                path: '**',
                component: DiapachListComponent
            }
        ]
    },
    {
        path: 'payment',
        component: PaymentComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                component: PaymentListComponent
            },
            {
                path: ':id/invoice',
                component: InvoiceComponent
            }
        ]
    },
    {
        path: 'manageRoles',
        component: RolesAndPermissionComponent,
        canActivate: [AuthGuard],
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }