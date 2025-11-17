import { expect } from "chai";
import dotenv from "dotenv";
import axios from "axios";

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

describe("Vacation - admin functions", function () {
    this.timeout(7000);

    const email = randomEmail();
    const password = "pass1234";
    let token;
    let userId;
    let vacationId;
    let conn;

    // regular user (should be blocked from admin functions)
    const regularEmail = randomEmail();
    let regularUserId;
    let regularUserToken;

    before(async () => {
        const registerRes = await registerViaApi({ first_name: "admin", last_name: "Function_Test", email, password });
        const regularUserRes = await registerViaApi({
            first_name: "user",
            last_name: "should_be_blocked",
            email: regularEmail,
            password,
        });
        expect(registerRes.status).to.equal(201);
        expect(registerRes.data).to.have.property("id");

        conn = await getDbConnection();
        userId = registerRes.data.id;
        regularUserId = regularUserRes.data.id;
        const regularUserLoginRes = await loginViaApi({ email: regularEmail, password });
        expect(regularUserLoginRes.status).to.equal(200);
        expect(regularUserLoginRes.data).to.have.property("token");
        regularUserToken = regularUserLoginRes.data.token;
    });

    after(async () => {
        await deleteUserByEmail(email);
        await deleteUserByEmail(regularEmail);
        if (conn) await conn.end();
    });

    it("[Set Admin]-[PUT] /auth/setAdmin/{id} - set a user to 'admin' role", async () => {
        const res = await axios.put(`${BASE_URL}/auth/setAdmin/${userId}`);

        expect(res.status).to.equal(200);
        expect(res.data.message).to.include("User set to admin role");

        const [adminRows] = await conn.execute(`SELECT * FROM vacations_app.users WHERE user_id = ? `, [userId]);
        expect(adminRows.length).to.equal(1);
        expect(adminRows[0]).to.have.property("role", "admin");

        if (adminRows[0].role === "admin") {
            const loginRes = await loginViaApi({ email, password });
            expect(loginRes.status).to.equal(200);
            expect(loginRes.data).to.have.property("token");
            token = loginRes.data.token;
        }
    });

    it("[Create Vacation]-[POST] /admin/create - follow a vacation", async () => {
        const payload = {
            destination: "roei_test_dest",
            description: "roei_test_desc",
            start_date: "1995-01-01",
            end_date: "2026-01-01",
            price: 99.99,
            // no image
        };

        const vacationRes = await axiosWithToken(token).post("/admin/create", payload);
        expect(vacationRes.status).to.equal(201);
        expect(vacationRes.data.message).to.include("Vacation created");
        expect(vacationRes.data).to.have.property("id");
        vacationId = vacationRes.data.id;
    });

    it("[Update Vacation]-[Put] /admin/{VacationID} - update a vacation", async () => {
        const payload = {
            destination: "updated_roei_test_dest",
            description: "updated_roei_test_desc",
            start_date: "1995-01-01",
            end_date: "2029-01-01",
            price: 999.99,
            // no image
        };

        const vacationRes = await axiosWithToken(token).put(`/admin/${vacationId}`, payload);
        expect(vacationRes.status).to.equal(200);
        expect(vacationRes.data.message).to.include("Vacation updated");

        const [vacationRows] = await conn.execute(`SELECT * FROM vacations_app.vacations WHERE vacation_id = ? `, [vacationId]);
        expect(vacationRows.length).to.equal(1);
        expect(vacationRows[0]).to.have.property("destination", payload.destination);
        expect(vacationRows[0]).to.have.property("description", payload.description);
    });

    it("[Unauthorized Create]- try to create vacation with user role", async () => {
        const payload = {
            destination: "roei_test_dest",
            description: "roei_test_desc",
            start_date: "1995-01-01",
            end_date: "2026-01-01",
            price: 99.99,
            // no image
        };
        try {
            const unautVacationRes = await axiosWithToken(regularUserToken).post("/admin/create", payload);
            throw new Error("Unauthorize to create vacation");
        } catch (err) {
            expect(err.response.status).to.equal(403);
            expect(err.response.data).to.have.property("message");
            expect(err.response.data.message).to.include("Admin role required");
        }
    });

    it("[Unauthorized Edit]- try to edit vacation with user role", async () => {
        const payload = {
            destination: "updated_roei_test_dest",
            description: "updated_roei_test_desc",
            start_date: "1995-01-01",
            end_date: "2029-01-01",
            price: 999.99,
            // no image
        };
        try {
            const unautVacationRes = await axiosWithToken(regularUserToken).put(`/admin/${vacationId}`, payload);
            throw new Error("Unauthorize to edit vacation");
        } catch (err) {
            expect(err.response.status).to.equal(403);
            expect(err.response.data).to.have.property("message");
            expect(err.response.data.message).to.include("Admin role required");
        }
    });

    it("[Unauthorized Delete]- try to create vacation with user role", async () => {
        try {
            const unautVacationRes = await axiosWithToken(regularUserToken).delete(`/admin/${vacationId}`);
            throw new Error("Unauthorize to delete vacation");
        } catch (err) {
            expect(err.response.status).to.equal(403);
            expect(err.response.data).to.have.property("message");
            expect(err.response.data.message).to.include("Admin role required");
        }
    });

    it("[Delete Vacation]-[Delete] /admin/{VacationID} - delete a vacation", async () => {
        const vacationRes = await axiosWithToken(token).delete(`/admin/${vacationId}`);
        expect(vacationRes.status).to.equal(204);

        const [vacationRows] = await conn.execute(`SELECT * FROM vacations_app.vacations WHERE vacation_id = ? `, [vacationId]);
        expect(vacationRows.length).to.equal(0);
    });
});
