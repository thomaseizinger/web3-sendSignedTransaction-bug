# Bug report `sendSignedTransaction`

## To reproduce

```bash
yarn run jest
```

The test will timeout because it cannot fetch the transaction receipt.

## To fix

Fix the version of `web3` to `beta-48`:

```
"web3": "=1.0.0-beta48"
```

Re-install packages:

```bash
yarn
```

Run the tests again:

```bash
yarn run jest
```

The tests now pass.
