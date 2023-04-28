const EllipticCurve = require('elliptic').ec;
const ec = new EllipticCurve('secp256k1');
const ether=require('ethers')
const keccak256 = require('keccak256');
const base58 = require('bs58');
const {metaAddress} = require('./Bob.js')
const tronWeb = require('tronweb');


const metaA =metaAddress.slice(1)


let decodedID = new Uint8Array();
decodedID = base58.decode(metaA);
console.log('decodedID',decodedID)

const trueID = decodedID.subarray(0, 33);

const meta = ec.keyFromPublic(trueID, 'hex');


const ephKey = ec.genKeyPair();
const ephPublic = ephKey.getPublic();


const ss = ephKey.derive(meta.getPublic());

const hashed = ec.keyFromPrivate(keccak256(ss.toArray()));
const secret=hashed.getPrivate().toString(16)

const pub = meta
    .getPublic()
    .add(hashed.getPublic())
    .encode('array', true);

// console.log(pub)
const addr = keccak256(pub.splice(1));
// const wallet=Buffer.from(addr).toString('hex')
// console.log(wallet)
console.log((tronWeb.address.fromHex(addr)))











const x='T'+ ephPublic.getX().toString(16, 64)
const y='T'+ ephPublic.getY().toString(16, 64)

// console.log('secret',sharedSecret)

module.exports={
    x,y
}


