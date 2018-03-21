import { NgZone, OnInit, ViewChild, ElementRef, Component, ViewContainerRef, AfterViewInit } from '@angular/core';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { Router, ActivatedRoute } from '@angular/router';
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
import * as moment from 'moment';

import { Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';



declare var google: any;
declare var $:any;

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  // dates setting
  now = moment();
  public singleSessionPickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd-mm-yyyy',
    disableUntil: {year:this.now.get('year'), month: this.now.get('month') + 1, day: this.now.get('date')}
  };
  public startDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd-mm-yyyy',
    disableUntil: {year:this.now.get('year'), month: this.now.get('month') + 1, day: this.now.get('date')}
  };
  public endDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd-mm-yyyy',
    disableUntil: {year:this.now.get('year'), month: this.now.get('month') + 1, day: this.now.get('date') + 7}
  };

  startDate:any;
  endDate:any;
  sessionDate:any;

  //--------------------
  //tutor setting
  dataProduct:any = {};
  productList:any = [];
  tutorData:any;
  activeSchedule:any = [];

  //userSetting
  uid:any;
  userData:any = {};
  firstName:any;
  lastName:any;
  address:any;
  phoneNumber:any;
  studentName:any;
  studentAddress:any;
  muridId:any;
  

  //selectSetting
  myOptions: Array<IOption> = [];
  myOptionsCourse: Array<IOption> = [];

  orderTypeOptions: Array<IOption> = [
    {
      label:"Single Session",
      value:"Single Session"
    },
    {
      label:"Regular",
      value:"Regular"
    }
  ];

  totalStudentOptions: Array<IOption> = [
    {
      label:"1",
      value:"1"
    },
    {
      label:"2",
      value:"2"
    },
    {
      label:"3",
      value:"3"
    },
    {
      label:"4",
      value:"4"
    }
  ];

  dayOptions: Array<IOption> = [];
  hourOptions: Array<IOption> = [];
  hourOpt:any = {};
  singleSessionHourOption: Array<IOption> = [];
  
  frekuensiOptions: Array<IOption> = [
    {
      label:"1X",
      value:"1"
    },
    {
      label:"2X",
      value:"2"
    },
    {
      label:"3X",
      value:"3"
    },
    {
      label:"4X",
      value:"4"
    }
  ];

  selectedLevel:string = "";
  selectedCourse:string = "";
  selectedFrekuensi:string = "1";
  dayIndex:any = [true, true, true, true];
  selectedTotalStudent:string = "1";
  selectedOrderType:string = "Regular";


  //map setting
  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;
  public pinPointAddress:any = "";

  @ViewChild("search")
  public searchElementRef: ElementRef;

  //image setting
  storage = firebase.storage();
  ref = firebase.database().ref();
  progressPercent: number;
  progressView:boolean = false;
  profilePhoto: string = "https://firebasestorage.googleapis.com/v0/b/lesgo-dev-v2.appspot.com/o/default-avatar.png?alt=media&token=f302f701-4f76-4e2c-8e29-8b659692e163";
  public data:any;
  cropperSettings: CropperSettings;
  @ViewChild('cropper', undefined)
  cropper:ImageCropperComponent;
  public blobImgfile:any;

  //other setting
  frekuensiDayHour:any = [
    {
      day:"",
      hour:""
    }
  ];
  dateRange:any = [];
  tmpHourDay:any = {};
  sessionData:any = [];
  orderData:any = {};
  dailyStringDay:any = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  
  

  constructor(private route: ActivatedRoute, public productService:ProductService, private afAuth:AngularFireAuth, private af:AngularFireDatabase, public userService:UserService, public smsService:SmsService, private router: Router,private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) { 
    // console.log(this.userService.getUserKey());
    
    

  }

  ngOnInit() { 
    var that = this;
    this.afAuth.authState.subscribe(auth=>{
      this.uid = auth.uid;
      // console.log(this.uid);
      if(auth){
        this.userService.getUsersById(auth.uid).valueChanges().subscribe(snapshot=>{
          this.userData = snapshot;
          this.studentAddress = this.userData.displayAddress;
          // console.log(snapshot);
          

        })
        
        this.userService.getMuridKey(auth.uid).snapshotChanges().subscribe(snap=>{
          console.log(snap[0].key);
          this.muridId = snap[0].key;
        })
        
      }
    
    })   

    console.log(this.now.get('year'));
    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.tutorData = params;
      this.productService.getProductByKey(params.productKey).valueChanges().subscribe(snap=>{
        this.dataProduct = snap;
      })
      this.getDataTutor().then(e=>{
        console.log(e);
      }).catch(err=>{
        console.log(err);
      })
      
      // console.log(this.tutorData.schedule)
    });

    // this.getAllProduct();
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
  
  getDataTutor(){
    return new Promise((resolve , reject)=>{
      this.productService.getTutorProfile(this.tutorData.userId).valueChanges().subscribe(snap=>{
        this.tutorData = snap;
        for (let index = 0; index < 7; index++) {
          if(this.tutorData.schedule[index]){
  
          }else{
            // console.log()
            this.tutorData.schedule[index] = {
              AM:[false, false, false, false, false, false, false, false, false, false, false, false],
              PM:[false, false, false, false, false, false, false, false, false, false, false, false],
              day:this.dailyStringDay[index],
              status:false
            }
          }
          
        }
        // this.generateTutorSchedule(this.tutorData.schedule);
        // console.log(this.tutorData.schedule);
        let filteredSchedule = _.filter(this.tutorData.schedule, {status: true});
        let filteredNotActive = _.filter(this.tutorData.schedule, {status: false});
        var that = this;
        var dayOption = [];
        var frekuensiOption = [];
        filteredSchedule.forEach(function(value, i){
          // console.log(value);
          var obj = value;
          obj.hour = that.resolveHour(obj);
          that.activeSchedule.push(obj)
          dayOption.push({label:obj.day,value:obj.day});
          // frekuensiOption.push({label:(i+1)+"X", value:(i+1)});
        })
        this.dayOptions = dayOption;
        // this.frekuensiOptions = frekuensiOption;
        // console.log(filteredNotActive);
        var arrDisable = [];
        filteredNotActive.forEach(e=>{
          // console.log(e.day.substring(0,2).toLowerCase());
          arrDisable.push(e.day.substring(0,2).toLowerCase());
        })
    
        // console.log(arrDisable);
        that.singleSessionPickerOptions.disableWeekdays = [];
        that.singleSessionPickerOptions.disableWeekdays = arrDisable;
        // console.log(this.tutorData);
        resolve(this.tutorData);
      },error=>{
        reject(error);
      })
    })
   
  }


  fileChangeListener($event) {
    var image:any = new Image();
    var file:File = $event.target.files[0];
    var myReader:FileReader = new FileReader();
    var that = this;
    myReader.onloadend = function (loadEvent:any) {
        image.src = loadEvent.target.result;
        that.cropper.setImage(image);


    };
    console.log(this.cropper);
    myReader.readAsDataURL(file);
  }

  submitImg(){
    this.blobImgfile = this.dataURLtoBlob(this.data.image);
    this.onUpload();
  }

  dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
  }

  onUpload() {
    // console.log(this.uploader.queue[this.uploader.queue.length - 1]['_file']);
    const fileName: string = "profile" + new Date().getTime() + '.png';
    const timestamp: number = new Date().getTime();
    const fileRef: any = this.storage.ref(`images/${fileName}`);
    const uploadTask: any = fileRef.put(this.blobImgfile);
    var that = this;
    uploadTask.on('state_changed',
    function (snapshot) {
      that.progressPercent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      that.progressView = true;
      if (that.progressPercent == 100) {
        that.progressView = false;
      }
      console.log('Upload is ' + that.progressPercent + '% done');
    },
    function(error) {
      switch (error.code) {
        case 'storage/unauthorized':
        // User doesn't have permission to access the object
        break;

        case 'storage/canceled':
        // User canceled the upload
        break;

        case 'storage/unknown':
        // Unknown error occurred, inspect error.serverResponse
        break;
      }
    }, function() {
      // Upload completed successfully, now we can get the download URL
      that.profilePhoto = uploadTask.snapshot.downloadURL;

      console.log(uploadTask.snapshot.downloadURL);
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
    if(this.selectedLevel != "" && this.selectedCourse != ""){
      this.productList = _.filter(this.productList, function(o) { return o.categoryName == that.selectedLevel; });
      this.productList = _.filter(this.productList, function(o) { return o.courseText.includes(that.selectedCourse); });
    }else if(this.selectedLevel != "" && this.selectedCourse == ""){
      this.productList = _.filter(this.productList, function(o) { return o.categoryName == that.selectedLevel; });
    }else if(this.selectedLevel == ""){
      // this.getAllProduct();
    }
  }

  onSelected(option: IOption) {
    // this.msg = `Selected ${option.label}`;
    console.log(option.value);
    this.myOptionsCourse = [];
    this.selectedLevel = option.label;
    this.userService.getAllCourseByCategories(option.value).snapshotChanges().subscribe(snapshot=>{
      console.log(snapshot);
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
        // console.log(this.myOptionsCourse);
      })
    })
    console.log(option);
  }

  onSelectedFrekuensi(option: IOption) {
    // this.msg = `Selected ${option.label}`;
    this.tmpHourDay = {}
    this.frekuensiDayHour = [];
    for (let i = 0; i < Number(option.value); i++) {
      this.frekuensiDayHour.push({day:"", hour:""});
      // this.sessionData.push(i);
    }
  }

  onSelectedTotalStudent(option: IOption) {
    // this.msg = `Selected ${option.label}`;
    this.selectedTotalStudent = option.value;
  }

  onSelectedDay(option: IOption, index) {
    // this.dayIndex[index] = false;
    this.hourOptions = [];
    console.log(option);
    var daySchedule:any = _.filter(this.activeSchedule, {day: option.value});
    console.log(daySchedule);
    daySchedule[0].hour.forEach(e=>{
      this.hourOptions.push({label:e,value:e});
    })
    this.hourOpt[index] = this.hourOptions;
    // this.dayIndex[index] = true;
  }

  onSelectedHour(option: IOption, day,hour, index){
    

    this.tmpHourDay[index] = {};
    this.tmpHourDay[index] = {day:moment(day.jsdate).format('dddd'), hour:hour};
    console.log(this.tmpHourDay);

  }

  // checkSelectedSchedule(index){
  //   if(this.tmpHourDay[index])
  // }
  checkCart(){

    if(this.selectedOrderType == 'Regular'){
      if(this.dateRange.length > 0 && this.tmpHourDay[0] != undefined){
        console.log(this.tutorData);
        console.log(this.dataProduct);
        this.sessionData = [];
        this.orderData = {};
        // console.log("test"); 
        for (var key in this.tmpHourDay) {
          var obj = this.tmpHourDay[key];
          this.dateRange.forEach(each => {
            if(each.moment.format('dddd') == this.tmpHourDay[key].day){
              // console.log("ketemu");
              var session:any = {
                date:each.moment.format('MM-DD-YYYY'),
                day:each.moment.format('dddd'),
                jam:this.tmpHourDay[key].hour,
                jamEnd:0,
                jamStart:0,
                review:"",
                status:"booked"
              }
              this.sessionData.push(session);
  
            }
          })
          console.log(this.sessionData);
        }
  
        this.orderData.sessions = this.sessionData;
        this.orderData.muridId = this.muridId;
        this.orderData.alamatMurid = this.studentAddress;
        this.orderData.avatarMurid = this.userData.avatar;
        this.orderData.namaMurid = this.studentName;
        this.orderData.frekuensi = this.selectedFrekuensi;
        this.orderData.jenisPaket = this.selectedOrderType;
        this.orderData.jumlahMurid = Number(this.selectedTotalStudent);
        this.orderData.latitude = this.userData.latitude;
        this.orderData.longitude = this.userData.longitude;
        if(this.dataProduct){
          this.orderData.categoryName = this.dataProduct.categoryName;
          this.orderData.matpel = this.dataProduct.courses;
        }
        this.orderData.orderSchedule = {
          endDate: this.endDate.date.year + "-" + this.endDate.date.month + "-" + this.endDate.date.day,
          startDate: this.startDate.date.year + "-" + this.startDate.date.month + "-" + this.startDate.date.day
        }
        
        this.orderData.phoneNumber = this.userData.phoneNumber;
        this.orderData.price = this.dataProduct.price;
        // if(jumlah)
        console.log(this.sessionData.length);
        console.log(this.dataProduct.price);
        console.log();
        this.orderData.totalHarga = this.sessionData.length * ( this.dataProduct.price * (((Number(this.selectedTotalStudent) - 1) * 0.5) + 1))
        console.log(this.orderData);
        this.orderData.status = "cart";
        this.orderData.transactionId = "LP"+moment().format('x');
        this.orderData.tutorAvatar = this.tutorData.avatar;
        this.orderData.tutorName = this.tutorData.firstName + " " + this.tutorData.lastName;
        this.orderData.tutorRating = "average";
        this.orderData.tutorUid = this.tutorData.uid;
        this.orderData.uid = this.userData.updateBy;
        this.orderData.userName = this.userData.firstName;
        this.orderData.createDate = moment().format('x');
  
        // return true;
      }
    }else {
      console.log(this.tutorData);
      console.log(this.dataProduct);
      this.sessionData = [];
      this.orderData = {};
      // console.log("test"); 
      // console.log(this.tmpHourDay);
      // var obj = this.tmpHourDay[0];
      var session:any = {
        date:moment(this.sessionDate.jsdate).format('MM-DD-YYYY'),
        day:moment(this.sessionDate.jsdate).format('dddd'),
        jam:this.tmpHourDay[0].hour,
        jamEnd:0,
        jamStart:0,
        review:"",
        status:"booked"
      }
      this.sessionData.push(session);
      this.orderData.sessions = this.sessionData;
      this.orderData.muridId = this.muridId;
      this.orderData.alamatMurid = this.studentAddress;
      this.orderData.avatarMurid = this.userData.avatar;
      this.orderData.namaMurid = this.studentName;
      this.orderData.frekuensi = this.selectedFrekuensi;
      this.orderData.jenisPaket = this.selectedOrderType;
      this.orderData.jumlahMurid = Number(this.selectedTotalStudent);
      this.orderData.latitude = this.userData.latitude;
      this.orderData.longitude = this.userData.longitude;
      if(this.dataProduct){
        this.orderData.categoryName = this.dataProduct.categoryName;
        this.orderData.matpel = this.dataProduct.courses;
      }
      this.orderData.orderSchedule = {
        endDate: this.sessionDate.date.year + "-" + this.sessionDate.date.month + "-" + this.sessionDate.date.day,
        startDate: this.sessionDate.date.year + "-" + this.sessionDate.date.month + "-" + this.sessionDate.date.day
      }
      
      this.orderData.phoneNumber = this.userData.phoneNumber;
      this.orderData.price = this.dataProduct.price;
      // if(jumlah)
      console.log(this.sessionData.length);
      console.log(this.dataProduct.price);
      console.log();
      this.orderData.totalHarga = this.sessionData.length * ( this.dataProduct.price * (((Number(this.selectedTotalStudent) - 1) * 0.5) + 1))
      console.log(this.orderData);
      this.orderData.status = "cart";
      this.orderData.transactionId = "LP"+moment().format('x');
      this.orderData.tutorAvatar = this.tutorData.avatar;
      this.orderData.tutorName = this.tutorData.firstName + " " + this.tutorData.lastName;
      this.orderData.tutorRating = "average";
      this.orderData.tutorUid = this.tutorData.uid;
      this.orderData.uid = this.userData.updateBy;
      this.orderData.userName = this.userData.firstName;
      this.orderData.createDate = moment().format('x');
    }

    if(!this.orderData.sessions || !this.studentAddress || !this.studentName){
      this.showNotification('top', 'right', 'danger', "Please fill the data");
      this.orderData = {};
    }
   
    
    
  }

  submitCart(){
    if(this.orderData.sessions){
      var obj = {
        address:this.studentAddress,
        displayAddress:this.studentAddress
      }
      this.userService.updateMuridProfile(obj, this.muridId).then(e=>{
        this.productService.createOrder(this.orderData).then(e=>{
          console.log('success');
          this.router.navigate(['dashboard/cart']);
        })
      });
    }
  }

  

  onDeselected(option: IOption) {
    this.selectedLevel = "";
    console.log(option);
  }

  onSelectedStartDate(){
    this.dateRange = [];
    console.log(this.startDate);
    console.log(new Date());
    this.endDatePickerOptions.disableUntil.year = this.startDate.date.year;
    this.endDatePickerOptions.disableUntil.month = this.startDate.date.month;
    this.endDatePickerOptions.disableUntil.day = (this.startDate.date.day+5);
    this.endDate = "";
  }

  onSelectedSessionDate(){
    this.singleSessionHourOption = [];
    // console.log(option);
    var daySchedule:any = _.filter(this.activeSchedule, {day: moment(this.sessionDate.jsdate).format('dddd')});
    console.log(daySchedule);
    daySchedule[0].hour.forEach(e=>{
      this.singleSessionHourOption.push({label:e,value:e});
    })
    // this.hourOpt[index] = this.singleSessionHourOption;
  }

  onSelectedEndDate(){
    // var range = moment().range(fromDate, toDate);
    // const a = this.startDate.jsdate;
    // var that = this;
    var start = this.startDate.jsdate;
    this.dateRange = [];
    console.log(start);
    while(start <= this.endDate.jsdate){
      this.dateRange.push({
        moment:moment(start),
        day:moment(start).format('dddd'),
        date:moment(start).format('dddd DD-MM-YYYY'),
        status:false
      });
      //.format('dddd DD-MM-YYYY')
      var newDate = moment(start).add(1,'day');
      start = newDate;  
      // console.log(this.startDate.jsdate);
    }

    console.log(this.dateRange);
  }

  onSelectedCourse(option: IOption) {
    this.selectedCourse = option.label;
  }

  onSelectedOrderType(option: IOption) {
    this.orderData = {};
    this.sessionDate={};
    this.startDate={};
    this.selectedOrderType = option.label;
  }

  generateTutorSchedule(schedule){
    console.log(schedule);
    let filteredSchedule = _.filter(schedule, {status: true});
    let filteredNotActive = _.filter(schedule, {status: false});
    var that = this;
    var dayOption = [];
    var frekuensiOption = [];
    filteredSchedule.forEach(function(value, i){
      console.log(value);
      var obj = value;
      obj.hour = that.resolveHour(obj);
      that.activeSchedule.push(obj)
      dayOption.push({label:obj.day,value:obj.day});
      // frekuensiOption.push({label:(i+1)+"X", value:(i+1)});
    })
    this.dayOptions = dayOption;
    // this.frekuensiOptions = frekuensiOption;
    console.log(filteredNotActive);
    var arrDisable = [];
    filteredNotActive.forEach(e=>{
      console.log(e.day.substring(0,2).toLowerCase());
      arrDisable.push(e.day.substring(0,2).toLowerCase());
    })

    console.log(arrDisable);
    that.singleSessionPickerOptions.disableWeekdays = [];
    that.singleSessionPickerOptions.disableWeekdays = arrDisable;
    // this.activeSchedule.forEach(e=>{
    //   that.singleSessionPickerOptions.disableWeekdays = [];
    //   that.singleSessionPickerOptions.disableWeekdays.push(e.day.substring(0,2).toLowerCase());
    // })
    
  }

  resolveHour(schedule){
    var hour = [];
    schedule.AM.forEach(function (value, i){
      console.log(value);
      console.log(i);
      if(value){
        hour.push(i+1);
      }
      
    })
    schedule.PM.forEach(function(value, i){
      if(value){
        hour.push(i+13);
      }
      
    });
    console.log(hour);
    return hour;
    
  }

  resolveCurrency(num){
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } 

}
