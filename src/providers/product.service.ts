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
export class ProductService {

    user: Observable<firebase.User>;

    constructor(private afAuth: AngularFireAuth, private router: Router, private afDB:AngularFireDatabase) {
        this.user = afAuth.authState;
    }

    getAllProduct(){
        // var that = this;
        return this.afDB.list('products', ref => ref.orderByChild('status').equalTo(true));
        // return this.afDB.list('products');

         //   .subscribe(snapshot=>{
        //     console.log(snapshot);
        //     var b = _.filter(snapshot, function(each) {
        //         var jarak = that.distance(-6.436981, 106.835537, each.latitude, each.longitude, "K");
        //         console.log(jarak);
        //         return jarak < 8;
        //     });
        //     // var a = _.result(_.find(snapshot, function(each) {
        //     //     var jarak = that.distance(-6.436981, 106.835537, each.latitude, each.longitude, "K");
        //     //     console.log(jarak);
        //     //     return jarak <= 8;
        //     //     // return user.age === 36 || user.active;
        //     // }), 'snapshot');
        //     console.log(b);
        //     return b;
        // })
        
      }

    distance(lat1, lon1, lat2, lon2, unit) {
    	var radlat1 = Math.PI * lat1/180
    	var radlat2 = Math.PI * lat2/180
    	var theta = lon1-lon2
    	var radtheta = Math.PI * theta/180
    	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    	dist = Math.acos(dist)
    	dist = dist * 180/Math.PI
    	dist = dist * 60 * 1.1515
    	if (unit=="K") { dist = dist * 1.609344 }
    	if (unit=="N") { dist = dist * 0.8684 }
    	return dist
    }

    getTutorProfile(key){
        
        return this.afDB.object('tutorProfile/' + key);
    }

    updateUsers(params){
        return this.afDB.object('users/'+params.uid) .update(params);
     }

    updateUsersTesting(params){
       return this.afDB.object('users/testing') .update(params);
    }

    getAllCategories(){
        // firebase.database.
        return this.afDB.list('categories');
    }

    getProductByKey(key){
        return this.afDB.object('products/' + key);
    }

    getMuridProfileTest(){
        return this.afDB.list('/muridProfile', ref => ref.orderByChild('userId').equalTo("y6wZo0uQW6PtkC7htbzB7fjVcAX2"));
    }

    createOrder(obj){
        return this.afDB.list('order').push(obj);
    }

    getAllOrder(uid){
        return this.afDB.list('/order', ref => ref.orderByChild('uid').equalTo(uid));
    }

    updateOrderStatus(obj){
        return this.afDB.object('order/'+obj).update({status:'pending'});
    }

    updateTransactionId(obj){
        return this.afDB.object('order/'+obj.key).update({transactionId:obj.transactionId});
    }

    getProductByUserId(uid){
        return this.afDB.list('/products', ref => ref.orderByChild('userId').equalTo(uid));
    }

}