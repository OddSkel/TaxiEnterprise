import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MotoristaService } from '../motorista.service';
import { Motorista } from '../motorista';
import { TurnoService } from '../turno.service';
import { Turno } from '../turno';
import { Taxi } from '../taxi';

@Component({
  selector: 'app-motorista-detail',
  templateUrl: './motorista-detail.component.html',
  styleUrls: ['./motorista-detail.component.css'],
})
export class MotoristaDetailComponent implements OnInit {
  motorista: Motorista | undefined;
  availableTaxis: Taxi[] = [];
  allShifts: Turno[] = [];
  start: string = '';
  end: string = '';
  timeError: string | null = null;
  overlapError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private motoristaService: MotoristaService,
    private turnoService: TurnoService
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
        console.log('Loaded shifts:', shifts);
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

    // Ensure start time is at least 1 hour in the future
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1);

    const startIso = new Date(this.start).toISOString();
    const endIso = new Date(this.end).toISOString();

    if (new Date(this.start) < now) {
      console.error('Start time must be at least 1 minute in the future.');
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
    const startTime = new Date(this.start);
    const endTime = new Date(this.end);

    // Check if the start time is in the future (at least 1 hour from now)
    now.setMinutes(now.getMinutes() + 1);
    if (startTime < now) {
      this.timeError = 'Start time must be at least 1 minute in the future.';
      return;
    }

    // Check if the end time is after the start time
    if (startTime >= endTime) {
      this.timeError = 'End time must be after the start time.';
      return;
    }

    // Check for shift duration (max 8 hours)
    const duration =
      (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60); // duration in hours
    if (duration > 8) {
      this.timeError = "Shift can't be more than 8 hours!";
      return;
    }

    // If no time errors, clear the error message
    this.timeError = null;

    // Now check for overlapping shifts, even if no time errors
    this.checkForOverlappingShifts(this.start, this.end);
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
        this.overlapError = 'Selected shift overlaps with another shift!';
        return;
      }
    }
    this.overlapError = null;
  }
}
