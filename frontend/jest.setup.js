import '@testing-library/jest-dom';

// No access to window since it is a JsDom to render out components.
// Replace window.alert with console.warn:
window.alert = console.warn;
