import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

const walletsTemp = ['CyvSnFw4SiceFDm9xgKBTM8Q2PcAknadQktrUZDTZfev', 'kUWhjvgBgQZPLLiZoBheAwzJTaoPF5wZXDr4ExwaqgJ', '8GVPkjPVK3TpnwvYJJk5t2D911qPr3RE7Wykam2SjMwD', 'BHzUekk627CpyWqUWm5VrCmBcmmow6DU1vvBepMxxcDN', 'KingqCdB2BA1tG8dixJq2PyXk8W7W4cQkTrYcWfPT19', 'BURNAavVkWUnQG17BGKjyGiJLrSAyAcq15ZJU27VofmU']
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
