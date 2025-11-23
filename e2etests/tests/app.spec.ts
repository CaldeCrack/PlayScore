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

    test("users can register", async ({ page }) => {
        const otherTestUser = {
            username: "register_user",
            name: "Test User",
            email: "other_test@mail.dom",
            password: "passwd"
        }

        await page.goto("/signup")

        await page.getByRole("textbox", { name: /\bname\b/i }).fill(otherTestUser.name)
        await page.getByRole("textbox", { name: /username/i }).fill(otherTestUser.username)
        await page.getByRole("textbox", { name: /email/i }).fill(otherTestUser.email)
        await page.getByRole("textbox", { name: /password/i }).fill(otherTestUser.password)

        await page.getByRole("button", { name: /register/i }).click()
        await loginWith(page, otherTestUser.username, otherTestUser.password)

        await expect(page.getByText("Wrong credentials")).not.toBeVisible()
        await expect(page.getByText(otherTestUser.username)).toBeVisible()
    })

    test("users can log in", async ({ page }) => {
        await loginWith(page, testUserData.username, testUserData.password)

        await expect(page.getByText("Wrong credentials")).not.toBeVisible()
        await expect(page.getByText(testUserData.username)).toBeVisible()
    })

    test("login with wrong credentials", async ({ page }) => {
        await loginWith(page, `${testUserData.username}123`, `${testUserData.password}123`)

        await expect(page.getByText("Wrong credentials")).toBeVisible()
        await expect(page.getByText(testUserData.username)).not.toBeVisible()
    })

    test("guest users can't enter profile page", async ({ page }) => {
        await page.goto("/profile")

        await expect(page.getByText("Profile")).not.toBeVisible()
        await expect(page.getByText(testUserData.name)).not.toBeVisible()
        await expect(page.getByText(testUserData.username)).not.toBeVisible()
        await expect(page.getByText(testUserData.email)).not.toBeVisible()

    })
})