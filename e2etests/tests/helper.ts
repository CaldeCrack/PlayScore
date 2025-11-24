import { Page } from "@playwright/test";

const loginWith = async (page: Page, username: string, password: string) => {
    await page.goto("/login")

    await page.getByRole("textbox", { name: /username/i }).fill(username)
    await page.getByRole("textbox", { name: /password/i }).fill(password)
    await page.getByRole("button", { name: /log in/i }).click()
};

export { loginWith };