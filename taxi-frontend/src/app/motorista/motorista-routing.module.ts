import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MotoristaComponent } from './motorista.component';

import { DriversListComponent } from './pages/drivers-list/drivers-list.component';
import { RegisterShiftComponent } from './pages/register-shift/register-shift.component';
import { RegisterRideComponent } from './pages/register-ride/register-ride.component';
import { DriverDetailComponent } from './pages/driver-detail/driver-detail.component';
import { AcceptRideComponent } from './pages/accept-ride/accept-ride.component';

const routes: Routes = [
  { 
      path: '',
      component: MotoristaComponent,
      children: [
        { path: '', redirectTo: 'motoristas', pathMatch: 'full' },
        { path: 'motoristas', component: DriversListComponent },
        { path: 'motoristas/:id', component: DriverDetailComponent },
        { path: 'motoristas/:id/newShift', component: RegisterShiftComponent },
        { path: 'motoristas/:id/acceptRide', component: AcceptRideComponent },
        { path: 'motoristas/:id/newRide', component: RegisterRideComponent },
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MotoristaRoutingModule { }
