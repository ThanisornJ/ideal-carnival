import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head, Link } from '@inertiajs/react';
import {
    Anchor,
    Button,
    Checkbox,
    Group,
    PasswordInput,
    Stack,
    Text,
    TextInput,
} from '@mantine/core';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <>
            <Head title="Log in" />

            <Form {...store.form()} resetOnSuccess={['password']}>
                {({ processing, errors }) => (
                    <Stack gap="md">
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            label="Email address"
                            placeholder="email@example.com"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            error={errors.email}
                        />

                        <div>
                            <Group justify="space-between" mb={5}>
                                <Text
                                    component="label"
                                    htmlFor="password"
                                    size="sm"
                                    fw={500}
                                >
                                    Password{' '}
                                    <Text span c="red">
                                        *
                                    </Text>
                                </Text>
                                {canResetPassword && (
                                    <Anchor
                                        component={Link}
                                        href={request()}
                                        size="sm"
                                        tabIndex={5}
                                    >
                                        Forgot password?
                                    </Anchor>
                                )}
                            </Group>
                            <PasswordInput
                                id="password"
                                name="password"
                                placeholder="Password"
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                error={errors.password}
                            />
                        </div>

                        <Checkbox
                            id="remember"
                            name="remember"
                            label="Remember me"
                            tabIndex={3}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            mt="sm"
                            tabIndex={4}
                            loading={processing}
                            data-test="login-button"
                        >
                            Log in
                        </Button>

                        {canRegister && (
                            <Text ta="center" size="sm" c="dimmed" mt="xs">
                                Don't have an account?{' '}
                                <Anchor
                                    component={Link}
                                    href={register()}
                                    tabIndex={5}
                                >
                                    Sign up
                                </Anchor>
                            </Text>
                        )}
                    </Stack>
                )}
            </Form>

            {status && (
                <Text ta="center" size="sm" fw={500} c="green" mt="md">
                    {status}
                </Text>
            )}
        </>
    );
}

Login.layout = {
    title: 'Log in to your account',
    description: 'Enter your email and password below to log in',
};
