import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

const walletsTemp = ['6s3qFETH7kfQupco4Df2owU8SUhmjz8c9HnKa9hRAzNo', 'MfDuWeqSHEqTFVYZ7LoexgAK9dxk7cy4DFJWjWMGVWa']
const tempRPC = [{
    url: 'https://mainnet.helius-rpc.com/?api-key=12d4921b-a6ee-4fa7-8179-59e9ba528f8d',
    wss: 'wss://mainnet.helius-rpc.com/?api-key=12d4921b-a6ee-4fa7-8179-59e9ba528f8d'
}]

interface WalletResult {
    wallet: string,
    balance: number
}
class WalletBalance {
    wallets: string[];
    connection: Connection | null;
    finalResult: WalletResult[] = [];
    constructor(wallets: string[]) {
        this.wallets = wallets;
        this.connection = null
    }

    private toPublicKey () {
        return this.wallets.map((w) => new PublicKey(w));
    }

    public mainConnection () {
        return this.connection = new Connection(tempRPC[0].url, {
            wsEndpoint: tempRPC[0].wss,
            commitment: 'processed'
        })
    }

    public async walletsBalance () {
        try {
            console.clear()
            this.finalResult = [];
            const result = await this.mainConnection().getMultipleAccountsInfo(
                [...this.toPublicKey()],
                {
                    commitment: 'processed'
                }
            )

            result.forEach((r, index) => {
                if (r) {
                    this.finalResult.push({
                        wallet: this.wallets[index],
                        balance: r.lamports / LAMPORTS_PER_SOL
                    })
                }
            })
            console.table(this.finalResult);
            return this.finalResult;
        } catch (error) {
            console.error('[Unable to get wallets balance]', error)
        }
    }

    public runEvery2s () {
        setInterval(this.walletsBalance, 2000);
    }

    public async runOnce () {
        return await this.walletsBalance()
    }
}

const checkBalances = async () => {
    const wb = new WalletBalance(walletsTemp);
    return await wb.runOnce()
}

export default checkBalances