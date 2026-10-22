import { router } from '@inertiajs/react';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck, IconInfoCircle, IconX } from '@tabler/icons-react';
import { useEffect } from 'react';

import type { FlashToast } from '@/types/ui';

export function useFlashToast(): void {
    useEffect(() => {
        return router.on('flash', (event) => {
            const flash = (event as CustomEvent).detail?.flash;
            const data = flash?.toast as FlashToast | undefined;

            if (!data) {
                return;
            }

            let color = 'blue';
            let icon = <IconInfoCircle size={18} />;
            let title = 'Notification';

            switch (data.type) {
                case 'success':
                    color = 'green';
                    icon = <IconCheck size={18} />;
                    title = 'Success';
                    break;
                case 'error':
                    color = 'red';
                    icon = <IconX size={18} />;
                    title = 'Error';
                    break;
                case 'warning':
                    color = 'yellow';
                    icon = <IconAlertTriangle size={18} />;
                    title = 'Warning';
                    break;
                case 'info':
                default:
                    color = 'blue';
                    icon = <IconInfoCircle size={18} />;
                    title = 'Info';
                    break;
            }

            notifications.show({
                title: title,
                message: data.message,
                color: color,
                icon: icon,
            });
        });
    }, []);
}

// สร้าง Component Wrapper เพื่อให้เรียกใช้ Hook นี้ในระดับ Global ได้
export function FlashNotification() {
    useFlashToast();

    return null;
}
