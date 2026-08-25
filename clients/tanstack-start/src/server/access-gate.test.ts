import { beforeEach, describe, expect, it, vi } from "vitest";

const login = vi.hoisted(() => ({
	buildLoginRedirect: vi.fn(),
	getSessionSubject: vi.fn(),
	handleCallback: vi.fn(),
	handleLogout: vi.fn(),
	initializeEnturLogin: vi.fn(),
	startLogin: vi.fn(),
}));

const permission = vi.hoisted(() => ({
	hasStagingAccess: vi.fn(),
	initializePermissionStore: vi.fn(),
}));

const deployment = vi.hoisted(() => ({
	isEnturLoginRequired: vi.fn(),
}));

vi.mock("./entur-login", () => login);
vi.mock("./permission-store", () => permission);
vi.mock("./deployment-config", () => deployment);

async function loadAccessGate() {
	return import("./access-gate");
}

beforeEach(() => {
	vi.resetModules();
	vi.clearAllMocks();
	deployment.isEnturLoginRequired.mockReturnValue(true);
	login.initializeEnturLogin.mockResolvedValue(undefined);
	permission.initializePermissionStore.mockResolvedValue(undefined);
	login.buildLoginRedirect.mockReturnValue(
		new Response(null, {
			status: 302,
			headers: {
				location: "https://wayfare.staging.entur.no/auth/login",
				"cache-control": "no-store",
			},
		}),
	);
});

describe("access gate", () => {
	it("does not authorize requests before startup initialization completes", async () => {
		const { authorizeRequest } = await loadAccessGate();
		const response = await authorizeRequest(
			new Request("https://wayfare.staging.entur.no/map"),
			new Headers(),
		);

		expect(response?.status).toBe(503);
		expect(response?.headers.get("cache-control")).toBe("no-store");
	});

	it("initializes login and Permission Store before becoming ready", async () => {
		const { initializeAccessGate, isAccessGateReady } = await loadAccessGate();

		await initializeAccessGate();

		expect(login.initializeEnturLogin).toHaveBeenCalledOnce();
		expect(permission.initializePermissionStore).toHaveBeenCalledOnce();
		expect(isAccessGateReady()).toBe(true);
	});

	it("redirects an invalid session with no-store headers", async () => {
		login.getSessionSubject.mockResolvedValue(undefined);
		const { authorizeRequest, initializeAccessGate } = await loadAccessGate();
		await initializeAccessGate();

		const response = await authorizeRequest(
			new Request("https://wayfare.staging.entur.no/map"),
			new Headers(),
		);

		expect(response?.status).toBe(302);
		expect(response?.headers.get("cache-control")).toBe("no-store");
	});

	it("returns a no-store 403 when Permission Store denies the capability", async () => {
		login.getSessionSubject.mockResolvedValue("employee-subject");
		permission.hasStagingAccess.mockResolvedValue(false);
		const { authorizeRequest, initializeAccessGate } = await loadAccessGate();
		await initializeAccessGate();

		const response = await authorizeRequest(
			new Request("https://wayfare.staging.entur.no/map"),
			new Headers(),
		);

		expect(response?.status).toBe(403);
		expect(response?.headers.get("cache-control")).toBe("no-store");
	});

	it("allows a verified session with wayfare.web", async () => {
		login.getSessionSubject.mockResolvedValue("employee-subject");
		permission.hasStagingAccess.mockResolvedValue(true);
		const { authorizeRequest, initializeAccessGate } = await loadAccessGate();
		await initializeAccessGate();

		expect(
			await authorizeRequest(
				new Request("https://wayfare.staging.entur.no/map"),
				new Headers(),
			),
		).toBeNull();
	});

	it("keeps login-disabled startup credential-free", async () => {
		deployment.isEnturLoginRequired.mockReturnValue(false);
		const { initializeAccessGate, isAccessGateReady } = await loadAccessGate();

		await initializeAccessGate();

		expect(login.initializeEnturLogin).not.toHaveBeenCalled();
		expect(permission.initializePermissionStore).not.toHaveBeenCalled();
		expect(isAccessGateReady()).toBe(true);
	});
});
