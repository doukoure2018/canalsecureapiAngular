import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

const MATERIALS = [MatTableModule, MatPaginatorModule, MatSortModule];

@NgModule({
  imports: [CommonModule, ...MATERIALS],
  exports: [CommonModule, ...MATERIALS],
})
export class MaterialModule {}
