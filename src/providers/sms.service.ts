import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map'
// declare var xml2json: any;;

@Injectable()
export class SmsService {
    // url = 'http://kab-bogor.kpu.go.id/berita/headline?limit=5&start=10&format=feed&type=rss';
    constructor(private http: Http) {
        this.http = http;
    }

    sendSMS(number,code) {
    //  var q= encodeURI({"where":{"id":"3"}});
    // console.log(nik.toString());
    // var a = "3201405002970001";
        // var num = "+62" + number;
        
        return this.http.get("https://les-go.com/api/twilio/"+ number +"/"+code).map(res=>{
            return res.json()
        },error=>{
            error;
        });
    }
}
