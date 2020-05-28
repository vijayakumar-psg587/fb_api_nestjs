import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, throwError, from, of } from 'rxjs';
import fastify from 'fastify';
import * as _ from 'lodash';
import {
  APP_CORS_ACCESS_ALLOW_HEADERS,
  APP_CORS_ACCESS_ALLOW_METHODS,
  APP_CORS_WHITELIST,
  CHAR_COMMA,
} from '../util/app.constants';
import { catchError, filter, first, map, switchMap, tap } from 'rxjs/operators';
import { CustomHttpException } from '../models/custom.httpexception.model';
import { CustomErrorModel } from '../models/custom.error.model';
import { AppUtilService } from '../services/app-util/app-util.service';
import { raw } from 'express';

@Injectable()
export class CorsInterceptor implements NestInterceptor {
  constructor(private readonly appUtilService: AppUtilService) {

  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // interception for cors
    const request:fastify.FastifyRequest = context.switchToHttp().getRequest();
    console.log('coming in cors');
    const res:fastify.FastifyReply<any> = context.switchToHttp().getResponse();
    // if HTTP1 is being used, then one of origin or host header will be populated
    const hostHeader = request.headers['host'];
    const originHeader = ( request.headers['origin'] && true )? <string> request.headers['origin'] :null;
    // in http2 supported browsers - this is the header,
    const http2AuthorityHeader = (request.headers[':authority'] && true)? request.headers[':authority']: null;
    console.log('origin header', originHeader);
    console.log('http2Header', http2AuthorityHeader);
    console.log('http2Header', request.headers);
    let allowedHostOrigin = null;
    const headerObs$ = from(Object.entries(request.headers)).pipe(tap(mapData => {
      console.log('in obs:',mapData);
    }), map(rawData => {
      const map = new Map();
      map.set(rawData[0], rawData[1]);
      console.log('map in:', map);
      return map;
    }), first((mapData) => {
      // key can be any of authority or origin- hence check for or condition with keys alone
      if(mapData.has(':authority') || mapData.has('origin') ) {
        const val = mapData.get(':authority') != null ?
            mapData.get(':authority') : mapData.get('origin') != null ? mapData.get('origin') != null: '' ;
        console.log('inside first if', APP_CORS_WHITELIST.join(',').includes(val));
        if( (mapData.get(':authority') != ''
            && APP_CORS_WHITELIST.join(',').includes(val)) ||
            (mapData.get('origin') != ''
                && APP_CORS_WHITELIST.join(',').includes(val))
        ) {
          return true;
        }else {
          return false;
        }

      } else {
        return false;
      }
    }));

    headerObs$.subscribe(data => {
      allowedHostOrigin = true;
    }, err => {
      console.log('error in cors', err);
      // we have to throw the error -  first set the flag as false
      allowedHostOrigin = false;

    });

   if(allowedHostOrigin) {
     const corsHeaders = {
       'Access-Control-Allow-Origin': request.headers['host'] ?? request.headers['origin'],
       'Access-Control-Allow-Methods': _.join(APP_CORS_ACCESS_ALLOW_METHODS, CHAR_COMMA),
       'Access-Control-Allow-Headers':_.join(APP_CORS_ACCESS_ALLOW_HEADERS, CHAR_COMMA),
       'Access-Control-Max-Age':86400,
       'Access-Control-Allow-Credentials': true
     };

     res.headers(corsHeaders);
     console.log('coming in cors interceptors:');
     return next.handle();
   } else {
     console.log('coming in else');
     const custErrModel = new CustomErrorModel('CorsValidationError');
     custErrModel.name = 'CorsValidationError';
     custErrModel.errType = custErrModel.name;
     custErrModel.timeOfOccurance = this.appUtilService.getCurrentLocaleTimeZone();
     custErrModel.errorMessage = ['Request doesnt contain CORS allowed domain'];
     custErrModel.errorCode = '500';
     throw custErrModel;
   }



  }
}
