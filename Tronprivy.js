const EllipticCurve = require('elliptic').ec;
const ec = new EllipticCurve('secp256k1');
const { calculateCrc32 } =require( './Functions.js');
const keccak256 = require('keccak256');
const base58 = require('bs58');
const TronWeb = require('tronweb');
const tronWeb = new TronWeb({
  fullHost: 'https://api.trongrid.io',
  solidityNode: 'https://api.trongrid.io'
});




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
// console.log(StealthmetaAddress);




//Alice generating stealth address from her eph private key and bobs meta address

const ephKey = ec.genKeyPair();
const ephPublic = ephKey.getPublic();
const _StealthmetaAddress =StealthmetaAddress.slice(1)
let decodedID =  base58.decode(_StealthmetaAddress);
const meta = decodedID.subarray(0, 33);
const metaAddress = ec.keyFromPublic(meta, 'hex');



const AliceSharedsecret = ephKey.derive(metaAddress.getPublic());
const AliceHashedsecret = ec.keyFromPrivate(keccak256(AliceSharedsecret.toArray()));
const sharedSecret='T' + AliceSharedsecret.toArray()[0].toString(16).padStart(2, '0')
console.log(sharedSecret)
const publicKey = metaAddress.getPublic().add(AliceHashedsecret.getPublic()).encode('array', false);
const address = keccak256(publicKey.splice(1));
const StealthAddress=Buffer.from(address).toString('hex');
const _HexString= StealthAddress.substring(StealthAddress.length - 40, StealthAddress.length)
const _Hex='41'+_HexString
// console.log(tronWeb.address.fromHex(_Hex))





const x=ephPublic.getX().toString(16, 64)
const y=ephPublic.getY().toString(16, 64)
const z=`${sharedSecret}04${x}${y}`
console.log('z',z)
console.log('first three numbers',z.slice(0,3))
console.log('Z after slicing sharedsecret',z.slice(3))
const ephPublicKey = ec.keyFromPublic(z.slice(3), 'hex');


//Bobs computing private key for stealth address

const BobSharedsecret = spendingkey.derive(ephPublicKey.getPublic()); // 
const BobHashedsecret = ec.keyFromPrivate(keccak256(BobSharedsecret.toArray()));
const _sharedSecret='T' + BobSharedsecret.toArray()[0].toString(16).padStart(2, '0')
console.log(_sharedSecret)
console.log(_sharedSecret.toString().toLocaleLowerCase===z.slice(3).toString().toLocaleLowerCase)
const _key = spendingkey.getPrivate().add(BobHashedsecret.getPrivate());
const privatekey = _key.mod(ec.curve.n);
console.log('Private key to open wallet',privatekey.toString(16, 32))

//Bobs generating the same stealth address from his private key and alice ephemeral public key




const _publickey = spendingkey.getPublic().add(BobHashedsecret.getPublic()).encode('array', false);
const _address = keccak256(_publickey.splice(1));
const _StealthAddress=Buffer.from(_address).toString('hex');
const HexString= _StealthAddress.substring(_StealthAddress.length - 40, _StealthAddress.length)
const Hex='41'+HexString
console.log(tronWeb.address.fromHex(Hex))
