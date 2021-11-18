// import algosdk from 'algosdk';
var express = require('express') //llamamos a Express
var app = express()  
var algosdk = require('algosdk')



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
        
        console.log("Account balance: %d microAlgos", accountInfo.amount);
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

app.del('/', function(req, res) {
  res.json({ mensaje: 'Método delete' })  
})

// iniciamos nuestro servidor
app.listen(port)
console.log('API escuchando en el puerto ' + port)

}

startListen()
test()


