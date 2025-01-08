import { MatPaginatorIntl } from "@angular/material/paginator";


const espRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) {
    return `0 de ${length}`;
  }

  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  // If the start index exceeds the list length, do not try and fix the end index to the end.
  const endIndex =
    startIndex < length
      ? Math.min(startIndex + pageSize, length)
      : startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} de ${length}`;
};

export function getEspPaginatorIntl(): any {
  const paginatorIntl1 = new MatPaginatorIntl();

  paginatorIntl1.itemsPerPageLabel = "Filas por página:";
  paginatorIntl1.nextPageLabel = "Siguiente página";
  paginatorIntl1.previousPageLabel = "Página anterior";
  paginatorIntl1.lastPageLabel = "Ultima página";
  paginatorIntl1.firstPageLabel = "Primera página";
  paginatorIntl1.getRangeLabel = espRangeLabel;

  return paginatorIntl1;
}

export const paginatorIntl = getEspPaginatorIntl();