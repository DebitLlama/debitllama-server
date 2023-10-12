// Session storage access!

export function setSidebarOpenCookie(to: string) {
  document.cookie = `renderSidebarOpen=${to};path=/`;
}

export function setCookiesAcceptedToSS() {
  window.localStorage.setItem("cookiesAccepted", "true");
}

export function getCookiesAcceptedFromSS() {
  return window.localStorage.getItem("cookiesAccepted") === "true";
}
