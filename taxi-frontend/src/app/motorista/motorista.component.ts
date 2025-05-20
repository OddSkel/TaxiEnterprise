import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-motorista',
  templateUrl: './motorista.component.html',
  styleUrls: ['./motorista.component.css']
})
export class MotoristaComponent {

  constructor(
    private router: Router
  ) { }
  goHome() {
    this.router.navigate(['/']);
  }
}
