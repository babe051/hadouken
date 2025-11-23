/**
 * Device detection utilities
 */

/**
 * Check if the device is a mobile device
 * @returns {boolean} True if mobile device
 */
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth <= 768;
};

/**
 * Check if the device is a touch device
 * @returns {boolean} True if touch device
 */
export const isTouchDevice = () => {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
};

/**
 * Check if should show virtual keyboard
 * @returns {boolean} True if should show virtual keyboard
 */
export const shouldShowVirtualKeyboard = () => {
  return isMobileDevice() || isTouchDevice();
};

