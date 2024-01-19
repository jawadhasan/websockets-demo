import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReversePipe } from './reverse.pipe';
import { FormsModule } from '@angular/forms';
import { FleetMapComponent } from './fleet-map/fleet-map.component';

@NgModule({
  declarations: [
    AppComponent,
    ReversePipe,
    FleetMapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    ReversePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
