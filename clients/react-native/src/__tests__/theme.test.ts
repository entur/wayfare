import { resolveTheme, themes } from "@/theme/theme";

describe("theme resolution", () => {
  it("follows the system only in system mode", () => {
    expect(resolveTheme("system", "dark")).toBe("dark");
    expect(resolveTheme("system", "unspecified")).toBe("light");
    expect(resolveTheme("light", "dark")).toBe("light");
    expect(resolveTheme("dark", "light")).toBe("dark");
  });

  it("keeps the TanStack light and dark token values", () => {
    expect(themes.light.colors.primary).toBe("#E90037");
    expect(themes.light.colors.background).toBe("#F5F6F7");
    expect(themes.dark.colors.primary).toBe("#FF3355");
    expect(themes.dark.colors.background).toBe("#12151A");
  });
});
