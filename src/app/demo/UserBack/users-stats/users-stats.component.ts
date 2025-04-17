import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ApexOptions, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { UserPreferenceService } from 'src/app/services/user-preference.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { lastValueFrom } from 'rxjs';

interface GenderStats {
  Male: number;
  Female: number;
}

interface ThemeStats {
  darkMode: number;
  lightMode: number;
}

interface RegionData {
  region: string;
  count: number;
}

@Component({
  selector: 'app-users-stats',
  standalone: true,
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './users-stats.component.html',
  styleUrls: ['./users-stats.component.scss']
})
export class UsersStatsComponent implements OnInit, OnDestroy {
  @ViewChild('genderChart') private genderChart?: ChartComponent;
  @ViewChild('modeChart') private modeChart?: ChartComponent;
  @ViewChild('regionChart') private regionChart?: ChartComponent;

  donutChart: ApexOptions = {
    chart: { type: 'donut', height: 350 },
    series: [0, 0],
    labels: ['Male', 'Female']
  };

  barSimpleChart: ApexOptions = {
    chart: { type: 'bar', height: 350 },
    series: [
      { name: 'Dark Mode', data: [0] },
      { name: 'Light Mode', data: [0] }
    ]
  };

  regionChartOptions: ApexOptions = {
    chart: { type: 'bar', height: 350 },
    series: [{ name: 'Users', data: [] }],
    xaxis: { categories: [] }
  };

  radialChart: ApexOptions = {
    chart: { type: 'radialBar', height: 200 },
    series: [0]
  };

  stats = {
    totalUsers: 0,
    activeUsers: 0,
    malePercentage: 0,
    femalePercentage: 0,
    darkModeUsers: 0,
    lightModeUsers: 0,
    regions: [] as RegionData[]
  };

  filters = {
    period: '30days' as '7days' | '30days' | '90days',
    gender: 'all' as 'all' | 'male' | 'female',
    regions: 'all' as 'all' | 'top5'
  };

  originalData = {
    gender: { Male: 0, Female: 0 } as GenderStats,
    theme: { darkMode: 0, lightMode: 0 } as ThemeStats,
    regions: [] as RegionData[]
  };

  loading = true;
  errorMessage: string | null = null;
  private destroyed = false;

  constructor(
    private readonly userPreferenceService: UserPreferenceService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeCharts();
    this.loadAllStats();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
  }

  private initializeCharts(): void {
    this.updateCharts(0, 0, 0, 0, []);
  }

  private async loadAllStats(): Promise<void> {
    if (this.destroyed) return;

    this.loading = true;
    this.errorMessage = null;

    try {
      const [genderData, themeData, regionData] = await Promise.all([
        lastValueFrom(this.authService.getGenderStats()),
        lastValueFrom(this.userPreferenceService.getThemeStats()),
        lastValueFrom(this.authService.getUsersByRegion())
      ]);

      this.originalData = {
        gender: genderData,
        theme: themeData,
        regions: Object.entries(regionData).map(([region, count]) => ({
          region,
          count: count as number
        }))
      };

      this.applyFilters();
    } catch (error) {
      console.error('Error loading stats:', error);
      this.errorMessage = 'Failed to load statistics. Please try again.';
    } finally {
      if (!this.destroyed) {
        this.loading = false;
      }
    }
  }

  private applyFilters(): void {
    const { gender, theme, regions } = this.originalData;
    const periodFactor = this.getPeriodFactor();

    let maleCount = Math.round(gender.Male * periodFactor);
    let femaleCount = Math.round(gender.Female * periodFactor);
    const darkMode = Math.round(theme.darkMode * periodFactor);
    const lightMode = Math.round(theme.lightMode * periodFactor);

    let filteredRegions = regions.map(r => ({
      ...r,
      count: Math.round(r.count * periodFactor)
    }));

    if (this.filters.gender === 'male') {
      femaleCount = 0;
    } else if (this.filters.gender === 'female') {
      maleCount = 0;
    }

    if (this.filters.regions === 'top5') {
      filteredRegions = [...filteredRegions]
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    }

    const totalGender = maleCount + femaleCount;
    const malePercentage = totalGender > 0 ? Math.round((maleCount / totalGender) * 100) : 0;

    this.stats = {
      ...this.stats,
      malePercentage,
      femalePercentage: totalGender > 0 ? 100 - malePercentage : 0,
      darkModeUsers: darkMode,
      lightModeUsers: lightMode,
      regions: filteredRegions
    };

    this.updateCharts(maleCount, femaleCount, darkMode, lightMode, filteredRegions);
  }

  private updateCharts(
    male: number,
    female: number,
    darkMode: number,
    lightMode: number,
    regions: RegionData[]
  ): void {
    if (this.destroyed) return;

    this.donutChart = {
      ...this.donutChart,
      series: [male, female],
      tooltip: {
        y: {
          formatter: (val: number, { series, seriesIndex }) =>
            `${val} users (${Math.round((val / (male + female || 1)) * 100)}%)`
        }
      }
    };

    this.radialChart = {
      ...this.radialChart,
      series: [this.stats.malePercentage]
    };

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
          columnWidth: '55%'
        }
      },
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
          formatter: (val: number) => `${val} users`
        }
      }
    };

    this.regionChartOptions = {
      ...this.regionChartOptions,
      series: [{
        name: 'Users',
        data: regions.map(r => r.count)
      }],
      xaxis: {
        categories: regions.map(r => r.region)
      }
    };

    this.genderChart?.updateOptions(this.donutChart);
    this.modeChart?.updateOptions(this.barSimpleChart);
    this.regionChart?.updateOptions(this.regionChartOptions);
  }

  private getPeriodFactor(): number {
    switch (this.filters.period) {
      case '7days': return 0.3;
      case '30days': return 1;
      case '90days': return 1.5;
      default: return 1;
    }
  }

  setFilter(type: 'period' | 'gender' | 'regions', value: string): void {
    if (type === 'period') {
      this.filters.period = value as '7days' | '30days' | '90days';
    } else if (type === 'gender') {
      this.filters.gender = value as 'all' | 'male' | 'female';
    } else if (type === 'regions') {
      this.filters.regions = value as 'all' | 'top5';
    }
    this.applyFilters();
  }

  refreshData(): void {
    this.loadAllStats();
  }
}
