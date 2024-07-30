// __mocks__/html2canvas.js
export default function html2canvas() {
    return Promise.resolve({
      toDataURL: () => 'data:image/png;base64,fakeImageData',
    });
  }