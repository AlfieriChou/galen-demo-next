const crypto = require("crypto");
const { encrypted } = require("@galenjs/factories/crypto");

const serverPublicKey =
  "LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUF3R20ydlNOTDBiSHNGamZzRThBQQpXUHN4UngzUG44bDJsQWNuZkZ1d3I5Yko0VFBsQTk1NUVWVFhaRDNTakVjN0Zrc1hycjZvZDhBSGM3WmtYNDJICldUTjd5ZUt4NzV6bnY0Q0hNbm85blQyTU5jWkErb3lsZ0JieFhxRjNaaXgwOHVKc3lMZ3d6ZDRYYXpwK3VjdjgKZWxkY2xaRXpLY2MzdlRHYWxJZU9TK3Axb25wQjIycS9QanUweFJ6RWZmbHI4dmhsVDdMZWppWTErdEMxLzRORwp1WEp0ZU9zb0lBRVlRNU5OdUxDZVE4TzVoR0RUZ0ZrQnBRbC90Uyt4cGpCTXlmcTBESDc3OFh4NXUvS1BMMVNQCjJ2RVdGK3ZwSHdBWTlVNkZiYjlLd09ybDFKRnFZdlVBbDJ0cGpkMWplaVlNZzdQNHdveEs1Q1JVZTZDdmlKRTcKandJREFRQUIKLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg";

const buildSecretData = (data) => {
  const iv = crypto.randomBytes(16);
  const key = crypto.randomBytes(16);
  const encryptedKey = crypto.publicEncrypt(
    Buffer.from(serverPublicKey, "base64"),
    Buffer.from(key),
  );
  const encryptedData = encrypted(JSON.stringify(data), { key, iv });
  return {
    iv: iv.toString("base64"),
    encryptedKey: encryptedKey.toString("base64"),
    encryptedData,
    secretType: 1,
    clientId: "20211109000000523",
  };
};

console.log(
  "----",
  JSON.stringify(buildSecretData({
    "phone": "13211111111",
    "password": "123456",
  })),
);
