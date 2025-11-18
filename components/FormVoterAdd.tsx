'use client';

import { type BaseError, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { VOTER_REGISTRY_ADDRESS, VOTER_REGISTRY_ABI } from '../contracts/config';
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from 'sonner';
import { useEffect } from 'react';

export function FormVoterAdd() {
    const {
        data: hash,
        error,
        isPending,
        writeContract
    } = useWriteContract()

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        const address = formData.get('Address') as string

        writeContract({
            address: VOTER_REGISTRY_ADDRESS as `0x${string}`,
            abi: VOTER_REGISTRY_ABI,
            functionName: 'registerVoter',
            args: [address],
        })
    }

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        })

    useEffect(() => {
        if (isConfirming) {
            toast.loading('Waiting for confirmation...');
        }
        if (isConfirmed) {
            toast.success('Voter added successfully');
        }
        if (error) {
            toast.error((error as BaseError).shortMessage || error.message);
        }
        return () => {
            toast.dismiss();
        };
    }, [isConfirming, isConfirmed, error]);

    return (
        <form onSubmit={submit}>
            <FieldGroup>
                <FieldDescription>Fill in the details below to register a voter</FieldDescription>
            </FieldGroup>
            <FieldGroup className='mt-4'>
                <Field>
                    <FieldLabel htmlFor="Address">
                        Address
                    </FieldLabel>
                    <Input
                        id="Address"
                        name='Address'
                        placeholder="0x..."
                        required
                    />
                </Field>
            </FieldGroup>
            <Button
                className="w-full border-[#52A5D8] bg-[#52A5D8] text-white hover:border-sky-200 hover:bg-sky-200 hover:text-white dark:border-[#52A5D8] dark:bg-[#52A5D8] dark:text-white dark:hover:border-sky-400 dark:hover:bg-sky-400 dark:hover:text-white mx-auto flex items-center mt-6"
                disabled={isPending}
                variant="outline"
                type="submit"
            >
                {isPending ? 'Confirming...' : 'Register Voter'}
            </Button>
        </form>
    );
}
