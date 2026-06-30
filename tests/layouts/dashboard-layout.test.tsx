import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";

const mockReplace = vi.fn();

vi.mock("@/hooks/useUser", () => ({
  useUser: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

vi.mock("@/lib/firebase", () => ({ default: {} }));

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("@/components/Navbar", () => ({
  default: () => <nav>Navbar</nav>,
}));

import DashboardLayout from "@/app/(dashboard)/layout";
import { useUser } from "@/hooks/useUser";

const mockUseUser = vi.mocked(useUser);

describe("DashboardLayout", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("shows a loader while auth state is loading", () => {
    mockUseUser.mockReturnValue({
      user: null,
      loading: true,
      email: null,
      uid: null,
      displayName: null,
    });
    render(<DashboardLayout>content</DashboardLayout>);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.queryByText("content")).not.toBeInTheDocument();
  });

  it("redirects to /login and shows loader when user is not authenticated", () => {
    mockUseUser.mockReturnValue({
      user: null,
      loading: false,
      email: null,
      uid: null,
      displayName: null,
    });
    render(<DashboardLayout>content</DashboardLayout>);

    expect(mockReplace).toHaveBeenCalledWith("/login");
    expect(screen.queryByText("content")).not.toBeInTheDocument();
  });

  it("renders children when user is authenticated", () => {
    mockUseUser.mockReturnValue({
      user: { uid: "123" } as never,
      loading: false,
      email: null,
      uid: "123",
      displayName: null,
    });
    render(<DashboardLayout>content</DashboardLayout>);

    expect(screen.getByText("content")).toBeInTheDocument();
    expect(screen.getByText("Navbar")).toBeInTheDocument();
  });
});
