import { NgZone, OnInit, ViewChild, ElementRef, Component, ViewContainerRef, AfterViewInit } from '@angular/core';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { Router , ActivatedRoute, NavigationExtras} from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';
import { FormControl } from '@angular/forms';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';

import { UserService } from '../../../providers/user.service';
import { ProductService } from '../../../providers/product.service';
import { SmsService } from '../../../providers/sms.service';

import { AngularFireDatabase } from 'angularfire2/database';

import * as firebase from 'firebase';

import * as _ from "lodash";

declare var google: any;
declare var $:any;

@Component({
  selector: 'app-tutor-profile',
  templateUrl: './tutor-profile.component.html',
  styleUrls: ['./tutor-profile.component.css']
})
export class TutorProfileComponent implements OnInit {

  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;


  public pinPointAddress:any = "";

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

  
  uid:any;
  userData:any = {};
  firstName:any;
  lastName:any;
  address:any;
  phoneNumber:any;
  tutorKey:any;
  tutorProfileData:any = {};
  productList:any = [];
  dailyStringDay:any = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


  constructor( private productService:ProductService, private activatedRoute:ActivatedRoute, private afAuth:AngularFireAuth, private af:AngularFireDatabase, public userService:UserService, public smsService:SmsService, private router: Router,private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) { 
    // console.log(this.userService.getUserKey());
    
    // this.userService.getUserData
    
   }

  ngOnInit() { 

    this.activatedRoute.queryParams.subscribe(params => {
      this.tutorKey = params.tutorKey;
      console.log(params);
    });

    this.getTutorProfile().then(e=>{
      console.log(e);
      this.getAllProduct().then(e=>{
        console.log("success");
      })
    })

    this.afAuth.authState.subscribe(auth=>{
      this.uid = auth.uid;
      console.log(this.uid);
      if(auth){
        this.userService.getUsersById(auth.uid).valueChanges().subscribe(snapshot=>{
          this.userData = snapshot;
          this.firstName = this.userData.firstName;
          this.lastName = this.userData.lastName;
          this.pinPointAddress = this.userData.displayAddress;
          this.phoneNumber = this.userData.phoneNumber;
          this.latitude = this.userData.latitude;
          this.longitude = this.userData.longitude;
        })
      }
      // let subscribe = this.af.object('users/testing').valueChanges().subscribe(
      //   data =>{
      //     console.log(data);
      //   }
      // );
    })

    this.zoom = 12;
    console.log(this.userData);
    // this.latitude = this.userData.latitude;
    // this.longitude = this.userData.longitude;

    //create search FormControl
    this.searchControl = new FormControl();

    //set current position
    // this.setCurrentPosition();

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      
    });
  }

  getTutorProfile(){
    return new Promise((resolve, reject)=>{
      this.productService.getTutorProfile(this.tutorKey).snapshotChanges().subscribe(e=>{
        console.log(e.key)
        console.log(e.payload.val());
        this.tutorProfileData = e.payload.val();
        console.log("masuk", this.tutorProfileData.schedule.length);
        var array:any = [];
        for (let index = 0; index < 7; index++) {
          if(this.tutorProfileData.schedule[index]){
            console.log(this.tutorProfileData.schedule[index]);
            array.push(this.tutorProfileData.schedule[index]);
          }else{
            array.push({
              AM:[false, false, false, false, false, false, false, false, false, false, false, false],
              PM:[false, false, false, false, false, false, false, false, false, false, false, false],
              day:this.dailyStringDay[index],
              status:false
            })
            // this.tutorProfileData.schedule[index] = 
          }
          
        }
        this.tutorProfileData.schedule = array; 
        resolve(this.tutorProfileData);
      },error =>{
        reject(error);
      });
    })
    
  }

  getAllProduct(){
    return new Promise((resolve, reject)=>{
      this.productService.getProductByUserId(this.tutorKey).snapshotChanges().subscribe(snap=>{
        var list = [];
        snap.forEach(e=>{
          list.push({productKey:e.key, val:e.payload.val()});
        })
        this.productList = list;
        console.log(this.productList);
        this.productList = _.filter(this.productList, function(o) { return o.val.status == true; });
        resolve(this.productList);
       
      }, error=>{
        reject(error);
      })
    })
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
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

  centerChanged(event){
    console.log("center changed", event);
    this.latitude = event.lat;
    this.longitude = event.lng;
    if (navigator.geolocation) {
      let geocoder = new google.maps.Geocoder();
      let latlng = new google.maps.LatLng(this.latitude, this.longitude);
      let request = { latLng: latlng };
      var that = this;
      geocoder.geocode(request, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          let result = results[0];
          console.log(result)
          that.pinPointAddress = result.formatted_address;
          // let rsltAdrComponent = result.address_components;
          // let resultLength = rsltAdrComponent.length;
          // if (result != null) {
          //   console.log(rsltAdrComponent[resultLength-8].short_name);
          //   console.log(rsltAdrComponent[resultLength-7].short_name);
          // } else {
          //   alert("No address available!");
          // }
        }
      });
    }
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

  updateProile(){
    var obj = {
      firstName : this.firstName,
      lastName : this.lastName,
      phoneNumber : this.phoneNumber,
      displayAddress : this.pinPointAddress,
      uid: this.uid,
      latitude: this.latitude,
      longitude : this.longitude
    }
    this.userService.updateUsersProfile(obj).then(e=>{
      this.showNotification('top', 'right', 'success', "Your profile has been updated");
    })
  }

  resolveCurrency(num){
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } 

  doOrder(obj, productKey){
    // obj.productId = 
    obj.productKey = productKey;
    let navigationExtras: NavigationExtras = {
      queryParams: obj
    }

    this.router.navigate(['dashboard/order/detail'], navigationExtras);
  }

}
