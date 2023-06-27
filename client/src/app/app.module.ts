import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { View1Component } from './components/view1.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { View2Component } from './components/view2.component';
import { MaterialModule} from './material.module'
import { CrudService } from './services/crud.service';
import { View3Component } from './components/view3.component';
import { View0Component } from './components/view0.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from './components/dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { View4Component } from './components/view4.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { View5Component } from './components/view5.component';
import { EmailComponent } from './components/email.component';
import { DummypageComponent } from './components/dummypage.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapsComponent } from './components/maps.component';
import { MapDisplayComponent } from './components/map-display.component';
import { PlaceAutocompleteComponent } from './components/place-autocomplete.component';
import { NewuserComponent } from './components/newuser.component';
import { GetweatherComponent } from './components/getweather.component';
import { WeatherService } from './services/weather.service';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ContactComponent } from './components/contact.component';

@NgModule({
  declarations: [
    AppComponent,
    DialogComponent,
    DummypageComponent,
    EmailComponent,
    View0Component,
    View1Component,
    View2Component,
    View3Component,
    View4Component,
    View5Component,
    MapsComponent,
    MapDisplayComponent,
    PlaceAutocompleteComponent,
    NewuserComponent,
    GetweatherComponent,
    ContactComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    MatDialogModule,
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
    MatSortModule,
    MatPaginatorModule,
    MatTooltipModule,
    GoogleMapsModule,
    NgxMaterialTimepickerModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    BrowserAnimationsModule
  ],
  providers: [CrudService, WeatherService],
  bootstrap: [AppComponent]
})
export class AppModule { }
