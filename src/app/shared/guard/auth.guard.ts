import { ToastrService } from 'ngx-toastr';
import { NavigationEnd } from '@angular/router';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    previousURL: string = ''
    permissionList: any = [];
    role: string = '';
    currentUser: any = '';
    isLoaded: boolean = false;
    constructor(
        private router: Router,
        private toaste: ToastrService,
    ) {
    }


    canActivate() {
        if (!this.isLoaded && localStorage.getItem('tca')) {
            const { permissions, userType, ...rest } = JSON.parse(localStorage.getItem('tca'))
            this.permissionList = permissions;
            this.role = userType;
            this.currentUser = rest;
        }

        if (localStorage.getItem('isLoggedin')) {
            this.router.events.subscribe(event => {
                if (event instanceof NavigationEnd) {
                    console.log('evnet url---', event.url, event.url.split('/')[1])
                    let splitedURL: string = event.url.split('/')[1];
                    // event.url has current url
                    if (this.role !== 'Admin' && splitedURL !== '') {
                        if (this.permissionList.includes(splitedURL)) {
                            this.previousURL = event.url
                            return true;
                        } else {
                            this.toaste.warning('You are Unauthorised for this page! redirecting to Back!')
                            this.router.navigate([this.previousURL])
                            return false
                        }
                    } else {
                        return true;
                    }
                }
            });
            return true;
        }
        this.router.navigate(['/login']);
        return false;
    }
}
