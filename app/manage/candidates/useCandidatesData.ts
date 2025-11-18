'use client';

import { useEffect, useMemo } from 'react';
import { useBlockNumber, useReadContract, useReadContracts } from 'wagmi';
import { CANDIDATE_REGISTRY_ADDRESS, CANDIDATE_REGISTRY_ABI } from '@/contracts/config';

export type CandidateRow = {
    id: number;
    name: string;
    photoURL: string;
    partyURL: string;
}

export function useCandidatesData() {
    const { data: candidates, isLoading: isLoadingList, error: errorList, refetch } = useReadContract({
        address: CANDIDATE_REGISTRY_ADDRESS as `0x${string}`,
        abi: CANDIDATE_REGISTRY_ABI,
        functionName: 'getCandidateList',
    });

    const contracts = useMemo(() => {
        if (!candidates) return [];
        return (candidates as CandidateRow[]).flatMap(candidateID => [
            { address: CANDIDATE_REGISTRY_ADDRESS, abi: CANDIDATE_REGISTRY_ABI, functionName: 'getCandidate', args: [candidateID] },
        ]);
    }, [candidates]);

    const { data: candidatesData, isLoading: isLoadingDetails, error: errorDetails } = useReadContracts({
        contracts: contracts as any,
        query: {
            enabled: Array.isArray(candidates) && candidates.length > 0,
        },
    });

    const { data: blockNumber } = useBlockNumber({ watch: true })

    useEffect(() => {
        refetch()
    }, [blockNumber, refetch])

    //  4. Format the raw data into the clean array needed for the table
    const formattedData = useMemo(() => {
        if (!candidatesData) return [];

        const data: CandidateRow[] = [];
        console.log("Raw candidates data:", candidatesData);
        for (let i = 0; i < candidatesData.length; i++) {
            const candidateID = (candidates as number[])[i];

            const entry = candidatesData[i] as { result?: { name?: string; photoURL?: string; partyURL?: string } } | undefined;
            const result = entry?.result ?? { name: '', photoURL: '', partyURL: '' };

            data.push({
                id: candidateID,
                name: result.name ?? '',
                photoURL: result.photoURL ?? '',
                partyURL: result.partyURL ?? '',
            });
        }
        return data;
    }, [candidatesData, candidates]);

    return {
        data: formattedData,
        isLoading: isLoadingList || isLoadingDetails,
        error: errorList || errorDetails,
    };
}
