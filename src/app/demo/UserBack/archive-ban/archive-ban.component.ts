import { Component, OnInit } from '@angular/core';
import { BanLogService } from 'src/app/services/banlog.service';
import { BanLog } from 'src/app/models/ban-log';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-archive-ban',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './archive-ban.component.html',
  styleUrls: ['./archive-ban.component.scss']
})
export class ArchiveBanComponent implements OnInit {
  archivedBans: BanLog[] = [];
  page: number = 1;
  itemsPerPage: number = 7;
  totalPages: number = 0;
  archivedBansPaginated: BanLog[] = [];

  ngOnInit(): void {
    this.getArchivedBans();
  }

  constructor(private banlogService: BanLogService) {}

  getArchivedBans(): void {
    this.banlogService.getAllBanLogs().subscribe(
      (data: BanLog[]) => {
        const now = new Date();
        this.archivedBans = data.filter(ban => new Date(ban.banDuration) <= now);
        this.totalPages = Math.ceil(this.archivedBans.length / this.itemsPerPage);
        this.updatePaginatedBans();
      },
      (error) => {
        console.error('Erreur lors de la récupération des bans archivés :', error);
      }
    );
  }

  updatePaginatedBans(): void {
    const start = (this.page - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.archivedBansPaginated = this.archivedBans.slice(start, end);
  }

  changePage(newPage: number): void {
    if (newPage > 0 && newPage <= this.totalPages) {
      this.page = newPage;
      this.updatePaginatedBans();
    }
  }
}
