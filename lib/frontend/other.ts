// Session storage access!

export function setSidebarOpenCookie(to: string) {
  document.cookie = `renderSidebarOpen=${to};path=/`;
}
