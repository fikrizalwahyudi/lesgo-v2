import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-typographywithparams',
  templateUrl: './typographywithparams.component.html',
  styleUrls: ['./typographywithparams.component.css']
})
export class TypographyWithParamsComponent implements OnInit {

  constructor(private route: ActivatedRoute) { 
    this.route.queryParams.subscribe(params => {
      console.log(params);
  });
   }

  ngOnInit() {
  }

}
