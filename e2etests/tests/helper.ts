import { Page } from "@playwright/test";

const loginWith = async (page: Page, username: string, password: string) => {
    await page.goto("/login")

    await page.getByTestId("username").fill(username)
    await page.getByTestId("password").fill(password)
    await page.getByRole("button", { name: "login" }).click()
};

export { loginWith };