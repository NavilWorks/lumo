import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import App from "./App";

const invoke = vi.fn();
const isTauri = vi.fn();

vi.mock("@tauri-apps/api/core", () => ({
  invoke: (...args: unknown[]) => invoke(...args),
  isTauri: () => isTauri(),
}));

describe("App", () => {
  beforeEach(() => {
    invoke.mockReset();
    isTauri.mockReset();
  });

  it("renders all metric placeholders as not implemented, with no fake values", async () => {
    isTauri.mockReturnValue(false);
    render(<App />);

    for (const label of ["CPU", "Memory", "Disk", "Network"]) {
      expect(screen.getByRole("region", { name: `${label} (not implemented)` })).toBeInTheDocument();
    }
    expect(screen.getAllByText("Not implemented yet")).toHaveLength(4);
    expect(screen.queryByText(/\d+\s?%/)).not.toBeInTheDocument();
    await screen.findByTestId("backend-status");
  });

  it("reports backend unavailable outside Tauri without calling invoke", async () => {
    isTauri.mockReturnValue(false);
    render(<App />);

    expect(await screen.findByTestId("backend-status")).toHaveTextContent(/backend unavailable/i);
    expect(invoke).not.toHaveBeenCalled();
  });

  it("shows app info returned by the backend", async () => {
    isTauri.mockReturnValue(true);
    invoke.mockResolvedValue({ name: "Lumo", version: "0.1.0", os: "windows", arch: "x86_64" });
    render(<App />);

    expect(await screen.findByTestId("backend-status")).toHaveTextContent("Lumo v0.1.0 · windows/x86_64");
    expect(invoke).toHaveBeenCalledWith("app_info");
  });

  it("surfaces backend errors instead of hiding them", async () => {
    isTauri.mockReturnValue(true);
    invoke.mockRejectedValue(new Error("boom"));
    render(<App />);

    expect(await screen.findByTestId("backend-status")).toHaveTextContent("boom");
  });
});
