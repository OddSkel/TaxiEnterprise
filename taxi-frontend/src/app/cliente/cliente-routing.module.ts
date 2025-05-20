import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteComponent } from './cliente.component';

import { RequestRideComponent } from './pages/request-ride/request-ride.component';
import { WaitingDriverComponent } from './pages/waiting-driver/waiting-driver.component';
import { AcceptDriverComponent } from './pages/accept-driver/accept-driver.component';

const routes: Routes = [
  { 
      path: '',
      component: ClienteComponent,
      children: [
        { path: '', redirectTo: 'cliente', pathMatch: 'full' },
        { path: 'cliente', component: RequestRideComponent },
        { path: 'cliente/:id/waiting', component: WaitingDriverComponent },
        { path: 'cliente/:id/answer-driver', component: AcceptDriverComponent },
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClienteRoutingModule { }
