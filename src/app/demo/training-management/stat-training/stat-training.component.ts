import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { TrainingService } from 'src/app/Services/training.service';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavigationComponent } from 'src/app/theme/layout/admin/navigation/navigation.component';
import { ConfigurationComponent } from 'src/app/theme/layout/admin/configuration/configuration.component';
import { BreadcrumbsComponent } from 'src/app/theme/shared/components/breadcrumbs/breadcrumbs.component';
import { NavLogoComponent } from 'src/app/theme/layout/admin/navigation/nav-logo/nav-logo.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-stat-training',
 imports: [
   
    NavigationComponent,
    ConfigurationComponent,
    NavContentComponent,
    NavLogoComponent,
    NavBarComponent,
    BreadcrumbsComponent,
    SharedModule

  ]  ,
  templateUrl: './stat-training.component.html',
  styleUrl: './stat-training.component.scss'
})
export class StatTrainingComponent implements OnInit {
  revenueData: any[] = [];
  revenueByHourData: any[] = [];
  totalRevenue: number = 0;
  predictedRevenue: number = 0;
  chart!: Chart;
  chartByHour!: Chart;
  chartType: 'bar' | 'line' = 'bar';
  darkMode: boolean = false;
  liveUpdate: boolean = false;
  intervalId: any;
  chartColor = 'rgba(54, 162, 235, 1)';
  selectedTimeRange = 'day';
  showTrainingChart = true;
  showHourlyChart = true;
  chartPredicted!: Chart; // 🎯 Ajouter un graphique pour la prédiction

  constructor(private trainingService: TrainingService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.getTrainingRevenue();
    this.getRevenueByHour();
    this.getPredictedHourlyRevenue(); // 🔮 Charger la prédiction


    setInterval(() => {
      this.getPredictedHourlyRevenue(); // 🔄 Mise à jour auto toutes les 10 sec
    }, 10000);

  }

  /** 🔥 Récupère les revenus par formation */
  getTrainingRevenue() {
    this.trainingService.getTrainingRevenue().subscribe(
      (data) => {
        this.revenueData = data;
        this.totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
        if (this.showTrainingChart) this.createChart();
      },
      (error) => console.error("❌ Error loading revenue data:", error)
    );
  }

  /** 📊 Récupère les revenus par heure */
  getRevenueByHour() {
    this.trainingService.getRevenueByHour().subscribe(
      (data) => {
        this.revenueByHourData = this.formatHourlyData(data);
        if (this.showHourlyChart) this.createRevenueByHourChart();
      },
      (error) => console.error("❌ Error loading hourly revenue data:", error)
    );
  }

  /** 🔮 Récupère la prédiction de revenus */

  

  /** 🕒 Assure un affichage de toutes les heures 00h - 23h */
  formatHourlyData(data: any[]): any[] {
    let hourlyData = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      totalRevenue: 0
    }));

    data.forEach(item => {
      hourlyData[item.hour].totalRevenue = item.totalRevenue;
    });

    return hourlyData;
  }

  /** 📊 Création du graphique des revenus par formation */
  createChart() {
    if (!this.showTrainingChart) return;
    if (this.chart) this.chart.destroy();

    const ctx = document.getElementById('trainingRevenueChart') as HTMLCanvasElement;

    this.chart = new Chart(ctx, {
      type: this.chartType,
      data: {
        labels: this.revenueData.map(d => d.trainingName),
        datasets: [{
          label: 'Revenue ($)',
          data: this.revenueData.map(d => d.revenue),
          backgroundColor: this.chartColor,
          borderColor: this.chartColor,
          borderWidth: 2,
          fill: false,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        animation: { duration: 2000 },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  createPredictedRevenueChart() {
    if (this.chartPredicted) this.chartPredicted.destroy();
  
    const ctx = document.getElementById('predictedRevenueChart') as HTMLCanvasElement;
    const gradient = ctx.getContext('2d')!.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(255, 206, 86, 0.5)'); // Jaune clair
    gradient.addColorStop(1, 'rgba(255, 206, 86, 0)');
  
    this.chartPredicted = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.revenueByHourData.map(d => `${d.hour}:00`),
        datasets: [{
          label: 'Predicted Hourly Revenue ($)',
          data: this.revenueByHourData.map(d => this.predictedRevenue), // 🔮 Valeur constante
          borderColor: 'rgba(255, 206, 86, 1)', // Jaune vif
          backgroundColor: gradient,
          borderWidth: 3,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        animation: { duration: 2000, easing: 'easeInOutQuart' },
        scales: { y: { beginAtZero: true } }
      }
    });
  }
  /** 📈 Création du graphique des revenus par heure */
  createRevenueByHourChart() {
    if (!this.showHourlyChart) return;
    if (this.chartByHour) this.chartByHour.destroy();

    const ctx = document.getElementById('revenueByHourChart') as HTMLCanvasElement;
    const gradient = ctx.getContext('2d')!.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, this.darkMode ? 'rgba(255, 99, 132, 0.9)' : 'rgba(255, 99, 132, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 99, 132, 0)');

    this.chartByHour = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.revenueByHourData.map(d => `${d.hour}:00`),
        datasets: [{
          label: 'Hourly Revenue ($)',
          data: this.revenueByHourData.map(d => d.totalRevenue),
          borderColor: this.darkMode ? 'white' : 'rgba(255, 99, 132, 1)',
          backgroundColor: gradient,
          borderWidth: 3,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        animation: { duration: 2000, easing: 'easeInOutQuart' },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  /** 🔄 Actualisation des données */
  refreshData() {
    this.getTrainingRevenue();
    this.getRevenueByHour();
  }

  /** 📤 Exportation en PNG */
  exportChart() {
    const link = document.createElement('a');
    link.download = 'Revenue_Chart.png';
    link.href = this.chart.toBase64Image();
    link.click();
  }

  /** 🌙 Activation du mode sombre */
  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    this.createRevenueByHourChart();
  }

  /** 🕐 Activation/Désactivation de la mise à jour en temps réel */
  toggleLiveUpdate() {
    if (this.liveUpdate) {
      clearInterval(this.intervalId);
      this.liveUpdate = false;
    } else {
      this.liveUpdate = true;
      this.intervalId = setInterval(() => this.refreshData(), 5000);
    }
  }

  /** 🎨 Changer la couleur du graphique */
  changeChartColor(color: string) {
    this.chartColor = color;
    this.createChart();
  }

  /** 🔄 Permet de changer le type de graphique */
  toggleChartType() {
    this.chartType = this.chartType === 'bar' ? 'line' : 'bar';
    this.createChart();
  }

  /** 👀 Afficher/Masquer le graphique des formations */
  toggleTrainingChart() {
    this.showTrainingChart = !this.showTrainingChart;
    if (this.showTrainingChart) this.createChart();
  }

  /** ⏳ Afficher/Masquer le graphique des revenus horaires */
  toggleHourlyChart() {
    this.showHourlyChart = !this.showHourlyChart;
    if (this.showHourlyChart) this.createRevenueByHourChart();
  }



  getPredictedHourlyRevenue() {
    this.trainingService.getPredictedHourlyRevenue().subscribe(
      (data) => {
        this.predictedRevenue = data; // Mise à jour de la valeur
      },
      (error) => console.error("❌ Error loading predicted hourly revenue:", error)
    );
  }
  
}
