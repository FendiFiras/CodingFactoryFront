export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'group-navigation',
    title: 'Navigation',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'dashboard-home',
        title: 'Dashboard',
        type: 'item',
        url: '/dashboard',
        icon: 'feather icon-home',
        classes: 'nav-item'
      }
    ]
  },
  {
    id: 'group-forms',
    title: 'Forms & Tables',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'form-elements',
        title: 'Form Elements',
        type: 'item',
        url: '/forms/basic',
        classes: 'nav-item',
        icon: 'feather icon-file-text'
      },
      {
        id: 'tables',
        title: 'Tables',
        type: 'item',
        url: '/tables/bootstrap',
        classes: 'nav-item',
        icon: 'feather icon-server'
      },
      {
        id: 'users-management',
        title: 'Users Management',
        type: 'collapse',
        icon: 'feather icon-users',
        children: [
          {
            id: 'users-list',
            title: 'List of Users',
            type: 'item',
            url: '/listeUsers',
            icon: 'feather icon-user',
            breadcrumbs: false
          },
          {
            id: 'students',
            title: 'Student Management',
            type: 'item',
            url: '/student',
            icon: 'feather icon-user-check',
            breadcrumbs: false
          },
          {
            id: 'instructors',
            title: 'Instructor Management',
            type: 'item',
            url: '/instructor',
            icon: 'feather icon-user-check',
            breadcrumbs: false
          },
          {
            id: 'banned-users',
            title: 'Banned Users',
            type: 'item',
            url: '/banned-user',
            icon: 'feather icon-user-x',
            breadcrumbs: false
          },
          {
            id: 'archived-bans',
            title: 'Archived Banned Users',
            type: 'item',
            url: '/archive-ban',
            icon: 'feather icon-archive',
            breadcrumbs: false
          },
          {
            id: 'user-stats',
            title: 'Users Stats',
            type: 'item',
            url: '/users-stats',
            icon: 'feather icon-bar-chart-2',
            breadcrumbs: false
          },
          {
            id: 'company-rep',
            title: 'Company Representative Management',
            type: 'item',
            url: '/companyrepresentive',
            icon: 'feather icon-briefcase',
            breadcrumbs: false
          }
        ]
      },
      {
        id: 'training-management',
        title: 'Training Management',
        type: 'item',
        url: '/TrainingManagement',
        classes: 'nav-item',
        icon: 'feather icon-server'
      },
      {
        id: 'events-management',
        title: 'Events Management',
        type: 'item',
        url: '/Events/bootstrap',
        classes: 'nav-item',
        icon: 'feather icon-calendar'
      },
      {
        id: 'pfe-management',
        title: 'Pfe Management',
        type: 'collapse',
        icon: 'feather icon-file',
        children: [
          {
            id: 'partnerships',
            title: 'Partnerships',
            type: 'item',
            url: '/partnerships'
          },
          {
            id: 'offers',
            title: 'Offers',
            type: 'item',
            url: '/offerslist'
          },
          {
            id: 'applications',
            title: 'Applications',
            type: 'item',
            url: '/applications'
          },
          {
            id: 'pfe-affectations',
            title: 'Pfe Affectations',
            type: 'item',
            url: '/pfeaffectations'
          },
          {
            id: 'evaluations',
            title: 'Evaluations',
            type: 'item',
            url: '/evaluations'
          }
        ]
      },
      {
        id: 'forums-management',
        title: 'Forums Management',
        type: 'item',
        url: '/forums-management',
        classes: 'nav-item',
        icon: 'feather icon-message-circle'
      },
      {
        id: 'reclamations-management',
        title: 'Reclamations Management',
        type: 'collapse',
        classes: 'nav-item',
        icon: 'feather icon-alert-circle',
        children: [
          {
            id: 'reclamations-main',
            title: 'Reclamations',
            type: 'item',
            url: '/admin/reclamations',
            classes: 'nav-item'
          },
          {
            id: 'suppliers-main',
            title: 'Suppliers',
            type: 'item',
            url: '/suppliers',
            classes: 'nav-item'
          },
          {
            id: 'materials-main',
            title: 'Materials',
            type: 'item',
            url: '/materials',
            classes: 'nav-item'
          }
        ]
      }
    ]
  },
  {
    id: 'group-charts',
    title: 'Charts',
    type: 'group',
    icon: 'icon-charts',
    children: [
      {
        id: 'apex-chart',
        title: 'ApexChart',
        type: 'item',
        url: '/apexchart',
        classes: 'nav-item',
        icon: 'feather icon-pie-chart'
      }
    ]
  },
  {
    id: 'group-pages',
    title: 'Pages',
    type: 'group',
    icon: 'icon-pages',
    children: [
      {
        id: 'auth-pages',
        title: 'Authentication',
        type: 'collapse',
        icon: 'feather icon-lock',
        children: [
          {
            id: 'signup',
            title: 'Sign up',
            type: 'item',
            url: '/auth/signup',
            target: true,
            breadcrumbs: false
          },
          {
            id: 'signin',
            title: 'Sign in',
            type: 'item',
            url: '/auth/signin',
            target: true,
            breadcrumbs: false
          }
        ]
      },
      {
        id: 'sample-page',
        title: 'Sample Page',
        type: 'item',
        url: '/sample-page',
        classes: 'nav-item',
        icon: 'feather icon-sidebar'
      },
      {
        id: 'disabled-menu',
        title: 'Disabled Menu',
        type: 'item',
        url: 'javascript:',
        classes: 'nav-item disabled',
        icon: 'feather icon-power',
        external: true
      },
      {
        id: 'buy-now',
        title: 'Buy Now',
        type: 'item',
        url: 'https://codedthemes.com/item/datta-able-angular/',
        icon: 'feather icon-book',
        classes: 'nav-item',
        target: true,
        external: true
      }
    ]
  },
  {
    id: 'group-ui-elements',
    title: 'UI Elements',
    type: 'group',
    icon: 'icon-ui',
    children: [
      {
        id: 'basic-components',
        title: 'Component',
        type: 'collapse',
        icon: 'feather icon-box',
        children: [
          {
            id: 'button',
            title: 'Button',
            type: 'item',
            url: '/basic/button'
          },
          {
            id: 'badges',
            title: 'Badges',
            type: 'item',
            url: '/basic/badges'
          },
          {
            id: 'breadcrumb-pagination',
            title: 'Breadcrumb & Pagination',
            type: 'item',
            url: '/basic/breadcrumb-paging'
          },
          {
            id: 'collapse',
            title: 'Collapse',
            type: 'item',
            url: '/basic/collapse'
          },
          {
            id: 'tabs-pills',
            title: 'Tabs & Pills',
            type: 'item',
            url: '/basic/tabs-pills'
          },
          {
            id: 'typography',
            title: 'Typography',
            type: 'item',
            url: '/basic/typography'
          }
        ]
      }
    ]
  }
];
