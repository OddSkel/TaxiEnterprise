import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Motorista } from 'src/app/core/models/motorista';
import { Taxi } from 'src/app/core/models/taxi';
import { Turno } from 'src/app/core/models/turno';
import { MotoristaService } from 'src/app/core/services/motorista.service';
import { TaxiService } from 'src/app/core/services/taxi.service';
import { TurnoService } from 'src/app/core/services/turno.service';

@Component({
  selector: 'app-register-shift',
  templateUrl: './register-shift.component.html',
  styleUrls: ['./register-shift.component.css']
})
export class RegisterShiftComponent {
  motorista: Motorista | undefined;
  availableTaxis: Taxi[] = [];
  allShifts: Turno[] = [];
  start: string = '';
  end: string = '';
  timeError: string | null = null;
  overlapError: string | null = null;
  shiftValidated: boolean = false;

  constructor(
    private taxiService: TaxiService,
    private motoristaService: MotoristaService,
    private turnoService: TurnoService, 
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      console.error('No motorista ID in route.');
      return;
    }

    this.motoristaService.getMotorista(id).subscribe((motorista) => {
      this.motorista = motorista;
      this.turnoService.getAllShifts(motorista._id).subscribe((shifts) => {
        this.allShifts = shifts;
      });
    });
  }

  getAvailableTaxisForShift(): void {
    if (!this.motorista || !this.motorista._id) {
      console.error('Motorista ID is not available.');
      return;
    }

    const startIso = new Date(this.start).toISOString();
    const endIso = new Date(this.end).toISOString();

    this.turnoService
      .getAvailableTaxisForShift(this.motorista._id, startIso, endIso)
      .subscribe((availableTaxis) => {
        this.availableTaxis = availableTaxis;
      });
  }

  requestTaxiForShift(taxi: Taxi): void {
    if (!this.motorista || !this.motorista._id) {
      console.error('Cannot request shift without valid motorista ID.');
      return;
    }

    const now = new Date();
    now.setMinutes(now.getMinutes() + 1);

    const startIso = new Date(this.start).toISOString();
    const endIso = new Date(this.end).toISOString();

    if (new Date(this.start) < now) {
      console.error('Start time must be in the future.');
      return;
    }

    const periodo = { start: startIso, end: endIso };

    this.turnoService
      .requestTaxiForShift(this.motorista._id, periodo, {
        matricula: taxi.matricula,
      })
      .subscribe({
        next: (turnos) => {
          console.log('Shifts returned:', turnos);
          this.allShifts = turnos;
          this.location.back();
        },
        error: (err) => {
          console.error('Error from backend:', err); // Log the error
          // Check if error response has a specific message
          if (err.error && err.error.error) {
            alert(`Error: ${err.error.error}`);
          } else if (err.error && err.error.erro) {
            alert(`Error: ${err.error.erro}`);
          } else {
            alert('An unknown error occurred.');
          }
        },
      });
  }

  validateShiftTimes(): void {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1);

    const startTime = new Date(this.start);
    const endTime = new Date(this.end);

    this.shiftValidated = false; // reseta toda vez que validar

    if (startTime < now) {
      this.timeError = 'O turno deve comecar agora ou no futuro.';
      return;
    }

    if (startTime >= endTime) {
      this.timeError = 'O fim do turno deve ser depois do inicio.';
      return;
    }

    const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    if (duration > 8) {
      this.timeError = "O turno nao pode ter mais de 8 horas.";
      return;
    }

    this.timeError = null;
    this.checkForOverlappingShifts(this.start, this.end);

    if (!this.overlapError) {
      this.shiftValidated = true;  // só ativa aqui se não houver erro de sobreposição
      this.getAvailableTaxisForShift(); // buscar os táxis disponíveis só depois da validação
    }
  }


  checkForOverlappingShifts(start: string, end: string): void {
    const startTime = new Date(start);
    const endTime = new Date(end);

    console.log('Checking for overlap: Start:', startTime, 'End:', endTime);

    for (let turno of this.allShifts) {
      const existingStart = new Date(turno.start);
      const existingEnd = new Date(turno.end);

      console.log('Existing Shift: Start:', existingStart, 'End:', existingEnd);

      if (startTime < existingEnd && endTime > existingStart) {
        this.overlapError = 'O horário selecionado sobrepoem outro turno!';
        return;
      }
    }
    this.overlapError = null;
  }

  goBack(): void {
    this.location.back();
  }
}
