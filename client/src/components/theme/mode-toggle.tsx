import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  function toggleTheme() {
  
    setTheme(theme === "light" ? "dark" : "light");
  }

  return (
    <div>
      <button onClick={toggleTheme} aria-label="Toggle theme">
        {theme === "dark" ? <Sun /> : <Moon />}
      </button>
    </div>
  );
}