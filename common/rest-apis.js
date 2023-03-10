const PINATA_BASE = `https://api.pinata.cloud`;
const PINATA = {
  AUTH: `${PINATA_BASE}/data/testAuthentication`,
  UPLOAD_FILE: `${PINATA_BASE}/pinning/pinFileToIPFS`,
  UPLOAD_JSON: `${PINATA_BASE}/pinning/pinJSONToIPFS`,
  QUERY_PINS: `${PINATA_BASE}/data/pinList?status=pinned`,
  FILE_STORE: `https://gateway.pinata.cloud/ipfs`,
};
module.exports = { PINATA };
