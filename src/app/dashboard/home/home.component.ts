import { NgZone, OnInit, ViewChild, ElementRef, Component, ViewContainerRef, AfterViewInit } from '@angular/core';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { Router ,NavigationExtras} from '@angular/router';

import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { LegendItem, ChartType } from '../lbd/lbd-chart/lbd-chart.component';
import * as Chartist from 'chartist';

import { ProductService } from '../../../providers/product.service';
import { UserService } from '../../../providers/user.service';


import { AngularFireDatabase } from 'angularfire2/database';

import * as _ from "lodash";
import * as moment from 'moment';

declare var $:any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    public emailChartType: ChartType;
    public emailChartData: any;
    public emailChartLegendItems: LegendItem[];

    public hoursChartType: ChartType;
    public hoursChartData: any;
    public hoursChartOptions: any;
    public hoursChartResponsive: any[];
    public hoursChartLegendItems: LegendItem[];

    public activityChartType: ChartType;
    public activityChartData: any;
    public activityChartOptions: any;
    public activityChartResponsive: any[];
    public activityChartLegendItems: LegendItem[];

    uid:any;
    userData:any;
    orderData:any = [];
    token:any;
  
    orderStatusCartData:any=[];
    orderHistoryData:any=[];
    totalPrice:any = 0;

    sessionsList:any= [];


  constructor(private router: Router,private userService:UserService, public productService:ProductService, private afAuth:AngularFireAuth) { }

  ngOnInit() {
    $('.carousel').carousel({
      interval: 5000,
      pause: 'false'
    })

    this.getDataUser().then(e=>{
      console.log(e);
      this.getDataOrder().then(x=>{
        console.log(x);
      }).catch(err=>{
        console.log(err);
      })
    })

      // this.emailChartType = ChartType.Pie;
      // this.emailChartData = {
      //   labels: ['62%', '32%', '6%'],
      //   series: [62, 32, 6]
      // };
      // this.emailChartLegendItems = [
      //   { title: 'Open', imageClass: 'fa fa-circle text-info' },
      //   { title: 'Bounce', imageClass: 'fa fa-circle text-danger' },
      //   { title: 'Unsubscribe', imageClass: 'fa fa-circle text-warning' }
      // ];

      // this.hoursChartType = ChartType.Line;
      // this.hoursChartData = {
      //   labels: ['9:00AM', '12:00AM', '3:00PM', '6:00PM', '9:00PM', '12:00PM', '3:00AM', '6:00AM'],
      //   series: [
      //     [287, 385, 490, 492, 554, 586, 698, 695, 752, 788, 846, 944],
      //     [67, 152, 143, 240, 287, 335, 435, 437, 539, 542, 544, 647],
      //     [23, 113, 67, 108, 190, 239, 307, 308, 439, 410, 410, 509]
      //   ]
      // };
      // this.hoursChartOptions = {
      //   low: 0,
      //   high: 800,
      //   showArea: true,
      //   height: '245px',
      //   axisX: {
      //     showGrid: false,
      //   },
      //   lineSmooth: Chartist.Interpolation.simple({
      //     divisor: 3
      //   }),
      //   showLine: false,
      //   showPoint: false,
      // };
      // this.hoursChartResponsive = [
      //   ['screen and (max-width: 640px)', {
      //     axisX: {
      //       labelInterpolationFnc: function (value) {
      //         return value[0];
      //       }
      //     }
      //   }]
      // ];
      // this.hoursChartLegendItems = [
      //   { title: 'Open', imageClass: 'fa fa-circle text-info' },
      //   { title: 'Click', imageClass: 'fa fa-circle text-danger' },
      //   { title: 'Click Second Time', imageClass: 'fa fa-circle text-warning' }
      // ];

      // this.activityChartType = ChartType.Bar;
      // this.activityChartData = {
      //   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      //   series: [
      //     [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895],
      //     [412, 243, 280, 580, 453, 353, 300, 364, 368, 410, 636, 695]
      //   ]
      // };
      // this.activityChartOptions = {
      //   seriesBarDistance: 10,
      //   axisX: {
      //     showGrid: false
      //   },
      //   height: '245px'
      // };
      // this.activityChartResponsive = [
      //   ['screen and (max-width: 640px)', {
      //     seriesBarDistance: 5,
      //     axisX: {
      //       labelInterpolationFnc: function (value) {
      //         return value[0];
      //       }
      //     }
      //   }]
      // ];
      // this.activityChartLegendItems = [
      //   { title: 'Tesla Model S', imageClass: 'fa fa-circle text-info' },
      //   { title: 'BMW 5 Series', imageClass: 'fa fa-circle text-danger' }
      // ];


    }

  getDataUser(){
    return new Promise((resolve , reject)=>{
      var that = this;
      this.afAuth.authState.subscribe(auth=>{
        this.uid = auth.uid;
        console.log(this.uid);
        if(auth){
          this.userService.getUsersById(this.uid).valueChanges().subscribe(snapshot=>{
            that.userData = snapshot;
            console.log(that.userData);
            resolve(that.userData);
          })
        }
      }, error=>{
        reject(error);
      })
    });
  }

  getDataOrder(){
    var that = this;
    return new Promise((resolve, reject)=>{
      
      this.productService.getAllOrder(this.uid).snapshotChanges().subscribe(snapshot=>{
        // this.totalPrice = 0;
        // this.orderData = snapshot;
        var x = [];
        snapshot.map(e=>{
          // x.push(e.key);
          x.push({key:e.key,val:e.payload.val()});
          // console.log(e.key);
          // console.log(e.payload.val());
        })
        this.orderData = x;
        // this.orderStatusCartData = _.filter(this.orderData, function(o) { return o.val.status == "cart"; });
        // this.orderStatusCartData.forEach(e=>{
        //   this.totalPrice += Number(e.val.totalHarga);
        // })

        this.orderHistoryData = _.filter(this.orderData, function(o) { return o.val.status == "booked" });
        this.orderHistoryData.forEach(e=>{
          e.val.sessions.map(c=>{
            c.dateMoment = moment(c.date+" "+c.jam+":00", "MM-DD-YYYY HH:mm");
            c.tutorAvatar = e.val.tutorAvatar;
            c.categoryName = e.val.categoryName;
            c.courses = e.val.matpel;
            c.tutorName = e.val.tutorName;
            c.tutorKey = e.val.tutorUid;

            this.sessionsList.push(c);
          })
          
        })

        this.sessionsList = _.sortBy(this.sessionsList, 'dateMoment');
        console.log(this.sessionsList);
        console.log(this.orderStatusCartData);
        console.log(this.orderData);
        resolve(this.orderData);
      
      },error=>{
        reject(error);
      })

    });
  }

  goToTutorProfile(tutorKey){
    let navigationExtras: NavigationExtras = {
      queryParams : {
        "tutorKey" : tutorKey
      }
    }
    this.router.navigate(['dashboard/tutorprofile'], navigationExtras);
  }

  goToOrderPage(){
    this.router.navigate(['dashboard/order']);
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
        return false;
    }
    return true;
} ;

}
