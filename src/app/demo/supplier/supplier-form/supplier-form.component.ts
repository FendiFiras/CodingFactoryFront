import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Supplier } from 'src/app/Models/supplier';
import { SupplierService } from 'src/app/services/supplier.service';

@Component({
  selector: 'app-supplier-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './supplier-form.component.html',
  styleUrl: './supplier-form.component.scss'
})
export class SupplierFormComponent implements OnInit {

  supplier: Supplier = { name: '', email: '', address: '', phone: '' };
  isEdit = false;

  constructor(
    private supplierService: SupplierService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.supplierService.getSupplierById(+id).subscribe(data => {
        this.supplier = data;
      });
    }
  }

  saveSupplier() {
    if (this.isEdit) {
      this.supplierService.updateSupplier(this.supplier).subscribe(() => {
        this.router.navigate(['/suppliers']);
      });
    } else {
      this.supplierService.addSupplier(this.supplier).subscribe(() => {
        this.router.navigate(['/suppliers']);
      });
    }
  }
}