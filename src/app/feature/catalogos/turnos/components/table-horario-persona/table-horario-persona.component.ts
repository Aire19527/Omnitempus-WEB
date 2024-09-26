import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { EsqeuemaHorarioPersona } from '../../models/horarios';

@Component({
  selector: 'app-table-horario-persona',
  templateUrl: './table-horario-persona.component.html',
  styleUrls: ['./table-horario-persona.component.css'],
})
export class TableHorarioPersonaComponent implements OnInit, OnChanges {
  @Input() schedulePerson: EsqeuemaHorarioPersona[];
  @ViewChild('tableDecoration') tableRef: ElementRef;

  days: string[] = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];
  hours: string[] = Array.from({ length: 24 }, (_, i) => i.toString());

  schedule: {
    [person: string]: { [day: string]: { [hour: string]: string } };
  } = {};
  scheduleKeys: string[];

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.schedulePerson;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.schedulePerson) {
      this.transformSchedule();
    }
  }

  transformSchedule() {
    this.schedule = {};
    this.schedulePerson.forEach((person) => {
      this.schedule[person.person] = {};
      person.schemePerson.forEach((item) => {
        if (!this.schedule[person.person][item.day]) {
          this.schedule[person.person][item.day] = {};
        }
        this.schedule[person.person][item.day][item.hour.toString()] =
          item.abbreviation;
      });
    });
    this.scheduleKeys = Object.keys(this.schedule);
  }

  getColor(abbreviation: string): string {
    switch (abbreviation) {
      case 'RD':
        return '#EDF8FA';
      case 'RN':
        return '#AED5DC';
      case 'ED':
        return '#FFE2DC';
      case 'EN':
        return '#FAC4B8';
      case 'DD':
        return '#D5FBB1';
      case 'DED':
        return '#F6DD77';
      case 'DEN':
        return '#8DD14D';
      case 'DEN':
        return '#4E8917';
      case 'FD':
        return '#FFC39B';
      case 'FN':
        return '#FF9752';
      case 'FED':
        return '#F57B2C';
      case 'FEN':
        return '#E06311';
      default:
        return '';
    }
  }
}
