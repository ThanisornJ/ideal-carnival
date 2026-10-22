import { update } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { Button, PasswordInput, Stack, TextInput } from '@mantine/core';

type Props = {
    token: string;
    email: string;
};

export default function ResetPassword({ token, email }: Props) {
    return (
        <>
            <Head title="Reset password" />

            <Form
                {...update.form()}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
            >
                {({ processing, errors }) => (
                    <Stack gap="md">
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            label="Email"
                            value={email}
                            readOnly
                            error={errors.email}
                        />

                        <PasswordInput
                            id="password"
                            name="password"
                            label="Password"
                            placeholder="Password"
                            autoComplete="new-password"
                            autoFocus
                            error={errors.password}
                        />

                        <PasswordInput
                            id="password_confirmation"
                            name="password_confirmation"
                            label="Confirm password"
                            placeholder="Confirm password"
                            autoComplete="new-password"
                            error={errors.password_confirmation}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            mt="sm"
                            loading={processing}
                            data-test="reset-password-button"
                        >
                            Reset password
                        </Button>
                    </Stack>
                )}
            </Form>
        </>
    );
}

ResetPassword.layout = {
    title: 'Reset password',
    description: 'Please enter your new password below',
};
