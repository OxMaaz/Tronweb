const EllipticCurve = require('elliptic').ec;
const ec = new EllipticCurve('secp256k1');
const keccak256 = require('keccak256');
const base58 = require('bs58');
const TronWeb = require('tronweb');
const tronWeb = new TronWeb({
    fullHost: 'https://api.trongrid.io',
    solidityNode: 'https://api.trongrid.io'
});

const ephKey = ec.genKeyPair();
const ephPublic = ephKey.getPublic();

const StealthmetaAddress = 'TMfpC8REbeR6NhYXACKLsQoiYbxiFvi5DES3F9cwQF2iKfif'
const _StealthmetaAddress = StealthmetaAddress.slice(1)
let decodedID = base58.decode(_StealthmetaAddress);
const meta = decodedID.subarray(0, 33);
const metaAddress = ec.keyFromPublic(meta, 'hex');


const AliceSharedsecret = ephKey.derive(metaAddress.getPublic());
const AliceHashedsecret = ec.keyFromPrivate(keccak256(AliceSharedsecret.toArray()));
const sharedSecret = 'T' + AliceSharedsecret.toArray()[0].toString(16).padStart(2, '0')
console.log(sharedSecret)
const publicKey = metaAddress.getPublic().add(AliceHashedsecret.getPublic()).encode('array', false);
const address = keccak256(publicKey.splice(1));
const StealthAddress = Buffer.from(address).toString('hex');
const _HexString = StealthAddress.substring(StealthAddress.length - 40, StealthAddress.length)
const _Hex = '41' + _HexString
// console.log(tronWeb.address.fromHex(_Hex))






const array = ['Te7048d3a9c7db3a7ccceed8ffb784b85170f9fac1366dd97229e863706af0757bd055fdd376cbac5cf818a534cbaabf5932f10b06d0f8aef0cf8a2aa2077c9e372cc',
    'T9004538e30f4adc25d54b495cd7aa6d8bf94588c6b1b8d9d71575bcf483579324286f73e0367f3e67b9f85f721c65053cc1e0fc78f16b61aaba390de1e8904eaae6e']
const x = ephPublic.getX().toString(16, 64)
const y = ephPublic.getY().toString(16, 64)
const z = `${sharedSecret}04${x}${y}`
array.push(z)
console.log(array[0].slice(0,3))

module.exports = {
    array
}