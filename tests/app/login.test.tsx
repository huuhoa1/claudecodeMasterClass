import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach } from "vitest";

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
}));

vi.mock("@/lib/firebase", () => ({ default: {} }));

import LoginPage from "@/app/(public)/login/page";
import { signInWithEmailAndPassword } from "firebase/auth";

const mockSignIn = vi.mocked(signInWithEmailAndPassword);

describe("LoginPage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("calls signInWithEmailAndPassword with the entered email and password", async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValue({
      user: { displayName: "ShadowFoxVault", email: "thief@heist.io" },
    } as never);
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email/i), "thief@heist.io");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(mockSignIn).toHaveBeenCalledWith(
      undefined,
      "thief@heist.io",
      "secret123",
    );
  });

  it("shows a success message with the user's display name on successful login", async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValue({
      user: { displayName: "ShadowFoxVault", email: "thief@heist.io" },
    } as never);
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email/i), "thief@heist.io");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(
      await screen.findByText(/welcome back, shadowfoxvault/i),
    ).toBeInTheDocument();
  });

  it("shows an error message when login fails", async () => {
    const user = userEvent.setup();
    mockSignIn.mockRejectedValue(new Error("Invalid credentials."));
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email/i), "thief@heist.io");
    await user.type(screen.getByLabelText("Password"), "wrongpass");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText("Invalid credentials.")).toBeInTheDocument();
  });
});
