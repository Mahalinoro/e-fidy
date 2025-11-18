'use client';

import { type BaseError, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ELECTION_ABI } from '../contracts/config';
import { Button } from './ui/button';
import { toast } from "sonner"
import { useEffect } from 'react';

export function StartElection({ electionAddress }: { electionAddress: `0x${string}` }) {
    const {
        data: hash,
        error,
        isPending,
        writeContract
    } = useWriteContract();

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        writeContract({
            address: electionAddress,
            abi: ELECTION_ABI,
            functionName: 'startElection',
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
            toast.success('Election started successfully');
        }
        if (error) {
            toast.error((error as BaseError).shortMessage || error.message);
        }
        return () => {
            toast.dismiss();
        };
    }, [isConfirming, isConfirmed, error]);
    return (
        <form onSubmit={submit} className='inline'>
            <Button
                variant="outline" size="sm" className="text-[#52A5D8] hover:text-green-500"
                disabled={isPending}
                type="submit"
            >
                {isPending ? 'Confirming...' : 'Start'}
            </Button>
        </form>
    );
}