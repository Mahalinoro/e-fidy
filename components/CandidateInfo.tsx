'use client';

import { type BaseError, useReadContract } from 'wagmi';
import { CANDIDATE_REGISTRY_ADDRESS, CANDIDATE_REGISTRY_ABI } from '../contracts/config';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from 'next/link';

type Candidate = {
    photoURL: string;
    name: string;
    partyURL: string;
};

export function CandidateInfo({ candidateId }: { candidateId: bigint }) {
    const {
        data,
        error,
        isPending,
    } = useReadContract({
        address: CANDIDATE_REGISTRY_ADDRESS as `0x${string}`,
        abi: CANDIDATE_REGISTRY_ABI,
        functionName: 'getCandidate',
        args: [candidateId],
    })

    const candidate = data as unknown as Candidate | undefined;

    if (isPending) return <div>Loading candidate info...</div>

    if (error)
        return (
            <div>
                Error: {(error as unknown as BaseError).shortMessage || error.message}
            </div>
        )

    return (
        <div>
            {candidate ? (
                <div className="flex items-center space-x-4">
                    <Avatar className="w-32 h-32">
                        <AvatarImage src={candidate.photoURL} alt={candidate.name} />
                        <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className='gap-2 flex flex-col'>
                        <p className="font-semibold text-lg">{candidate.name}</p>
                        <Button variant="outline" size="sm">
                            <Link href={candidate.partyURL} target="_blank" rel="noopener noreferrer">View Party</Link>
                        </Button>
                    </div>
                </div>
            ) : (
                <p>No candidate found with ID {candidateId.toString()}</p>
            )}
        </div>
    );
}
