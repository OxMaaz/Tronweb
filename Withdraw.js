const { x,y} =require('./Alice.js');
const EllipticCurve = require('elliptic').ec;
const ec = new EllipticCurve('secp256k1');
const keccak256 = require('keccak256');
const {skey} =require('./Bob.js');
const tronWeb = require('tronweb');



const eph = ec.keyFromPublic(`04${x.slice(1)}${y.slice(1)}`, 'hex');
// console.log('eph',eph)

const ss = skey.derive(eph.getPublic());
const hashed = ec.keyFromPrivate(keccak256(ss.toArray()));

const _key = skey.getPrivate().add(hashed.getPrivate());
const key = _key.mod(ec.curve.n);
console.log('Private key to open wallet',key.toString(16, 32))







//wallet address made from private key
const hashed2 = ec.keyFromPrivate(keccak256(ss.toArray()));
const pub = skey
  .getPublic()
  .add(hashed2.getPublic())
  .encode('array', false);

const _addr = keccak256(pub.splice(1));
const wallet2=Buffer.from(_addr).toString('hex')
console.log(tronWeb.address.fromPrivateKey(key.toString(16,32)))



//https://github.com/vden/hazed/blob/master/frontend/src/components/withdraw.tsx