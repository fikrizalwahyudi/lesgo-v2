import { NgZone, OnInit, ViewChild, ElementRef, Component, ViewContainerRef, AfterViewInit } from '@angular/core';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';
import { FormControl } from '@angular/forms';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';

import { SmsService } from '../../providers/sms.service';
import { UserService } from '../../providers/user.service';

import * as firebase from 'firebase';

declare var google: any;
declare var $:any;

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
    public latitude: number;
    public longitude: number;
    public searchControl: FormControl;
    public zoom: number;

    @ViewChild("search")
    public searchElementRef: ElementRef;

    public pinPointAddress:any = "";

    state: string = '';
    error: any;

    firstName:any;
    lastName:any;
    email:any;
    password:any;
    passwordConfirmation:any;
  
    storage = firebase.storage();
    ref = firebase.database().ref();
    progressPercent: number;
    progressView:boolean = false;
    profilePhoto: string = "https://firebasestorage.googleapis.com/v0/b/lesgo-dev-v2.appspot.com/o/default-avatar.png?alt=media&token=f302f701-4f76-4e2c-8e29-8b659692e163";

    public phoneNumber: string = "";
    public mask = ['+', '6','2', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/ , /\d/];

    public data:any;
    cropperSettings: CropperSettings;
    @ViewChild('cropper', undefined)
    cropper:ImageCropperComponent;
    public blobImgfile:any;
 

    constructor(public userService:UserService, public smsService:SmsService, public af: AngularFireAuth,private router: Router,private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {
      //image cropper setting;
      this.cropperSettings = new CropperSettings();
      this.cropperSettings.width = 100;
      this.cropperSettings.height = 100;
      this.cropperSettings.croppedWidth =200;
      this.cropperSettings.croppedHeight = 200;
      this.cropperSettings.canvasWidth = 300;
      this.cropperSettings.canvasHeight = 300;
      this.cropperSettings.noFileInput = true;
      this.data = {};

      // this.af.authState.subscribe(auth => { 
      //   if(auth) {
      //     this.router.navigate(['/dashboard/user']);
      //     console.log(auth.uid);
      //   }
      // });
  }



  ngOnInit() { 
    this.zoom = 14;
    this.longitude = 106.84513;
    this.latitude = -6.21462;

    //create search FormControl
    this.searchControl = new FormControl();

    //set current position
    this.setCurrentPosition();

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 14;
        });
      });
    });
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 14;
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


  onSubmit() {
    console.log();
    var phone = this.phoneNumber.match(/\d/g).join("");
    var fixPhone = "+" + phone;
    
    // console.log(fixPhone);
    if(this.password != this.passwordConfirmation){
      this.showNotification('top', 'right', 'danger', "Your password didnt match with password confirmation");
    }


    if(this.email != null && this.password != null && this.firstName != null && this.lastName != null && this.pinPointAddress != null){
      var that = this;
      this.userService.signup(this.email, this.password).then(user=>{
        var smsCode = Math.floor(1000 + Math.random() * 9000); 
        var obj = {
          avatar:this.profilePhoto,
          displayAddress:this.pinPointAddress,
          email:this.email,
          firstName:this.firstName,
          id:smsCode,
          lastName:this.lastName,
          latitude:this.latitude,
          longitude:this.longitude,
          phoneNumber:fixPhone,
          smsVerificationCode:smsCode,
          uid:user.uid
        }
        // console.log(user.uid);
        console.log(obj);
        this.userService.createUsers(obj).then(val=>{
          // console.log(val);
          console.log("tambah sukses");
          this.smsService.sendSMS(fixPhone, smsCode).subscribe(e=>{
            console.log(e);
            // console.log(e.result);
            if(e.result != undefined){
              console.log(e.result);
              console.log("berhasil terkirim");
              this.router.navigate(['verification']);
              // success
            }else {
              console.log(e.status);
              console.log("gagal");
              this.router.navigate(['verification']);
              //tidak sukses
            }
          },error=>{
            console.log("error");
            //nanti di kasih edit phone number
          })
        }).catch(error=>{
          console.log(error);
          console.log("masuk error");
           //nanti di kasih edit phone number
        })
        // console.log(this.userService.user);
        
      }).catch(error=>{
          console.log("sign UP ERROR");
          this.showNotification('top', 'right', 'danger', error);
      })
        // console.log(this.phoneNumber.replace( /^\D+/g, ''));
    }else {
      this.showNotification('top', 'right', 'danger', "Please fill the data");
    }
    
  }

  // doSaveUsers(obj){
  //   this.userService.createUsers(obj).then(val=>{
  //     // console.log(val);
  //     console.log("tambah sukses");
  //     // this.smsService.sendSMS(fixPhone, smsCode).subscribe(e=>{
  //     //   console.log(e);
  //     //   // console.log(e.result);
  //     //   if(e.result != undefined){
  //     //     console.log(e.result);
          
  //     //     // success
  //     //   }else {
  //     //     console.log(e.status);
  //     //     //tidak sukses
  //     //   }
  //     // },error=>{
  //     //   console.log("error");
  //     // })
  //   }).catch(error=>{
  //     console.log(error);
  //     console.log("masuk error");
  //   })
  // }

  register() {
    this.router.navigate(['registration']);
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

  
  


}
