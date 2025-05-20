import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { GestorRoutingModule } from './gestor-routing.module';
import { GestorComponent } from './gestor.component';

import { ConfortEditComponent } from './pages/confort-edit/confort-edit.component';
import { ConfortListComponent } from './pages/confort-list/confort-list.component';
import { SimulateRideComponent } from './pages/simulate-ride/simulate-ride.component';

import { DriverDetailComponent } from './pages/driver-detail/driver-detail.component';
import { DriverEditComponent } from './pages/driver-edit/driver-edit.component';
import { DriversListComponent } from './pages/drivers-list/drivers-list.component';
import { RegisterDriverComponent } from './pages/register-driver/register-driver.component';

import { RegisterTaxiComponent } from './pages/register-taxi/register-taxi.component';
import { TaxiDetailComponent } from './pages/taxi-detail/taxi-detail.component';
import { TaxiEditComponent } from './pages/taxi-edit/taxi-edit.component';
import { TaxisListComponent } from './pages/taxis-list/taxis-list.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    GestorComponent,
    RegisterTaxiComponent,
    RegisterDriverComponent,
    DriversListComponent,
    TaxisListComponent,
    ConfortListComponent,
    TaxiEditComponent,
    DriverEditComponent,
    SimulateRideComponent,
    TaxiDetailComponent,
    DriverDetailComponent,
    ConfortEditComponent
  ],
  imports: [
    CommonModule,
    GestorRoutingModule,
    FormsModule,
    RouterModule,
    HttpClientModule
  ]
})
export class GestorModule { }
