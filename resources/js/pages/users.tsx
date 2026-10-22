import { Form, Head } from '@inertiajs/react';
import {
    Badge,
    Button,
    Card,
    Group,
    Modal,
    Select,
    Stack,
    Table,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';

import UserController from '@/actions/App/Http/Controllers/UserController';
import { index as usersIndex } from '@/routes/users';

type ManagedUser = {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
    email_verified_at: string | null;
    created_at: string;
};

type Props = {
    users: ManagedUser[];
    currentUserId: number;
};

export default function UsersIndex({ users, currentUserId }: Props) {
    const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
    const [opened, { open, close }] = useDisclosure(false);

    function editUser(user: ManagedUser): void {
        setEditingUser(user);
        open();
    }

    function closeEditor(): void {
        close();
        setEditingUser(null);
    }

    return (
        <>
            <Head title="Users" />

            <Stack gap="xl">
                <div>
                    <Title order={2}>User management</Title>
                    <Text c="dimmed" size="sm" mt={4}>
                        Manage user names, email addresses, and roles.
                    </Text>
                </div>

                <Card withBorder radius="md" padding={0}>
                    <Table.ScrollContainer minWidth={700}>
                        <Table striped highlightOnHover>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Name</Table.Th>
                                    <Table.Th>Email</Table.Th>
                                    <Table.Th>Role</Table.Th>
                                    <Table.Th>Actions</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {users.map((user) => (
                                    <Table.Tr key={user.id}>
                                        <Table.Td>
                                            <Text fw={500}>{user.name}</Text>
                                            {user.id === currentUserId && (
                                                <Text size="xs" c="dimmed">
                                                    You
                                                </Text>
                                            )}
                                        </Table.Td>
                                        <Table.Td>{user.email}</Table.Td>
                                        <Table.Td>
                                            <Badge
                                                color={
                                                    user.role === 'admin'
                                                        ? 'violet'
                                                        : 'gray'
                                                }
                                                variant="light"
                                            >
                                                {user.role}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            <Button
                                                size="xs"
                                                variant="light"
                                                onClick={() => editUser(user)}
                                            >
                                                Edit
                                            </Button>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </Table.ScrollContainer>
                </Card>
            </Stack>

            {editingUser && (
                <Modal
                    opened={opened}
                    onClose={closeEditor}
                    title={`Edit ${editingUser.name}`}
                >
                    <Form
                        {...UserController.update.form(editingUser.id)}
                        options={{ preserveScroll: true }}
                        onSuccess={closeEditor}
                    >
                        {({ errors, processing }) => (
                            <Stack>
                                <TextInput
                                    name="name"
                                    label="Name"
                                    defaultValue={editingUser.name}
                                    required
                                    error={errors.name}
                                />
                                <TextInput
                                    name="email"
                                    type="email"
                                    label="Email"
                                    defaultValue={editingUser.email}
                                    required
                                    error={errors.email}
                                />
                                <Select
                                    name="role"
                                    label="Role"
                                    data={[
                                        { value: 'user', label: 'User' },
                                        { value: 'admin', label: 'Admin' },
                                    ]}
                                    defaultValue={editingUser.role}
                                    allowDeselect={false}
                                    required
                                    error={errors.role}
                                />
                                <Group justify="flex-end">
                                    <Button
                                        type="button"
                                        variant="default"
                                        onClick={closeEditor}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" loading={processing}>
                                        Save changes
                                    </Button>
                                </Group>
                            </Stack>
                        )}
                    </Form>
                </Modal>
            )}
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs: [{ title: 'Users', href: usersIndex() }],
};
