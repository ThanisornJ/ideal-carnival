import { store } from '@/routes/password/confirm';
import { Form, Head } from '@inertiajs/react';
import { Button, PasswordInput, Stack } from '@mantine/core';

export default function ConfirmPassword() {
    return (
        <>
            <Head title="Confirm password" />

            <Form {...store.form()} resetOnSuccess={['password']}>
                {({ processing, errors }) => (
                    <Stack gap="md">
                        <PasswordInput
                            id="password"
                            name="password"
                            label="Password"
                            placeholder="Password"
                            autoComplete="current-password"
                            autoFocus
                            error={errors.password}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            mt="sm"
                            loading={processing}
                            data-test="confirm-password-button"
                        >
                            Confirm password
                        </Button>
                    </Stack>
                )}
            </Form>
        </>
    );
}

ConfirmPassword.layout = {
    title: 'Confirm your password',
    description:
        'This is a secure area of the application. Please confirm your password before continuing.',
};
