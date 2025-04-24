import { Component, Input } from '@angular/core';
import { Conforto } from '../conforto';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ConfortoService } from '../conforto.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-conforto-details',
  templateUrl: './conforto-details.component.html',
  styleUrls: ['./conforto-details.component.css']
})
export class ConfortoDetailsComponent {

  @Input() conforto?: Conforto;

  constructor(
    private route: ActivatedRoute,
    private confortoService: ConfortoService,
    private location: Location,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.getDetails();
  }

  getDetails(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if(id === null){

      return;
    }
    this.confortoService.getConforto(id)
      .subscribe(conforto => {this.conforto = conforto})
  }

  updateConforto(): void{
    if(this.conforto) {
      this.log(`Fetched conforto: ${JSON.stringify(this.conforto)}`);
      this.confortoService.updateConforto(this.conforto)
      .subscribe(() => this.goBack());
    }
  }

  goBack(): void {
    this.location.back();
  }

  private log(message: string) {
    this.messageService.add(`ConfortoService: ${message}`);
  }

}