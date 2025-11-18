'use client'

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
import { useVotersData } from "./useVotersData";

import { FormVoterAdd } from "@/components/FormVoterAdd";

export default function Voter() {
    const { data, isLoading, error } = useVotersData();

    return (
        <div>
            <div className="bg-[#52A5D8] w-full h-48">
                <div className="mr-40 ml-40 pt-8">
                    <h2 className="text-white text-xl font-semibold mb-4">Voters Overview</h2>
                    <Card className="w-1/3 gap-2 h-auto">
                        <CardHeader>
                            <CardTitle>Register New Voter</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FormVoterAdd></FormVoterAdd>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="mr-40 ml-40 mt-40">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Address</TableHead>
                            <TableHead>Elligibility</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* {isLoading && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center bg-gray-100 dark:bg-gray-800" >
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
                        {data && data.length > 0 ? (data.map((voter) => (
                            <TableRow key={voter.address}>
                                <TableCell>{`${voter.address?.slice(0, 6)}...${voter.address?.slice(-4)}`}</TableCell>
                                <TableCell>
                                   {voter.isEligible ? "Yes" : "No"}
                                </TableCell>
                            </TableRow>
                        ))) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center bg-gray-100 dark:bg-neutral-900">
                                    No voters registered
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