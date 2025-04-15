import { Component, OnInit, ViewChild } from '@angular/core';
import { ApexOptions, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { UserPreferenceService } from 'src/app/services/user-preference.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-users-stats',
  standalone: true,
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './users-stats.component.html',
  styleUrls: ['./users-stats.component.scss']
})
export class UsersStatsComponent implements OnInit {
  @ViewChild('genderChart') genderChart!: ChartComponent;
  @ViewChild('modeChart') modeChart!: ChartComponent;
  @ViewChild('regionChart') regionChart!: ChartComponent;

  // Chart configurations
  donutChart: Partial<ApexOptions> = {};
  barSimpleChart: Partial<ApexOptions> = {};
  regionChartOptions: Partial<ApexOptions> = {};
  radialChart: Partial<ApexOptions> = {};

  // Data
  stats = {
    totalUsers: 0,
    activeUsers: 0,
    malePercentage: 0,
    femalePercentage: 0,
    darkModeUsers: 0,
    lightModeUsers: 0,
    regions: [] as { region: string, count: number }[]
  };

  // Filtres
  filters = {
    period: '30days',
    gender: 'all',
    regions: 'all'
  };

  // Données originales
  originalData = {
    gender: { Male: 0, Female: 0 },
    theme: { darkMode: 0, lightMode: 0 },
    regions: [] as { region: string, count: number }[]
  };

  loading = true;

  constructor(
    private userPreferenceService: UserPreferenceService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadAllStats();
  }

  async loadAllStats() {
    this.loading = true;
    try {
      const [genderData, themeData, regionData] = await Promise.all([
        this.authService.getGenderStats().toPromise(),
        this.userPreferenceService.getThemeStats().toPromise(),
        this.authService.getUsersByRegion().toPromise()
      ]);

      // Sauvegarder les données originales
      this.originalData = {
        gender: genderData,
        theme: themeData,
        regions: Object.entries(regionData).map(([region, count]) => ({ region, count: count as number }))
      };

      // Appliquer les filtres initiaux
      this.applyFilters();
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      this.loading = false;
    }
  }

  applyFilters() {
    let maleCount = this.originalData.gender.Male;
    let femaleCount = this.originalData.gender.Female;
    let darkMode = this.originalData.theme.darkMode;
    let lightMode = this.originalData.theme.lightMode;
    let regions = [...this.originalData.regions];

    const periodFactor = this.filters.period === '7days' ? 0.3 :
                        this.filters.period === '30days' ? 1 : 1.5;
    
    maleCount = Math.round(maleCount * periodFactor);
    femaleCount = Math.round(femaleCount * periodFactor);
    darkMode = Math.round(darkMode * periodFactor);
    lightMode = Math.round(lightMode * periodFactor);
    regions = regions.map(r => ({ ...r, count: Math.round(r.count * periodFactor) }));

    if (this.filters.gender === 'male') {
      femaleCount = 0;
    } else if (this.filters.gender === 'female') {
      maleCount = 0;
    }

    if (this.filters.regions === 'top5') {
      regions = regions.sort((a, b) => b.count - a.count).slice(0, 5);
    }

    const totalGender = maleCount + femaleCount;
    this.stats = {
      ...this.stats,
      malePercentage: totalGender > 0 ? Math.round((maleCount / totalGender) * 100) : 0,
      femalePercentage: totalGender > 0 ? 100 - this.stats.malePercentage : 0,
      darkModeUsers: darkMode,
      lightModeUsers: lightMode,
      regions: regions
    };

    this.updateGenderChart(maleCount, femaleCount);
    this.updateThemeChart(darkMode, lightMode);
    this.updateRegionChart(regions);
  }

  updateGenderChart(male: number, female: number) {
    const total = male + female;
    this.donutChart = {
      chart: {
        type: 'donut',
        height: 350
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `${val.toFixed(1)}%`,
        style: {
          fontSize: '12px',
          fontWeight: 'bold'
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total Users',
                fontSize: '16px',
                fontWeight: 600,
                color: '#6c757d',
                formatter: () => total.toString()
              },
              value: {
                fontSize: '24px',
                fontWeight: 700,
                color: '#343a40'
              }
            }
          }
        }
      },
      colors: ['#3a86ff', '#ff006e'],
      series: [male, female],
      labels: ['Male', 'Female'],
      legend: {
        position: 'right',
        markers: {
          strokeWidth: 12,
        }
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val} users (${Math.round((val / total) * 100)}%)`
        }
      }
    };
    

    this.radialChart = {
      chart: {
        height: 200,
        type: 'radialBar',
        sparkline: {
          enabled: true
        }
      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          track: {
            background: "#e0e0e0",
            strokeWidth: '97%',
            margin: 5,
          },
          dataLabels: {
            name: {
              show: false
            },
            value: {
              offsetY: -2,
              fontSize: '22px',
              fontWeight: 700,
              formatter: (val) => `${val}%`
            }
          }
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          shadeIntensity: 0.4,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 100]
        },
      },
      colors: ['#3a86ff'],
      series: [this.stats.malePercentage],
      labels: ['Male Percentage'],
    };
  }

  updateThemeChart(darkMode: number, lightMode: number) {
    this.barSimpleChart = {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 6,
          columnWidth: '55%',
          dataLabels: {
            position: 'top'
          }
        },
      },
      colors: ['#3a86ff', '#ffbe0b'],
      series: [
        { name: 'Dark Mode', data: [darkMode] },
        { name: 'Light Mode', data: [lightMode] }
      ],
      xaxis: {
        categories: ['Theme Preference'],
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        title: { text: 'Number of Users' },
        min: 0
      },
      dataLabels: {
        enabled: true,
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ['#fff']
        },
        background: {
          enabled: true,
          foreColor: '#fff',
          borderRadius: 4,
          padding: 6,
          opacity: 0.8
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'center'
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: (val: number) => `${val} ${val > 1 ? 'users' : 'user'}`
        }
      },
      grid: {
        row: {
          colors: ['#f8f9fa', 'transparent'],
          opacity: 0.5
        }
      }
    };
  }

  updateRegionChart(regions: { region: string, count: number }[]) {
    this.regionChartOptions = {
      chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: '60%',
          dataLabels: {
            position: 'top'
          }
        }
      },
      colors: ['#3a86ff'],
      series: [{
        name: 'Users',
        data: regions.map(r => r.count)
      }],
      xaxis: {
        categories: regions.map(r => r.region),
        labels: {
          rotate: -45,
          rotateAlways: true,
          style: {
            fontSize: '12px'
          }
        }
      },
      yaxis: {
        title: { text: 'Number of Users' },
        min: 0
      },
      dataLabels: {
        enabled: true,
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ['#fff']
        }
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val} ${val > 1 ? 'users' : 'user'}`
        }
      }
    };
  }

  setFilter(type: 'period' | 'gender' | 'regions', value: string) {
    this.filters[type] = value;
    this.applyFilters();
  }

  refreshData() {
    this.loadAllStats();
  }
}
