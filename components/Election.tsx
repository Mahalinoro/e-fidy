'use client';

import { type BaseError, useReadContracts } from 'wagmi';
import { ELECTION_ABI } from '../contracts/config';
import { CandidateInfo } from './CandidateInfo';
import { CastVote } from './CastVote';
import { GetVoteTally } from './GetVoteTally';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from 'lucide-react';

// (Your formatElectionStatus function is perfect, keep it)
function formatElectionStatus(status: number | bigint) {
    switch (status?.toString()) {
        case '0': return 'Pending';
        case '1': return 'Active';
        case '2': return 'Closed';
        default: return 'Unknown';
    }
}

export function Election({ electionAddress }: { electionAddress: `0x${string}` }) {
    const {
        data,
        error,
        isPending,
    } = useReadContracts({
        contracts: [
            {
                address: electionAddress,
                abi: ELECTION_ABI,
                functionName: 'getElectionInfo',
            }, {
                address: electionAddress,
                abi: ELECTION_ABI,
                functionName: 'getTotalVotesCast',
            }, {
                address: electionAddress,
                abi: ELECTION_ABI,
                functionName: 'getParticipatingCandidates',
            }
        ]
    });

    if (isPending) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-1/4" />
                    <Separator />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    {(error as BaseError).shortMessage || error.message}
                </AlertDescription>
            </Alert>
        );
    }

    if (!data) return null;

    const [electionInfo, totalVotesCast, participatingCandidates] = data || []

    const info = electionInfo?.result;
    const votes = totalVotesCast?.result;
    const candidates = participatingCandidates?.result;

    if (!info || !Array.isArray(info)) return null;
    const infoArr = info as (string | number | bigint)[];
    const status = formatElectionStatus(infoArr[3] as number | bigint);
    const showVoteButtons = (status === 'Active');

    const getBadgeVariant = (s: string) => {
        if (s === 'Active') return 'default';
        if (s === 'Pending') return 'secondary';
        if (s === 'Closed') return 'destructive';
        return 'outline';
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-2xl">{info[0]?.toString()}</CardTitle>
                        <CardDescription>
                            {`Starts: ${new Date(Number(info[1]) * 1000).toLocaleString()} | Ends: ${new Date(Number(info[2]) * 1000).toLocaleString()}`}
                        </CardDescription>
                    </div>
                    <Badge variant={getBadgeVariant(status)} className="ml-4">
                        {status}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent>
                <div className="mb-4">
                    <h4 className="text-lg font-semibold">Overview</h4>
                    <p className="text-sm text-muted-foreground">
                        Total Votes Cast: <span className="font-bold text-primary">{votes?.toString() || '0'}</span>
                    </p>
                </div>

                <Separator className="my-4" />

                <div>
                    <h4 className="text-lg font-semibold mb-3">Candidates</h4>
                    {Array.isArray(candidates) && candidates.length > 0 ? (
                        <ul className="space-y-4">
                            {candidates.map((id) => (
                                
                                <li key={id.toString()} className="flex flex-col sm:flex-row justify-between sm:items-center p-4 border rounded-lg">
                                    <div className="flex-1 mb-4 sm:mb-0">
                                        <CandidateInfo candidateId={id} />
                                    </div>

                                    <div className="shrink-0">
                                        {showVoteButtons && (
                                            <CastVote electionAddress={electionAddress} candidateId={id} />
                                        )}
                                        <GetVoteTally electionAddress={electionAddress} candidateId={id} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-muted-foreground">No candidates have been added to this election yet.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}