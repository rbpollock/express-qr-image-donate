var qrImage = require("qr-image");
var express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const { default: WalletConnect } = require("@walletconnect/client");

const gnosisAddr = "0xf5A07f885B9C2BC30e3766F5727E05bCE8b2B549";

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create a connector
const connector = new WalletConnect({
  bridge: "https://bridge.walletconnect.org"
});

// Check if connection is already established
if (!connector.connected) {
  // create new session
  connector.createSession();
}

// Subscribe to connection events
connector.on("connect", (error, payload) => {
  if (error) {
    throw error;
  }

  // Get provided accounts and chainId
  const { accounts, chainId } = payload.params[0];
  console.log(accounts, chainId);
  sendTransaction(accounts, chainId);
});

function sendTransaction(accounts, chainId) {
  // Draft transaction
  const tx = {
    from: "0xbc28Ea04101F03aA7a94C1379bc3AB32E65e62d3", // Required
    to: "0x89D24A7b4cCB1b6fAA2625Fe562bDd9A23260359", // Required (for non contract deployments)
    data: "0x", // Required
    gasPrice: "0x02540be400", // Optional
    gas: "0x9c40", // Optional
    value: "0x00", // Optional
    nonce: "0x0114" // Optional
  };

  // Send transaction
  connector
    .sendTransaction(tx)
    .then((result) => {
      // Returns transaction id (hash)
      console.log(result);
    })
    .catch((error) => {
      // Error returned when rejected
      console.error(error);
    });
}

connector.on("session_update", (error, payload) => {
  if (error) {
    throw error;
  }

  // Get updated accounts and chainId
  const { accounts, chainId } = payload.params[0];
});

connector.on("disconnect", (error, payload) => {
  if (error) {
    throw error;
  }

  // Delete connector
});

app.get("/", (req, res) => {
  var uri = connector.uri; //"https://voxwheels.art";
  var code = qrImage.image(uri, { type: "png" });
  res.setHeader("Content-type", "image/png"); //sent qr image to client side
  code.pipe(res);
});

app.post("/", (req, res) => {
  res.send({ req: req.body });
});

app.listen(3000);
