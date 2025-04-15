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
    id: 'navigation',
    title: 'Navigation',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/dashboard',
        icon: 'feather icon-home',
        classes: 'nav-item'
      }
    ]
  },
  
  {
    id: 'forms',
    title: 'Forms & Tables',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'forms-element',
        title: 'Form Elements',
        type: 'item',
        url: '/forms/basic',
        classes: 'nav-item',
        icon: 'feather icon-file-text'
      },
      {
        id: 'Tables',
        title: 'Tables',
        type: 'item',
        url: '/tables/bootstrap',
        classes: 'nav-item',
        icon: 'feather icon-server'
      },
     
      {
        id: 'UsersManagement',
        title: 'Users Management',
        type: 'collapse', // Permet l'expansion des éléments enfants
        icon: 'feather icon-server',
        children: [
          {
            
            id: 'Users Managment',
            title: 'List of Users',
            type: 'item',
            url: '/listeUsers',
            icon: 'feather icon-server',
            breadcrumbs: false
            
          },
          {
            id: 'StudentManagement',
            title: 'Student Management',
            type: 'item',
            url: '/student',
            icon: 'feather icon-server',
            breadcrumbs: false
          },
          {
            id: 'InstructorManagement',
            title: 'Instructor Management',
            type: 'item',
            url: '/instructor',
            icon: 'feather icon-server',
            breadcrumbs: false
          }, {
            id: 'BannedUsers',
            title: 'Banned Users',
            type: 'item',
            url: '/banned-user',
            icon: 'feather icon-server',
            breadcrumbs: false
          },
          {
            id: 'archive Ban',
            title: 'Archived Banned Users',
            type: 'item',
            url: '/archive-ban',
            icon: 'feather icon-server',
            breadcrumbs: false
          },
          {
            id: 'user stats',
            title: 'Users stats',
            type: 'item',
            url: '/users-stats',
            icon: 'feather icon-server',
            breadcrumbs: false
          },
          {
            id: 'CompanyRepresentativeManagement',
            title: 'Company Representative Management',
            type: 'item',
            url: '/companyrepresentive',
            icon: 'feather icon-server',
            breadcrumbs: false
          }
          

         
        ]
      },
     {
        id: 'Training-managment',
        title: 'Training Management', // Titre affiché
        type: 'item',
        url: '/TrainingManagement', // URL de la route
        classes: 'nav-item',
        icon: 'feather icon-server' // Icône à utiliser
      },
      {
        id: 'Events Managment',
        title: 'Events Managment',
        type: 'item',
        url: '/Events/bootstrap',
        classes: 'nav-item',
        icon: 'feather icon-server'
      },
      {
        id: 'Pfe Managment',
        title: 'Pfe Managment',
        type: 'item',
        url: '/Pfe/bootstrap',
        classes: 'nav-item',
        icon: 'feather icon-server'
      },
      {
        id: 'Forums Managment',
        title: 'Forums Managment',
        type: 'item',
        url: '/Forums/bootstrap',
        classes: 'nav-item',
        icon: 'feather icon-server'
      },
      {
        id: 'Reclamations Managment',
        title: 'Reclamations Managment',
        type: 'item',
        url: '/Reclamations/bootstrap',
        classes: 'nav-item',
        icon: 'feather icon-server'
      }
    ]
  },
  {
    id: 'chart-maps',
    title: 'Chart',
    type: 'group',
    icon: 'icon-charts',
    children: [
      {
        id: 'apexChart',
        title: 'ApexChart',
        type: 'item',
        url: 'apexchart',
        classes: 'nav-item',
        icon: 'feather icon-pie-chart'
      }
    ]
  },
  {
    id: 'pages',
    title: 'Pages',
    type: 'group',
    icon: 'icon-pages',
    children: [
      {
        id: 'auth',
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
        id: 'buy_now',
        title: 'Buy Now',
        type: 'item',
        icon: 'feather icon-book',
        classes: 'nav-item',
        url: 'https://codedthemes.com/item/datta-able-angular/',
        target: true,
        external: true
      }
    ]
  },
  {
    id: 'ui-element',
    title: 'UI ELEMENT',
    type: 'group',
    icon: 'icon-ui',
    children: [
      {
        id: 'basic',
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
  },
];
