export const walletNetworks = {
  polygon: {
    chainId: "0x89",
    chainName: "Polygon",
    rpcUrls: ["https://polygon-rpc.com"],
    blockExplorerUrls: ["https://polygonscan.com/"],
    nativeCurrency: {
      symbol: "MATIC",
      decimals: 18,
    },
  },
  sepolia: {
    chainId: "0xaa36a7",
    chainName: "Ethereum Sepolia Testnet",
    rpcUrls: ["https://eth-sepolia.public.blastapi.io/"],
    blockExplorerUrls: ["https://sepolia.etherscan.io/"],
    nativeCurrency: {
      name: "SepoliaETH",
      symbol: "SepoliaETH",
      decimals: 18,
    },
  },
};
