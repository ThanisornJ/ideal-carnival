import { Head, Link } from '@inertiajs/react';
import {
    Badge,
    Card,
    Group,
    SimpleGrid,
    Stack,
    Table,
    Text,
    Title,
} from '@mantine/core';
import { Clock3, ClipboardList, PackageCheck, PackageOpen } from 'lucide-react';

import { index as equipmentIndex } from '@/routes/equipment';
import { index as requisitionsIndex } from '@/routes/requisitions';

type Stats = {
    equipmentCount: number;
    availableQuantity: number;
    pendingRequisitions: number;
    requisitionCount: number;
};

type Requisition = {
    id: number;
    quantity: number;
    status: 'pending' | 'approved' | 'returned' | 'rejected';
    equipment: { item_code: string; name: string };
    user: { name: string };
};

type Props = {
    isAdmin: boolean;
    stats: Stats;
    recentRequisitions: Requisition[];
};

function statusColor(status: Requisition['status']): string {
    return {
        pending: 'yellow',
        approved: 'green',
        rejected: 'red',
        returned: 'blue',
    }[status];
}

export default function Home({ isAdmin, stats, recentRequisitions }: Props) {
    const cards = [
        {
            label: 'Equipment types',
            value: stats.equipmentCount,
            icon: PackageOpen,
        },
        {
            label: 'Available units',
            value: stats.availableQuantity,
            icon: PackageCheck,
        },
        {
            label: isAdmin ? 'Pending approvals' : 'Pending requests',
            value: stats.pendingRequisitions,
            icon: Clock3,
        },
        {
            label: 'Total requisitions',
            value: stats.requisitionCount,
            icon: ClipboardList,
        },
    ];

    return (
        <>
            <Head title="Dashboard" />

            <Stack gap="xl">
                <div>
                    <Title order={2}>Dashboard</Title>
                    <Text c="dimmed" size="sm" mt={4}>
                        {isAdmin
                            ? 'Monitor equipment and manage requisition activity.'
                            : 'View equipment availability and track your requests.'}
                    </Text>
                </div>

                <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
                    {cards.map(({ label, value, icon: Icon }) => (
                        <Card withBorder radius="md" key={label}>
                            <Group justify="space-between" align="flex-start">
                                <div>
                                    <Text c="dimmed" size="sm">
                                        {label}
                                    </Text>
                                    <Text fw={700} size="xl" mt={4}>
                                        {value}
                                    </Text>
                                </div>
                                <Icon size={22} />
                            </Group>
                        </Card>
                    ))}
                </SimpleGrid>

                <Card withBorder radius="md" padding={0}>
                    <Group justify="space-between" p="md">
                        <div>
                            <Title order={4}>Recent requisitions</Title>
                            <Text c="dimmed" size="sm" mt={4}>
                                The latest equipment requests.
                            </Text>
                        </div>
                        <Link href={requisitionsIndex()}>
                            <Text size="sm">View all</Text>
                        </Link>
                    </Group>

                    <Table.ScrollContainer minWidth={650}>
                        <Table striped highlightOnHover>
                            <Table.Thead>
                                <Table.Tr>
                                    {isAdmin && <Table.Th>Requester</Table.Th>}
                                    <Table.Th>Equipment</Table.Th>
                                    <Table.Th>Quantity</Table.Th>
                                    <Table.Th>Status</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {recentRequisitions.length === 0 ? (
                                    <Table.Tr>
                                        <Table.Td colSpan={isAdmin ? 4 : 3}>
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
                                    recentRequisitions.map((requisition) => (
                                        <Table.Tr key={requisition.id}>
                                            {isAdmin && (
                                                <Table.Td>
                                                    {requisition.user.name}
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
                                                <Badge
                                                    color={statusColor(
                                                        requisition.status,
                                                    )}
                                                    variant="light"
                                                >
                                                    {requisition.status}
                                                </Badge>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))
                                )}
                            </Table.Tbody>
                        </Table>
                    </Table.ScrollContainer>
                </Card>

                <Group>
                    <Link href={equipmentIndex()}>
                        <Text size="sm">Browse equipment</Text>
                    </Link>
                    {!isAdmin && (
                        <Link href={requisitionsIndex()}>
                            <Text size="sm">Create a requisition</Text>
                        </Link>
                    )}
                </Group>
            </Stack>
        </>
    );
}

Home.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/' }],
};
