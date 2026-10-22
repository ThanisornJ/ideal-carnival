import { AppShell, Center, Container, Paper } from '@mantine/core';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <AppShell>
            <AppShell.Main>
                <Center h="100vh">
                    <Container size="xs" w="100%">
                        <Paper withBorder shadow="md" p="xl" radius="md">
                            {children}
                        </Paper>
                    </Container>
                </Center>
            </AppShell.Main>
        </AppShell>
    );
}
