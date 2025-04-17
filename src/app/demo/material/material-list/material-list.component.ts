import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Material } from 'src/app/models/material';
import { MaterialService } from 'src/app/services/material.service';

@Component({
  selector: 'app-material-list',
    imports: [RouterModule, CommonModule],
  templateUrl: './material-list.component.html',
  styleUrl: './material-list.component.scss'
})
export class MaterialListComponent implements OnInit {

  materials: Material[] = [];

  constructor(private materialService: MaterialService) { }

  ngOnInit(): void {
    this.loadMaterials();
  }

  loadMaterials() {
    this.materialService.getAllMaterials().subscribe(data => {
      this.materials = data;
    });
  }

  deleteMaterial(id: number) {
    this.materialService.deleteMaterial(id).subscribe(() => {
      this.loadMaterials();
    });
  }
}
