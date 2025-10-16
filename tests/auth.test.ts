import { describe, it, expect, beforeAll } from "vitest";
import { checkPasswordHash, hashPassword, makeJWT, validateJWT } from "../src/api/auth";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });
});

describe("JWT creation and validation", () => {
    const secret = "test-secret";
    const userID = "user-123";

    it("creates and validates a token", () => {
        const token = makeJWT(userID, 60, secret);
        const sub = validateJWT(token, secret);
        expect(sub).toBe(userID);
    });

    it("rejects token signed with wrong secret", () => {
        const token = makeJWT(userID, 60, "secret-A");
        expect(() => validateJWT(token, "secret-B")).toThrow();
    });

    it("rejects expired token", async () => {
        const token = makeJWT(userID, 0, secret);
        expect(() => validateJWT(token, secret)).toThrow();
    });
})