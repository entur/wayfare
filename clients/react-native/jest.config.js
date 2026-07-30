module.exports = {
  preset: "jest-expo",
  testMatch: ["**/__tests__/**/*.test.ts?(x)"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "\\.svg$": "<rootDir>/src/__mocks__/svg.tsx",
  },
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/api/schema.ts"],
};
