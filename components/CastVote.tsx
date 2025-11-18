'use client';

import { type BaseError, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ELECTION_ABI } from '../contracts/config';
import { useEffect } from 'react'
import { toast } from "sonner"
import { Button } from './ui/button';

export function CastVote({ electionAddress, candidateId }: { electionAddress: `0x${string}`, candidateId: bigint }) {
    const {
        data: hash,
        error,
        isPending,
        writeContract
    } = useWriteContract();

    async function handleVote() {
        writeContract({
            address: electionAddress,
            abi: ELECTION_ABI,
            functionName: 'castVote',
            args: [candidateId],
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
            toast.success('Vote cast successfully');
        }
        if (error) {
            toast.error((error as BaseError).shortMessage || error.message);
        }
        return () => {
            toast.dismiss();
        };
    }, [isConfirming, isConfirmed, error]);

    return (
        <div>
           <Button
                variant="outline" size="sm" className="text-[#52A5D8] hover:text-[#52A5D8] w-full mb-2"
                disabled={isPending}
                onClick={handleVote}
                type="submit"
            >
                {isPending ? 'Confirming...' : (isConfirming ? 'Voting...' : 'Vote')}
            </Button>
        </div>
    );
}