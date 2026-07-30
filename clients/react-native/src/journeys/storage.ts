import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ActiveJourney {
  journeyId: string;
  startTime: string;
}

const activeKey = (customerNumber: string) =>
  `@wayfare/active-journey/${customerNumber}`;

export async function loadActiveJourney(
  customerNumber: string,
): Promise<ActiveJourney | undefined> {
  const value = await AsyncStorage.getItem(activeKey(customerNumber));
  if (!value) return undefined;
  try {
    const parsed = JSON.parse(value) as ActiveJourney;
    return parsed.journeyId && parsed.startTime ? parsed : undefined;
  } catch {
    return undefined;
  }
}

export async function saveActiveJourney(
  customerNumber: string,
  journey: ActiveJourney,
): Promise<void> {
  await AsyncStorage.setItem(
    activeKey(customerNumber),
    JSON.stringify(journey),
  );
}

export async function clearActiveJourney(
  customerNumber: string,
): Promise<void> {
  await AsyncStorage.removeItem(activeKey(customerNumber));
}
