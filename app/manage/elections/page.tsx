'use client'

import { FormElectionAdd } from "@/components/FormElectionAdd";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function ElectionsPage() {
    return (
        <div>
            <div className="bg-[#52A5D8] w-full h-48">
                <div className="mr-40 ml-40 pt-8">
                    <h2 className="text-white text-xl font-semibold mb-4">Elections</h2>
                    <Card className="w-1/3 gap-2 h-auto">
                        <CardHeader>
                            <CardTitle>Register New Election</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FormElectionAdd></FormElectionAdd>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}