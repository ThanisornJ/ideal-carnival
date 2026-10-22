import { login } from '@/routes';
import { email as emailRoute } from '@/routes/password';
import { Form, Head, Link } from '@inertiajs/react';
import { Anchor, Button, Stack, Text, TextInput } from '@mantine/core';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="Forgot password" />

            {status && (
                <Text ta="center" size="sm" fw={500} c="green" mb="md">
                    {status}
                </Text>
            )}

            <Stack gap="lg">
                <Form {...emailRoute.form()}>
                    {({ processing, errors }) => (
                        <Stack gap="md">
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                label="Email address"
                                placeholder="email@example.com"
                                autoComplete="off"
                                autoFocus
                                error={errors.email}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                loading={processing}
                                data-test="email-password-reset-link-button"
                            >
                                Email password reset link
                            </Button>
                        </Stack>
                    )}
                </Form>

                <Text ta="center" size="sm" c="dimmed">
                    <span>Or, return to </span>
                    <Anchor component={Link} href={login()}>
                        log in
                    </Anchor>
                </Text>
            </Stack>
        </>
    );
}

ForgotPassword.layout = {
    title: 'Forgot password',
    description: 'Enter your email to receive a password reset link',
};
