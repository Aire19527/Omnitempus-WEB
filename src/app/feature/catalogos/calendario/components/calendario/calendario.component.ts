import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormCalendarioComponent } from '../form-calendario/form-calendario.component';
import { Holiday } from '../../models/calendario';
import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CalendarioService } from '../../service/calendario.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CalendarOptions } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Alert } from 'src/app/helpers/alert_helper';
import { ResponseDto } from 'src/app/models/responseDto';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css'],
})
export class CalendarioComponent implements OnInit {
  calendarList: Holiday[] = [];

  array: any[] = [];
  calendarPlugins = [dayGridPlugin];
  @ViewChild('fullcalendar') fullcalendar: FullCalendarComponent;
  capitalizationDone = false;
  constructor(
    private matDialog: MatDialog,
    private calendarioService: CalendarioService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getHoliday();
  }

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: esLocale,
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek',
    },
    eventClick: this.handleDateClick.bind(this),
    titleFormat: { year: 'numeric', month: 'long' },
    editable: true,
    events: [],
  };

  handleDateClick(event: any) {
    const date = new Date(event.event.startStr);
    date.setUTCHours(0, 0, 0, 0);
    this.openDialog('editar', {
      id: event.event.id,
      title: event.event.title,
      date: date,
    });
  }

  openDialog(action: string, data?: Holiday): void {
    let dialogRef = this.matDialog.open(FormCalendarioComponent, {
      width: '60%',
      data: { title: action, data: data },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getHoliday();
    });
  }

  addEvent(event: Holiday) {
    this.calendarList.push(event);
  }

  getHoliday() {
    this.calendarioService.getHoliday().subscribe((res) => {
      this.calendarList = res;
      this.calendarOptions.events = this.calendarList.map((event: Holiday) => ({
        id: event.id,
        title: event.title,
        start: new Date(event.date).toISOString().split('T')[0],
        backgroundColor: '#f4a423',
        textColor: 'black',
        borderColor: '#f4a423',
      }));
    });
  }

  deleteHolidayById(event: any) {
    const holidayId = event.id;
    Alert.questionConfirmDelete().then((result) => {
      if (result.isConfirmed) {
        this.calendarioService.deleteHolidayById(holidayId).subscribe({
          next: (response: ResponseDto) => {
            this.getHoliday();
            Alert.toastSWMessage('success', response.message);
          },
          error: (err: any) => {
            console.error(err);
            Alert.error('Ha ocurrido un error, por favor vuelva a intentarlo');
          },
        });
      }
    });
  }
}
