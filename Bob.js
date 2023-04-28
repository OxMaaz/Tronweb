const EllipticCurve = require('elliptic').ec;
const ec = new EllipticCurve('secp256k1');
const base58 = require('bs58');
const { calculateCrc32 } =require( './Functions.js');

let key = ec.genKeyPair();

const storedspendingkey=key.getPrivate().toString(16)
const skey = ec.keyFromPrivate(storedspendingkey, 'hex');

// console.log(skey)

const data = Uint8Array.from(
    skey.getPublic().encodeCompressed('array')
);
// console.log(data)

const crc = calculateCrc32(data);
console.log(crc)

const addr = new Uint8Array(data.length + 2);
addr.set(data);
console.log(addr)
addr.set(crc, data.length);

let Address=base58.encode(addr);  
const metaAddress='T'+ Address
console.log(metaAddress)



