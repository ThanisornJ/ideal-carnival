import { Form, Head } from '@inertiajs/react';
import {
    Badge,
    Card,
    Button,
    Group,
    Modal,
    NumberInput,
    ScrollArea,
    Select,
    Stack,
    Table,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';

import EquipmentController from '@/actions/App/Http/Controllers/EquipmentController';
import { index as equipmentIndex } from '@/routes/equipment';

type Equipment = {
    id: number;
    item_code: string;
    name: string;
    total_qty: number;
    available_qty: number;
    status: string;
};

type Props = {
    equipment: Equipment[];
    isAdmin: boolean;
};

function getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
        case 'available':
            return 'green';
        case 'unavailable':
            return 'red';
        default:
            return 'yellow';
    }
}

export default function EquipmentIndex({ equipment, isAdmin }: Props) {
    const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(
        null,
    );
    const [editOpened, { open: openEdit, close: closeEdit }] =
        useDisclosure(false);

    function startEditing(item: Equipment): void {
        setEditingEquipment(item);
        openEdit();
    }

    return (
        <>
            <Head title="Equipment" />

            <Group justify="space-between" mb="xl">
                <div>
                    <Title order={2}>Equipment</Title>
                    <Text c="dimmed" size="sm" mt={4}>
                        View the current equipment inventory.
                    </Text>
                </div>
            </Group>

            {isAdmin && (
                <Card withBorder radius="md" mb="xl">
                    <Title order={4} mb="md">
                        Add equipment
                    </Title>
                    <Form {...EquipmentController.store.form()}>
                        {({ errors, processing }) => (
                            <Stack gap="md">
                                <Group grow align="flex-start">
                                    <TextInput
                                        name="item_code"
                                        label="Item code"
                                        placeholder="EQ-001"
                                        required
                                        error={errors.item_code}
                                    />
                                    <TextInput
                                        name="name"
                                        label="Name"
                                        placeholder="Projector"
                                        required
                                        error={errors.name}
                                    />
                                </Group>
                                <Group grow align="flex-start">
                                    <NumberInput
                                        name="total_qty"
                                        label="Total quantity"
                                        min={1}
                                        required
                                        error={errors.total_qty}
                                    />
                                    <NumberInput
                                        name="available_qty"
                                        label="Available quantity"
                                        min={0}
                                        required
                                        error={errors.available_qty}
                                    />
                                    <Select
                                        name="status"
                                        label="Status"
                                        data={[
                                            {
                                                value: 'available',
                                                label: 'Available',
                                            },
                                            {
                                                value: 'unavailable',
                                                label: 'Unavailable',
                                            },
                                        ]}
                                        defaultValue="available"
                                        allowDeselect={false}
                                        required
                                        error={errors.status}
                                    />
                                </Group>
                                <Group justify="flex-end">
                                    <Button type="submit" loading={processing}>
                                        Add equipment
                                    </Button>
                                </Group>
                            </Stack>
                        )}
                    </Form>
                </Card>
            )}

            <Card withBorder radius="md" padding={0}>
                <ScrollArea>
                    <Table striped highlightOnHover withTableBorder={false}>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Item code</Table.Th>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Total quantity</Table.Th>
                                <Table.Th>Available quantity</Table.Th>
                                <Table.Th>Status</Table.Th>
                                {isAdmin && <Table.Th>Actions</Table.Th>}
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {equipment.length === 0 ? (
                                <Table.Tr>
                                    <Table.Td colSpan={isAdmin ? 6 : 5}>
                                        <Text c="dimmed" ta="center" py="xl">
                                            No equipment has been added yet.
                                        </Text>
                                    </Table.Td>
                                </Table.Tr>
                            ) : (
                                equipment.map((item) => (
                                    <Table.Tr key={item.id}>
                                        <Table.Td>{item.item_code}</Table.Td>
                                        <Table.Td fw={500}>
                                            {item.name}
                                        </Table.Td>
                                        <Table.Td>{item.total_qty}</Table.Td>
                                        <Table.Td>
                                            {item.available_qty}
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge
                                                color={getStatusColor(
                                                    item.status,
                                                )}
                                                variant="light"
                                            >
                                                {item.status}
                                            </Badge>
                                        </Table.Td>
                                        {isAdmin && (
                                            <Table.Td>
                                                <Button
                                                    size="xs"
                                                    variant="light"
                                                    onClick={() =>
                                                        startEditing(item)
                                                    }
                                                >
                                                    Update
                                                </Button>
                                            </Table.Td>
                                        )}
                                    </Table.Tr>
                                ))
                            )}
                        </Table.Tbody>
                    </Table>
                </ScrollArea>
            </Card>

            {editingEquipment && (
                <Modal
                    opened={editOpened}
                    onClose={() => {
                        closeEdit();
                        setEditingEquipment(null);
                    }}
                    title={`Update ${editingEquipment.name}`}
                >
                    <Form
                        {...EquipmentController.update.form(
                            editingEquipment.id,
                        )}
                        options={{ preserveScroll: true }}
                        onSuccess={() => {
                            closeEdit();
                            setEditingEquipment(null);
                        }}
                    >
                        {({ errors, processing }) => (
                            <Stack gap="md">
                                <TextInput
                                    label="Item code"
                                    value={editingEquipment.item_code}
                                    readOnly
                                />
                                <TextInput
                                    label="Name"
                                    value={editingEquipment.name}
                                    readOnly
                                />
                                <NumberInput
                                    name="total_qty"
                                    label="Total quantity"
                                    defaultValue={editingEquipment.total_qty}
                                    min={1}
                                    required
                                    error={errors.total_qty}
                                />
                                <NumberInput
                                    name="available_qty"
                                    label="Available quantity"
                                    defaultValue={
                                        editingEquipment.available_qty
                                    }
                                    min={0}
                                    max={editingEquipment.total_qty}
                                    required
                                    error={errors.available_qty}
                                />
                                <Select
                                    name="status"
                                    label="Status"
                                    data={[
                                        {
                                            value: 'available',
                                            label: 'Available',
                                        },
                                        {
                                            value: 'unavailable',
                                            label: 'Unavailable',
                                        },
                                    ]}
                                    defaultValue={editingEquipment.status}
                                    allowDeselect={false}
                                    required
                                    error={errors.status}
                                />
                                <Group justify="flex-end">
                                    <Button
                                        type="button"
                                        variant="default"
                                        onClick={closeEdit}
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

EquipmentIndex.layout = {
    breadcrumbs: [{ title: 'Equipment', href: equipmentIndex() }],
};
