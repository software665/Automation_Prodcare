import { Page, expect } from "@playwright/test";
import { step } from "../../../helpers/test-steps-decorator";

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * @param organisation passing string value in the organisation Field
   * @param userName passing string value in the userName Field
   * @param password passing string value in the password Field
   */

  @step
  async loginPageCredentials(
    organisation: string,
    userName: string,
    password: string,
    rememberMe: boolean,
    forgotPassword?: boolean,
  ) 
  {
    const organisationInput = this.page.getByPlaceholder("your-company");
    const userNameInput = this.page.getByPlaceholder("Username");
    const passwordInput = this.page.getByPlaceholder("Password");
    const loginButton = this.page.getByRole("button", { name: "Login" });

    await organisationInput.clear();
    await organisationInput.fill(organisation);
    await userNameInput.clear();
    await userNameInput.fill(userName);
    await passwordInput.clear();
    await passwordInput.fill(password);
    //login Button click

    await loginButton.click();
    //remember me checkbox
    if (rememberMe) {
      const rememberMeText = this.page.getByText("Remember me", {exact: true,});
      await rememberMeText.click();
    } else {
      console.log("Remember me is not selected");
    }

    //forgot password
    if (forgotPassword) {
      const forgotPasswordLink = this.page.getByRole("link", {name: "Forgot password?",});
      await forgotPasswordLink.click();
    } else {
      console.log("Forgot password is not selected");
    }

    //expect
    const welcomeMessage = this.page.getByRole("status").filter({ hasText: "Welcome back!" });
    await expect(welcomeMessage).toBeVisible();
  }

  @step
  async SignOutPage() {
    const profileButton = this.page.getByRole("button", { name: /Admin/i });
    await profileButton.click();
    const signOutButton = this.page.getByRole("button", { name: "Sign Out" });
    await signOutButton.click();
  }
}
