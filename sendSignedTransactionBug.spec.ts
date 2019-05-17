import { GenericContainer } from "testcontainers";
import Web3 from "web3";
import {privateToAddress} from "ethereumjs-util"
import EthereumTx from "ethereumjs-tx"

const privateKey = Buffer.from(
    "1759af2005454dfc596d8e0d09469f5997069e8e6b24a82defa0dae4a387e5f7",
    "hex"
);

describe("sendSignedTransaction", () => {

    test("should return receipt of locally signed transaction", async () => {

        const container = await new GenericContainer("parity/parity", "v2.5.1")
            .withCmd([
                "--config=dev",
                "--jsonrpc-apis=all",
                "--unsafe-expose",
                "--tracing=on",
                "--logging=debug,ethcore-miner=trace,miner=trace,rpc=trace,tokio_core=warn,tokio_reactor=warn",
                "--jsonrpc-cors='all'"
            ])
            .withExposedPorts(8545)
            .start();

        const web3 = new Web3(
            new Web3.providers.HttpProvider(
                `http://localhost:${container.getMappedPort(8545)}`
            )
        );

        // move some money to our address
        await web3.eth.personal.sendTransaction(
            {
                from: "0x00a329c0648769a73afac7f9381e08fb43dbea72",
                to: privateToAddress(privateKey).toString("hex"),
                value: "0x10000000000000"
            },
            ""
        );

        let tx = new EthereumTx({
            nonce: 0,
            gasPrice: 0,
            gasLimit: 100000,
            to: "0xcb777414c38e426c7038a7c4908751f5e864f7ad",
            value: "0x1000",
            chainId: 1
        });

        tx.sign(privateKey);
        let receipt = await web3.eth.sendSignedTransaction("0x" + tx.serialize().toString("hex"));

        expect(receipt).toBeDefined();
    }, 20000)

})