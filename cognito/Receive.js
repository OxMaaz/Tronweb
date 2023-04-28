const EllipticCurve = require('elliptic').ec;
const ec = new EllipticCurve('secp256k1');
const keccak256 = require('keccak256');
const TronWeb = require('tronweb');
const tronWeb = new TronWeb({
    fullHost: 'https://api.trongrid.io',
    solidityNode: 'https://api.trongrid.io'
});
const { array } = require('./Send.js')
const {spendingkey}=require('./Meta.js')




function check() {
    array.map((z) => {
        const ephPublicKey = ec.keyFromPublic(array[z.slice(3)], 'hex');
        const BobSharedsecret = spendingkey.derive(ephPublicKey.getPublic()); // 
        const BobHashedsecret = ec.keyFromPrivate(keccak256(BobSharedsecret.toArray()));
        const _sharedSecret = 'T' + BobSharedsecret.toArray()[0].toString(16).padStart(2, '0')
        if (_sharedSecret.toString().toLocaleLowerCase === array[z.slice(3).toString().toLocaleLowerCase] ){
            const _key = spendingkey.getPrivate().add(BobHashedsecret.getPrivate());
            const privatekey = _key.mod(ec.curve.n);
            console.log('Private key to open wallet', privatekey.toString(16, 32))

        }
        else {
            console.log('Not found')
        }
    })
}

check()


//Bobs generating the same stealth address from his private key and alice ephemeral public key




const _publickey = spendingkey.getPublic().add(BobHashedsecret.getPublic()).encode('array', false);
const _address = keccak256(_publickey.splice(1));
const _StealthAddress = Buffer.from(_address).toString('hex');
const HexString = _StealthAddress.substring(_StealthAddress.length - 40, _StealthAddress.length)
const Hex = '41' + HexString
console.log(tronWeb.address.fromHex(Hex))
