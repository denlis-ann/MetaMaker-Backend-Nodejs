var express = require('express');
var router = express.Router();
const sdk = require('api')('@alchemy-docs/v1.0#3z8hny6legldj05');

/* GET users listing. */
router.post('/getOwnersForToken', async function (req, res, next) {
  sdk.getOwnersForToken({
    contractAddress: '0xe785E82358879F061BC3dcAC6f0444462D4b5330',
    tokenId: '44',
    apiKey: 'UmZMVU2qUq22y910y7VizqLxmiDwqSs0'
  })
    .then(({ data }) => {
      console.log(data)
      res.status(200).send({ 'data': data })
    })
    .catch(err => console.error(err));
});

router.post('/getOwnersForCollection', async function (req, res, next) {
  sdk.getOwnersForCollection({
    contractAddress: '0xe785E82358879F061BC3dcAC6f0444462D4b5330',
    withTokenBalances: 'false',
    apiKey: 'UmZMVU2qUq22y910y7VizqLxmiDwqSs0'
  })
    .then(({ data }) => {
      console.log(data)
      res.status(200).send({ 'data': data })
    })
    .catch(err => console.error(err));
});

router.post('/searchContractMetadata', async function (req, res, next) {
  sdk.searchContractMetadata({query: 'sunglasses', apiKey: 'UmZMVU2qUq22y910y7VizqLxmiDwqSs0'})
    .then(({ data }) => {
      console.log(data)
      res.status(200).send({ 'data': data })
    })
    .catch(err => console.error(err));
});

module.exports = router;