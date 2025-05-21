import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gestor',
  templateUrl: './gestor.component.html',
  styleUrls: ['./gestor.component.css']
})
export class GestorComponent {

  constructor(
    private router: Router
  ) { }
  goHome() {
    this.router.navigate(['/']);
  }
}
