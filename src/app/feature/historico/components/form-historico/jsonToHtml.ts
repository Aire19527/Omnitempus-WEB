import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'jsonToHtml'
})
export class JsonToHtmlPipe implements PipeTransform {
  transform(jsonData: any): string {
    if (!jsonData) {
      return '';
    }
    let html = '';
    if (typeof jsonData === 'string') {
      try {
        jsonData = JSON.parse(jsonData);
      } catch (error) {
        return 'Invalid JSON data';
      }
    }
    for (const key in jsonData) {
      if (jsonData.hasOwnProperty(key)) {
        const value = jsonData[key];

        if (this.isValidDate(value)) {
          const formattedDate = this.formatDate(value);
          if (key === 'originalValue') {
            html += `<p>Valor anterior: ${formattedDate}</p>`;
          }
          else if (key === 'currentValue') {
            html += `<p>Valor actual: ${formattedDate}</p>`;
          }
          else {
            html += `<p>${key}: ${formattedDate}</p>`;
          }
        }
        else if (typeof value === 'string') {
          if (key === 'originalValue') {
            html += `<p>Valor anterior: ${value}</p>`;
          }
          else if (key === 'currentValue') {
            html += `<p>Valor actual: ${value}</p>`;
          }
          else {
            html += `<p>${key}: ${value}</p>`;
          }
        }
        else if (typeof value === 'number') {
          if (key === 'originalValue') {
            html += `<p>Valor anterior: ${value}</p>`;
          }
          else if (key === 'currentValue') {
            html += `<p>Valor actual: ${value}</p>`;
          }
          else {
            html += `<p>${key}: ${value}</p>`;
          }
        }
        else if (typeof value === 'boolean') {
          if (key === 'originalValue') {
            html += `<p>Valor anterior: ${value}</p>`;
          }
          else if (key === 'currentValue') {
            html += `<p>Valor actual: ${value}</p>`;
          }
          else {
            html += `<p>${key}: ${value ? 'Verdadero' : 'Falso'}</p>`;
          }
        }
        else if (typeof value === 'object') {
          html += `<p><b>${key}</b></p>`;
          html += this.transform(value);
        } else {
          html += `<p>${key}: ${value}</p>`;
        }
      }
    }
    return html;
  }

  private isValidDate(date: any): boolean {
    const parsedDate = Date.parse(date);
    return !isNaN(parsedDate);
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
