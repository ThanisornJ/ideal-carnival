import { login } from '@/routes';
import { store } from '@/routes/register';
import { Form, Head, Link } from '@inertiajs/react';
import {
    Anchor,
    Button,
    PasswordInput,
    Stack,
    Text,
    TextInput,
} from '@mantine/core';

export default function Register() {
    return (
        <>
            <Head title="Register" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
            >
                {({ processing, errors }) => (
                    <Stack gap="md">
                        <TextInput
                            id="name"
                            type="text"
                            name="name"
                            label="Name"
                            placeholder="Full name"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            error={errors.name}
                        />

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            label="Email address"
                            placeholder="email@example.com"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            error={errors.email}
                        />

                        <PasswordInput
                            id="password"
                            name="password"
                            label="Password"
                            placeholder="Password"
                            required
                            tabIndex={3}
                            autoComplete="new-password"
                            error={errors.password}
                        />

                        <PasswordInput
                            id="password_confirmation"
                            name="password_confirmation"
                            label="Confirm password"
                            placeholder="Confirm password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            error={errors.password_confirmation}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            mt="sm"
                            tabIndex={5}
                            loading={processing}
                            data-test="register-user-button"
                        >
                            Create account
                        </Button>

                        <Text ta="center" size="sm" c="dimmed" mt="xs">
                            Already have an account?{' '}
                            <Anchor
                                component={Link}
                                href={login()}
                                tabIndex={6}
                            >
                                Log in
                            </Anchor>
                        </Text>
                    </Stack>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Create an account',
    description: 'Enter your details below to create your account',
};
