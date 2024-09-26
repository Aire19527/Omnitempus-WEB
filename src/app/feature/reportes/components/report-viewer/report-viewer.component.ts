import { Component, OnInit } from '@angular/core';
import { ReportesService } from '../../service/reportes.service';
import { ActivatedRoute } from '@angular/router';
import { ConsultReport, ReporteModel } from '../../models/reportes';
import { NgxSpinnerService } from 'ngx-spinner';
import { Alert } from 'src/app/helpers/alert_helper';
import { dA } from '@fullcalendar/core/internal-common';
import { ZoomScale } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-report-viewer',
  templateUrl: './report-viewer.component.html',
  styleUrls: ['./report-viewer.component.css'],
})
export class ReportViewerComponent implements OnInit {
  showSubButtons = false;
  error: string | null = null;
  loadPdf: boolean = false;
  documentUrl: string = '';
  pdfConfig = {
    pdfZoom: 1,
    rotation: 0,
    zoomScale: 'pdf-width' as ZoomScale,
    page: 1,
    totalPages: 1,
  };

  constructor(
    private reportService: ReportesService,
    private spinner: NgxSpinnerService
  ) {
    const data = sessionStorage.getItem('reportEconomical');
    if (data) {
      const reportEconomical = JSON.parse(data) as ReporteModel;
      const reportParamter: ReporteModel = {
        idReport: reportEconomical.idReport,
        parameters: reportEconomical.parameters,
        nameFile: reportEconomical.nameFile,
      };
      this.reportService.ReportParamter = reportParamter;
    }
  }

  ngOnInit(): void {
    this.error = 'Cargando reporte...';
    const data = this.reportService.ReportParamter;
    if (data.idReport != 0) {
      this.exportReport(data, 'pdf', false);
    } else {
      const dataModel = sessionStorage.getItem('reportEconomical');
      if (dataModel) {
        this.exportReport(JSON.parse(dataModel), 'pdf', false);
      } else {
        this.error = 'Error al cargar reporte, parámetros inválidos';
      }
    }
  }

  exportReport(data: ReporteModel, format: string, download: boolean) {
    const report: ConsultReport = {
      idReport: data.idReport,
      format: format,
      parameters: data.parameters,
      nameFile: '',
    };

    this.spinner.show();
    this.reportService.exportReport(report).subscribe({
      next: (response) => {
        this.spinner.hide();
        // Determina el tipo de contenido basado en el formato
        const contentType =
          format.toLowerCase() === 'pdf'
            ? 'application/pdf'
            : format.toLowerCase() === 'word'
            ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            : format.toLowerCase() === 'excel'
            ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            : '';

        // Crear el Blob con el tipo de contenido determinado
        const blob = new Blob([response], { type: contentType });

        // Ajusta el nombre del archivo según el formato
        format =
          format.toLowerCase() === 'pdf'
            ? format
            : format.toLowerCase() === 'word'
            ? 'doc'
            : format.toLowerCase() === 'excel'
            ? 'xls'
            : format;
        const url = window.URL.createObjectURL(blob);

        if (!download) {
          this.documentUrl = url;
        } else {
          const link = document.createElement('a');
          link.href = url;
          link.download = `${data.nameFile}.${format}`;
          link.click();
          window.URL.revokeObjectURL(url);
        }
      },
      error: (error) => {
        this.error = 'Error al cargar reporte, parámetros inválidos';
        this.spinner.hide();
        Alert.errorHttp(error);
      },
    });
  }

  downloadPDF() {
    const data = this.reportService.ReportParamter;
    this.exportReport(data, 'pdf', true);
  }

  downloadWord() {
    const data = this.reportService.ReportParamter;
    this.exportReport(data, 'word', true);
  }

  downloadExcel() {
    const data = this.reportService.ReportParamter;
    this.exportReport(data, 'excel', true);
  }
  openSubButtons() {
    this.showSubButtons = true;
  }

  closeSubButtons() {
    this.showSubButtons = false;
  }

  zoomIn() {
    this.pdfConfig.pdfZoom += 0.1;
  }
  zoomOut() {
    this.pdfConfig.pdfZoom -= 0.1;
  }
  rotateRight() {
    this.pdfConfig.rotation += 90;
  }
  rotateLeft() {
    this.pdfConfig.rotation -= 90;
  }
  fullWidht() {
    this.pdfConfig.zoomScale = 'pdf-width' as ZoomScale;
  }
  fullHeight() {
    this.pdfConfig.zoomScale = 'pdf-height' as ZoomScale;
  }
  nextPage() {
    this.pdfConfig.page++;
  }
  previousPage() {
    if (this.pdfConfig.page > 0) this.pdfConfig.page--;
  }

  pageInitialized(e: any) {
    this.pdfConfig.totalPages = e.source._pages.length;
  }
}
