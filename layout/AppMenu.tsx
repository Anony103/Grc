import { MenuModal } from '@/types/layout';
import AppSubMenu from './AppSubMenu';

const AppMenu = () => {
    const model: MenuModal[] = [
        {
            label: 'Dashboards',
            icon: 'pi pi-home',
            items: [
                {
                    label: 'Overview',
                    icon: 'pi pi-th-large',
                    to: '/'
                },
                {
                    label: 'Reports',
                    icon: 'pi pi-chart-bar',
                    to: '/dashboards/reports'
                }
            ]
        },
        { separator: true },
        {
            label: 'Compliance Management',
            icon: 'pi pi-check-circle',
            items: [
                {
                    label: 'Campaign Setup',
                    icon: 'pi pi-sun',
                    items: [
                        {
                            label: 'Campaigns',
                            icon: 'pi pi-megaphone',
                            to: '/compliance/campaign-set-up/campaign'
                        },
                        {
                            label: 'Notification Template',
                            icon: 'pi pi-bell',
                            to: '/compliance/campaign-set-up/notification-templates'
                        },
                        {
                            label: 'Report',
                            icon: 'pi pi-chart-line',
                            to: '/compliance/campaign-set-up/report'
                        }
                    ]
                },
                {
                    label: 'Vulnerability Status',
                    icon: 'pi pi-exclamation-triangle',
                    items: [
                        {
                            label: 'Dashboard',
                            icon: 'pi pi-chart-line',
                            to: '/compliance/vulnerabilities/dashboard'
                        },
                        {
                            label: 'Vulnerability List',
                            icon: 'pi pi-list',
                            to: '/compliance/vulnerabilities/list'
                        },
                        {
                            label: 'Add Vulnerability',
                            icon: 'pi pi-plus',
                            to: '/compliance/vulnerabilities/add'
                        },
                        {
                            label: 'Resolution Status',
                            icon: 'pi pi-cog',
                            to: '/compliance/vulnerabilities/status'
                        }
                    ]
                },
                {
                    label: 'Projects',
                    icon: 'pi pi-folder',
                    items: [
                        {
                            label: 'Kanban Board',
                            icon: 'pi pi-columns',
                            to: '/projects/kanban'
                        },
                        {
                            label: 'Timeline',
                            icon: 'pi pi-calendar',
                            to: '/projects/timeline'
                        },
                        {
                            label: 'Tasks',
                            icon: 'pi pi-tasks',
                            to: '/projects/tasks'
                        }
                    ]
                }
            ]
        },
        { separator: true },
        {
            label: 'Framework Management',
            icon: 'pi pi-microsoft',
            items: [
                {
                    label: 'Frameworks',
                    icon: 'pi pi-microsoft',
                    to: '/framework-management'
                },
                {
                    label: 'Policy Review',
                    icon: 'pi pi-file',
                    items: [
                        {
                            label: 'Policy Review',
                            icon: 'pi pi-file',
                            to: '/framework-management/policie(s)'
                        },
                        {
                            label: 'Notification Template',
                            icon: 'pi pi-bell',
                            to: '/framework-management/policie(s)/notification-templates'
                        },
                    ]
                },
                {
                    label: 'Control Management',
                    icon: 'pi pi-stop-circle',
                    to: '/framework-management/control-management'
                },
            ]
        },
        { separator: true },
        {
            label: 'Resource Management',
            icon: 'pi pi-database',
            items: [
                {
                    label: 'Licenses',
                    icon: 'pi pi-key',
                    items: [
                        {
                            label: 'License List',
                            icon: 'pi pi-list',
                            to: '/resources/licenses/list'
                        },
                        {
                            label: 'Add License',
                            icon: 'pi pi-plus',
                            to: '/resources/licenses/add'
                        },
                        {
                            label: 'Expirations',
                            icon: 'pi pi-clock',
                            to: '/resources/licenses/expirations'
                        }
                    ]
                },
                {
                    label: 'Quarterly Deliverables',
                    icon: 'pi pi-calendar-times',
                    items: [
                        {
                            label: 'Calendar View',
                            icon: 'pi pi-calendar',
                            to: '/resources/deliverables/calendar'
                        },
                        {
                            label: 'Assign Deliverables',
                            icon: 'pi pi-user-plus',
                            to: '/resources/deliverables/assign'
                        },
                        {
                            label: 'Deliverable Status',
                            icon: 'pi pi-info-circle',
                            to: '/resources/deliverables/status'
                        }
                    ]
                },
                {
                    label: 'Compliance Reports',
                    icon: 'pi pi-file-pdf',
                    items: [
                        {
                            label: 'View Reports',
                            icon: 'pi pi-eye',
                            to: '/resources/reports/view'
                        },
                        {
                            label: 'Export Reports',
                            icon: 'pi pi-download',
                            to: '/resources/reports/export'
                        },
                        {
                            label: 'Control Data',
                            icon: 'pi pi-sliders-h',
                            to: '/resources/reports/control-data'
                        }
                    ]
                }
            ]
        },
        { separator: true },
        {
            label: 'User Management',
            icon: 'pi pi-user',
            items: [
                {
                    label: 'Users',
                    icon: 'pi pi-user',
                    to: '/users/list'
                },
                {
                    label: 'Groups',
                    icon: 'pi pi-users',
                    to: '/users/groups'
                },
                {
                    label: 'Roles',
                    icon: 'pi pi-sitemap',
                    to: '/users/roles'
                }
            ]
        }
    ];

    return <AppSubMenu model={model} />;
};

export default AppMenu;
