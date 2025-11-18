'use client';

import { type BaseError, useReadContract, useBlockNumber } from 'wagmi';
import { ELECTION_ABI } from '../contracts/config';
import { useEffect } from 'react'
import { Badge } from "@/components/ui/badge"

export function GetVoteTally({ electionAddress, candidateId }: { electionAddress: `0x${string}`, candidateId: bigint }) {
    const {
        data: voteTally,
        error,
        isPending,
        refetch
    } = useReadContract({
        address: electionAddress,
        abi: ELECTION_ABI,
        functionName: 'getVoteTally',
        args: [candidateId],
    })

    const { data: blockNumber } = useBlockNumber({ watch: true })

    useEffect(() => {
        refetch()
    }, [blockNumber, refetch])

    if (isPending) return <div>Loading...</div>

    if (error)
        return (
            <div>
                Error: {(error as unknown as BaseError).shortMessage || error.message}
            </div>
        )
    return (
        <div>
            <Badge className="h-5 min-w-5 px-2 bg-[#52A5D8]  text-white">
                Total Votes: {voteTally?.toString() || '0'}
            </Badge>
        </div>
    );
}