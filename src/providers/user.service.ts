import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import * as firebase from 'firebase';

@Injectable()
export class UserService {

    user: Observable<firebase.User>;

    constructor(private afAuth: AngularFireAuth, private router: Router, private afDB:AngularFireDatabase) {
        this.user = afAuth.authState;
    }

    signup(email: string, password: string) {
        return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
        // this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(value => {
        //     console.log('Success!', value);
        // }).catch(err => {
        //     console.log('Something went wrong:',err.message);
        // });    
    }

    logout() {
        this.afAuth
          .auth
          .signOut();
      }

    getUsersById(uid){
        return this.afDB.object('/users/' + uid);
        // return this.afDB.object('users/'+uid);
    }

    getUserDataTesting(){
        return this.afDB.object('/users/testing');
    }

    createUsers(params) {
        return this.afDB.object('users/' + params.uid).set({
            avatar:params.avatar,
            createDate: firebase.database.ServerValue.TIMESTAMP,
            device: "web",
            deviceId: "none",
            displayAddress:params.displayAddress,
            email:params.email,
            emailVerificationStatus:false,
            firstName:params.firstName,
            gender:"male",
            id:params.smsVerificationCode,
            lastName:params.lastName,
            latitude:params.latitude,
            longitude:params.longitude,
            phoneNumber:params.phoneNumber,
            refParent:"",
            refcode:"DE"+params.smsVerificationCode,
            role:"murid",
            smsVerificationCode:params.smsVerificationCode,
            smsVerificationStatus:false,
            stateVerification:100,
            status:true,
            updateBy:params.uid,
            updateDate:firebase.database.ServerValue.TIMESTAMP
        });
    }

    createMuridProfile(params){
        
        return this.afDB.list('muridProfile').push({
            address:params.displayAddress,
            avatar:params.avatar,
            cityId:8,
            cityName:"Depok",
            createdAt:"",
            displayAddress:params.displayAddress,
            dob:"1991-01-01",
            firstName:params.firstName,
            gender:"male",
            lastName:params.lastName,
            latitude:params.latitude,
            longitude:params.longitude,
            muridId:"",
            postalCode:"16421",
            proviceId:7,
            provinceName:"Jawa Barat",
            status:"new",
            uid:"",
            updatedAt:"",
            userId:params.uid
        });
    }

    updateMuridProfile(params, key){
        return this.afDB.object('muridProfile/'+key) .update({address:params.address, displayAddress:params.address});
    }

    updateUsers(params){
        return this.afDB.object('users/'+params.uid) .update({smsVerificationStatus:params.smsVerificationStatus});
     }



    updateUsersProfile(params){
       return this.afDB.object('users/'+params.uid).update(params);
    }

    getAllCategories(){
        // firebase.database.
        return this.afDB.list('categories');
    }

    getAllCourseByCategories(key){
        return this.afDB.list('courses', ref => ref.orderByChild('parentId').equalTo(key));
    }

    getMuridProfileById(uid){
        return this.afDB.list('/muridProfile', ref => ref.orderByChild('userId').equalTo(uid));
    }

    getMuridKey(uid){
        return this.afDB.list('/muridProfile', ref => ref.orderByChild('userId').equalTo(uid));
    }

    updateProfilePhoto(uid,photo){
        return this.afDB.object('users/'+uid).update({avatar:photo});
    }


    getMuridProfileTest(){
        return this.afDB.list('/muridProfile', ref => ref.orderByChild('userId').equalTo("y6wZo0uQW6PtkC7htbzB7fjVcAX2"));
    }

}