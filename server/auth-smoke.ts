import assert from "node:assert/strict";

process.env.USE_IN_MEMORY_DB = "true";
process.env.START_SERVER = "false";

const { app, databaseReady } = await import("./index");
const { default: request } = await import("supertest");

await databaseReady;

const registration = await request(app)
  .post("/api/auth/register")
  .send({
    name: "Smoke Donor",
    email: "smoke@example.com",
    phone: "+91 90000 00000",
    password: "smoke-password",
    confirmPassword: "smoke-password",
    role: "DONOR",
    donor_type: "Restaurant / Eatery",
    organization_name: "Smoke Kitchen",
    address: "1 Test Street, Mumbai",
    termsAccepted: true,
  });

assert.equal(registration.status, 201);
assert.ok(registration.body.token);
assert.equal(registration.body.user.role, "DONOR");

const login = await request(app)
  .post("/api/auth/login")
  .send({
    email: "SMOKE@EXAMPLE.COM",
    password: "smoke-password",
    role: "DONOR",
  });

assert.equal(login.status, 200);
assert.ok(login.body.token);
assert.equal(login.body.user.email, "smoke@example.com");

const currentUser = await request(app)
  .get("/api/auth/me")
  .set("Authorization", `Bearer ${login.body.token}`);

assert.equal(currentUser.status, 200);
assert.equal(currentUser.body.user.email, "smoke@example.com");

const ngoRegistration = await request(app)
  .post("/api/auth/register")
  .send({
    name: "Smoke NGO",
    email: "ngo-smoke@example.com",
    phone: "+91 91111 11111",
    password: "ngo-password",
    confirmPassword: "ngo-password",
    role: "NGO",
    ngo_category: "Food Relief",
    registration_number: "SMOKE/NGO/001",
    address: "2 Test Street, Mumbai",
    daily_meal_capacity: 100,
    termsAccepted: true,
  });

assert.equal(ngoRegistration.status, 201);
assert.equal(ngoRegistration.body.user.role, "NGO");

const ngoLogin = await request(app)
  .post("/api/auth/login")
  .send({
    email: "ngo-smoke@example.com",
    password: "ngo-password",
    role: "NGO",
  });

assert.equal(ngoLogin.status, 200);
assert.equal(ngoLogin.body.user.role, "NGO");
assert.equal(ngoLogin.body.verification.isVerified, false);

console.log("Auth smoke test passed: donor and NGO register -> login -> /me");