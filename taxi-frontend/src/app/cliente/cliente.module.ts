import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClienteRoutingModule } from './cliente-routing.module';
import { ClienteComponent } from './cliente.component';
import { RequestRideComponent } from './pages/request-ride/request-ride.component';
import { AcceptDriverComponent } from './pages/accept-driver/accept-driver.component';
import { WaitingDriverComponent } from './pages/waiting-driver/waiting-driver.component';


@NgModule({
  declarations: [
    ClienteComponent,
    RequestRideComponent,
    AcceptDriverComponent,
    WaitingDriverComponent
  ],
  imports: [
    CommonModule,
    ClienteRoutingModule
  ]
})
export class ClienteModule { }
