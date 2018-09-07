import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationComponent } from './registration.component';
import { RouterModule, Routes,ActivatedRoute } from '@angular/router';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';

// import { SmsService } from '../../providers/sms.service';


// import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';
import { ImageCropperModule } from 'ng2-img-cropper';
import { AgmCoreModule } from '@agm/core';

@NgModule({
    declarations: [RegistrationComponent],
    imports: [ 
        BrowserModule, 
        FormsModule,
        ReactiveFormsModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyDkJlWv1jF6qlZvbn8vQbtiSQckPFjzQ-w',
            libraries: ["places"]
        }),
        TextMaskModule,
        ImageCropperModule
     ],
    exports: [ RegistrationComponent ],
    providers: [],
    bootstrap: [RegistrationComponent]
})
export class RegistrationModule {}