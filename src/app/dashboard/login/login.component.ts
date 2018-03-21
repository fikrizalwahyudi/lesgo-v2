import { Component, OnInit, HostBinding } from '@angular/core';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  error: any;
  constructor(public af: AngularFireAuth,private router: Router) {

    this.af.authState.subscribe(auth => { 
      if(auth) {
        this.router.navigateByUrl('/members');
      }
    });
  }

  ngOnInit() {
  }

}