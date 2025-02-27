import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Partnership } from 'src/app/models/Partnership';
import { PartnershipService } from 'src/app/service/partnership.service';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-partnershiplist',
  imports: [CommonModule,SharedModule,RouterModule,MatDialogModule],
  templateUrl: './partnershiplist.component.html',
  styleUrl: './partnershiplist.component.scss',
  providers: [PartnershipService] 
})
export class PartnershiplistComponent implements OnInit {
  @ViewChild('detailsDialog') detailsDialog!: TemplateRef<any>;
  @ViewChild('updateDialog') updateDialog!: TemplateRef<any>;
  @ViewChild('deleteDialog') deleteDialog!: TemplateRef<any>;
  partnerships: Partnership[] = [];

  selectedPartnership: Partnership | null = null; // Initialize as null  selectedPartnership: any; // Store the selected partnership for dialogs
  updateForm: FormGroup;

constructor(
  private partnershipService: PartnershipService,
  private dialog: MatDialog,
  private fb: FormBuilder // Inject FormBuilder
) {
  this.updateForm = this.fb.group({
    companyName: ['', Validators.required],
    industry: ['', Validators.required],
    companyWebsite: ['', Validators.required],
      companyLogo: [''], // Add this field

  });
}

  ngOnInit(): void {
 this.loadPartnerships();
  }
  loadPartnerships(): void {
    console.log('Fetching partnerships...');
    this.partnershipService.getPartnerships().subscribe({
      next: (datas) => {
        console.log('Fetched data:', datas);
        this.partnerships = Array.isArray(datas) ? datas : []; // ✅ Ensure it's an array
      },
      error: (err) => {
        console.error('Error fetching partnerships:', err);
      },
    });
  }
  onDetails(partnership: any): void {
    this.selectedPartnership = partnership;
    this.dialog.open(this.detailsDialog);
  }

  closeDetailsDialog(): void {
    this.dialog.closeAll();
  }


  imageUrl(logoPath: string): string {
    const url = './' + logoPath;
    console.log('Image URL:', url); // Debugging
    return url;
  }


  onUpdate(partnership: Partnership): void {
    this.selectedPartnership = partnership; // Store the selected partnership
    this.updateForm.patchValue(partnership); // Populate the form with partnership data
    this.dialog.open(this.updateDialog); // Open the update dialog
  }
  fileSelected: boolean = false; // Add this property

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileSelected = true;
      // Store the file name or path as a normal string
      const filePath = `uploads/${file.name}`; // Replace with your actual file path logic
      this.updateForm.patchValue({ companyLogo: filePath });
    }
  }

  onSave(): void {
    if (this.updateForm.valid && this.selectedPartnership) {
      const updatedPartnership = { ...this.selectedPartnership, ...this.updateForm.value };
      this.partnershipService.updatePartnership(this.selectedPartnership.idPartnership, updatedPartnership).subscribe(
        (response) => {
          console.log('Partnership updated successfully', response);
          this.loadPartnerships(); // Reload the list
          this.dialog.closeAll(); // Close the dialog
        },
        (error) => {
          console.error('Failed to update partnership', error);
        }
      );
    }
  }
  closeUpdateDialog(): void {
    this.dialog.closeAll();
  }

  onDelete(partnership: any): void {
    this.selectedPartnership = partnership;
    this.dialog.open(this.deleteDialog);
  }

  onDeleteConfirm(): void {
    if (this.selectedPartnership) {
      this.partnershipService.deletePartnership(this.selectedPartnership.idPartnership).subscribe(
        () => {
          console.log('Partnership deleted successfully');
          this.loadPartnerships(); // Reload the list
          this.dialog.closeAll(); // Close the dialog
        },
        (error) => {
          console.error('Failed to delete partnership', error);
        }
      );
    }
  }

 
  closeDeleteDialog(): void {
    this.dialog.closeAll();
  }
}