const testConfig = require("./config");
const {getSum, hashPassword, comparePassword, encryptSymmetric, decryptSymmetric, generateKeyPair, encryptAsymmetric,
    decryptAsymmetric
} = require("../lib/utils/encryption");
const {expect} = testConfig;

const content = "test";

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

describe("Hash tests", async() => {
    it("Hash password", async() => {
        const hash = await hashPassword(content);
        expect(hash).to.be.a("string");
        expect(hash).to.have.lengthOf(98);
        const compare = await comparePassword(hash, content);
        expect(compare).to.be.true;
    });
    it("Hash password with empty content", async() => {
        const hash = await hashPassword("");
        expect(hash).to.be.a("string");
        expect(hash).to.have.lengthOf(98);
        const compare = await comparePassword(hash, "");
        expect(compare).to.be.true;
    });
    it("Hash password with null content", async() => {
        const hash = await hashPassword(null);
        expect(hash).to.be.a("string");
        expect(hash).to.have.lengthOf(98);
        const compare = await comparePassword(hash, null);
        expect(compare).to.be.true;
    });
    it("Hash password with undefined content", async() => {
        const hash = await hashPassword(undefined);
        expect(hash).to.be.a("string");
        expect(hash).to.have.lengthOf(98);
        const compare = await comparePassword(hash, undefined);
        expect(compare).to.be.true;
    });
    it("Hash password with no content", async() => {
        const hash = await hashPassword();
        expect(hash).to.be.a("string");
        expect(hash).to.have.lengthOf(98);
        const compare = await comparePassword(hash);
        expect(compare).to.be.true;
    });
    it("Hash password with number content", async() => {
        const hash = await hashPassword(123);
        expect(hash).to.be.a("string");
        expect(hash).to.have.lengthOf(98);
        const compare = await comparePassword(hash, 123);
        expect(compare).to.be.true;
    });
});

describe("Symmetric encryption tests", async() => {
    it("Encrypt content", async() => {
        const encrypted = await encryptSymmetric(content);
        expect(encrypted).to.be.a("string");
        const decrypted = await decryptSymmetric(encrypted);
        expect(decrypted).to.be.a("string");
        expect(decrypted).to.have.lengthOf(content.length);
        expect(decrypted).to.equal(content);
    });
    it("Encrypt content with empty content", async() => {
        const encrypted = await encryptSymmetric("");
        expect(encrypted).to.be.a("string");
        expect(encrypted).to.have.lengthOf(195);
        const decrypted = await decryptSymmetric(encrypted);
        expect(decrypted).to.be.a("string");
        expect(decrypted).to.have.lengthOf(0);
        expect(decrypted).to.equal("");
    });
    it("Encrypt content with null content", async() => {
        const encrypted = await encryptSymmetric(null);
        expect(encrypted).to.be.a("string");
        expect(encrypted).to.have.lengthOf(195);
        const decrypted = await decryptSymmetric(encrypted);
        expect(decrypted).to.be.a("string");
        expect(decrypted).to.have.lengthOf(0);
        expect(decrypted).to.equal("");
    });
    it("Encrypt content with undefined content", async() => {
        const encrypted = await encryptSymmetric(undefined);
        expect(encrypted).to.be.a("string");
        expect(encrypted).to.have.lengthOf(195);
        const decrypted = await decryptSymmetric(encrypted);
        expect(decrypted).to.be.a("string");
        expect(decrypted).to.have.lengthOf(0);
        expect(decrypted).to.equal("");
    });
    it("Encrypt content with no content", async() => {
        const encrypted = await encryptSymmetric();
        expect(encrypted).to.be.a("string");
        expect(encrypted).to.have.lengthOf(195);
        const decrypted = await decryptSymmetric(encrypted);
        expect(decrypted).to.be.a("string");
        expect(decrypted).to.have.lengthOf(0);
        expect(decrypted).to.equal("");
    });
    it("Encrypt content with number content", async() => {
        const encrypted = await encryptSymmetric(123);
        expect(encrypted).to.be.a("string");
        expect(encrypted).to.have.lengthOf(195);
        const decrypted = await decryptSymmetric(encrypted);
        expect(decrypted).to.be.a("string");
        expect(decrypted).to.have.lengthOf(3);
        expect(decrypted).to.equal("123");
    });
});

let keyPair;

describe("Asymmetric encryption tests", async() => {
    it("Key generation", async() => {
        keyPair = generateKeyPair(2048);
        expect(keyPair).to.be.an("object");
        expect(keyPair).to.have.property("publicKey");
        expect(keyPair).to.have.property("privateKey");
        expect(keyPair.publicKey).to.be.a("string");
        expect(keyPair.privateKey).to.be.a("string");
        expect(keyPair.publicKey).to.have.lengthOf(451);
        expect(keyPair.privateKey).to.have.lengthOf(1874);
    });
    it("Encrypt content", async() => {
        const encrypted = encryptAsymmetric(content, keyPair.publicKey);
        expect(encrypted).to.be.a("string");
        const decrypted = decryptAsymmetric(encrypted, keyPair.privateKey);
        expect(decrypted).to.be.a("string");
        expect(decrypted).to.have.lengthOf(content.length);
        expect(decrypted).to.equal(content);
    });
    it("Encrypt content with empty content", async() => {
        const encrypted = encryptAsymmetric("", keyPair.publicKey);
        expect(encrypted).to.be.a("string");
        expect(encrypted).to.have.lengthOf(344);
        const decrypted = decryptAsymmetric(encrypted, keyPair.privateKey);
        expect(decrypted).to.be.a("string");
        expect(decrypted).to.have.lengthOf(0);
        expect(decrypted).to.equal("");
    });
    it("Encrypt content with null content", async() => {
        const encrypted = encryptAsymmetric(null, keyPair.publicKey);
        expect(encrypted).to.be.a("string");
        expect(encrypted).to.have.lengthOf(344);
        const decrypted = decryptAsymmetric(encrypted, keyPair.privateKey);
        expect(decrypted).to.be.a("string");
        expect(decrypted).to.have.lengthOf(0);
        expect(decrypted).to.equal("");
    });
    it("Encrypt content with undefined content", async() => {
        const encrypted = encryptAsymmetric(undefined, keyPair.publicKey);
        expect(encrypted).to.be.a("string");
        expect(encrypted).to.have.lengthOf(344);
        const decrypted = decryptAsymmetric(encrypted, keyPair.privateKey);
        expect(decrypted).to.be.a("string");
        expect(decrypted).to.have.lengthOf(0);
        expect(decrypted).to.equal("");
    });
    it("Encrypt content with no content", async() => {
        const encrypted = encryptAsymmetric(undefined, keyPair.publicKey);
        expect(encrypted).to.be.a("string");
        expect(encrypted).to.have.lengthOf(344);
        const decrypted = decryptAsymmetric(encrypted, keyPair.privateKey);
        expect(decrypted).to.be.a("string");
        expect(decrypted).to.have.lengthOf(0);
        expect(decrypted).to.equal("");
    });
    it("Encrypt content with number content", async() => {
        const encrypted = encryptAsymmetric(123, keyPair.publicKey);
        expect(encrypted).to.be.a("string");
        expect(encrypted).to.have.lengthOf(344);
        const decrypted = decryptAsymmetric(encrypted, keyPair.privateKey);
        expect(decrypted).to.be.a("string");
        expect(decrypted).to.have.lengthOf(3);
        expect(decrypted).to.equal("123");
    });
});
