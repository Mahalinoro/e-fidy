'use client';

import { type BaseError, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ELECTION_ABI } from '../contracts/config';
import { toast } from 'sonner';
import { Button } from './ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { type CandidateRow } from '@/app/manage/candidates/useCandidatesData';
import { useEffect, useState } from 'react';

export function AddCandidateToElection({
    electionAddress,
    candidates
}: {
    electionAddress: `0x${string}`,
    candidates: CandidateRow[]
}) {
    const [selectedId, setSelectedId] = useState<string>("");
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
            functionName: 'addCandidateToElection',
            args: [BigInt(selectedId)],
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
            <Select value={selectedId} onValueChange={setSelectedId}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a candidate..." />
                </SelectTrigger>
                <SelectContent>
                    {candidates.length > 0 ? (
                        candidates.map((candidate) => (
                            <SelectItem
                                key={candidate.id}
                                value={candidate.id.toString()} // The value must be a string
                            >
                                {candidate.name}
                            </SelectItem>
                        ))
                    ) : (
                        <SelectItem value="none" disabled>No candidates registered</SelectItem>
                    )}
                </SelectContent>
            </Select>

            <Button
                className="w-full border-[#52A5D8] bg-[#52A5D8] text-white hover:border-sky-200 hover:bg-sky-200 hover:text-white dark:border-[#52A5D8] dark:bg-[#52A5D8] dark:text-white dark:hover:border-sky-400 dark:hover:bg-sky-400 dark:hover:text-white mx-auto flex items-center mt-6"
                disabled={isPending || !selectedId}
                variant="outline"
                type="submit"
            >
                {isPending ? 'Confirming...' : 'Add'}
            </Button>
        </form>
    );
}

