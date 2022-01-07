// import algosdk from 'algosdk';
var express = require('express') //llamamos a Express
var app = express()  
var algosdk = require('algosdk')
// var encodeObj = require('algosdk')
// import algosdk, { encodeObj } from 'algosdk';



const cors=require("cors");
const { decodeSignedTransaction, decodeObj } = require('algosdk');
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

const test = async() => {
    try {
        const algodToken = '';
        const algodServer = "https://api.testnet.algoexplorer.io";
        const algodPort = '';
        algodClient = new algosdk.Algodv2(algodToken, algodServer,algodPort);
        const receiver = "HZ57J3K46JIJXILONBBZOHX6BKPXEM2VVXNRFSUED6DKFD5ZD24PMJ3MVA";
        let accountInfo = await algodClient.accountInformation(receiver).do();
        
        // console.log("Account balance: %d microAlgos", accountInfo.amount);
    } catch (err) {
      console.error(err);
    }
  }

  

  const callTx = async(signedTxn) => {
    try {
     
        const signed = decodeObj(new Uint8Array(Buffer.from(signedTxn, "base64")));
         await algodClient.sendRawTransaction(signed.blob).do();
    } catch (err) {
      console.error(err);
    }
  }

    // compile stateless delegate contract
    async function compileProgram(client, programSource) {
      let encoder = new TextEncoder();
      let programBytes = encoder.encode(programSource);
      let compileResponse = await client.compile(programBytes).do();
      return compileResponse;
  }


  const oracleTx = async() => {
    try {


let oracleTemplate = `#pragma version 5
txn TypeEnum
int pay
==
global GroupSize
int 4
==
&&
txn Receiver
addr YEUJW5EPVUDGXYG67LWCL376GMHYKORJECSB2JAW5WY4ESL3CEHPRSEWX4
==
&&
txn CloseRemainderTo
global ZeroAddress
==
&&
txn RekeyTo
global ZeroAddress
==
&&
txn Fee
int 1000
<=
&&
txn Note
btoi
int <exchange_rate>
==
&&
txn LastValid
int <lastvalid>
<=
&&
return
`;
        const algodToken = '';
        const algodServer = "https://api.testnet.algoexplorer.io";
        const algodPort = '';
        algodClient = new algosdk.Algodv2(algodToken, algodServer,algodPort);

        const status = (await algodClient.status().do());
        if (status === undefined) {
            throw new Error("Unable to get node status");
        }
        // obtengo last round + 10
        // console.log('lastRound: '+status["last-round"])  
        lastvalid = status["last-round"] + 10

        // armo el logicsig del oracle

        tipocambio = "25000"
        oracleTemplate = oracleTemplate.replace("<exchange_rate>", parseInt(tipocambio));    
        let program = oracleTemplate.replace("<lastvalid>", lastvalid); 
        // console.log(program)
        compilation = await compileProgram(algodClient, program);
        //generate unique filename
        // let uintAr = _base64ToArrayBuffer(compilation.result);
        // console.log(compilation.result)
        oracleProgramReferenceProgramBytesReplace = Buffer.from(compilation.result, "base64");
        // console.log(oracleProgramReferenceProgramBytesReplace)
        program_array = new Uint8Array (oracleProgramReferenceProgramBytesReplace);
        args = null;
        // let lsig = algosdk.makeLogicSig(program_array, args);
        oracle_lsig = new algosdk.LogicSigAccount(program_array, args);
        // console.log('Oracle_logicsic_account: '+oracle_lsig.address())

        let oracle_sk = algosdk.mnemonicToSecretKey("popular sauce pride off fluid you come coffee display list stadium blood scout bargain segment laptop hand employ demise grass sign adult want abstract exhibit")
        // console.log("CT Oracle signed Address:" +oracle_sk.addr.toString())
        console.log("Tipo de cambio que envia Oracle: "+tipocambio)
        // console.log(oracle_lsig)
        oracle_lsig.sign(oracle_sk.sk);
        // console.log(oracle_lsig)
        // console.log('oracle_sk.sk')
        // console.log(oracle_sk)
        // console.log(oracle_sk.sk)
        // console.log('Oracle_logicsic_account: '+oracle_lsig.address())
        // pepe = oracle_lsig.get_obj_for_encoding()
        // console.log(pepe)
        // const aux = Buffer.from(algosdk.encodeObj(oracle_lsig)).toString("base64");
        const encoded1 = Buffer.from(algosdk.encodeObj(oracle_lsig)).toString("base64");

        // encoded1 = algosdk.encodeObj(aux)
        // console.log(encoded1)


        // return encoded1;
        return {'signedOracle': encoded1, 'tipocambio': tipocambio}
        // + encoded1
        // const signed = decodeObj(new Uint8Array(Buffer.from(signedTxn, "base64")));
        //  await algodClient.sendRawTransaction(signed.blob).do();
    } catch (err) {
      console.error(err);
    }
  }

  const startListen = async() => {

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions))
// var bodyParser = require('body-parser')
// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json())

var port = process.env.PORT || 8080  // establecemos nuestro puerto

app.get('/', function(req, res) {
  res.json({ mensaje: '¡Hola Mundo!' })   
})

app.get('/cervezas', function(req, res) {
  res.json({ mensaje: '¡A beber cerveza!' })  
})

app.post('/', async function(req, res) {
//   res.json({ mensaje: 'Método post' })  
console.log('llego llamado!' )

  callTx(req.body.param1)
  res.json({mensaje: req.body.param1})  
})

app.post('/oracle', async function(req, res) {
  //   res.json({ mensaje: 'Método post' })  
  console.log('llama oracle!' )
  
    envioSignedTx = await oracleTx()
    // res.json({signedOracle: envioSignedTx})  
    res.json(envioSignedTx)
  })

app.delete('/', function(req, res) {
  res.json({ mensaje: 'Método delete' })  
})

// iniciamos nuestro servidor
app.listen(port)
console.log('CT Oracle escuchando en el puerto ' + port)

}

startListen()
test()


