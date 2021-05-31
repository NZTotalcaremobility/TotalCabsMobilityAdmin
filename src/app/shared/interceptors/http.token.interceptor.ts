import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { JwtService } from '../services';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
    constructor(private jwtService: JwtService) { }
    authHeader: any;
    setUser() {
        this.authHeader = this.jwtService.getToken();
    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.setUser();
        if (this.authHeader === null) {
            return next.handle(req.clone());
        }
        const clonedReq = req.clone({ headers: req.headers.set('Authorization', `${this.authHeader}`) });
        return next.handle(clonedReq);
    }
}
