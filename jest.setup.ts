// jest.setup.ts
// Optional: configure or set up a testing framework before each test.
// Jest will run this file before each test file.

// Example: If using @testing-library/jest-dom
// import '@testing-library/jest-dom';

// Example: Mocking localStorage or other browser APIs
// const localStorageMock = (function() {
//   let store: Record<string, string> = {};
//   return {
//     getItem: function(key: string) {
//       return store[key] || null;
//     },
//     setItem: function(key: string, value: string) {
//       store[key] = value.toString();
//     },
//     removeItem: function(key: string) {
//       delete store[key];
//     },
//     clear: function() {
//       store = {};
//     }
//   };
// })();
// Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Silence console.error and console.warn during tests if needed
// beforeEach(() => {
//   jest.spyOn(console, 'error').mockImplementation(() => {});
//   jest.spyOn(console, 'warn').mockImplementation(() => {});
// });

// afterEach(() => {
//   jest.restoreAllMocks();
// });

console.log("Jest setup file (jest.setup.ts) loaded.");
