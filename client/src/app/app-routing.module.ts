import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { View1Component } from './components/view1.component';
import { View2Component } from './components/view2.component';
import { View0Component } from './components/view0.component';
import { DummypageComponent } from './components/dummypage.component';
import { View3Component } from './components/view3.component';
import { View4Component } from './components/view4.component';
import { View5Component } from './components/view5.component';
import { EmailComponent } from './components/email.component';
import { MapsComponent } from './components/maps.component';
import { NewuserComponent } from './components/newuser.component';
import { GetweatherComponent } from './components/getweather.component';
import { ContactComponent } from './components/contact.component';

const routes: Routes = [
  { path: "", component: View0Component},
  { path: "view1", component: View1Component},
  { path: "view2", component: View2Component},
  { path: "view3", component: View3Component},
  { path: "view4", component: View4Component},
  { path: "view5", component: View5Component},
  { path: "dummy", component: DummypageComponent},
  { path: "email", component: EmailComponent},
  { path: "maps", component: MapsComponent},
  { path: "newuser", component: NewuserComponent},
  { path: "weather", component: GetweatherComponent},
  { path: "contact", component: ContactComponent},
  { path: "**", redirectTo:"/", pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
