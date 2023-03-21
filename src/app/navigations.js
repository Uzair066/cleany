const user = JSON.parse(window.localStorage.getItem('user'));
export const navigations =
  user?.role === 'Customer'
    ? [
        { name: 'Dashboard', path: '/dashboard/default', icon: 'dashboard' },
        { label: 'PAGES', type: 'label' },
        { name: 'Payment Method', icon: 'add_card_icon', path: '/dashboard/payment-methods' },
        {
          name: 'Appreciate Us',
          icon: 'sign_language_outlined_icon',
          path: '/dashboard/appreciate',
        },

        { name: 'Invoices', icon: 'money', path: '/dashboard/customer/invoices' },
        {
          name: 'Settings',
          icon: 'settings_icon',
          children: [{ name: 'Profile', iconText: 'CP', path: '/dashboard/settings/profile' }],
        },
      ]
    : user?.role === 'Manager'
    ? [
        { name: 'Dashboard', path: '/dashboard/default', icon: 'dashboard' },
        { label: 'PAGES', type: 'label' },
        {
          name: 'Bookings',
          icon: 'import_contacts_outlined_icon',
          children: [
            {
              name: 'Booking Appointments',
              iconText: 'CP',
              path: '/dashboard/booking-appointments',
            },
          ],
        },
        {
          name: 'Dispatcher',
          path: '/dashboard/dispatcher',
          icon: 'format_list_bulleted_outlined_icon',
        },
        {
          name: 'Customers',
          icon: 'sensor_occupied_outlined_icon',
          children: [{ name: 'All Customers', iconText: 'CP', path: '/dashboard/customers' }],
        },
        {
          name: 'Service Provider',
          icon: 'engineering_icon',
          children: [
            { name: 'All Service Providers', iconText: 'CP', path: '/dashboard/service-providers' },
          ],
        },
        { name: 'Services', path: '/dashboard/services', icon: 'widgets_outlined_icon' },
        {
          name: 'Settings',
          icon: 'settings_icon',
          children: [
            { name: 'Company Profile', iconText: 'CP', path: '/dashboard/company' },
            { name: 'Tax', iconText: 'T', path: '/dashboard/tax' },
          ],
        },
        {
          name: 'Pay Roll',
          icon: ' money',
          children: [
            {
              name: 'Service Providers Payroll',
              iconText: 'payroll',
              path: '/dashboard/service-provider-payroll',
            },
            {
              name: 'Payments',
              iconText: 'payment',
              path: '/dashboard/Payments',
            },
          ],
        },

        {
          name: 'Reports',
          icon: 'reports',
          children: [
            { name: 'Invoice', iconText: 'invoice', path: '/dashboard/invoice' },
            { name: 'Pending Reports ', iconText: 'reports', path: '/dashboard/reports' },
            {
              name: 'All Bookings (by Creation Date) ',
              iconText: 'reports',
              path: '/dashboard/booking-creation-date',
            },
            {
              name: 'Stripe Charges ',
              iconText: 'reports',
              path: '/dashboard/reports/stripe-payments',
            },
            // {
            // 	name: 'Pending Reports ',
            // 	iconText: 'payroll',
            // 	path: '/dashboard/pending-reports',
            // },
          ],
        },
      ]
    : [
        { name: 'Dashboard', path: '/dashboard/default', icon: 'dashboard' },
        { label: 'PAGES', type: 'label' },
        {
          name: 'Bookings',
          icon: 'import_contacts_outlined_icon',
          children: [
            {
              name: 'Booking Appointments',
              iconText: 'CP',
              path: '/dashboard/booking-appointments',
            },
          ],
        },
        {
          name: 'Dispatcher',
          path: '/dashboard/dispatcher',
          icon: 'format_list_bulleted_outlined_icon',
        },
        {
          name: 'Calendar',
          path: '/dashboard/calendar',
          icon: 'insert_invitation_icon',
        },
        {
          name: 'Customers',
          icon: 'sensor_occupied_outlined_icon',
          children: [{ name: 'All Customers', iconText: 'CP', path: '/dashboard/customers' }],
        },
        {
          name: 'Service Provider',
          icon: 'engineering_icon',
          children: [
            { name: 'All Service Providers', iconText: 'CP', path: '/dashboard/service-providers' },
          ],
        },
        {
          name: 'Managers',
          icon: ' account_box_outlined_icon',
          children: [{ name: 'All Managers', iconText: 'CP', path: '/dashboard/managers' }],
        },
        { name: 'Services', path: '/dashboard/services', icon: 'widgets_outlined_icon' },
        {
          name: 'Settings',
          icon: 'settings_icon',
          children: [
            { name: 'Company Profile', iconText: 'CP', path: '/dashboard/company' },
            {
              name: 'Email Template',
              path: '/dashboard/email-template',
              iconText: 'CP',
              // icon: 'mail_outline_icon',
            },
            { name: 'Tax', iconText: 'CP', path: '/dashboard/tax' },
          ],
        },
        {
          name: 'Pay Roll',
          icon: ' money',
          children: [
            {
              name: 'Service Providers Payroll',
              iconText: 'payroll',
              path: '/dashboard/service-provider-payroll',
            },
            {
              name: 'Payments',
              iconText: 'payment',
              path: '/dashboard/Payments',
            },
          ],
        },

        {
          name: 'Reports',
          icon: 'reports',
          children: [
            { name: 'Invoice', iconText: 'invoice', path: '/dashboard/invoice' },
            { name: 'Pending Reports ', iconText: 'reports', path: '/dashboard/reports' },
            {
              name: 'All Bookings (by Creation Date) ',
              iconText: 'reports',
              path: '/dashboard/booking-creation-date',
            },
            {
              name: 'Stripe Charges ',
              iconText: 'reports',
              path: '/dashboard/reports/stripe-payments',
            },
            // {
            // 	name: 'Pending Reports ',
            // 	iconText: 'payroll',
            // 	path: '/dashboard/pending-reports',
            // },
          ],
        },
      ];
