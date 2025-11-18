'use client';

import { type BaseError, useReadContract, useBlockNumber } from 'wagmi';
import { CANDIDATE_REGISTRY_ADDRESS, CANDIDATE_REGISTRY_ABI } from '../contracts/config';
import { useEffect } from 'react'
import { CandidateInfo } from './CandidateInfo';

export function CandidateList() {
    const {
        data: candidates,
        error,
        isPending,
        refetch
    } = useReadContract({
        address: CANDIDATE_REGISTRY_ADDRESS as `0x${string}`,
        abi: CANDIDATE_REGISTRY_ABI,
        functionName: 'getCandidateList',
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
            <h2>Candidate List</h2>
            <ul>
                {Array.isArray(candidates) && candidates.length > 0 ? (
                    candidates.map((candidateId) => (
                        <li key={candidateId.toString()}>
                            <CandidateInfo candidateId={candidateId} />
                        </li>
                    ))
                ) : (
                    <li>No candidates registered.</li>
                )}
            </ul>
        </div>
    );
}