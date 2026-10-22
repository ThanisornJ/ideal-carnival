import { logout } from '@/routes';
import { send } from '@/routes/verification';
import { Form, Head, Link } from '@inertiajs/react';
import { Anchor, Button, Stack, Text } from '@mantine/core';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <>
            <Head title="Email verification" />

            {status === 'verification-link-sent' && (
                <Text ta="center" size="sm" fw={500} c="green" mb="md">
                    A new verification link has been sent to the email address
                    you provided during registration.
                </Text>
            )}

            <Form {...send.form()}>
                {({ processing }) => (
                    <Stack gap="md" align="center">
                        <Button
                            type="submit"
                            variant="default"
                            loading={processing}
                        >
                            Resend verification email
                        </Button>

                        <Anchor component={Link} href={logout()} size="sm">
                            Log out
                        </Anchor>
                    </Stack>
                )}
            </Form>
        </>
    );
}

VerifyEmail.layout = {
    title: 'Verify email',
    description:
        'Please verify your email address by clicking on the link we just emailed to you.',
};
