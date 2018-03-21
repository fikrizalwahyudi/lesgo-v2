import { NgZone, OnInit, ViewChild, ElementRef, Component, ViewContainerRef, AfterViewInit } from '@angular/core';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';
import { FormControl } from '@angular/forms';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';

import { UserService } from '../../../providers/user.service';
import { ProductService } from '../../../providers/product.service';
import { SmsService } from '../../../providers/sms.service';

import { AngularFireDatabase } from 'angularfire2/database';

import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import * as firebase from 'firebase';
import * as _ from "lodash";
import * as moment from 'moment';

declare var google: any;
declare var $:any;
declare var snap;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

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
  orderData:any = [];
  token:any;

  orderStatusCartData:any=[];
  orderHistoryData:any=[];
  totalPrice:any = 0;
  


  constructor( private http:Http, private productService: ProductService,private afAuth:AngularFireAuth, private af:AngularFireDatabase, public userService:UserService, public smsService:SmsService, private router: Router,private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) { 
    
   }

  ngOnInit() { 
    this.getDataUser().then(e=>{
      console.log(e);
      this.getDataOrder().then(x=>{
        console.log(x);
      }).catch(err=>{
        console.log(err);
      })
    })
    
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
        this.totalPrice = 0;
        // this.orderData = snapshot;
        var x = [];
        snapshot.map(e=>{
          // x.push(e.key);
          x.push({key:e.key,val:e.payload.val()});
          // console.log(e.key);
          // console.log(e.payload.val());
        })
        this.orderData = x;
        this.orderStatusCartData = _.filter(this.orderData, function(o) { return o.val.status == "cart"; });
        this.orderStatusCartData.forEach(e=>{
          this.totalPrice += Number(e.val.totalHarga);
        })

        this.orderHistoryData = _.filter(this.orderData, function(o) { return o.val.status != "cart"; });
        console.log(this.orderStatusCartData);
        console.log(this.orderData);
        resolve(this.orderData);
      
      },error=>{
        reject(error);
      })

    });
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 10;
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

  convertDate(date){
    return moment(date, 'x').format('DD-MM-YYYY HH:mm:ss');
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

  getToken() {
    var sendData = [];
    var transId = 'LP' + new Date().getTime();
    var totalHarga = 5700;
    
    this.orderStatusCartData.forEach(e=>{
      var obj:any = {
        transactionId:transId,
        key:e.key
      }
      this.productService.updateTransactionId(obj).then(e=>{
        console.log("update success");
      })
    })

    
    // this.orderData.forEach(e=>{
    //   console.log(e.val);
    //   console.log(e.key);
    //   if(e.val.status == 'cart'){
        
    //     this.productService.updateOrderStatus(e.key).then(success=>{
    //       console.log('success');
    //     });
    //   }
    // })

    for (let i = 0; i < this.orderStatusCartData.length; i++) {
      var fullName = this.orderStatusCartData[i].val.tutorName.substring(0, 17) + '.. ';
      // var StringDiscount = "";

      // if(this.orderStatusCartData[i].totalHarga >= 50000 && this.setDiscount == true){
      //   if(this.discount != 0){
      //     fullName += '**';
      //   }
      //   this.orderStatusCartData[i].totalHarga = (this.cartData[i].totalHarga - this.discount);
      //   this.discount = 0;
      //   // StringDiscount = "potongan " + this.discountText;
      // }
      totalHarga += this.orderStatusCartData[i].val.totalHarga;
      sendData.push({
        "id": this.orderStatusCartData[i].val.orderId,
        "price": this.orderStatusCartData[i].val.totalHarga,
        "quantity": 1,
        "name": fullName  + this.orderStatusCartData[i].val.orderSchedule.startDate + ' - ' + this.orderStatusCartData[i].val.orderSchedule.endDate,
        "brand": "Midtrans",
        "category": "Toys",
        "merchant_name": "Midtrans"
      })
    }

    var conFee = 5700

    sendData.push({
      "id": "ConvenienceFee",
      "price": conFee,
      "quantity": 1,
      "name": "Convenience Fee"
    });

    // // if(this.setDiscount == true){
    // //   sendData.push({
    // //     "id": this.promoCode,
    // //     "price": this.discountText,
    // //     "quantity": 0,
    // //     "name": "Potongan Harga"
    // //   });
    // // }

    // let loader = this.loadingCtrl.create({
    //   showBackdrop: false,
    //   spinner: "hide"
    // });

    console.log(sendData)
    // loader.present();
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    var body = {
      "transaction_details": {
        "order_id": transId,
        "gross_amount": totalHarga

      },
      "item_details": sendData,
      "enabled_payments": ["mandiri_clickpay", "cimb_clicks",
        "bca_klikbca", "bca_klikpay", "bri_epay", "telkomsel_cash", "echannel",
        "bbm_money", "xl_tunai", "indosat_dompetku", "mandiri_ecash", "permata_va",
        "bca_va", "other_va", "kioson", "indomaret", "gci"],
      "customer_details": {
        "first_name": this.userData.firstName,
        "last_name": this.userData.lastName,
        "email": this.userData.email,
        "phone": this.userData.phoneNumber
      },
      "expiry": {
        "start_time": moment(new Date()).format('YYYY-MM-DD HH:mm:ss Z'),
        "unit": "minutes",
        "duration": 360
      }
    };
    console.log(body);

    
   
    this.http.post('http://13.228.37.52:4000/api/pay', body, options).subscribe(snapshot => {
      try {
        this.token = JSON.parse(snapshot['_body']).token;
      } catch (e) {
        // return this.presentAlert('Payment Not Finish', 'Mitra pembayaran online sedang bermasalah, Agar dicoba beberapa saat lagi');
      }
      if (!this.token) {
        // return this.presentAlert('Payment Not Finish', 'Mitra pembayaran online sedang bermasalah, Agar dicoba beberapa saat lagi');
      }
      console.log('snapshot', snapshot);
      snap.pay(this.token, {
        onSuccess: (result) => { 
          // this.presentAlert('Payment Success', 'Pembayaran Anda sudah diterima'); this.subtotal = 0; this.total = 0 
        },
        onPending: (result) => {
          // this.subtotal = 0;
          // this.total = 0;
          // console.log('pending', result);
          this.orderStatusCartData.forEach(e=>{
            console.log(e.val);
            console.log(e.key);
            if(e.val.status == 'cart'){
              
              this.productService.updateOrderStatus(e.key).then(success=>{
                console.log('success');
              });
            }
          })
        },
        onError: (result) => {
          // this.presentAlert('Error', result);
        },
        onClose: () => {

          // let loader = this.loadingCtrl.create({
          //   showBackdrop: false, spinner: 'hide'
          // });
          // loader.present();
          // this.promoCode = null;
          // this.doUpdateStatus(cart, transId, 'cart');
          // this.getCart(this.uid);
          // loader.dismissAll();
          // this.presentAlert('Payment Not Finish', 'Pembayaran tidak diselesaikan');
        }
      });
      // loader.dismiss();
    }, (err: any) => {
      console.log('err', err)
    });
  };

  goToOrderPage(){
    this.router.navigate(['dashboard/order']);
  }

  resolveCurrency(num){
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } 

}
