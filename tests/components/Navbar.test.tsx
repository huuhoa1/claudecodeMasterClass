import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach } from "vitest";

vi.mock("@/hooks/useUser", () => ({
  useUser: vi.fn(() => ({ user: null, displayName: null, email: null })),
}));

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(),
  signOut: vi.fn(() => Promise.resolve()),
}));

vi.mock("@/lib/firebase", () => ({ default: {} }));

import Navbar from "@/components/Navbar";
import { useUser } from "@/hooks/useUser";
import { signOut } from "firebase/auth";

const mockUseUser = vi.mocked(useUser);
const mockSignOut = vi.mocked(signOut);

describe("Navbar", () => {
  afterEach(() => {
    vi.clearAllMocks();
    mockUseUser.mockReturnValue({
      user: null,
      displayName: null,
      email: null,
      loading: false,
      uid: null,
    });
  });

  it("renders the main heading", () => {
    render(<Navbar />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it("renders the Create Heist link", () => {
    render(<Navbar />);

    const createLink = screen.getByRole("link", { name: /create heist/i });
    expect(createLink).toBeInTheDocument();
    expect(createLink).toHaveAttribute("href", "/heists/create");
  });

  it("does not render the logout button when no user is signed in", () => {
    render(<Navbar />);

    expect(
      screen.queryByRole("button", { name: /logout/i }),
    ).not.toBeInTheDocument();
  });

  it("renders the logout button when a user is signed in", () => {
    mockUseUser.mockReturnValue({
      user: { uid: "123" } as never,
      displayName: "ShadowFoxVault",
      email: "thief@heist.io",
      loading: false,
      uid: "123",
    });
    render(<Navbar />);

    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });

  it("calls signOut when the logout button is clicked", async () => {
    const user = userEvent.setup();
    mockUseUser.mockReturnValue({
      user: { uid: "123" } as never,
      displayName: "ShadowFoxVault",
      email: "thief@heist.io",
      loading: false,
      uid: "123",
    });
    render(<Navbar />);

    await user.click(screen.getByRole("button", { name: /logout/i }));

    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});
