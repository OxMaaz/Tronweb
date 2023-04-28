const tronWeb = window.tronWeb;

// create a new instance of the contract you want to interact with
const contract = await tronWeb.contract(abi, contractAddress);

// create a transaction object with the necessary details
const transaction = await contract.transfer(toAddress, amount).send();

// sign the transaction using TronLink
try {
  const signedTransaction = await tronWeb.trx.sign(transaction);
} catch (error) {
  console.error('Failed to sign transaction:', error);
  return;
}

// send the signed transaction to the network
try {
  const result = await tronWeb.trx.sendRawTransaction(signedTransaction);
  console.log('Transaction successful with ID:', result);
} catch (error) {
  console.error('Failed to send transaction:', error);
  return;
}
