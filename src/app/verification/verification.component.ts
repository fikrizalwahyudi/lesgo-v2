import { Component, OnInit } from '@angular/core';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

import { SmsService } from '../../providers/sms.service';
import { UserService } from '../../providers/user.service';

declare var $:any;

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {

    state: string = '';
    error: any;
    email:any;
    password:any;
    userData:any = {};
    phoneNumber:string = "";
    verificationCode:any;
    uid:any;

    constructor(public smsService:SmsService, public userService:UserService, public af: AngularFireAuth,private router: Router) {
      
      this.af.authState.subscribe(auth => { 
        if(auth) {
          // this.router.navigate(['/dashboard/user']);
          console.log(auth.uid);
          this.uid = auth.uid;
          this.userService.getUsersById(auth.uid).valueChanges().subscribe(snapshot=>{
            console.log(snapshot);
            this.userData = snapshot;
            this.phoneNumber = this.userData.phoneNumber;
            this.userData.uid = auth.uid;
            if(this.userData.smsVerificationStatus == true){
              this.router.navigate(['/dashboard/home']);
            }
            // this.phoneNumber = snapshot.phoneNumber;
          })
        }
      });
  }

  ngOnInit() {
  }


  onSubmit() {
    if(Number(this.verificationCode) != Number(this.userData.smsVerificationCode)){
      this.showNotification('top', 'right', 'danger', "invalid code");
    }else {
      var obj = {
        smsVerificationStatus:true,
        uid:this.uid
      }

      this.userService.createMuridProfile(this.userData).then(e=>{
        console.log("berhasil create muridprofile")
        this.userService.updateUsers(obj).then(obj=>{
          console.log(obj);
          console.log("berhasil update");
        });
      })
      
    }
  }

  resendCode(){
    this.smsService.sendSMS(this.userData.phoneNumber, this.userData.smsVerificationCode).subscribe(e=>{
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
  }

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
