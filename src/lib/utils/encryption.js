const argon2 = require("argon2");
const crypto = require("crypto");

/**
 * Converts a content to a string
 * @param content The content to convert
 * @returns The stringify content
 */
function stringify(content){
    if(!content) return "";
    if(typeof content !== "string") return content.toString();
    return content;
}

/**
 * Gets the SHA-256 sum of a content
 * @param content The content to hash
 * @returns The SHA-256 sum
 */
function getSum(content){
    content = stringify(content);
    return crypto.createHash("sha256").update(content).digest("hex");
}

/**
 * Hashes a content like passwords with Argon2
 * @param content The content to hash
 * @param cost The cost of the hash (default: 10)
 * @returns The hashed content
 */
async function hashPassword(content, cost = 10){
    content = stringify(content);
    return await argon2.hash(content, {
        type: argon2.argon2id,
        timeCost: cost
    });
}

/**
 * Compares a hashed content with a plain text content
 * @param hash The hashed content
 * @param content The plain text content
 * @returns True if the content matches the hash, false otherwise
 */
async function comparePassword(hash, content){
    content = stringify(content);
    return await argon2.verify(hash, content);
}

/**
 * Encrypts a content with AES-256-CBC
 * @param content The content to encrypt
 * @param encryptionKey The encryption key
 * @param timeCost The time cost
 * @returns The encrypted content
 */
async function encryptSymmetric(content, encryptionKey = process.env.SYMMETRIC_ENCRYPTION_KEY, timeCost = 200000){
    content = stringify(content);
    const salt = crypto.randomBytes(32);
    const key = crypto.pbkdf2Sync(encryptionKey, salt, timeCost, 64, "sha512");
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", key.subarray(0, 32), iv);
    let encrypted = cipher.update(content, "utf-8", "hex");
    encrypted += cipher.final("hex");
    const hmac = crypto.createHmac("sha256", key.subarray(32));
    hmac.update(`${salt.toString("hex")}:${iv.toString("hex")}:${encrypted}`);
    const digest = hmac.digest("hex");
    return `${salt.toString("hex")}:${iv.toString("hex")}:${encrypted}:${digest}`;
}

/**
 * Decrypts a content with AES-256-CBC
 * @param encryptedContent The encrypted content
 * @param encryptionKey The encryption key
 * @param timeCost The time cost
 * @returns The decrypted content
 */
async function decryptSymmetric(encryptedContent, encryptionKey = process.env.SYMMETRIC_ENCRYPTION_KEY, timeCost = 200000){
    const [saltString, ivString, encryptedString, digest] = encryptedContent.split(":");
    const salt = Buffer.from(saltString, "hex");
    const key = crypto.pbkdf2Sync(encryptionKey, salt, timeCost, 64, "sha512");
    const iv = Buffer.from(ivString, "hex");
    const hmac = crypto.createHmac("sha256", key.subarray(32));
    hmac.update(`${saltString}:${ivString}:${encryptedString}`);
    const calculatedDigest = hmac.digest("hex");
    if (calculatedDigest !== digest)
        throw new Error("Integrity check failed");
    const decipher = crypto.createDecipheriv("aes-256-cbc", key.subarray(0, 32), iv);
    let decrypted = decipher.update(encryptedString, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
}

/**
 * Generates a key pair
 * @param privateEncryptionKey The private encryption key
 * @returns {KeyPairSyncResult<string, string>} The key pair
 */
function generateKeyPair(privateEncryptionKey = process.env.ASYMMETRIC_ENCRYPTION_KEY){
    return crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: "spki",
            format: "pem"
        },
        privateKeyEncoding: {
            type: "pkcs8",
            format: "pem",
            cipher: "aes-256-cbc",
            passphrase: privateEncryptionKey
        }
    });
}

/**
 * Encrypts a content with an asymmetric key
 * @param content The content to encrypt
 * @param publicKey The public key
 * @returns {string} The encrypted content
 */
function encryptAsymmetric(content, publicKey){
    const buffer = Buffer.from(stringify(content), "utf-8");
    const encrypted = crypto.publicEncrypt({
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
    }, buffer);
    return encrypted.toString("base64");
}

/**
 * Decrypts a content with an asymmetric key
 * @param encryptedContent The encrypted content
 * @param privateKey The private key
 * @param privateEncryptionKey The private encryption key
 * @returns {string} The decrypted content
 */
function decryptAsymmetric(encryptedContent, privateKey, privateEncryptionKey = process.env.ASYMMETRIC_ENCRYPTION_KEY){
    const buffer = Buffer.from(encryptedContent, "base64");
    const decrypted = crypto.privateDecrypt({
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        passphrase: privateEncryptionKey
    }, buffer);
    return decrypted.toString("utf-8");
}

module.exports = {
    getSum,
    hashPassword,
    comparePassword,
    encryptSymmetric,
    decryptSymmetric,
    generateKeyPair,
    encryptAsymmetric,
    decryptAsymmetric
};
