import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home.routing.module';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { NoteComponent } from './note/note.component';


@NgModule({
  declarations: [
    HomeComponent,
    ProfileComponent,
    NoteComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule    
  ]
})
export class HomeModule { }
