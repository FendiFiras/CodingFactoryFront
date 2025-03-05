import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Material } from 'src/app/Models/material';
import { MaterialService } from 'src/app/services/material.service';

@Component({
  selector: 'app-material-form',
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './material-form.component.html',
  styleUrl: './material-form.component.scss'
})
export class MaterialFormComponent implements OnInit {

  material: Material = { label: '', quantity: 0 };
  isEdit = false;

  constructor(
    private materialService: MaterialService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.materialService.getMaterialById(+id).subscribe(data => {
        this.material = data;
      });
    }
  }

  saveMaterial() {
    if (this.isEdit) {
      this.materialService.updateMaterial(this.material).subscribe(() => {
        this.router.navigate(['/materials']);
      });
    } else {
      this.materialService.addMaterial(this.material).subscribe(() => {
        this.router.navigate(['/materials']);
      });
    }
  }
}
