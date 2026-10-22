import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import { store } from '@/routes/two-factor/login';
import { Form, Head, setLayoutProps } from '@inertiajs/react';
import {
    Anchor,
    Button,
    Center,
    PinInput,
    Stack,
    Text,
    TextInput,
} from '@mantine/core';
import { useMemo, useState } from 'react';

export default function TwoFactorChallenge() {
    const [showRecoveryInput, setShowRecoveryInput] = useState<boolean>(false);
    const [code, setCode] = useState<string>('');

    const authConfigContent = useMemo<{
        title: string;
        description: string;
        toggleText: string;
    }>(() => {
        if (showRecoveryInput) {
            return {
                title: 'Recovery code',
                description:
                    'Please confirm access to your account by entering one of your emergency recovery codes.',
                toggleText: 'login using an authentication code',
            };
        }

        return {
            title: 'Authentication code',
            description:
                'Enter the authentication code provided by your authenticator application.',
            toggleText: 'login using a recovery code',
        };
    }, [showRecoveryInput]);

    setLayoutProps({
        title: authConfigContent.title,
        description: authConfigContent.description,
    });

    const toggleRecoveryMode = (clearErrors: () => void): void => {
        setShowRecoveryInput(!showRecoveryInput);
        clearErrors();
        setCode('');
    };

    return (
        <>
            <Head title="Two-factor authentication" />

            <Form
                {...store.form()}
                resetOnError
                resetOnSuccess={!showRecoveryInput}
            >
                {({ errors, processing, clearErrors }) => (
                    <Stack gap="md">
                        {showRecoveryInput ? (
                            <TextInput
                                name="recovery_code"
                                placeholder="Enter recovery code"
                                autoFocus={showRecoveryInput}
                                required
                                error={errors.recovery_code}
                            />
                        ) : (
                            <Stack gap="xs" align="center">
                                <Center w="100%">
                                    <PinInput
                                        name="code"
                                        length={OTP_MAX_LENGTH}
                                        value={code}
                                        onChange={setCode}
                                        disabled={processing}
                                        type="number"
                                        autoFocus
                                        error={!!errors.code}
                                    />
                                </Center>
                                {errors.code && (
                                    <Text c="red" size="sm" ta="center">
                                        {errors.code}
                                    </Text>
                                )}
                            </Stack>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            disabled={processing}
                            loading={processing}
                        >
                            Continue
                        </Button>

                        <Text ta="center" size="sm" c="dimmed">
                            <span>or you can </span>
                            <Anchor
                                component="button"
                                type="button"
                                onClick={() => toggleRecoveryMode(clearErrors)}
                                inherit
                            >
                                {authConfigContent.toggleText}
                            </Anchor>
                        </Text>
                    </Stack>
                )}
            </Form>
        </>
    );
}
