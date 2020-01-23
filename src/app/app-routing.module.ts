import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FrontPageComponent } from './front-page/front-page.component';
import { MainPageComponent } from './main-page/main-page.component';


const routes: Routes = [
{path: "start", component: FrontPageComponent},
{path: "home", component: MainPageComponent},
{path: "",redirectTo: "start",pathMatch: "full"}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
