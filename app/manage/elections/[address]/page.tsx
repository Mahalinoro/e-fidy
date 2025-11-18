'use client'

import { AddCandidateToElection } from "@/components/AddCandidateToElection"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { useCandidatesData } from "@/app/manage/candidates/useCandidatesData"
import { Election } from "@/components/Election"
import { useParams } from "next/navigation"

export default function ElectionPage() {
    const { address } = useParams();
    const { data: allCandidates } = useCandidatesData();
    console.log(address);
    
    return (
        <div>
            <div className="bg-[#52A5D8] w-full h-48">
                <div className="mr-40 ml-40 pt-8">
                    <h2 className="text-white text-xl font-semibold mb-4">Election Detail</h2>
                    <Card className="w-1/4 gap-2 h-auto">
                        <CardHeader>
                            <CardTitle>Add Candidate</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AddCandidateToElection electionAddress={address as `0x${string}`} candidates={allCandidates || []} />
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div className="mr-40 ml-40 mt-20 mb-4 ">
                <Election electionAddress={address as `0x${string}`} />
            </div>
        </div>
    )
}