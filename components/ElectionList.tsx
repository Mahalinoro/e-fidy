'use client';

import { type BaseError, useReadContract, useBlockNumber } from 'wagmi';
import { ELECTION_FACTORY_ADDRESS, ELECTION_FACTORY_ABI  } from '../contracts/config';
import { useEffect } from 'react'
import { Election } from './Election';

export function ElectionList() {
    const {
        data: elections,
        error,
        isPending,
        refetch
    } = useReadContract({
        address: ELECTION_FACTORY_ADDRESS as `0x${string}`,
        abi: ELECTION_FACTORY_ABI,
        functionName: 'getAllElections',
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
            <h2>Election List</h2>
            <ul>
                {Array.isArray(elections) && elections.length > 0 ? (
                    elections.map((election) => (
                        <li key={election.toString()}>
                            <Election electionAddress={election} />            
                        </li>
                    ))
                ) : (
                    <li>No elections found.</li>
                )}
            </ul>
        </div>
    );
}