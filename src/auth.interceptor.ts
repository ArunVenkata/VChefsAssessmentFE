import { inject, Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpParams,
  HttpParameterCodec,
  HttpErrorResponse,
  HttpHeaders,
  HttpHandlerFn
} from '@angular/common/http';
import { Observable, throwError, forkJoin, of, iif } from 'rxjs';
import { catchError, concatMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './app/services/auth.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';


export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const authToken = inject(AuthService).getAccessToken();
  if (authToken){
    const newReq = req.clone({
      headers: req.headers.append('Authorization', `Bearer ${authToken}`),
    });

   return next(newReq);
  }
  return next(req);
}