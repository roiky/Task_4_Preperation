import { expect } from "chai";
import dotenv from "dotenv";
dotenv.config();

import { randomEmail, registerViaApi, loginViaApi, deleteUserByEmail, BASE_URL } from "./helpers.test.mjs";

let newUserID;

describe("Auth - register and login", function () {
    this.timeout(5000);

    const email = randomEmail();
    const password = "abcd1234";
    const payload = {
        first_name: "Test",
        last_name: "User",
        email,
        password,
    };

    after(async () => {
        await deleteUserByEmail(email);
        //console.log(`[User ID: ${newUserID}] Deleted Successfully`);
    });

    it("[Register] /auth/register - create user", async () => {
        const res = await registerViaApi(payload);
        //console.log(payload);
        newUserID = res.data.id;
        expect(res.status).to.equal(201);
        expect(res.data).to.have.property("id");
        expect(res.data.message).to.include("User registered");
        //console.log(`[User ID: ${newUserID}] Register Successfully`);
    });

    it("[Login] /auth/login - login with new created user", async () => {
        const res = await loginViaApi({ email, password });
        expect(res.status).to.equal(200);
        expect(res.data).to.have.property("token");
        const token = res.data.token;
        expect(token).to.be.a("string");
        //console.log(token);
        //console.log(res.data.user);
        //console.log(`[User ID: ${newUserID}] Login Successfully`);
    });

    it("[Register] /auth/register - invalid email", async () => {
        try {
            await registerViaApi({ ...payload, email: "not-an-email" });
            throw new Error("Expected register to fail");
        } catch (err) {
            expect(err.response).to.exist;
            expect(err.response.status).to.equal(400);
            expect(err.response.data.message).to.include("Validation error");
        }
    });

    it("[Register] /auth/register - short password", async () => {
        try {
            await registerViaApi({ ...payload, password: "1" });
            throw new Error("Expected register to fail");
        } catch (err) {
            expect(err.response).to.exist;
            expect(err.response.status).to.equal(400);
            expect(err.response.data.message).to.include("Validation error");
        }
    });

    it("[Register] /auth/register - duplicate mail", async () => {
        try {
            await registerViaApi(payload);
            throw new Error("Expected register to fail");
        } catch (err) {
            expect(err.response).to.exist;
            expect(err.response.status).to.equal(409);
            expect(err.response.data.message).to.include("Email already exists");
        }
    });
});
