import { render, waitFor } from "@testing-library/react-native";
import { Text } from "react-native";
import { Button, Screen } from "@/components/ui";
import { SettingsProvider } from "@/settings/context";

async function renderButton(props: React.ComponentProps<typeof Button>) {
  return render(
    <SettingsProvider>
      <Button {...props} />
    </SettingsProvider>,
  );
}

describe("accessible controls", () => {
  it("exposes disabled state and blocks presses", async () => {
    const onPress = jest.fn();
    const view = await renderButton({
      label: "Check in",
      onPress,
      disabled: true,
    });
    const button = await view.findByRole("button", { name: "Check in" });
    expect(button).toBeDisabled();
    expect(onPress).not.toHaveBeenCalled();
  });

  it("announces pending actions as busy", async () => {
    const view = await renderButton({
      label: "Retry payment",
      onPress: jest.fn(),
      pending: true,
    });
    const button = await view.findByRole("button", {
      name: "Retry payment, in progress",
    });
    await waitFor(() =>
      expect(button.props.accessibilityState).toEqual({
        busy: true,
        disabled: true,
      }),
    );
  });

  it("keeps a screen action outside the scrolling content", async () => {
    const view = await render(
      <SettingsProvider>
        <Screen
          title="Travel"
          footer={<Button label="Check in" onPress={jest.fn()} />}
        >
          <Text>Passenger choices</Text>
        </Screen>
      </SettingsProvider>,
    );

    expect(
      await view.findByRole("button", { name: "Check in" }),
    ).toBeOnTheScreen();
    expect(view.getByText("Passenger choices")).toBeOnTheScreen();
  });
});
