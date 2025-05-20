import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MotoristaRoutingModule } from './motorista-routing.module';
import { MotoristaComponent } from './motorista.component';

import { AcceptRideComponent } from './pages/accept-ride/accept-ride.component';
import { DriverDetailComponent } from './pages/driver-detail/driver-detail.component';
import { DriversListComponent } from './pages/drivers-list/drivers-list.component';
import { RegisterRideComponent } from './pages/register-ride/register-ride.component';
import { RegisterShiftComponent } from './pages/register-shift/register-shift.component';


@NgModule({
  declarations: [
    MotoristaComponent,
    DriversListComponent,
    RegisterShiftComponent,
    RegisterRideComponent,
    AcceptRideComponent,
    DriverDetailComponent,
  ],
  imports: [
    CommonModule,
    MotoristaRoutingModule,
    HttpClientModule,
    RouterModule,
    FormsModule
  ]
})
export class MotoristaModule { }
