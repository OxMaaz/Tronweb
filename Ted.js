
const { calculateCrc32 } = require('./Functions.js');
const EllipticCurve = require('elliptic').ec;
const ec = new EllipticCurve('secp256k1');
const keccak256 = require('keccak256');
const base58 = require('bs58');
const TronWeb = require('tronweb');
const tronWeb = new TronWeb({
  fullHost: 'https://api.trongrid.io',
  solidityNode: 'https://api.trongrid.io'
});


let key = ec.genKeyPair();

const storedspendingkey = key.getPrivate().toString(16)
const spendingkey = ec.keyFromPrivate(storedspendingkey, 'hex');


const data = Uint8Array.from(
  spendingkey.getPublic().encodeCompressed('array')
);

const crc = calculateCrc32(data);
const addr = new Uint8Array(data.length + 2);
addr.set(data);
addr.set(crc, data.length);
const StealthmetaAddress = 'T' + base58.encode(addr)
// console.log('meta', StealthmetaAddress)



const ephKey = ec.genKeyPair();
const ephPublic = ephKey.getPublic();


const _StealthmetaAddress = StealthmetaAddress.slice(1)
let decodedID = base58.decode(_StealthmetaAddress);
const meta = decodedID.subarray(0, 33);
const metaAddress = ec.keyFromPublic(meta, 'hex');


const AliceSharedsecret = ephKey.derive(metaAddress.getPublic());
const AliceHashedsecret = ec.keyFromPrivate(keccak256(AliceSharedsecret.toArray()));
const sharedSecret = '0x' + AliceSharedsecret.toArray()[0].toString(16).padStart(2, '0')
// console.log('secret', sharedSecret)
const publicKey = metaAddress.getPublic().add(AliceHashedsecret.getPublic()).encode('array', false);
const address = keccak256(publicKey.splice(1));
const StealthAddress = Buffer.from(address).toString('hex');
const _HexString = StealthAddress.substring(StealthAddress.length - 40, StealthAddress.length)
const _Hex = '41' + _HexString
// console.log(tronWeb.address.fromHex(_Hex))






const array = ['0xTe7048d3a9c7db3a7ccceed8ffb784b85170f9fac1366dd97229e863706af0757bd055fdd376cbac5cf818a534cbaabf5932f10b06d0f8aef0cf8a2aa2077c9e372cc', '0xT9004538e30f4adc25d54b495cd7aa6d8bf94588c6b1b8d9d71575bcf483579324286f73e0367f3e67b9f85f721c65053cc1e0fc78f16b61aaba390de1e8904eaae6e']
r = '0x'+ ephPublic.getX().toString(16, 64)
s = '0x'+ ephPublic.getY().toString(16, 64)
const rs=`04${r.slice(2)}${s.slice(2)}`
const z = `T${sharedSecret.replace('0x', '')}04${r.slice(2)}${s.slice(2)}`
array.push(z)
console.log(r,s ,sharedSecret)
// console.log(z.slice(1,3))
// console.log(sharedSecret.slice(2,4))
// console.log(z.slice(3))
// console.log(rs)
// console.log(rs===z.slice(3))




function check() {

  var ephPublicKey;
  var BobSharedsecret;
  var BobHashedsecret;
  var _sharedSecret;
  array.forEach((z) => {
    const ok=z.slice(3)
    ephPublicKey = ec.keyFromPublic(ok, 'hex');
    BobSharedsecret = spendingkey.derive(ephPublicKey.getPublic()); // 
    BobHashedsecret = ec.keyFromPrivate(keccak256(BobSharedsecret.toArray()));
    _sharedSecret = '0x' + BobSharedsecret.toArray()[0].toString(16).padStart(2, '0')
    // console.log(_sharedSecret)

    if (_sharedSecret.toString().slice(2, 4) === z.slice(1, 3).toString()) {
      console.log(_sharedSecret.toString())
      console.log(z.slice(0, 3).toString())
      const _key = spendingkey.getPrivate().add(BobHashedsecret.getPrivate());
      const privatekey = _key.mod(ec.curve.n);
      console.log('Private key to open wallet', privatekey.toString(16, 32))
    }

    return



    //  0xT6a
  })



  const _publickey = spendingkey.getPublic().add(BobHashedsecret.getPublic()).encode('array', false);
  const _address = keccak256(_publickey.splice(1));
  const _StealthAddress = Buffer.from(_address).toString('hex');
  const HexString = _StealthAddress.substring(_StealthAddress.length - 40, _StealthAddress.length)
  const Hex = '41' + HexString
  // console.log(tronWeb.address.fromHex(Hex))






}

check()


// Bobs generating the same stealth address from his private key and alice ephemeral public key



