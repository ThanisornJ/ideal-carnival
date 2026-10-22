import { Form, Head } from '@inertiajs/react';
import {
    Badge,
    Button,
    Card,
    Group,
    NumberInput,
    Select,
    Stack,
    Table,
    Text,
    Textarea,
    Title,
} from '@mantine/core';
import { useState } from 'react';

import RequisitionController from '@/actions/App/Http/Controllers/RequisitionController';
import { index as requisitionsIndex } from '@/routes/requisitions';

type Equipment = {
    id: number;
    item_code: string;
    name: string;
    available_qty: number;
};

type Requisition = {
    id: number;
    quantity: number;
    reason: string;
    status: 'pending' | 'approved' | 'returned' | 'rejected';
    equipment: Pick<Equipment, 'item_code' | 'name' | 'available_qty'>;
    user: { name: string; email: string };
};

type Props = {
    isAdmin: boolean;
    equipment: Equipment[];
    requisitions: Requisition[];
};

function statusColor(status: Requisition['status']): string {
    return {
        pending: 'yellow',
        approved: 'green',
        rejected: 'red',
        returned: 'blue',
    }[status];
}

export default function RequisitionIndex({
    isAdmin,
    equipment,
    requisitions,
}: Props) {
    const [selectedEquipmentId, setSelectedEquipmentId] = useState<
        string | null
    >(null);
    const [quantity, setQuantity] = useState<number | string>(1);
    const selectedEquipment = equipment.find(
        (item) => String(item.id) === selectedEquipmentId,
    );

    return (
        <>
            <Head title="Requisitions" />

            <Stack gap="xl">
                <div>
                    <Title order={2}>Requisitions</Title>
                    <Text c="dimmed" size="sm" mt={4}>
                        Request equipment and track approval decisions.
                    </Text>
                </div>

                {!isAdmin && (
                    <Card withBorder radius="md">
                        <Title order={4} mb="md">
                            Create requisition
                        </Title>
                        <Form
                            {...RequisitionController.store.form()}
                            options={{ preserveScroll: true }}
                        >
                            {({ processing, errors }) => (
                                <Stack>
                                    <Select
                                        name="equipment_id"
                                        label="Equipment"
                                        placeholder="Select equipment"
                                        data={equipment.map((item) => ({
                                            value: String(item.id),
                                            label: `${item.name} (${item.item_code}) - ${item.available_qty} available`,
                                        }))}
                                        error={errors.equipment_id}
                                        value={selectedEquipmentId}
                                        onChange={(value) => {
                                            setSelectedEquipmentId(value);
                                            const selected = equipment.find(
                                                (item) =>
                                                    String(item.id) === value,
                                            );

                                            if (
                                                selected &&
                                                typeof quantity === 'number' &&
                                                quantity >
                                                    selected.available_qty
                                            ) {
                                                setQuantity(
                                                    selected.available_qty,
                                                );
                                            }
                                        }}
                                        required
                                    />
                                    <NumberInput
                                        name="quantity"
                                        label="Quantity"
                                        min={1}
                                        max={selectedEquipment?.available_qty}
                                        value={quantity}
                                        onChange={setQuantity}
                                        disabled={!selectedEquipment}
                                        description={
                                            selectedEquipment
                                                ? `Up to ${selectedEquipment.available_qty} available`
                                                : 'Select equipment first'
                                        }
                                        error={errors.quantity}
                                        required
                                    />
                                    <Textarea
                                        name="reason"
                                        label="Reason"
                                        placeholder="Explain why this equipment is needed"
                                        error={errors.reason}
                                        required
                                    />
                                    <Group>
                                        <Button
                                            type="submit"
                                            loading={processing}
                                        >
                                            Submit requisition
                                        </Button>
                                    </Group>
                                </Stack>
                            )}
                        </Form>
                    </Card>
                )}

                <Card withBorder radius="md" padding={0}>
                    <Table.ScrollContainer minWidth={isAdmin ? 900 : 700}>
                        <Table striped highlightOnHover>
                            <Table.Thead>
                                <Table.Tr>
                                    {isAdmin && <Table.Th>Requester</Table.Th>}
                                    <Table.Th>Equipment</Table.Th>
                                    <Table.Th>Quantity</Table.Th>
                                    <Table.Th>Reason</Table.Th>
                                    <Table.Th>Status</Table.Th>
                                    {isAdmin && <Table.Th>Actions</Table.Th>}
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {requisitions.length === 0 ? (
                                    <Table.Tr>
                                        <Table.Td colSpan={isAdmin ? 6 : 5}>
                                            <Text
                                                c="dimmed"
                                                ta="center"
                                                py="xl"
                                            >
                                                No requisitions found.
                                            </Text>
                                        </Table.Td>
                                    </Table.Tr>
                                ) : (
                                    requisitions.map((requisition) => (
                                        <Table.Tr key={requisition.id}>
                                            {isAdmin && (
                                                <Table.Td>
                                                    <Text fw={500}>
                                                        {requisition.user.name}
                                                    </Text>
                                                    <Text size="xs" c="dimmed">
                                                        {requisition.user.email}
                                                    </Text>
                                                </Table.Td>
                                            )}
                                            <Table.Td>
                                                <Text fw={500}>
                                                    {requisition.equipment.name}
                                                </Text>
                                                <Text size="xs" c="dimmed">
                                                    {
                                                        requisition.equipment
                                                            .item_code
                                                    }
                                                </Text>
                                            </Table.Td>
                                            <Table.Td>
                                                {requisition.quantity}
                                            </Table.Td>
                                            <Table.Td>
                                                {requisition.reason}
                                            </Table.Td>
                                            <Table.Td>
                                                <Badge
                                                    color={statusColor(
                                                        requisition.status,
                                                    )}
                                                    variant="light"
                                                >
                                                    {requisition.status}
                                                </Badge>
                                            </Table.Td>
                                            {isAdmin && (
                                                <Table.Td>
                                                    {requisition.status ===
                                                        'pending' && (
                                                        <Group gap="xs">
                                                            <Form
                                                                {...RequisitionController.approve.form(
                                                                    requisition.id,
                                                                )}
                                                                options={{
                                                                    preserveScroll: true,
                                                                }}
                                                            >
                                                                <Button
                                                                    type="submit"
                                                                    size="xs"
                                                                    color="green"
                                                                    disabled={
                                                                        requisition.quantity >
                                                                        requisition
                                                                            .equipment
                                                                            .available_qty
                                                                    }
                                                                    title={
                                                                        requisition.quantity >
                                                                        requisition
                                                                            .equipment
                                                                            .available_qty
                                                                            ? 'Not enough equipment available to approve'
                                                                            : undefined
                                                                    }
                                                                >
                                                                    {requisition.quantity >
                                                                    requisition
                                                                        .equipment
                                                                        .available_qty
                                                                        ? 'Insufficient stock'
                                                                        : 'Approve'}
                                                                </Button>
                                                            </Form>
                                                            <Form
                                                                {...RequisitionController.reject.form(
                                                                    requisition.id,
                                                                )}
                                                                options={{
                                                                    preserveScroll: true,
                                                                }}
                                                            >
                                                                <Button
                                                                    type="submit"
                                                                    size="xs"
                                                                    color="red"
                                                                    variant="light"
                                                                >
                                                                    Reject
                                                                </Button>
                                                            </Form>
                                                        </Group>
                                                    )}
                                                    {requisition.status ===
                                                        'approved' && (
                                                        <Form
                                                            {...RequisitionController.return.form(
                                                                requisition.id,
                                                            )}
                                                            options={{
                                                                preserveScroll: true,
                                                            }}
                                                        >
                                                            <Button
                                                                type="submit"
                                                                size="xs"
                                                                color="blue"
                                                            >
                                                                Return
                                                            </Button>
                                                        </Form>
                                                    )}
                                                </Table.Td>
                                            )}
                                        </Table.Tr>
                                    ))
                                )}
                            </Table.Tbody>
                        </Table>
                    </Table.ScrollContainer>
                </Card>
            </Stack>
        </>
    );
}

RequisitionIndex.layout = {
    breadcrumbs: [{ title: 'Requisitions', href: requisitionsIndex() }],
};
