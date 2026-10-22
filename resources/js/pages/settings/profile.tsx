import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import {
    Anchor,
    Box,
    Button,
    Group,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Profile settings" />

            {/* ใช้ Stack ครอบทั้งหมด และจำกัดความกว้างให้พอดีสำหรับหน้า Settings */}
            <Stack gap="xl" maw={600}>
                {/* ส่วนหัวของฟอร์มแทนที่ Heading component เดิม */}
                <Box>
                    <Title order={3} mb={5}>
                        Profile information
                    </Title>
                    <Text c="dimmed" size="sm">
                        Update your name and email address
                    </Text>
                </Box>

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                >
                    {({ processing, errors }) => (
                        <Stack gap="md">
                            <TextInput
                                id="name"
                                name="name"
                                label="Name"
                                defaultValue={auth.user.name}
                                required
                                autoComplete="name"
                                placeholder="Full name"
                                error={errors.name}
                            />

                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                label="Email address"
                                defaultValue={auth.user.email}
                                required
                                autoComplete="username"
                                placeholder="Email address"
                                error={errors.email}
                            />

                            {mustVerifyEmail &&
                                auth.user.email_verified_at === null && (
                                    <Box>
                                        <Text size="sm" c="dimmed">
                                            Your email address is unverified.{' '}
                                            <Anchor
                                                component={Link}
                                                href={send()}
                                                as="button"
                                                inherit
                                            >
                                                Click here to resend the
                                                verification email.
                                            </Anchor>
                                        </Text>

                                        {status ===
                                            'verification-link-sent' && (
                                            <Text
                                                mt="xs"
                                                size="sm"
                                                fw={500}
                                                c="green"
                                            >
                                                A new verification link has been
                                                sent to your email address.
                                            </Text>
                                        )}
                                    </Box>
                                )}

                            {/* จัดปุ่ม Save ให้อยู่ชิดซ้าย */}
                            <Group mt="sm">
                                <Button
                                    type="submit"
                                    loading={processing}
                                    data-test="update-profile-button"
                                >
                                    Save
                                </Button>
                            </Group>
                        </Stack>
                    )}
                </Form>

                {/* คอมโพเนนต์ DeleteUser ปล่อยไว้เหมือนเดิม */}
                <DeleteUser />
            </Stack>
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Profile settings',
            href: edit(),
        },
    ],
};
