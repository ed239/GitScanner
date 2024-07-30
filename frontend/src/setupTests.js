import '@testing-library/jest-dom';

global.ResizeObserver = class {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {
    // Mock observing
  }
  unobserve() {
    // Mock unobserving
  }
  disconnect() {
    // Mock disconnecting
  }
};

jest.mock('html2canvas', () => {
  return jest.fn().mockImplementation(() => {
    return Promise.resolve({
      toDataURL: () => 'data:image/png;base64,imagedata',
    });
  });
});
