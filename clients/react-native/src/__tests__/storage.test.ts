import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  clearActiveJourney,
  loadActiveJourney,
  saveActiveJourney,
} from "@/journeys/storage";
import {
  defaultSettings,
  effectiveBffBaseUrl,
  loadSettings,
  saveSettings,
} from "@/settings/storage";

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe("persisted settings", () => {
  it("round trips user settings and falls back safely", async () => {
    await expect(loadSettings()).resolves.toEqual(defaultSettings);
    await saveSettings({
      customerNumber: "123",
      bffBaseUrl: "http://10.0.2.2:3001/",
      themeMode: "dark",
    });
    await expect(loadSettings()).resolves.toEqual({
      customerNumber: "123",
      bffBaseUrl: "http://10.0.2.2:3001/",
      themeMode: "dark",
    });
    expect(
      effectiveBffBaseUrl({
        customerNumber: "123",
        bffBaseUrl: "http://10.0.2.2:3001/",
        themeMode: "dark",
      }),
    ).toBe("http://10.0.2.2:3001");
  });
});

describe("customer-scoped active journey storage", () => {
  it("does not restore one customer's journey for another customer", async () => {
    const journey = {
      journeyId: "4a387310-01bf-4ebe-a4a4-0b70bb92412b",
      startTime: "2026-07-29T08:00:00.000Z",
    };
    await saveActiveJourney("123", journey);
    await expect(loadActiveJourney("123")).resolves.toEqual(journey);
    await expect(loadActiveJourney("456")).resolves.toBeUndefined();
    await clearActiveJourney("123");
    await expect(loadActiveJourney("123")).resolves.toBeUndefined();
  });
});
