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
        type: argon2.argon2i,
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
 * @returns The encrypted content
 */
async function encrypt(content){
    content = stringify(content);
    const salt = crypto.randomBytes(16);
    const key = crypto.pbkdf2Sync(process.env.ENCRYPTION_KEY, salt, 100000, 32, "sha512");
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(content, "utf-8", "hex");
    encrypted += cipher.final("hex");
    const hmac = crypto.createHmac("sha256", key);
    hmac.update(`${salt.toString("hex")}:${iv.toString("hex")}:${encrypted}`);
    const digest = hmac.digest("hex");
    return `${salt.toString("hex")}:${iv.toString("hex")}:${encrypted}:${digest}`;
}

/**
 * Decrypts a content with AES-256-CBC
 * @param encryptedContent The encrypted content
 * @returns The decrypted content
 */
async function decrypt(encryptedContent){
    const [saltString, ivString, encryptedString, digest] = encryptedContent.split(":");
    const salt = Buffer.from(saltString, "hex");
    const key = crypto.pbkdf2Sync(process.env.ENCRYPTION_KEY, salt, 100000, 32, "sha512");
    const iv = Buffer.from(ivString, "hex");
    const hmac = crypto.createHmac("sha256", key);
    hmac.update(`${saltString}:${ivString}:${encryptedString}`);
    const calculatedDigest = hmac.digest("hex");
    if (calculatedDigest !== digest)
        throw new Error("Integrity check failed");
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(encryptedString, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
}

module.exports = {
    getSum,
    hashPassword,
    comparePassword,
    encrypt,
    decrypt
};
