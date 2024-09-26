import { MatPaginatorIntl } from '@angular/material/paginator';

export function customMatPaginatorInit() {
  const matPaginatorIntl: MatPaginatorIntl = new MatPaginatorIntl();

  matPaginatorIntl.itemsPerPageLabel = 'Ítems por página';
  matPaginatorIntl.nextPageLabel = 'Siguiente página';
  matPaginatorIntl.previousPageLabel = 'Anterior página';
  matPaginatorIntl.getRangeLabel = (
    page: number,
    pageSize: number,
    length: number
  ) => {
    if (length == 0 || pageSize == 0) {
      return `o de ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
    return `${startIndex + 1} a ${endIndex} de ${length}`;
  };

  return matPaginatorIntl;
}
