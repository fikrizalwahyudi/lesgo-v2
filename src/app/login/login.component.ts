import { Component, OnInit } from '@angular/core';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

import { UserService } from '../../providers/user.service';

declare var $:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    state: string = '';
    error: any;
    email:any;
    password:any;

    userData:any;

    constructor(private userService:UserService, public af: AngularFireAuth,private router: Router) {
      
      this.af.authState.subscribe(auth => { 
        if(auth) {
          this.userService.getUsersById(auth.uid).valueChanges().subscribe(snapshot=>{
            this.userData = snapshot;
            if(this.userData.smsVerificationStatus){
              this.router.navigate(['/dashboard/user']);
              console.log(auth.uid);
            }
          })
        }
      });
  }


  onSubmit() {
    if(this.email && this.password) {
      // console.log(formData.value);
      this.af.auth.signInWithEmailAndPassword(this.email, this.password).then(e=>{
        console.log("login berhasil");
        this.router.navigate(['/dashboard/user/']);
        console.log(e);
      }).catch(error=>{
        this.showNotification('top', 'right', 'danger', error);
        console.log(error);
      });
    }else {
      this.showNotification('top', 'right', 'danger', "Please type email and password to login");
    }
  }

  register() {
    this.router.navigate(['registration']);
  }

  ngOnInit() {
  }

  showNotification(from, align, type, message){
    // const type = ['','info','success','warning','danger'];

    var color = Math.floor((Math.random() * 4) + 1);
    $.notify({
        icon: "pe-7s-info",
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
