import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import fastify from "fastify";
import {Http2Server} from "http2";
const helmetCsp = require('helmet-csp');

@Injectable()
export class HelmetInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // instead of doing this, lets
    const response: fastify.FastifyReply<Http2Server> = context.switchToHttp().getResponse();
    this.addCspHeaders(response);
    // this.addFrameGuardHeader(response);
    this.addHidePoweredBy(response);
    this.addXSSFilterHeader(response);
    return next.handle();
  }

  addCspHeaders(response) {
    const cspheader = {
      'Content-Security-Policy': ['default-src' ,"'self'", 'default.com' ].join()
    }
    response.headers(cspheader);
  }

  addFrameGuardHeader(response) {
    const frameGuardHeader = {
      'X-Frame-Options': 'SAMEORIGIN'
    };
    response.headers(frameGuardHeader);
  }

  addHidePoweredBy(response) {
    const hidePoweredByHeader = {
      'X-Powered-By': 'PHP 4.2.0'
    };
    response.headers(hidePoweredByHeader);
  }


  addXSSFilterHeader = (res) => {
    const header = {
      'X-XSS-Protection': '1; mode=block'
    };
    res.headers(header);
  };
}
