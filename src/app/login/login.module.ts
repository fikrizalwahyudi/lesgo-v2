import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { RouterModule, Routes,ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [LoginComponent],
    imports: [ BrowserModule, FormsModule ],
    exports: [ LoginComponent ],
    providers: [],
    bootstrap: [LoginComponent]
})
export class LoginModule {}