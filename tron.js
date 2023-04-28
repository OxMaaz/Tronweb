const TronWeb = require('tronweb');
const tronWeb = new TronWeb({
  fullHost: 'https://api.trongrid.io',
  solidityNode: 'https://api.trongrid.io'
});


async function tron(){
    const newAccount = await tronWeb.createAccount();
    console.log(newAccount);
}

tron()