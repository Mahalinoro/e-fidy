// app/manage/elections/useElectionsData.ts
'use client';

import { useEffect, useMemo } from 'react';
import { useBlockNumber, useReadContract, useReadContracts } from 'wagmi';
import { ELECTION_FACTORY_ABI, ELECTION_FACTORY_ADDRESS, ELECTION_ABI } from '@/contracts/config';

function formatElectionStatus(status: number | bigint) {
    switch (status?.toString()) {
        case '0': return 'Pending';
        case '1': return 'Active';
        case '2': return 'Closed';
        default: return 'Unknown';
    }
}

export type ElectionRow = {
    id: string; 
    title: string;
    status: string;
    startTime: Date;
    endTime: Date;
    totalVotes: string;
    candidates: string[];
    candidateCount: number;
}

export function useElectionsData() {
    const { data: electionAddresses, isLoading: isLoadingList, error: errorList, refetch } = useReadContract({
        address: ELECTION_FACTORY_ADDRESS as `0x${string}`,
        abi: ELECTION_FACTORY_ABI,
        functionName: 'getAllElections'
    });

    // 2. Create a dynamic list of contract calls for *all* elections
    const contracts = useMemo(() => {
        if (!electionAddresses) return [];

        // For each address, create a "batch" of 3 calls
        return (electionAddresses as `0x${string}`[]).flatMap(address => [
            { address, abi: ELECTION_ABI, functionName: 'getElectionInfo' },
            { address, abi: ELECTION_ABI, functionName: 'getTotalVotesCast' },
            { address, abi: ELECTION_ABI, functionName: 'getParticipatingCandidates' },
        ]);
    }, [electionAddresses]);

    // 3. Fetch all details in a single batch
    const { data: electionsData, isLoading: isLoadingDetails, error: errorDetails } = useReadContracts({
        contracts: contracts as any,
        // Only run this hook if the first hook has successfully fetched addresses
        query: {
            enabled: Array.isArray(electionAddresses) && electionAddresses.length > 0,
        },
    });

    const { data: blockNumber } = useBlockNumber({ watch: true })

    useEffect(() => {
        refetch()
    }, [blockNumber, refetch])

    const formattedData = useMemo(() => {
        if (!electionsData || !electionAddresses) return [];

        const data: ElectionRow[] = [];

        for (let i = 0; i < electionsData.length; i += 3) {
            const electionAddress = (electionAddresses as `0x${string}`[])[i / 3] as `0x${string}`;

            // Get the results for this one election
            const electionInfo = electionsData[i]?.result;
            const totalVotes = electionsData[i + 1]?.result;
            const candidates = electionsData[i + 2]?.result;

            if (electionInfo) {
                data.push({
                    id: electionAddress,
                    title: (electionInfo as any)[0]?.toString(),
                    startTime: new Date(Number((electionInfo as any)[1]) * 1000),
                    endTime: new Date(Number((electionInfo as any)[2]) * 1000),
                    status: formatElectionStatus((electionInfo as any)[3]),
                    totalVotes: totalVotes?.toString() ?? '0',
                    candidates: (candidates as any[])?.map(c => c.toString()) || [],
                    candidateCount: (candidates as any[])?.length ?? 0,
                });
            }
        }
        return data;
    }, [electionsData, electionAddresses]);

    return {
        data: formattedData,
        isLoading: isLoadingList || isLoadingDetails,
        error: errorList || errorDetails,
    };
}