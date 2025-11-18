'use client'

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
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
import { type BaseError } from 'wagmi';
import { FormCandidateAdd } from "@/components/FormCandidateAdd"
import { useCandidatesData } from "./useCandidatesData";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@/components/ui/avatar";

export default function CandidatesPage() {
    const { data, isLoading, error } = useCandidatesData();
    // it seems the data is not being fetched as new candidates are added
    
    return (
        <div>
            <div className="bg-[#52A5D8] w-full h-48">
                <div className="mr-40 ml-40 pt-8">
                    <h2 className="text-white text-xl font-semibold mb-4">Candidate Overview</h2>
                    <Card className="w-1/3 gap-2 h-auto">
                        <CardHeader>
                            <CardTitle>Register New Candidate</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FormCandidateAdd />
                        </CardContent>
                    </Card>
                </div>
            </div>

             <div className="mr-40 ml-40 mt-80">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Photo</TableHead>
                            <TableHead>Party</TableHead>
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

                        {data && data.length > 0 ? (data.map((candidate) => (
                            <TableRow key={candidate.id}>
                                <TableCell>{`${candidate.id?.toString().slice(0, 6)}...${candidate.id?.toString().slice(-4)}`}</TableCell>
                                <TableCell>{candidate.name}</TableCell>
                                <TableCell>
                                    <Avatar>
                                       <AvatarImage src={candidate.photoURL} alt={candidate.name} />
                                    </Avatar>                            
                                </TableCell>
                                <TableCell>
                                    <Button variant="outline" >
                                        <Link href={candidate.partyURL} target="_blank" rel="noopener noreferrer">View Party</Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center bg-gray-100 dark:bg-neutral-900">
                                    No candidates registered
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>

                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={6}></TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </div>
    )
}