import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MotoristaRoutingModule } from './motorista-routing.module';
import { MotoristaComponent } from './motorista.component';
import { RegisterShiftComponent } from './pages/register-shift/register-shift.component';
import { RegisterRideComponent } from './pages/register-ride/register-ride.component';
import { AcceptRideComponent } from './pages/accept-ride/accept-ride.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';


@NgModule({
  declarations: [
    MotoristaComponent,
    RegisterShiftComponent,
    RegisterRideComponent,
    AcceptRideComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    MotoristaRoutingModule
  ]
})
export class MotoristaModule { }
