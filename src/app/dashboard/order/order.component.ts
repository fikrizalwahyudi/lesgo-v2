import { NgZone, OnInit, ViewChild, ElementRef, Component, ViewContainerRef, AfterViewInit } from '@angular/core';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { Router, NavigationExtras } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';
import { FormControl } from '@angular/forms';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';

import { UserService } from '../../../providers/user.service';
import { SmsService } from '../../../providers/sms.service';
import { ProductService } from '../../../providers/product.service';

import { AngularFireDatabase } from 'angularfire2/database';

import {IMyDpOptions} from 'mydatepicker';
import {IOption} from 'ng-select';

import * as firebase from 'firebase';

import * as _ from "lodash";

import { Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';



declare var google: any;
declare var $:any;

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;

  myOptions: Array<IOption> = [];
  myOptionsCourse: Array<IOption> = [];



  public pinPointAddress:any = "";

  storage = firebase.storage();
  ref = firebase.database().ref();
  progressPercent: number;
  progressView:boolean = false;
  profilePhoto: string = "https://firebasestorage.googleapis.com/v0/b/lesgo-dev-v2.appspot.com/o/default-avatar.png?alt=media&token=f302f701-4f76-4e2c-8e29-8b659692e163";

  public data:any;
  cropperSettings: CropperSettings;
  public blobImgfile:any;

  
  uid:any;
  userData:any = {};
  firstName:any;
  lastName:any;
  address:any;
  phoneNumber:any;
  dataProduct:any;
  productList:any = [];

  show:boolean = false;

  selectedLevel:string = "";
  selectedCourse:string = "";
  

  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd-mm-yyyy',
  };

  public dob: any = { date: { year: 2018, month: 10, day: 9 } };

  constructor(public productService:ProductService, private afAuth:AngularFireAuth, private af:AngularFireDatabase, public userService:UserService, public smsService:SmsService, private router: Router,private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) { 
    // console.log(this.userService.getUserKey());
    this.userService.getMuridProfileTest().valueChanges().subscribe(snap=>{
      // console.log("murid Profile", snap);
    })

    this.afAuth.authState.subscribe(auth=>{
      this.uid = auth.uid;
      // console.log(this.uid);
      if(auth){
        this.userService.getUsersById(auth.uid).valueChanges().subscribe(snapshot=>{
          this.userData = snapshot;
          // console.log(snapshot);
        })
      }
      // let subscribe = this.af.object('users/testing').valueChanges().subscribe(
      //   data =>{
      //     console.log(data);
      //   }
      // );
    })

    

    // this.userService.getUserData
   }

  ngOnInit() { 
    this.show= false;
    var that = this;
    setTimeout(function(){ 
      
      that.getAllProduct().then(e=>{
        // console.log(e);
        
        that.show = true;
        console.log(that.productList);
        
      }).catch(error=>{
        // console.log(error);
      });
    }, 1000);
    
    this.userService.getAllCategories().snapshotChanges().subscribe(snapshot=>{
      // console.log(snapshot);
      var x = [];
      snapshot.map(e=>{
        // x.push(e.key);
        x.push({key:e.key,val:e.payload.val()});
        // console.log(e.key);
        // console.log(e.payload.val());
      })
      x.forEach(e=>{
        // console.log(e.$keys);
        this.myOptions.push({label:e.val.name , value:e.key});
        // console.log(this.myOptions);
      })
    })

   
  }
  

  getAllProduct(){
    return new Promise((resolve, reject)=>{
      var that = this;
      this.productService.getAllProduct().snapshotChanges().subscribe(snapshot=>{
            // console.log(snapshot);
            var list = [];
            snapshot.map(e=>{
              var o = e.payload.val();
              o.productKey = e.key;
              // e.payload.val().productKey = e.key;
              list.push(o);
            })
            this.dataProduct = list;
            this.productList = _.filter(this.dataProduct, function(each) {
              var jarak = that.productService.distance(that.userData.latitude, that.userData.longitude, each.latitude, each.longitude, "K");
              // console.log(jarak);
              if(each.status == true && each.price > 10000){
                that.productService.getTutorProfile(each.userId).valueChanges().subscribe(snap => {
                    var profile:any = snap;
                    each.schedule = [];
                    each.profile = snap;
                    each.avatar = profile.avatar;
                    if (profile.schedule != undefined) {
                      for (let e of profile.schedule) {
                        // console.log(e);
                        if(e != undefined){
                          each.schedule.push(e);
                        }
                      }
                    }
  
                    // snap.schedule.forEach(e=>{
                    //   each.schedule.push(e);
                    // })
                    // return snap.schedule;
                });
                if(jarak <= 7){
                  return true;
                }
                else {
                  return false;
                }
              }else {
                return false;
              }
              // return jarak < 13;
          });
  
          this.productList = this.productList.map(function(obj){
            // that.tutorService.getTutorProfile(obj.userId).subscribe(snapshot => {
            //     obj.profile = snapshot;
            //     // return snapshot.schedule;
            // });
            // obj.fullName = obj.firstName  + ' ' + obj.lastName ;
            // obj.courseText = ' ';
            // obj.fullName += obj.categoryName;
            // console.log(obj);
            if(obj.courses != undefined){
              obj.courses.forEach(e=>{
  
                obj.fullName += e.text + ', ';
                obj.courseText += e.text + ', ';
                obj[e.text.split(' ').join('_')] = e.text.split(' ').join('_');
              });
            }
            
  
            return obj;
          });


          resolve(this.productList);

        }, error=>{
          reject(error);
        })
    });

   
  }


  showNotification(from, align, type, message){
    // const type = ['','info','success','warning','danger'];

    var color = Math.floor((Math.random() * 4) + 1);
    $.notify({
        icon: "pe-7s-gift",
        message: message
    },{
        type: type,
        timer: 1000,
        placement: {
            from: from,
            align: align
        }
    });
  }

  onSubmit() {
    var that = this;
    // this.show= false;
    if(this.selectedLevel != "" && this.selectedCourse != ""){
      this.getAllProduct().then(e=>{
        this.productList = _.filter(this.productList, function(o) { return o.categoryName == that.selectedLevel; });
        this.productList = _.filter(this.productList, function(o) { return o.courseText.includes(that.selectedCourse); });
        // this.show= true;
      });
    }else if(this.selectedLevel != "" && this.selectedCourse == ""){
      this.getAllProduct().then(e=>{
        this.productList = _.filter(this.productList, function(o) { return o.categoryName == that.selectedLevel; });
        // this.show= true;
      })
      
    }else if(this.selectedLevel == ""){
      this.getAllProduct().then(e=>{
        // this.show= true;
      });
    }
  }

  onSelected(option: IOption) {
    // this.msg = `Selected ${option.label}`;
    // console.log(option.value);
    this.myOptionsCourse = [];
    this.selectedLevel = option.label;
    this.userService.getAllCourseByCategories(option.value).snapshotChanges().subscribe(snapshot=>{
      // console.log(snapshot);
      var x = [];
      snapshot.map(e=>{
        // x.push(e.key);
        x.push({key:e.key,val:e.payload.val()});
        // console.log(e.key);
        // console.log(e.payload.val());
      })
      x.forEach(e=>{
        // console.log(e.$keys);
        this.myOptionsCourse.push({label:e.val.name , value:e.key});
        console.log(this.myOptionsCourse);
      })
    })
    console.log(option);
  }

  onDeselected(option: IOption) {
    this.selectedLevel = "";
    // console.log(option);
  }

  

  onSelectedCourse(option: IOption) {
    this.selectedCourse = option.label;
  }

  doOrder(obj){
    // obj.productId = 
    let navigationExtras: NavigationExtras = {
      queryParams: obj
    }

    this.router.navigate(['dashboard/order/detail'], navigationExtras);
  }

  goToOtherPage(){
    let navigationExtras: NavigationExtras = {
        queryParams: {
            "firstname": "Nic",
            "lastname": "Raboy"
        }
    };
    this.router.navigate(['table/typographywithparams'], navigationExtras);
  }

  goToTutorProfile(tutorKey){
    let navigationExtras: NavigationExtras = {
      queryParams : {
        "tutorKey" : tutorKey
      }
    }
    this.router.navigate(['dashboard/tutorprofile'], navigationExtras);
  }

  resolveCurrency(num){
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } 

}
