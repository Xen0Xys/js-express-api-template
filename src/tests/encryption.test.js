const testConfig = require("./config");
const {getSum, generateJWT, hashPassword, comparePassword, encryptSymmetric, decryptSymmetric, generateKeyPair, encryptAsymmetric,
    decryptAsymmetric,
    verifyJWT
} = require("../lib/utils/encryption");
const {expect} = testConfig;
const {assert} = require("chai");

const content = "test";
const hashCost = 2;
const encryptCost = 10000;
let keyPair;

describe("SHA-256 tests", async() => {
    it("Get SHA-256 sum", async() => {
        const sum = getSum(content);
        expect(sum).to.equal("9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08");
    });
    it("Get SHA-256 sum with empty content", async() => {
        const sum = getSum("");
        expect(sum).to.equal("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
    });
    it("Get SHA-256 sum with null content", async() => {
        const sum = getSum(null);
        expect(sum).to.equal("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
    });
    it("Get SHA-256 sum with undefined content", async() => {
        const sum = getSum(undefined);
        expect(sum).to.equal("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
    });
    it("Get SHA-256 sum with no content", async() => {
        const sum = getSum();
        expect(sum).to.equal("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
    });
    it("Get SHA-256 sum with number content", async() => {
        const sum = getSum(123);
        expect(sum).to.equal("a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3");
    });
});

describe("JWT tests", async() => {
    it("Symmetric JWT", async() => {
        const token = generateJWT({content}, process.env.TOKEN_DURATION, process.env.JWT_KEY);
        expect(token).to.be.a("string");
        const decoded = await verifyJWT(token, process.env.JWT_KEY);
        expect(decoded).to.be.an("object");
        expect(decoded).to.have.property("content");
    });
    it("Verify JWT with wrong key", async() => {
        const token = generateJWT({content}, process.env.TOKEN_DURATION, process.env.JWT_KEY);
        assert.throws(() => verifyJWT(token, "wrong_key"), Error);
    });
    it("Verify no JWT content", async() => {
        assert.throws(() => verifyJWT("invalid_content", process.env.JWT_KEY), Error);
    });
    it("Asymmetric JWT", async() => {
        const localKeyPair = generateKeyPair(2048);
        const token = generateJWT({content}, process.env.TOKEN_DURATION, localKeyPair.privateKey, false);
        expect(token).to.be.a("string");
        const decoded = await verifyJWT(token, localKeyPair.publicKey);
        expect(decoded).to.be.an("object");
        expect(decoded).to.have.property("content");
    });
    it("Asymmetric JWT with private encryption key", async() => {
        const localKeyPair = generateKeyPair(2048, process.env.ASYMMETRIC_ENCRYPTION_KEY);
        const token = generateJWT({content}, process.env.TOKEN_DURATION, localKeyPair.privateKey, false, process.env.ASYMMETRIC_ENCRYPTION_KEY);
        expect(token).to.be.a("string");
        const decoded = await verifyJWT(token, localKeyPair.publicKey, process.env.ASYMMETRIC_ENCRYPTION_KEY);
        expect(decoded).to.be.an("object");
        expect(decoded).to.have.property("content");
    });
});

describe("Hash tests", async() => {
    it("Hash password", async() => {
        const hash = await hashPassword(content, hashCost);
        expect(hash).to.be.a("string");
        const compare = await comparePassword(hash, content);
        expect(compare).to.be.true;
    });
    it("Compare password with wrong content", async() => {
        const hash = await hashPassword(content, hashCost);
        const compare = await comparePassword(hash, "wrong_content");
        expect(compare).to.be.false;
    });
    it("Hash password with negative cost", async() => {
        await expect(hashPassword(content, -1)).to.be.rejectedWith(Error);
    });
    it("Hash password with empty content", async() => {
        const hash = await hashPassword("", hashCost);
        expect(hash).to.be.a("string");
        const compare = await comparePassword(hash, "");
        expect(compare).to.be.true;
    });
    it("Hash password with null content", async() => {
        const hash = await hashPassword(null, hashCost);
        expect(hash).to.be.a("string");
        const compare = await comparePassword(hash, null);
        expect(compare).to.be.true;
    });
    it("Hash password with undefined content", async() => {
        const hash = await hashPassword(undefined, hashCost);
        expect(hash).to.be.a("string");
        const compare = await comparePassword(hash, undefined);
        expect(compare).to.be.true;
    });
    it("Hash password with number content", async() => {
        const hash = await hashPassword(123, hashCost);
        expect(hash).to.be.a("string");
        const compare = await comparePassword(hash, 123);
        expect(compare).to.be.true;
    });
});

describe("Symmetric encryption tests", async() => {
    it("Encrypt content", async() => {
        const encrypted = await encryptSymmetric(content, process.env.SYMMETRIC_ENCRYPTION_KEY, encryptCost);
        expect(encrypted).to.be.a("string");
        const decrypted = await decryptSymmetric(encrypted, process.env.SYMMETRIC_ENCRYPTION_KEY, encryptCost);
        expect(decrypted).to.be.a("string");
        expect(decrypted).to.have.lengthOf(content.length);
        expect(decrypted).to.equal(content);
    });
    it("Decrypt symmetric with wrong key", async() => {
        const encrypted = await encryptSymmetric(content, process.env.SYMMETRIC_ENCRYPTION_KEY, encryptCost);
        await expect(decryptSymmetric(encrypted, "wrong_key", encryptCost)).to.be.rejectedWith(Error);
    });
    it("Encrypt symmetric with negative time cost", async() => {
        await expect(encryptSymmetric(content, process.env.SYMMETRIC_ENCRYPTION_KEY, -1)).to.be.rejectedWith(Error);
    });
    it("Decrypt symmetric with negative time cost", async() => {
        const encrypted = await encryptSymmetric(content, process.env.SYMMETRIC_ENCRYPTION_KEY, encryptCost);
        await expect(decryptSymmetric(encrypted, process.env.SYMMETRIC_ENCRYPTION_KEY, -1)).to.be.rejectedWith(Error);
    });
    it("Encrypt content with empty content", async() => {
        const encrypted = await encryptSymmetric("", process.env.SYMMETRIC_ENCRYPTION_KEY, encryptCost);
        expect(encrypted).to.be.a("string");
        expect(encrypted).to.have.lengthOf(195);
        const decrypted = await decryptSymmetric(encrypted, process.env.SYMMETRIC_ENCRYPTION_KEY, encryptCost);
        expect(decrypted).to.be.a("string");
        expect(decrypted).to.have.lengthOf(0);
        expect(decrypted).to.equal("");
    });
    it("Encrypt content with null content", async() => {
        const encrypted = await encryptSymmetric(null, process.env.SYMMETRIC_ENCRYPTION_KEY, encryptCost);
        expect(encrypted).to.be.a("string");
        expect(encrypted).to.have.lengthOf(195);
        const decrypted = await decryptSymmetric(encrypted, process.env.SYMMETRIC_ENCRYPTION_KEY, encryptCost);
        expect(decrypted).to.be.a("string");
        expect(decrypted).to.have.lengthOf(0);
        expect(decrypted).to.equal("");
    });
    it("Encrypt content with undefined content", async() => {
        const encrypted = await encryptSymmetric(undefined, process.env.SYMMETRIC_ENCRYPTION_KEY, encryptCost);
        expect(encrypted).to.be.a("string");
        expect(encrypted).to.have.lengthOf(195);
        const decrypted = await decryptSymmetric(encrypted, process.env.SYMMETRIC_ENCRYPTION_KEY, encryptCost);
        expect(decrypted).to.be.a("string");
        expect(decrypted).to.have.lengthOf(0);
        expect(decrypted).to.equal("");
    });
    it("Encrypt content with number content", async() => {
        const encrypted = await encryptSymmetric(123, process.env.SYMMETRIC_ENCRYPTION_KEY, encryptCost);
        expect(encrypted).to.be.a("string");
        expect(encrypted).to.have.lengthOf(195);
        const decrypted = await decryptSymmetric(encrypted, process.env.SYMMETRIC_ENCRYPTION_KEY, encryptCost);
        expect(decrypted).to.be.a("string");
        expect(decrypted).to.have.lengthOf(3);
        expect(decrypted).to.equal("123");
    });
});

describe("Asymmetric encryption tests", async() => {
    it("Key generation", async() => {
        keyPair = generateKeyPair(1024);
        expect(keyPair).to.be.an("object");
        expect(keyPair).to.have.property("publicKey");
        expect(keyPair).to.have.property("privateKey");
        expect(keyPair.publicKey).to.be.a("string");
        expect(keyPair.privateKey).to.be.a("string");
    });
    it("Key generation with private encryption key", async() => {
        const localKeyPair = generateKeyPair(1024, process.env.ASYMMETRIC_ENCRYPTION_KEY);
        expect(localKeyPair).to.be.an("object");
        expect(localKeyPair).to.have.property("publicKey");
        expect(localKeyPair).to.have.property("privateKey");
        expect(localKeyPair.publicKey).to.be.a("string");
        expect(localKeyPair.privateKey).to.be.a("string");
    });
    it("Key generation with undefined private encryption key", async() => {
        const localKeyPair = generateKeyPair(1024, undefined);
        expect(localKeyPair).to.be.an("object");
        expect(localKeyPair).to.have.property("publicKey");
        expect(localKeyPair).to.have.property("privateKey");
        expect(localKeyPair.publicKey).to.be.a("string");
        expect(localKeyPair.privateKey).to.be.a("string");
    });
    it("Key generation with null private encryption key", async() => {
        const localKeyPair = generateKeyPair(1024, null);
        expect(localKeyPair).to.be.an("object");
        expect(localKeyPair).to.have.property("publicKey");
        expect(localKeyPair).to.have.property("privateKey");
        expect(localKeyPair.publicKey).to.be.a("string");
        expect(localKeyPair.privateKey).to.be.a("string");
    });
    it("Generate key pair with negative modulus length", async() => {
        assert.throws(() => generateKeyPair(-1, process.env.ASYMMETRIC_ENCRYPTION_KEY), Error);
    });
    it("Encrypt content", async() => {
        const encrypted = encryptAsymmetric(content, keyPair.publicKey);
        expect(encrypted).to.be.a("string");
        const decrypted = decryptAsymmetric(encrypted, keyPair.privateKey);
        expect(decrypted).to.be.a("string");
        expect(decrypted).to.have.lengthOf(content.length);
        expect(decrypted).to.equal(content);
    });

    it("Decrypt asymmetric with wrong key", async() => {
        const encrypted = encryptAsymmetric(content, keyPair.publicKey);
        assert.throws(() => decryptAsymmetric(encrypted, "wrong_key"), Error);
    });
    it("Encrypt content with empty content", async() => {
        const encrypted = encryptAsymmetric("", keyPair.publicKey);
        expect(encrypted).to.be.a("string");
        const decrypted = decryptAsymmetric(encrypted, keyPair.privateKey);
        expect(decrypted).to.be.a("string");
        expect(decrypted).to.have.lengthOf(0);
        expect(decrypted).to.equal("");
    });
    it("Encrypt content with null content", async() => {
        const encrypted = encryptAsymmetric(null, keyPair.publicKey);
        expect(encrypted).to.be.a("string");
        const decrypted = decryptAsymmetric(encrypted, keyPair.privateKey);
        expect(decrypted).to.be.a("string");
        expect(decrypted).to.have.lengthOf(0);
        expect(decrypted).to.equal("");
    });
    it("Encrypt content with undefined content", async() => {
        const encrypted = encryptAsymmetric(undefined, keyPair.publicKey);
        expect(encrypted).to.be.a("string");
        const decrypted = decryptAsymmetric(encrypted, keyPair.privateKey);
        expect(decrypted).to.be.a("string");
        expect(decrypted).to.have.lengthOf(0);
        expect(decrypted).to.equal("");
    });
    it("Encrypt content with number content", async() => {
        const encrypted = encryptAsymmetric(123, keyPair.publicKey);
        expect(encrypted).to.be.a("string");
        const decrypted = decryptAsymmetric(encrypted, keyPair.privateKey);
        expect(decrypted).to.be.a("string");
        expect(decrypted).to.have.lengthOf(3);
        expect(decrypted).to.equal("123");
    });
    it("Encrypt content with private encryption key", async() => {
        const encrypted = encryptAsymmetric(content, keyPair.publicKey);
        expect(encrypted).to.be.a("string");
        const decrypted = decryptAsymmetric(encrypted, keyPair.privateKey, process.env.ASYMMETRIC_ENCRYPTION_KEY);
        expect(decrypted).to.be.a("string");
        expect(decrypted).to.have.lengthOf(content.length);
        expect(decrypted).to.equal(content);
    });
    it("Encrypt content with null encryption key", async() => {
        const encrypted = encryptAsymmetric(content, keyPair.publicKey);
        expect(encrypted).to.be.a("string");
        const decrypted = decryptAsymmetric(encrypted, keyPair.privateKey, null);
        expect(decrypted).to.be.a("string");
        expect(decrypted).to.have.lengthOf(content.length);
        expect(decrypted).to.equal(content);
    });
    it("Encrypt content with undefined encryption key", async() => {
        const encrypted = encryptAsymmetric(content, keyPair.publicKey);
        expect(encrypted).to.be.a("string");
        const decrypted = decryptAsymmetric(encrypted, keyPair.privateKey, undefined);
        expect(decrypted).to.be.a("string");
        expect(decrypted).to.have.lengthOf(content.length);
        expect(decrypted).to.equal(content);
    });
    it("Encrypt content with encryption key and encrypted private key", async() => {
        keyPair = generateKeyPair(1024, process.env.ASYMMETRIC_ENCRYPTION_KEY);
        const encrypted = encryptAsymmetric(content, keyPair.publicKey);
        expect(encrypted).to.be.a("string");
        const decrypted = decryptAsymmetric(encrypted, keyPair.privateKey, process.env.ASYMMETRIC_ENCRYPTION_KEY);
        expect(decrypted).to.be.a("string");
        expect(decrypted).to.have.lengthOf(content.length);
        expect(decrypted).to.equal(content);
    });
    it("Decrypt asymmetric with wrong encrypted private key and correct private encryption key", async() => {
        keyPair = generateKeyPair(1024, process.env.ASYMMETRIC_ENCRYPTION_KEY);
        const encrypted = encryptAsymmetric(content, keyPair.publicKey);
        assert.throws(() => decryptAsymmetric(encrypted, "wrong_key", process.env.ASYMMETRIC_ENCRYPTION_KEY), Error);
    });
    it("Encrypt content with no private encryption key and encrypted private key", async() => {
        keyPair = generateKeyPair(1024, process.env.ASYMMETRIC_ENCRYPTION_KEY);
        const encrypted = encryptAsymmetric(content, keyPair.publicKey);
        expect(encrypted).to.be.a("string");
        assert.throws(() => decryptAsymmetric(encrypted, keyPair.privateKey), Error);
    });
    it("Encrypt content with null private encryption key and encrypted private key", async() => {
        keyPair = generateKeyPair(1024, process.env.ASYMMETRIC_ENCRYPTION_KEY);
        const encrypted = encryptAsymmetric(content, keyPair.publicKey);
        expect(encrypted).to.be.a("string");
        assert.throws(() => decryptAsymmetric(encrypted, keyPair.privateKey, null), Error);
    });
    it("Encrypt content with undefined private encryption key and encrypted private key", async() => {
        keyPair = generateKeyPair(1024, process.env.ASYMMETRIC_ENCRYPTION_KEY);
        const encrypted = encryptAsymmetric(content, keyPair.publicKey);
        expect(encrypted).to.be.a("string");
        assert.throws(() => decryptAsymmetric(encrypted, keyPair.privateKey, undefined), Error);
    });
    it("Encrypt content with wrong private encryption key and encrypted private key", async() => {
        keyPair = generateKeyPair(1024, process.env.ASYMMETRIC_ENCRYPTION_KEY);
        const encrypted = encryptAsymmetric(content, keyPair.publicKey);
        expect(encrypted).to.be.a("string");
        assert.throws(() => decryptAsymmetric(encrypted, keyPair.privateKey, "invalid_key"), Error);
    });
    it("Decrypt asymmetric with wrong encrypted private key", async() => {
        keyPair = generateKeyPair(1024, process.env.ASYMMETRIC_ENCRYPTION_KEY);
        const encrypted = encryptAsymmetric(content, keyPair.publicKey);
        assert.throws(() => decryptAsymmetric(encrypted, keyPair.privateKey, "wrong_key"), Error);
    });
});
