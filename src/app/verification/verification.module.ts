import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerificationComponent } from './verification.component';
import { RouterModule, Routes,ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
// import { SmsService } from '../../providers/sms.service';

@NgModule({
    declarations: [VerificationComponent],
    imports: [ BrowserModule, FormsModule ],
    exports: [ VerificationComponent ],
    providers: [],
    bootstrap: [VerificationComponent]
})
export class VerificationModule {}