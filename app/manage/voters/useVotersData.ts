'use client';

import { useEffect, useMemo } from 'react';
import { useBlockNumber, useReadContract, useReadContracts } from 'wagmi';
import { VOTER_REGISTRY_ADDRESS, VOTER_REGISTRY_ABI } from '@/contracts/config';

export type VoterRow = {
    address: string;
    isEligible: boolean;
}

export function useVotersData() {
    const { data: voters, isLoading: isLoadingList, error: errorList, refetch } = useReadContract({
        address: VOTER_REGISTRY_ADDRESS as `0x${string}`,
        abi: VOTER_REGISTRY_ABI,
        functionName: 'getVoterList',
    });

    const contracts = useMemo(() => {
        if (!voters) return [];
        return (voters as string[]).flatMap(voterAddress => [
            { address: VOTER_REGISTRY_ADDRESS, abi: VOTER_REGISTRY_ABI, functionName: 'isVoterEligible', args: [voterAddress] },
        ]);
    }, [voters]);

    const { data: votersData, isLoading: isLoadingDetails, error: errorDetails } = useReadContracts({
        contracts: contracts as any,
        query: {
            enabled: Array.isArray(voters) && voters.length > 0,
        },
    });

    const { data: blockNumber } = useBlockNumber({ watch: true })

    useEffect(() => {
        refetch()
    }, [blockNumber, refetch])

    const formattedData = useMemo(() => {
        if (!votersData) return [];

        const data: VoterRow[] = [];
        const voterList = voters as string[];

        for (let i = 0; i < votersData.length; i++) {
            const voterAddress = voterList[i];

            data.push({
                address: voterAddress,
                isEligible: votersData[i] as unknown as boolean,
            });
        }
        return data;
    }, [votersData, voters]);

    return {
        data: formattedData,
        isLoading: isLoadingList || isLoadingDetails,
        error: errorList || errorDetails,
    };  
}