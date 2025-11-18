'use client'

import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableFooter,
} from "@/components/ui/table"
import { Bookmark } from "lucide-react"
import { useElectionsData } from "./useElectionsData";
import { type BaseError } from 'wagmi';
import { StartElection } from "@/components/StartElection"
import { EndElection } from "@/components/EndElection"
import Link from "next/link";


export default function ManagePage() {
    const { data, isLoading, error } = useElectionsData();

    return (
        <div>
            <div className="bg-[#52A5D8] w-full h-48">
                <div className="mr-40 ml-40 pt-8">
                    <h2 className="text-white text-xl font-semibold mb-4">Overview</h2>
                    <Card className="w-1/6 gap-3">
                        <CardHeader>
                            <CardTitle>Elections</CardTitle>
                            <CardAction>
                                <Button size="icon-sm" variant="outline">
                                    <Bookmark />
                                </Button>
                            </CardAction>
                        </CardHeader>
                        <CardContent>
                            <h3 className="font-extrabold text-3xl">{data?.length || 0}</h3>
                        </CardContent>
                        <CardFooter>
                            <p><span className="font-extrabold">{data?.filter(e => e.status === 'Closed').length || 0}</span> completed</p>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            <div className="mr-40 ml-40 mt-16">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Total Votes</TableHead>
                            <TableHead>Candidates Count</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* {isLoading && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center bg-gray-100 dark:bg-gray-800">
                                    Loading elections...
                                </TableCell>
                            </TableRow>
                        )} */}
                        {error && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-red-500 bg-gray-100 dark:bg-gray-800">
                                    Error: {(error as BaseError).shortMessage || error.message}
                                </TableCell>
                            </TableRow>
                        )}

                        {data && data.length > 0 ? (data.map((election) => (
                            <TableRow key={election.id}>
                                <TableCell>{election.title}</TableCell>
                                <TableCell>{election.status}</TableCell>
                                <TableCell>{election.startTime.toLocaleDateString()} - {election.endTime.toLocaleDateString()}</TableCell>
                                <TableCell>{election.totalVotes}</TableCell>
                                <TableCell>{election.candidateCount || 0}</TableCell>
                                <TableCell className="w-2.5 space-x-2">
                                    <Button variant="outline" size="sm" className="text-[#52A5D8] hover:text-[#52A5D8]">
                                        <Link href={`/manage/elections/${election.id}`}>View Details</Link>
                                    </Button>
                                    {election.status === 'Pending' && (
                                        <StartElection electionAddress={election.id as `0x${string}`} />
                                    )}
                                    {election.status === 'Active' && (
                                        <EndElection electionAddress={election.id as `0x${string}`} />
                                    )}
                                </TableCell>
                            </TableRow>
                        ))) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center bg-gray-100 dark:bg-neutral-900">
                                    No elections avalailable
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>

                    <TableFooter>
                        <TableRow >
                            <TableCell colSpan={6} ></TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </div>
    )
}