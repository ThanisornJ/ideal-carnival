import { regenerateRecoveryCodes } from '@/routes/two-factor';
import { Form } from '@inertiajs/react';
import {
    Alert,
    Box,
    Button,
    Card,
    Collapse,
    Group,
    Skeleton,
    Text,
    ThemeIcon,
    Title,
} from '@mantine/core';
import {
    IconEye,
    IconEyeOff,
    IconLock,
    IconRefresh,
} from '@tabler/icons-react';
import { useCallback, useEffect, useRef, useState } from 'react';

type Props = {
    recoveryCodesList: string[];
    fetchRecoveryCodes: () => Promise<void>;
    errors: string[];
};

export default function TwoFactorRecoveryCodes({
    recoveryCodesList,
    fetchRecoveryCodes,
    errors,
}: Props) {
    const [codesAreVisible, setCodesAreVisible] = useState<boolean>(false);
    const codesSectionRef = useRef<HTMLDivElement | null>(null);
    const canRegenerateCodes = recoveryCodesList.length > 0 && codesAreVisible;

    const toggleCodesVisibility = useCallback(async () => {
        if (!codesAreVisible && !recoveryCodesList.length) {
            await fetchRecoveryCodes();
        }

        setCodesAreVisible(!codesAreVisible);

        if (!codesAreVisible) {
            setTimeout(() => {
                codesSectionRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                });
            });
        }
    }, [codesAreVisible, recoveryCodesList.length, fetchRecoveryCodes]);

    useEffect(() => {
        if (!recoveryCodesList.length) {
            fetchRecoveryCodes();
        }
    }, [recoveryCodesList.length, fetchRecoveryCodes]);

    const RecoveryCodeIconComponent = codesAreVisible ? IconEyeOff : IconEye;

    return (
        <Card withBorder radius="md" p="md">
            <Group mb="xs">
                <ThemeIcon variant="light" size="md">
                    <IconLock size={16} />
                </ThemeIcon>
                <Title order={5}>2FA recovery codes</Title>
            </Group>

            <Text size="sm" c="dimmed" mb="md">
                Recovery codes let you regain access if you lose your 2FA
                device. Store them in a secure password manager.
            </Text>

            <Group justify="space-between" mb={codesAreVisible ? 'md' : 0}>
                <Button
                    variant="default"
                    onClick={toggleCodesVisibility}
                    leftSection={<RecoveryCodeIconComponent size={16} />}
                >
                    {codesAreVisible ? 'Hide' : 'View'} recovery codes
                </Button>

                {canRegenerateCodes && (
                    <Form
                        {...regenerateRecoveryCodes.form()}
                        options={{ preserveScroll: true }}
                        onSuccess={fetchRecoveryCodes}
                    >
                        {({ processing }) => (
                            <Button
                                variant="light"
                                type="submit"
                                loading={processing}
                                leftSection={<IconRefresh size={16} />}
                            >
                                Regenerate codes
                            </Button>
                        )}
                    </Form>
                )}
            </Group>

            <Collapse expanded={codesAreVisible}>
                <Box ref={codesSectionRef}>
                    {errors?.length ? (
                        <Alert color="red" title="Error" mt="md">
                            {errors.join(', ')}
                        </Alert>
                    ) : (
                        <>
                            <Box
                                bg="dark.8" // สีพื้นหลังถ้าใช้ Dark mode จะกลมกลืน (Mantine ปรับให้อัตโนมัติตาม theme)
                                p="md"
                                mt="sm"
                                style={{
                                    borderRadius: '8px',
                                    fontFamily: 'monospace',
                                }}
                            >
                                {recoveryCodesList.length ? (
                                    <div
                                        style={{ display: 'grid', gap: '4px' }}
                                    >
                                        {recoveryCodesList.map(
                                            (code, index) => (
                                                <div
                                                    key={index}
                                                    style={{
                                                        userSelect: 'all',
                                                    }}
                                                >
                                                    {code}
                                                </div>
                                            ),
                                        )}
                                    </div>
                                ) : (
                                    <div
                                        style={{ display: 'grid', gap: '8px' }}
                                    >
                                        {Array.from(
                                            { length: 8 },
                                            (_, index) => (
                                                <Skeleton
                                                    key={index}
                                                    height={16}
                                                    radius="sm"
                                                />
                                            ),
                                        )}
                                    </div>
                                )}
                            </Box>

                            <Text size="xs" c="dimmed" mt="xs">
                                Each recovery code can be used once to access
                                your account and will be removed after use. If
                                you need more, click{' '}
                                <Text span fw={700}>
                                    Regenerate codes
                                </Text>{' '}
                                above.
                            </Text>
                        </>
                    )}
                </Box>
            </Collapse>
        </Card>
    );
}
