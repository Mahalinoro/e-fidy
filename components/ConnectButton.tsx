'use client'

import Image from 'next/image'
import { useAccount, useConnect, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'

export function ConnectButton() {
  const { address, isConnected } = useAccount()
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! })

  if (isConnected) {
    return (
      <div>
        {ensAvatar && <Image alt="ENS Avatar" src={ensAvatar} width={40} height={40} unoptimized />}
        {address && <div>{ensName ? `${ensName} (${address})` : address}</div>}
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    );
  }

  return (
    <div>
      {connectors
        .filter((connector) => connector.name === "Injected")
        .map((connector) => (
          <button key={connector.uid} onClick={() => connect({ connector })}>
            Connect Wallet
          </button>
        ))}
    </div>
  );
}