import { render } from "@testing-library/react-native";
import { Text, View } from "react-native";
import TabLayout from "@/app/(tabs)/_layout";
import { SettingsProvider } from "@/settings/context";

const mockText = Text;
const mockView = View;

jest.mock("expo-router", () => {
  const React = jest.requireActual("react");
  const MockTabs = ({ children }: { children: React.ReactNode }) =>
    React.createElement(mockView, null, children);
  function MockTabsScreen({ options }: { options: { title: string } }) {
    return React.createElement(mockText, null, options.title);
  }
  MockTabs.Screen = MockTabsScreen;
  return { Tabs: MockTabs };
});

jest.mock("lucide-react-native", () => ({
  Clock3: () => null,
  Settings: () => null,
  TramFront: () => null,
}));

describe("tab navigation", () => {
  it("offers Travel, History, and Settings destinations", async () => {
    const view = await render(
      <SettingsProvider>
        <TabLayout />
      </SettingsProvider>,
    );
    expect(await view.findByText("Travel")).toBeOnTheScreen();
    expect(view.getByText("History")).toBeOnTheScreen();
    expect(view.getByText("Settings")).toBeOnTheScreen();
  });
});
