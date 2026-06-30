import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach } from "vitest";

// component imports
import AuthForm from "@/components/AuthForm";

describe("AuthForm", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders email, password and Login button in login mode", () => {
    render(<AuthForm mode="login" />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("renders email, password and Sign Up button in signup mode", () => {
    render(<AuthForm mode="signup" />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i }),
    ).toBeInTheDocument();
  });

  it("hides the password by default", () => {
    render(<AuthForm mode="login" />);

    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "type",
      "password",
    );
  });

  it("toggles password visibility on and off", async () => {
    const user = userEvent.setup();
    render(<AuthForm mode="login" />);

    const password = screen.getByLabelText("Password");
    const toggle = screen.getByRole("button", { name: /show password/i });

    await user.click(toggle);
    expect(password).toHaveAttribute("type", "text");

    await user.click(screen.getByRole("button", { name: /hide password/i }));
    expect(password).toHaveAttribute("type", "password");
  });

  it("links to the signup page in login mode", () => {
    render(<AuthForm mode="login" />);

    expect(screen.getByRole("link", { name: /sign up/i })).toHaveAttribute(
      "href",
      "/signup",
    );
  });

  it("links to the login page in signup mode", () => {
    render(<AuthForm mode="signup" />);

    expect(screen.getByRole("link", { name: /log in/i })).toHaveAttribute(
      "href",
      "/login",
    );
  });

  it("logs the submitted credentials to the console", async () => {
    const user = userEvent.setup();
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    render(<AuthForm mode="login" />);

    await user.type(screen.getByLabelText(/email/i), "thief@heist.io");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(logSpy).toHaveBeenCalledWith({
      email: "thief@heist.io",
      password: "secret123",
    });
  });

  it("calls the onSubmit prop with email and password when provided", async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn().mockResolvedValue(undefined);
    render(<AuthForm mode="signup" onSubmit={mockSubmit} />);

    await user.type(screen.getByLabelText(/email/i), "thief@heist.io");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    expect(mockSubmit).toHaveBeenCalledWith("thief@heist.io", "secret123");
  });

  it("disables the submit button while onSubmit is pending", async () => {
    const user = userEvent.setup();
    let resolve!: () => void;
    const mockSubmit = vi.fn(
      () =>
        new Promise<void>((r) => {
          resolve = r;
        }),
    );
    render(<AuthForm mode="signup" onSubmit={mockSubmit} />);

    await user.type(screen.getByLabelText(/email/i), "thief@heist.io");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    expect(screen.getByRole("button", { name: /please wait/i })).toBeDisabled();
    resolve();
  });

  it("displays an error message when onSubmit rejects", async () => {
    const user = userEvent.setup();
    const mockSubmit = vi
      .fn()
      .mockRejectedValue(new Error("Email already in use."));
    render(<AuthForm mode="signup" onSubmit={mockSubmit} />);

    await user.type(screen.getByLabelText(/email/i), "taken@heist.io");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    expect(
      await screen.findByText("Email already in use."),
    ).toBeInTheDocument();
  });
});
