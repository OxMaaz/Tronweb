const EllipticCurve = require('elliptic').ec;
const ec = new EllipticCurve('secp256k1');
const { calculateCrc32 } =require( '../Functions.js');
const base58 = require('bs58');



let key = ec.genKeyPair();

const storedspendingkey=key.getPrivate().toString(16)
const spendingkey = ec.keyFromPrivate(storedspendingkey, 'hex');


const data = Uint8Array.from(
  spendingkey.getPublic().encodeCompressed('array')
);

const crc = calculateCrc32(data);
const addr = new Uint8Array(data.length + 2);
addr.set(data);
addr.set(crc, data.length);
const StealthmetaAddress='T'+  base58.encode(addr)
console.log(StealthmetaAddress)


module.exports = {
    spendingkey
}