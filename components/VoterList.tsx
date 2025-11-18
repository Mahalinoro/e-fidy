'use client';

import { type BaseError, useReadContract, useBlockNumber } from 'wagmi';
import { VOTER_REGISTRY_ADDRESS, VOTER_REGISTRY_ABI } from '../contracts/config';
import { useEffect } from 'react'

export function VoterList() {
    const {
        data: voters,
        error,
        isPending,
        refetch
    } = useReadContract({
        address: VOTER_REGISTRY_ADDRESS as `0x${string}`,
        abi: VOTER_REGISTRY_ABI,
        functionName: 'getVoterList',
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
            <h2>Voter List</h2>
            <ul>
                {Array.isArray(voters) && voters.length > 0 ? (
                    voters.map((voterAddress) => (
                        <li key={voterAddress.toString()}>
                            {voterAddress.toString()}                            
                        </li>
                    ))
                ) : (
                    <li>No voters registered.</li>
                )}
            </ul>
        </div>
    );
}