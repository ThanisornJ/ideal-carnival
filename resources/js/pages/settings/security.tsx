import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import { edit } from '@/routes/security';
import { disable, enable } from '@/routes/two-factor';
import { Form, Head } from '@inertiajs/react';
import {
    Box,
    Button,
    Group,
    PasswordInput,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { ShieldCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Props = {
    canManageTwoFactor?: boolean;
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
};

export default function Security({
    canManageTwoFactor = false,
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        clearTwoFactorAuthData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();
    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);
    const prevTwoFactorEnabled = useRef(twoFactorEnabled);

    useEffect(() => {
        if (prevTwoFactorEnabled.current && !twoFactorEnabled) {
            clearTwoFactorAuthData();
        }

        prevTwoFactorEnabled.current = twoFactorEnabled;
    }, [twoFactorEnabled, clearTwoFactorAuthData]);

    return (
        <>
            <Head title="Security settings" />

            <Stack gap="xl" maw={600}>
                {/* -------------------- ส่วนการเปลี่ยนรหัสผ่าน -------------------- */}
                <Box>
                    <Title order={3} mb={5}>
                        Update password
                    </Title>
                    <Text c="dimmed" size="sm">
                        Ensure your account is using a long, random password to
                        stay secure
                    </Text>
                </Box>

                <Form
                    {...SecurityController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    resetOnError={[
                        'password',
                        'password_confirmation',
                        'current_password',
                    ]}
                    resetOnSuccess
                    onError={(errors) => {
                        if (errors.password) {
                            passwordInput.current?.focus();
                        }

                        if (errors.current_password) {
                            currentPasswordInput.current?.focus();
                        }
                    }}
                >
                    {({ errors, processing }) => (
                        <Stack gap="md">
                            <PasswordInput
                                id="current_password"
                                ref={currentPasswordInput}
                                name="current_password"
                                label="Current password"
                                placeholder="Current password"
                                autoComplete="current-password"
                                error={errors.current_password}
                            />

                            <PasswordInput
                                id="password"
                                ref={passwordInput}
                                name="password"
                                label="New password"
                                placeholder="New password"
                                autoComplete="new-password"
                                error={errors.password}
                            />

                            <PasswordInput
                                id="password_confirmation"
                                name="password_confirmation"
                                label="Confirm password"
                                placeholder="Confirm password"
                                autoComplete="new-password"
                                error={errors.password_confirmation}
                            />

                            <Group mt="sm">
                                <Button
                                    type="submit"
                                    loading={processing}
                                    data-test="update-password-button"
                                >
                                    Save password
                                </Button>
                            </Group>
                        </Stack>
                    )}
                </Form>

                {/* -------------------- ส่วน 2FA -------------------- */}
                {canManageTwoFactor && (
                    <Stack gap="md" mt="xl">
                        <Box>
                            <Title order={3} mb={5}>
                                Two-factor authentication
                            </Title>
                            <Text c="dimmed" size="sm">
                                Manage your two-factor authentication settings
                            </Text>
                        </Box>

                        {twoFactorEnabled ? (
                            <Stack gap="sm" align="flex-start">
                                <Text size="sm" c="dimmed">
                                    You will be prompted for a secure, random
                                    pin during login, which you can retrieve
                                    from the TOTP-supported application on your
                                    phone.
                                </Text>

                                <Form {...disable.form()}>
                                    {({ processing }) => (
                                        <Button
                                            color="red"
                                            type="submit"
                                            loading={processing}
                                        >
                                            Disable 2FA
                                        </Button>
                                    )}
                                </Form>

                                {/* ปล่อย Component นี้ไว้เหมือนเดิม ให้มันจัดการตัวเอง */}
                                <TwoFactorRecoveryCodes
                                    recoveryCodesList={recoveryCodesList}
                                    fetchRecoveryCodes={fetchRecoveryCodes}
                                    errors={errors}
                                />
                            </Stack>
                        ) : (
                            <Stack gap="sm" align="flex-start">
                                <Text size="sm" c="dimmed">
                                    When you enable two-factor authentication,
                                    you will be prompted for a secure pin during
                                    login. This pin can be retrieved from a
                                    TOTP-supported application on your phone.
                                </Text>

                                {hasSetupData ? (
                                    <Button
                                        onClick={() => setShowSetupModal(true)}
                                        leftSection={<ShieldCheck size={18} />}
                                    >
                                        Continue setup
                                    </Button>
                                ) : (
                                    <Form
                                        {...enable.form()}
                                        onSuccess={() =>
                                            setShowSetupModal(true)
                                        }
                                    >
                                        {({ processing }) => (
                                            <Button
                                                type="submit"
                                                loading={processing}
                                            >
                                                Enable 2FA
                                            </Button>
                                        )}
                                    </Form>
                                )}
                            </Stack>
                        )}

                        {/* ปล่อย Modal ของ 2FA ไว้เหมือนเดิม */}
                        <TwoFactorSetupModal
                            isOpen={showSetupModal}
                            onClose={() => setShowSetupModal(false)}
                            requiresConfirmation={requiresConfirmation}
                            twoFactorEnabled={twoFactorEnabled}
                            qrCodeSvg={qrCodeSvg}
                            manualSetupKey={manualSetupKey}
                            clearSetupData={clearSetupData}
                            fetchSetupData={fetchSetupData}
                            errors={errors}
                        />
                    </Stack>
                )}
            </Stack>
        </>
    );
}

Security.layout = {
    breadcrumbs: [
        {
            title: 'Security settings',
            href: edit(),
        },
    ],
};
