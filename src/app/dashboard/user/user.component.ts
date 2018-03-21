import { NgZone, OnInit, ViewChild, ElementRef, Component, ViewContainerRef, AfterViewInit } from '@angular/core';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';
import { FormControl } from '@angular/forms';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';

import { UserService } from '../../../providers/user.service';
import { SmsService } from '../../../providers/sms.service';

import { AngularFireDatabase } from 'angularfire2/database';

import * as firebase from 'firebase';

declare var google: any;
declare var $:any;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;
 
  @ViewChild("search")
  public searchElementRef: ElementRef;

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
  detailAddress:any = "";
  dataMurid:any = {};

  muridKey:any;
  muridData:any;


  constructor( private afAuth:AngularFireAuth, private af:AngularFireDatabase, public userService:UserService, public smsService:SmsService, private router: Router,private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) { 
    // console.log(this.userService.getUserKey());
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

    
    // this.userService.getUserData
   }


  ngOnInit() { 
    this.afAuth.authState.subscribe(auth=>{
      this.uid = auth.uid;
      console.log(this.uid);
      if(auth){
        this.userService.getUsersById(auth.uid).valueChanges().subscribe(snapshot=>{
          this.userData = snapshot;
          this.firstName = this.userData.firstName;
          this.lastName = this.userData.lastName;
          // this.pinPointAddress = this.userData.displayAddress;
          this.phoneNumber = this.userData.phoneNumber;
          this.latitude = this.userData.latitude;
          this.longitude = this.userData.longitude;
          this.detailAddress = this.userData.displayAddress;
        })

        this.userService.getMuridProfileById(auth.uid).snapshotChanges().subscribe(snap=>{
          console.log(snap[0].key);
          this.dataMurid = snap;
          if(this.dataMurid[0] == undefined){
            var obj:any = {
              address:this.detailAddress,
              avatar:this.userData.avatar,
              cityId:8,
              cityName:"Depok",
              createdAt:"",
              displayAddress:this.userData.detailAddress,
              dob:"1991-01-01",
              firstName:this.userData.firstName,
              gender:"male",
              lastName:this.userData.lastName,
              latitude:this.userData.latitude,
              longitude:this.userData.longitude,
              muridId:"",
              postalCode:"16421",
              proviceId:7,
              provinceName:"Jawa Barat",
              status:"new",
              uid:"",
              updatedAt:"",
              userId:this.uid

            }
            this.userService.createMuridProfile(obj).then(e=>{
              console.log("success");
            })
            
          }else {
            this.muridKey = snap[0].key;
            this.muridData = snap[0].payload.val();
          }
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
          this.zoom = 12;
        });
      });
    });
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
      that.userService.updateProfilePhoto(that.uid, uploadTask.snapshot.downloadURL).then(e=>{
        console.log("success");
      })
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
      displayAddress : this.detailAddress,
      uid: this.uid,
      latitude: this.latitude,
      longitude : this.longitude
    }
    this.userService.updateUsersProfile(obj).then(e=>{
      
      var obj = {
        address:this.detailAddress,
        displayAddress:this.detailAddress
      }
      this.userService.updateMuridProfile(obj, this.muridKey).then(e=>{
        console.log("success Update murid");
        this.showNotification('top', 'right', 'success', "Your profile has been updated");
      });
    })
  }

}
