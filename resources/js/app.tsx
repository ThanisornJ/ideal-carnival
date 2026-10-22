import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { createInertiaApp } from '@inertiajs/react';
import { MantineProvider, createTheme } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';

import { FlashNotification } from '@/hooks/use-flash-toast';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from './layouts/auth-layout';

const theme = createTheme({
    fontFamily: 'Instrument Sans, sans-serif',
});

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            // case name.startsWith('settings/'):
            //     return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <MantineProvider theme={theme}>
                <Notifications />
                <FlashNotification />
                <ModalsProvider>{app}</ModalsProvider>
            </MantineProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
