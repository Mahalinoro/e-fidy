'use client'

import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import Image from "next/image";
import Link from 'next/link'
import { Wallet, LogOut, Vote } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAccount, useConnect, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'

export default function Home() {
  const { address, isConnected } = useAccount()
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! })
  const injectedConnector = connectors.find(
    (c) => c.name === "Injected"
  );

  return (
    <div className="bg-white dark:bg-black min-h-screen">
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>
      <div className="flex flex-col md:flex-row min-h-screen">
        <div className="md:w-1/2 flex items-center justify-center p-8">
          <div className="w-full h-full relative opacity-90">
            <Image
              src="/home-bg.jpg"
              alt="Login Background"
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        <div className="md:w-1/2 flex items-center justify-center">
          <div className="w-full max-w-md bg-white dark:bg-black p-8 ">
            <div className="my-9">
              <h1 className="text-center font-semibold text-xl">Tonga Soa !</h1>
            </div>

            <Link href="/manage">
              <Button variant="outline" disabled={!isConnected} className="w-full border-[#52A5D8] bg-[#52A5D8] text-white hover:border-sky-200 hover:bg-sky-200 hover:text-white dark:border-[#52A5D8] dark:bg-[#52A5D8] dark:text-white dark:hover:border-sky-400 dark:hover:bg-sky-400 dark:hover:text-white mx-auto flex items-center my-6">
                <Vote className="h-[1.2rem] w-[1.2rem] mr-2" />
                Hifidy
              </Button>
            </Link>

            {isConnected ? (
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
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
                  <div className="text-left text-sm">
                    <div className="font-medium text-black dark:text-white">
                      {ensName ? ensName : `${address?.slice(0, 6)}...${address?.slice(-4)}`}
                    </div>
                    {ensName && (
                      <div className="text-gray-500 dark:text-gray-400">
                        {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-red-500 bg-red-500 text-white hover:border-red-400 hover:bg-red-400 hover:text-white dark:border-red-500 dark:bg-red-500 dark:text-white dark:hover:border-red-600 dark:hover:bg-red-600 dark:hover:text-white mx-auto flex items-center"
                  onClick={() => disconnect()}
                >
                  <LogOut className="h-[1.2rem] w-[1.2rem] mr-2" />
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full border-gray-500 bg-gray-500 text-white hover:border-gray-400 hover:bg-gray-400 hover:text-white dark:border-gray-500 dark:bg-gray-500 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white mx-auto flex items-center"
                onClick={() => injectedConnector && connect({ connector: injectedConnector })}
                disabled={!injectedConnector}
              >
                <Wallet className="h-[1.2rem] w-[1.2rem] mr-2" />
                {injectedConnector ? "Connect Wallet" : "Wallet Not Found"}
              </Button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

