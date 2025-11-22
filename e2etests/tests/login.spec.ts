import { test, expect } from "@playwright/test";
import { loginWith } from "./helper";

test.describe("login", () => {

    const testUserData = {
        username: "usuario_test",
        name: "Test User",
        email: "test@mail.dom",
        password: "password123"
    }

    test.beforeEach(async ({ page, request }) => {
        await request.post("/api/test/reset"); 
        await request.post("/api/users", {
            data: testUserData
        });

        await page.goto("/")
    })

    test("users can log in", async ({ page }) => {
        await loginWith(page, testUserData.username, testUserData.password)
        await expect(page.getByText("Test User")).toBeVisible()
    })
})