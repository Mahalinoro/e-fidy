'use client'

import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useAccount, useConnect, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import { Button } from "@/components/ui/button"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Toaster } from 'sonner'
import { LogOut, Wallet } from 'lucide-react'
import Link from 'next/link'

export default function ManageLayout({ children, }: { children: React.ReactNode }) {
    const { address, isConnected } = useAccount()
    const { connectors, connect } = useConnect()
    const { disconnect } = useDisconnect()
    const { data: ensName } = useEnsName({ address })
    const { data: ensAvatar } = useEnsAvatar({ name: ensName! })

    // Find the injected (MetaMask, Rabby, etc.) connector
    const injectedConnector = connectors.find(
        (c) => c.name === "Injected" || c.name === "MetaMask"
    );

    return (
        <div className="bg-white dark:bg-black min-h-screen">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                <Link href="/manage">Manage</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                <Link href="/manage/elections">Elections</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                <Link href="/manage/voters">Voters</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                <Link href="/manage/candidates">Candidates</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                <div className="flex items-center gap-4">
                    {isConnected ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="flex items-center gap-2">
                                    {ensAvatar ? (
                                        <Avatar>
                                            <AvatarImage src={ensAvatar} />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    ) : (
                                        <Avatar>
                                            <AvatarImage src="https://github.com/shadcn.png" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    )}
                                    <span className="text-sm font-medium">
                                        {ensName ? ensName : `${address?.slice(0, 4)}...${address?.slice(-4)}`}
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() => disconnect()}
                                    className="text-red-500 focus:text-red-500" // Make it red for danger
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Disconnect
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    ) : (
                        <Button
                            variant="outline"
                            disabled={!injectedConnector}
                            onClick={() => injectedConnector && connect({ connector: injectedConnector })}
                        >
                            <Wallet className="mr-2 h-4 w-4" />
                            Connect Wallet
                        </Button>
                    )}
                    <ThemeSwitcher />
                </div>
            </div>
            <div>
                {children}
                <Toaster position="top-center" richColors/>
            </div>
        </div>
    )
}