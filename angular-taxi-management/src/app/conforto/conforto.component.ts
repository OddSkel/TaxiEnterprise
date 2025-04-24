import { Component, OnInit } from '@angular/core';

import { Conforto } from '../conforto';
import { ConfortoService } from '../conforto.service';


@Component({
  selector: 'app-conforto',
  templateUrl: './conforto.component.html',
  styleUrls: ['./conforto.component.css']
})
export class ConfortoComponent implements OnInit{

  confortos: Conforto[] = [];

  constructor(private confortoService: ConfortoService) {}

  ngOnInit(): void {
    this.getConforto();
  }

  getConforto(): void {
    this.confortoService.getConfortos().subscribe((confortos) => {
      this.confortos = confortos;
    });
  }

}