import { test, expect, _android } from "@playwright/test";
import { loginWith } from "./helper";
import path from 'path';

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


test.describe("games", () => {
    const testUsers = [
        {
            username: "admin",
            name: "Admin User",
            email: "admin@mail.com",
            password: "admin"
        },
        {
            username: "register_user",
            name: "Test User",
            email: "other_test@mail.dom",
            password: "passwd"
        }
    ]

    const testGame = {
        title: "Hollow Knight",
        developer: "Team Cherry",
        publisher: "Team Cherry",
        releaseYear: "2017",
        platforms: [
            "PC", 
            "Nintendo Switch", 
            "PlayStation 4", 
            "Xbox One", 
            "macOS", 
            "Linux"
        ], 
        genres: [
            "Metroidvania", 
            "Action-Adventure", 
            "Platformer", 
            "Indie"
        ],
        description: "Forge your own path in Hollow Knight! An epic action adventure through a vast ruined kingdom of insects and heroes. Explore twisting caverns, battle tainted creatures and befriend bizarre bugs, all in a classic, hand-drawn 2D style."
    }

    test.beforeEach(async ({ page, request }) => {
        await request.post("/api/test/reset"); 
        for (const user of testUsers) {
            await request.post("/api/users", {
                data: user
            });
        }
        await page.goto("/")
    })

    test("not admin users can't add games", async ({ page }) => {
        const otherUser = testUsers[1];
        await loginWith(page ,otherUser.username, otherUser.password)
        await page.goto("/add-game")
        await expect(page.getByText("Add Game")).not.toBeVisible()
    })

    test("admin users can add games", async ({ page }) => {
        const adminUser = testUsers[0];
        await loginWith(page ,adminUser.username, adminUser.password)

        await expect(page.getByText(adminUser.username)).toBeVisible();
        await page.goto("/add-game")

        await expect(page.getByText("Add Game")).toBeVisible()

        await page.getByRole("textbox", { name: /title/i }).fill(testGame.title)
        await page.getByRole("textbox", { name: /publisher/i }).fill(testGame.publisher)
        await page.getByRole("spinbutton", { name: /release/i }).fill(testGame.releaseYear)
        await page.getByRole("textbox", { name: /description/i }).fill(testGame.description)
        
        await page.getByRole("textbox", { name: /developer/i }).fill(testGame.developer)
        await page.getByTestId("add-dev-btn").click()

        for (const plat of testGame.platforms){
            await page.getByRole("textbox", { name: /platform/i }).fill(plat)
            await page.getByTestId("add-plat-btn").click()
        }

        for (const gen of testGame.genres){
            await page.getByRole("textbox", { name: /genre/i }).fill(gen)
            await page.getByTestId("add-gen-btn").click()
        }

        await page.locator('input[type="file"]').setInputFiles(path.join('img', 'hollow_hnight_cover_art.webp'));

        await page.getByRole("button", { name: /upload game/i }).click()
        await expect(page.getByText("Game succesfully uploaded!")).toBeVisible();
    })
})