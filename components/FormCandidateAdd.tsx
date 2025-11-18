'use client';

import { type BaseError, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CANDIDATE_REGISTRY_ADDRESS, CANDIDATE_REGISTRY_ABI } from '../contracts/config';
import { keccak256 } from 'viem/utils';
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

export function FormCandidateAdd() {
    const {
        data: hash,
        error,
        isPending,
        writeContract
    } = useWriteContract()

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        const name = formData.get('Name') as string
        const photo = formData.get('Photo') as string
        const party = formData.get('Party') as string
        const idHash = keccak256(new TextEncoder().encode(name));
        const id = BigInt(idHash as `0x${string}`);

        writeContract({
            address: CANDIDATE_REGISTRY_ADDRESS as `0x${string}`,
            abi: CANDIDATE_REGISTRY_ABI,
            functionName: 'registerCandidate',
            args: [id, name, photo, party],
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
            toast.success('Candidate added successfully');
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
                        Name
                    </FieldLabel>
                    <Input
                        id="Name"
                        name='Name'
                        placeholder="John Doe"
                        required
                    />

                    <FieldLabel htmlFor="Photo">
                        Photo URL
                    </FieldLabel>
                    <Input
                        id="Photo"
                        placeholder="https://example.com/photo.jpg"
                        name='Photo'
                        required
                    />

                     <FieldLabel htmlFor="Party">
                        Party URL
                    </FieldLabel>
                    <Input
                        id="Party"
                        placeholder="https://example.com/party.mg"
                        name='Party'
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
                {isPending ? 'Confirming...' : 'Register Candidate'}
            </Button>
        </form>
    );
}
