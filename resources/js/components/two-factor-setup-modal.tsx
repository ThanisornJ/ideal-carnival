import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import { confirm } from '@/routes/two-factor';
import { Form } from '@inertiajs/react';
import {
    ActionIcon,
    Alert,
    Box,
    Button,
    Center,
    Divider,
    Group,
    Loader,
    Modal,
    PinInput,
    Stack,
    Text,
    TextInput,
} from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { IconCheck, IconCopy, IconScan } from '@tabler/icons-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Component สำหรับแสดง Icon ด้านบน Modal
function GridScanIcon() {
    return (
        <Center mb="md">
            <Box
                p={5}
                style={{
                    borderRadius: '50%',
                    border: '1px solid var(--mantine-color-border)',
                }}
            >
                <Box p="xs" bg="gray.1" style={{ borderRadius: '50%' }}>
                    <IconScan size={24} />
                </Box>
            </Box>
        </Center>
    );
}

function TwoFactorSetupStep({
    qrCodeSvg,
    manualSetupKey,
    buttonText,
    onNextStep,
    errors,
}: {
    qrCodeSvg: string | null;
    manualSetupKey: string | null;
    buttonText: string;
    onNextStep: () => void;
    errors: string[];
}) {
    const clipboard = useClipboard();

    return (
        <Stack gap="md">
            {errors?.length ? (
                <Alert color="red" title="Error">
                    {errors.join(', ')}
                </Alert>
            ) : (
                <>
                    <Center>
                        <Box
                            w={200}
                            h={200}
                            p="md"
                            style={{
                                border: '1px solid var(--mantine-color-border)',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {qrCodeSvg ? (
                                <Box
                                    w="100%"
                                    h="100%"
                                    bg="white"
                                    dangerouslySetInnerHTML={{
                                        __html: qrCodeSvg,
                                    }}
                                    style={{
                                        // สำหรับ Dark mode ของ Mantine เพื่อให้ QR สีไม่เพี้ยน
                                        '& svg': {
                                            width: '100%',
                                            height: '100%',
                                        },
                                    }}
                                />
                            ) : (
                                <Loader color="gray" />
                            )}
                        </Box>
                    </Center>

                    <Button fullWidth onClick={onNextStep}>
                        {buttonText}
                    </Button>

                    <Divider
                        label="or, enter the code manually"
                        labelPosition="center"
                    />

                    {!manualSetupKey ? (
                        <Center
                            h={40}
                            bg="gray.1"
                            style={{ borderRadius: '4px' }}
                        >
                            <Loader size="sm" color="gray" />
                        </Center>
                    ) : (
                        <TextInput
                            readOnly
                            value={manualSetupKey}
                            rightSection={
                                <ActionIcon
                                    variant="subtle"
                                    color={clipboard.copied ? 'teal' : 'gray'}
                                    onClick={() =>
                                        clipboard.copy(manualSetupKey)
                                    }
                                >
                                    {clipboard.copied ? (
                                        <IconCheck size={16} />
                                    ) : (
                                        <IconCopy size={16} />
                                    )}
                                </ActionIcon>
                            }
                        />
                    )}
                </>
            )}
        </Stack>
    );
}

function TwoFactorVerificationStep({
    onClose,
    onBack,
}: {
    onClose: () => void;
    onBack: () => void;
}) {
    const [code, setCode] = useState<string>('');

    return (
        <Form
            {...confirm.form()}
            onSuccess={() => onClose()}
            resetOnError
            resetOnSuccess
        >
            {({ processing, errors }: any) => (
                <Stack gap="lg">
                    <Center>
                        <PinInput
                            name="code"
                            length={OTP_MAX_LENGTH}
                            value={code}
                            onChange={setCode}
                            disabled={processing}
                            type="number"
                            autoFocus
                            error={
                                !!errors?.confirmTwoFactorAuthentication?.code
                            }
                        />
                    </Center>

                    {errors?.confirmTwoFactorAuthentication?.code && (
                        <Text c="red" size="sm" ta="center" mt="-md">
                            {errors.confirmTwoFactorAuthentication.code}
                        </Text>
                    )}

                    <Group grow>
                        <Button
                            type="button"
                            variant="default"
                            onClick={onBack}
                            disabled={processing}
                        >
                            Back
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                processing || code.length < OTP_MAX_LENGTH
                            }
                            loading={processing}
                        >
                            Confirm
                        </Button>
                    </Group>
                </Stack>
            )}
        </Form>
    );
}

type Props = {
    isOpen: boolean;
    onClose: () => void;
    requiresConfirmation: boolean;
    twoFactorEnabled: boolean;
    qrCodeSvg: string | null;
    manualSetupKey: string | null;
    clearSetupData: () => void;
    fetchSetupData: () => Promise<void>;
    errors: string[];
};

export default function TwoFactorSetupModal({
    isOpen,
    onClose,
    requiresConfirmation,
    twoFactorEnabled,
    qrCodeSvg,
    manualSetupKey,
    clearSetupData,
    fetchSetupData,
    errors,
}: Props) {
    const [showVerificationStep, setShowVerificationStep] =
        useState<boolean>(false);

    const modalConfig = useMemo(() => {
        if (twoFactorEnabled) {
            return {
                title: 'Two-factor authentication enabled',
                description:
                    'Two-factor authentication is now enabled. Scan the QR code or enter the setup key in your authenticator app.',
                buttonText: 'Close',
            };
        }

        if (showVerificationStep) {
            return {
                title: 'Verify authentication code',
                description:
                    'Enter the 6-digit code from your authenticator app',
                buttonText: 'Continue',
            };
        }

        return {
            title: 'Enable two-factor authentication',
            description:
                'To finish enabling two-factor authentication, scan the QR code or enter the setup key in your authenticator app',
            buttonText: 'Continue',
        };
    }, [twoFactorEnabled, showVerificationStep]);

    const resetModalState = useCallback(() => {
        setShowVerificationStep(false);
        clearSetupData();
    }, [clearSetupData]);

    const handleClose = useCallback(() => {
        resetModalState();
        onClose();
    }, [onClose, resetModalState]);

    const handleModalNextStep = useCallback(() => {
        if (requiresConfirmation) {
            setShowVerificationStep(true);
            return;
        }
        handleClose();
    }, [requiresConfirmation, handleClose]);

    const fetchSetupDataRef = useRef(fetchSetupData);

    useEffect(() => {
        fetchSetupDataRef.current = fetchSetupData;
    }, [fetchSetupData]);

    useEffect(() => {
        if (isOpen && !qrCodeSvg) {
            fetchSetupDataRef.current();
        }
    }, [isOpen, qrCodeSvg]);

    return (
        <Modal
            opened={isOpen}
            onClose={handleClose}
            withCloseButton={false}
            centered
            size="sm"
        >
            <GridScanIcon />
            <Text ta="center" fw={600} size="lg" mb="xs">
                {modalConfig.title}
            </Text>
            <Text ta="center" c="dimmed" size="sm" mb="xl">
                {modalConfig.description}
            </Text>

            {showVerificationStep ? (
                <TwoFactorVerificationStep
                    onClose={handleClose}
                    onBack={() => setShowVerificationStep(false)}
                />
            ) : (
                <TwoFactorSetupStep
                    qrCodeSvg={qrCodeSvg}
                    manualSetupKey={manualSetupKey}
                    buttonText={modalConfig.buttonText}
                    onNextStep={handleModalNextStep}
                    errors={errors}
                />
            )}
        </Modal>
    );
}
