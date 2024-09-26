export class Utiles {
  static getDayInitial(day: string): string {
    switch (day) {
      case 'Lunes':
        return 'L';
      case 'Martes':
        return 'M';
      case 'Miércoles':
        return 'M';
      case 'Jueves':
        return 'J';
      case 'Viernes':
        return 'V';
      case 'Sábado':
        return 'S';
      case 'Domingo':
        return 'D';
      default:
        return '';
    }
  }

  static validateFormatNit(event: any) {
    let key;
    if (event.type === 'paste') {
      key = event.clipboardData.getData('text/plain');
    } else {
      key = event.key;
    }

    const regex = /^[0-9-]*$/;
    if (!regex.test(key)) {
      event.preventDefault();
    }
  }

  static buildReportUrl(
    reportServer: string,
    reportUrl: string,
    parameters: any,
    showParameters: boolean,
    language: string,
    toolbar: boolean
  ): string {
    if (!reportUrl) {
      return '';
    }
    var param = this.buildParameterString(parameters);
    return (
      reportServer +
      '?/' +
      reportUrl +
      '&rs:Embed=true' +
      '&rc:Parameters=' +
      showParameters +
      param +
      '&rs:ParameterLanguage=' +
      language +
      '&rc:Toolbar=' +
      toolbar
    );
  }

  private static buildParameterString(parameters: any): string {
    var parameterString = '';

    for (var param in parameters) {
      if (param) {
        if (parameters[param] instanceof Array === true) {
          for (var arrayParam in parameters[param]) {
            if (arrayParam) {
              parameterString +=
                '&' + param + '=' + parameters[param][arrayParam];
            }
          }
        }
        if (
          parameters[param] != null &&
          parameters[param] instanceof Array === false
        ) {
          parameterString += '&' + param + '=' + parameters[param];
        }
        if (parameters[param] == null) {
          parameterString += '&' + param + ':isnull=true';
        }
      }
    }
    return parameterString;
  }
}
