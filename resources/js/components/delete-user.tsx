import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { Form } from '@inertiajs/react';
import {
    Alert,
    Box,
    Button,
    Group,
    Modal,
    PasswordInput,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconAlertTriangle } from '@tabler/icons-react';
import { useRef } from 'react';

export default function DeleteUser() {
    const [opened, { open, close }] = useDisclosure(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    return (
        <Stack gap="xl" maw={600}>
            <Box>
                <Title order={3} mb={5}>
                    Delete account
                </Title>
                <Text c="dimmed" size="sm">
                    Delete your account and all of its resources
                </Text>
            </Box>

            <Alert
                variant="light"
                color="red"
                title="Warning"
                icon={<IconAlertTriangle size={18} />}
            >
                <Text size="sm">
                    Please proceed with caution, this cannot be undone.
                </Text>

                <Button
                    color="red"
                    mt="md"
                    onClick={open}
                    data-test="delete-user-button"
                >
                    Delete account
                </Button>
            </Alert>

            <Modal
                opened={opened}
                onClose={close}
                title="Are you sure you want to delete your account?"
                centered
            >
                <Text size="sm" c="dimmed" mb="md">
                    Once your account is deleted, all of its resources and data
                    will also be permanently deleted. Please enter your password
                    to confirm you would like to permanently delete your
                    account.
                </Text>

                <Form
                    {...ProfileController.destroy.form()}
                    options={{ preserveScroll: true }}
                    onError={() => passwordInput.current?.focus()}
                    resetOnSuccess
                >
                    {({ resetAndClearErrors, processing, errors }) => (
                        <Stack gap="md">
                            <PasswordInput
                                id="password"
                                name="password"
                                ref={passwordInput}
                                placeholder="Password"
                                autoComplete="current-password"
                                error={errors.password}
                                data-autofocus
                            />

                            <Group justify="flex-end" mt="md">
                                <Button
                                    variant="default"
                                    onClick={() => {
                                        resetAndClearErrors();
                                        close();
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    color="red"
                                    type="submit"
                                    loading={processing}
                                    data-test="confirm-delete-user-button"
                                >
                                    Delete account
                                </Button>
                            </Group>
                        </Stack>
                    )}
                </Form>
            </Modal>
        </Stack>
    );
}
