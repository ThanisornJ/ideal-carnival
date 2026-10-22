import { Link, usePage } from '@inertiajs/react';
import {
    Anchor,
    AppShell,
    Avatar,
    Breadcrumbs,
    Burger,
    Container,
    Group,
    Menu,
    NavLink,
    rem,
    Text,
    UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
    ChevronRight,
    ClipboardList,
    LayoutDashboard,
    LogOut,
    Settings,
    User,
    Users,
} from 'lucide-react';

import { index as equipmentIndex } from '@/routes/equipment';
import { index as requisitionsIndex } from '@/routes/requisitions';
import { index as usersIndex } from '@/routes/users';
import type { Auth, BreadcrumbItem } from '@/types';

type Props = {
    children?: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
};

export default function AppLayoutTemplate({ children, breadcrumbs }: Props) {
    const [opened, { toggle }] = useDisclosure();
    const { auth } = usePage().props as unknown as { auth: Auth };
    const user = auth.user;
    const currentUrl = usePage().url;

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: { mobile: !opened },
            }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md" justify="space-between">
                    <Group>
                        <Burger
                            opened={opened}
                            onClick={toggle}
                            hiddenFrom="sm"
                            size="sm"
                        />
                        <Link
                            href="/"
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <Text fw={700} size="lg">
                                Asset Management System
                            </Text>
                        </Link>
                    </Group>

                    <Menu shadow="md" width={200} position="bottom-end">
                        <Menu.Target>
                            <UnstyledButton>
                                <Group gap={7}>
                                    <Avatar
                                        src={user.avatar}
                                        alt={user.name}
                                        radius="xl"
                                        size={30}
                                    />
                                    <Text fw={500} size="sm" visibleFrom="sm">
                                        {user.name}
                                    </Text>
                                    <ChevronRight size={rem(14)} />
                                </Group>
                            </UnstyledButton>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Label>Application</Menu.Label>
                            <Menu.Item
                                component={Link}
                                href="/settings/profile"
                                leftSection={<User size={rem(14)} />}
                            >
                                Profile
                            </Menu.Item>
                            <Menu.Item
                                component={Link}
                                href="/settings/security"
                                leftSection={<Settings size={rem(14)} />}
                            >
                                Security
                            </Menu.Item>

                            <Menu.Divider />

                            <Menu.Item
                                color="red"
                                component={Link}
                                href="/logout"
                                method="post"
                                as="button"
                                style={{ width: '100%' }}
                                leftSection={<LogOut size={rem(14)} />}
                            >
                                Logout
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <NavLink
                    component={Link}
                    href="/"
                    label="Dashboard"
                    leftSection={<LayoutDashboard size={rem(16)} />}
                    active={currentUrl === '/'}
                />

                <NavLink
                    component={Link}
                    href={equipmentIndex()}
                    label="Equipment"
                    leftSection={<ClipboardList size={rem(16)} />}
                    active={currentUrl === equipmentIndex.url()}
                />

                <NavLink
                    component={Link}
                    href={requisitionsIndex()}
                    label="Requisitions"
                    leftSection={<ClipboardList size={rem(16)} />}
                    active={currentUrl === requisitionsIndex.url()}
                />

                {user.role === 'admin' && (
                    <NavLink
                        component={Link}
                        href={usersIndex()}
                        label="Users"
                        leftSection={<Users size={rem(16)} />}
                        active={currentUrl === usersIndex.url()}
                    />
                )}

                <NavLink
                    label="Settings"
                    leftSection={<Settings size={rem(16)} />}
                    childrenOffset={28}
                    defaultOpened={currentUrl.startsWith('/settings')}
                >
                    <NavLink
                        component={Link}
                        href="/settings/profile"
                        label="Profile"
                        active={currentUrl === '/settings/profile'}
                    />
                    <NavLink
                        component={Link}
                        href="/settings/security"
                        label="Security"
                        active={currentUrl === '/settings/security'}
                    />
                </NavLink>
            </AppShell.Navbar>

            <AppShell.Main>
                <Container>
                    {breadcrumbs && breadcrumbs.length > 0 && (
                        <Breadcrumbs mb="md">
                            {breadcrumbs.map((item, index) => (
                                <Anchor
                                    component={Link}
                                    href={item.href}
                                    key={index}
                                    size="sm"
                                >
                                    {item.title}
                                </Anchor>
                            ))}
                        </Breadcrumbs>
                    )}
                    {children}
                </Container>
            </AppShell.Main>
        </AppShell>
    );
}
