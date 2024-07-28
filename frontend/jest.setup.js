// jest.setup.js

// Extend Jest with custom matchers from jest-dom
import '@testing-library/jest-dom';

// If you need to mock global objects or functions, you can do it here
// Example: Mocking localStorage
// Object.defineProperty(window, 'localStorage', {
//   value: {
//     getItem: jest.fn(),
//     setItem: jest.fn(),
//     removeItem: jest.fn(),
//   },
//   writable: true,
// });


// jest.setTimeout(30000);
