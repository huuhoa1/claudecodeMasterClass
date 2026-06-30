import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { User } from "firebase/auth";

// Mock firebase/auth before importing anything that uses it
vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn(),
}));

vi.mock("@/lib/firebase", () => ({ default: {} }));

import { onAuthStateChanged } from "firebase/auth";
import { AuthProvider } from "@/contexts/AuthContext";
import { useUser } from "@/hooks/useUser";

const mockOnAuthStateChanged = vi.mocked(onAuthStateChanged);

function TestConsumer() {
  const { user, loading, email, uid, displayName } = useUser();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="user">{user ? "logged-in" : "null"}</span>
      <span data-testid="email">{email ?? "null"}</span>
      <span data-testid="uid">{uid ?? "null"}</span>
      <span data-testid="displayName">{displayName ?? "null"}</span>
    </div>
  );
}

function renderWithAuth() {
  return render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>,
  );
}

describe("useUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOnAuthStateChanged.mockReturnValue(vi.fn());
  });

  it("starts with loading true and null user before listener fires", () => {
    // Listener never fires — simulate pending state
    mockOnAuthStateChanged.mockImplementation(() => vi.fn());

    renderWithAuth();

    expect(screen.getByTestId("loading").textContent).toBe("true");
    expect(screen.getByTestId("user").textContent).toBe("null");
  });

  it("returns user data and loading false after listener fires with a user", async () => {
    const fakeUser = {
      uid: "abc123",
      email: "thief@heist.io",
      displayName: "The Thief",
    } as User;

    mockOnAuthStateChanged.mockImplementation((_auth, callback) => {
      callback(fakeUser);
      return vi.fn();
    });

    await act(async () => renderWithAuth());

    expect(screen.getByTestId("loading").textContent).toBe("false");
    expect(screen.getByTestId("user").textContent).toBe("logged-in");
    expect(screen.getByTestId("email").textContent).toBe("thief@heist.io");
    expect(screen.getByTestId("uid").textContent).toBe("abc123");
    expect(screen.getByTestId("displayName").textContent).toBe("The Thief");
  });

  it("returns null user and loading false after listener fires with null", async () => {
    mockOnAuthStateChanged.mockImplementation((_auth, callback) => {
      callback(null);
      return vi.fn();
    });

    await act(async () => renderWithAuth());

    expect(screen.getByTestId("loading").textContent).toBe("false");
    expect(screen.getByTestId("user").textContent).toBe("null");
    expect(screen.getByTestId("email").textContent).toBe("null");
  });

  it("registers the listener only once even when the component re-renders", async () => {
    mockOnAuthStateChanged.mockImplementation((_auth, callback) => {
      callback(null);
      return vi.fn();
    });

    const { rerender } = render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await act(async () =>
      rerender(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>,
      ),
    );

    expect(mockOnAuthStateChanged).toHaveBeenCalledTimes(1);
  });
});
