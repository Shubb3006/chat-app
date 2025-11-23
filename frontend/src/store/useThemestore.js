// import { create } from "zustand";

// export const useThemestore = create((set) => ({
//   theme: localStorage.getItem("chat-theme") || "dark",
//   setTheme: (theme) => {
//     console.log(theme)
//     localStorage.setItem("chat-theme", theme);
//     set({ theme });
//   },
// }));

import { create } from "zustand";

export const useThemestore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "black",

  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme });
    console.log(localStorage.getItem("chat-theme"));
  },
}));
