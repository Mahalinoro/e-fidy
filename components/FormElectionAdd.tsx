'use client';

import { type BaseError, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ELECTION_FACTORY_ADDRESS, ELECTION_FACTORY_ABI } from '../contracts/config';
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
import { DatePickerInput } from '@/components/ui/datepicker';

export function FormElectionAdd() {
    const {
        data: hash,
        error,
        isPending,
        writeContract
    } = useWriteContract()

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        const start = formData.get('Start Date') as string
        const end = formData.get('End Date') as string
        const name = formData.get('Name') as string

        // convert start and end to unix timestamps
        const startTimestamp = BigInt(Math.floor(new Date(start).getTime() / 1000));
        const endTimestamp = BigInt(Math.floor(new Date(end).getTime() / 1000));

        const owner = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'

        writeContract({
            address: ELECTION_FACTORY_ADDRESS as `0x${string}`,
            abi: ELECTION_FACTORY_ABI,
            functionName: 'createElection',
            args: [owner, name, startTimestamp, endTimestamp],
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
            toast.success('Election created successfully');
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
                <FieldDescription>Fill in the details below to register a new candidate</FieldDescription>
            </FieldGroup>
            <FieldGroup className='mt-4'>
                <Field>
                    <FieldLabel htmlFor="Name">
                        Title
                    </FieldLabel>
                    <Input
                        id="Name"
                        name='Name'
                        placeholder="Presidential 2025"
                        required
                    />

                    <DatePickerInput
                        label="Start Date"
                        name="Start Date"
                    />

                    <DatePickerInput
                        label="End Date"
                        name="End Date"
                    />
                </Field>
            </FieldGroup>
            <Button
                className="w-full border-[#52A5D8] bg-[#52A5D8] text-white hover:border-sky-200 hover:bg-sky-200 hover:text-white dark:border-[#52A5D8] dark:bg-[#52A5D8] dark:text-white dark:hover:border-sky-400 dark:hover:bg-sky-400 dark:hover:text-white mx-auto flex items-center mt-6"
                disabled={isPending}
                variant="outline"
                type="submit"
            >
                {isPending ? 'Confirming...' : 'Create Election'}
            </Button>
        </form>
    );
}
