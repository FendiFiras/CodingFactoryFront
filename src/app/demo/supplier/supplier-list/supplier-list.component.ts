import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Supplier } from 'src/app/Models/supplier';
import { SupplierService } from 'src/app/services/supplier.service';

@Component({
  selector: 'app-supplier-list',
  imports: [RouterModule, CommonModule],
  templateUrl: './supplier-list.component.html',
  styleUrl: './supplier-list.component.scss'
})
export class SupplierListComponent implements OnInit {

  suppliers: Supplier[] = [];

  constructor(private supplierService: SupplierService) { }

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers() {
    this.supplierService.getAllSuppliers().subscribe(data => {
      this.suppliers = data;
    });
  }

  deleteSupplier(id: number) {
    this.supplierService.deleteSupplier(id).subscribe(() => {
      this.loadSuppliers();
    });
  }
}
