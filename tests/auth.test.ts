import { describe, it, expect, beforeAll } from "vitest";
import { checkPasswordHash, getBearerToken, hashPassword, makeJWT, validateJWT } from "../src/api/auth";

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

describe("getBearerToken", () => {
  it("extracts the token from the Authorization header", () => {
    const req = new Request("http://example.com", {
      headers: {
        "Authorization": "Bearer token123"
      }
    });
    const token = getBearerToken(req);
    expect(token).toBe("token123");
  });

  it("throw error if no Authorization header is provided", () => {
    const req = new Request("https://example.com");
    expect(() => getBearerToken(req)).toThrow("No Authorization header provided");
  })

  it("throw error if Authorization header is not a Bearer token", () => {
    const req = new Request("https://example.com", {
      headers: {
        "Authorization": "token123"
      }
    });
    expect(() => getBearerToken(req)).toThrow("Invalid Authorization header format. Must be a Bearer token. Example: 'Bearer <TOKEN>'")
  })
})