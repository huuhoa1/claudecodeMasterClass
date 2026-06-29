import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import Avatar from "@/components/Avatar"

describe("Avatar", () => {
  it("renders successfully", () => {
    render(<Avatar name="Alice" />)
    expect(screen.getByText("A")).toBeTruthy()
  })

  it("shows first letter for non-PascalCase names", () => {
    render(<Avatar name="john" />)
    expect(screen.getByText("j")).toBeTruthy()
  })

  it("shows first two uppercase letters for PascalCase names", () => {
    render(<Avatar name="JohnDoe" />)
    expect(screen.getByText("JD")).toBeTruthy()
  })
})
