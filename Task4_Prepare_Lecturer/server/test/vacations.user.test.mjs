import { expect } from "chai";
import dotenv from "dotenv";
dotenv.config();

import {
    randomEmail,
    registerViaApi,
    loginViaApi,
    deleteUserByEmail,
    axiosWithToken,
    BASE_URL,
    getDbConnection,
} from "./helpers.test.mjs";

describe("Vacation - user functions", function () {
    this.timeout(7000);

    const email = randomEmail();
    const password = "pass1234";
    let token;
    let userId;
    let conn;

    before(async () => {
        const res = await registerViaApi({ first_name: "User", last_name: "Function_Test", email, password });
        const loginRes = await loginViaApi({ email, password });

        conn = await getDbConnection();
        userId = res.data.id;
        token = loginRes.data.token;
    });

    after(async () => {
        await deleteUserByEmail(email);
        if (conn) await conn.end();
    });

    it("[All-vacations]-[GET] /vac/all - get all vacation (or first 10...)", async () => {
        const res = await axiosWithToken(token).get("/vac/all");
        expect(res.status).to.equal(200);
        expect(res).to.have.property("data");
        expect(res.data).to.be.an("object");
    });

    it("[Follow Vacation]-[POST] /vac/{id}/follow - follow a vacation", async () => {
        const followRes = await axiosWithToken(token).post("/vac/1/follow"); //i assume that the DB have at least 1 vacation in it
        expect(followRes.status).to.equal(204);
        //console.log(`[UserID ${userId}] followed vacation!`);
        const [followRows] = await conn.execute(`SELECT * FROM vacations_app.followers WHERE user_id = ? AND vacation_id = ?`, [
            userId,
            "1",
        ]);
        expect(followRows.length).to.be.greaterThan(0);
    });

    it("[Unfollow Vacation]-[DELETE] /vac/{id}/follow - unfollow a vacation", async () => {
        const followRes = await axiosWithToken(token).delete("/vac/1/follow"); //i assume that the DB have at least 1 vacation in it
        expect(followRes.status).to.equal(204);
        //console.log(`[${userId}] unfollowed vacation!`);
        const [followRows] = await conn.execute(`SELECT * FROM vacations_app.followers WHERE user_id = ? AND vacation_id = ?`, [
            userId,
            "1",
        ]);
        expect(followRows.length).to.equal(0);
    });
});
