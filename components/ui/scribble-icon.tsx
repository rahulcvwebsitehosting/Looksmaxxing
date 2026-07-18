import { cn } from "@/lib/index";

export type ScribbleIconName =
  | "face"
  | "scissors"
  | "shirt"
  | "glasses"
  | "droplet"
  | "dumbbell"
  | "spark"
  | "check"
  | "alert"
  | "star"
  | "chart"
  | "arrow"
  | "trash"
  | "camera"
  | "upload"
  | "lock"
  | "shield"
  | "clock"
  | "signature";

interface ScribbleIconProps {
  name: ScribbleIconName;
  className?: string;
  strokeWidth?: number;
}

export function ScribbleIcon({
  name,
  className,
  strokeWidth = 2,
}: ScribbleIconProps) {
  const common = {
    className: cn("stroke-pencil fill-none", className),
    viewBox: "0 0 24 24",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    style: { strokeWidth },
  };

  switch (name) {
    case "face":
      return (
        <svg {...common} aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <circle cx="9" cy="10.5" r="0.6" className="fill-pencil" stroke="none" />
          <circle cx="15" cy="10.5" r="0.6" className="fill-pencil" stroke="none" />
          <path d="M8 15.5c1.4 1.2 6.6 1.2 8 0" />
        </svg>
      );
    case "scissors":
      return (
        <svg {...common} aria-hidden>
          <circle cx="6" cy="6" r="2.4" />
          <circle cx="6" cy="18" r="2.4" />
          <path d="M8.1 7.8 20 18" />
          <path d="M8.1 16.2 20 6" />
          <path d="M9.5 11.5 14 12" />
        </svg>
      );
    case "shirt":
      return (
        <svg {...common} aria-hidden>
          <path d="M5 6 8 4l4 1.5L16 4l3 2-2 3-1 12H7L6 9z" />
          <path d="M9 6.5c1.5 1.5 4.5 1.5 6 0" />
        </svg>
      );
    case "glasses":
      return (
        <svg {...common} aria-hidden>
          <circle cx="6.5" cy="13" r="3.4" />
          <circle cx="17.5" cy="13" r="3.4" />
          <path d="M10 12.5c1-0.8 3-0.8 4 0" />
          <path d="M3 11 5 10.5" />
          <path d="M21 11 19 10.5" />
        </svg>
      );
    case "droplet":
      return (
        <svg {...common} aria-hidden>
          <path d="M12 3.5c-3 4-5.5 7-5.5 10.5a5.5 5.5 0 0 0 11 0c0-3.5-2.5-6.5-5.5-10.5z" />
          <path d="M9.5 14.5c.8 1.2 2 1.8 3.5 1.6" />
        </svg>
      );
    case "dumbbell":
      return (
        <svg {...common} aria-hidden>
          <path d="M3 9v6M6 7v10M7 12h10M18 7v10M21 9v6" />
        </svg>
      );
    case "spark":
      return (
        <svg {...common} aria-hidden>
          <path d="M12 3c.8 4 1.7 5 5 5-3.3 0-4.2 1-5 5-.8-4-1.7-5-5-5 3.3 0 4.2-1 5-5z" />
          <path d="M19 15c.3 1.3.6 1.6 2 1.6-1.4 0-1.7.3-2 1.6-.3-1.3-.6-1.6-2-1.6 1.4 0 1.7-.3 2-1.6z" />
        </svg>
      );
    case "check":
      return (
        <svg {...common} aria-hidden>
          <path d="M4 12.5 9 17.5 20 6.5" />
        </svg>
      );
    case "alert":
      return (
        <svg {...common} aria-hidden>
          <path d="M12 3 21 19H3z" />
          <path d="M12 9v5" />
          <circle cx="12" cy="17" r="0.6" className="fill-pencil" stroke="none" />
        </svg>
      );
    case "star":
      return (
        <svg {...common} aria-hidden>
          <path d="M12 3.5 14.5 9.5 21 10.5 16 15 17.5 21 12 18 6.5 21 8 15 3 10.5 9.5 12 3.5z" />
        </svg>
      );
    case "chart":
      return (
        <svg {...common} aria-hidden>
          <path d="M4 20V4" />
          <path d="M4 20h16" />
          <path d="M7 17v-4" />
          <path d="M11.5 17V7" />
          <path d="M16 17v-6" />
          <path d="M20.5 17v-2" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...common} aria-hidden>
          <path d="M5 12h14" />
          <path d="M13 6 19 12 13 18" />
        </svg>
      );
    case "trash":
      return (
        <svg {...common} aria-hidden>
          <path d="M4 7h16" />
          <path d="M9 7V4h6v3" />
          <path d="M6 7 7 20h10l1-13" />
          <path d="M10 10v7M14 10v7" />
        </svg>
      );
    case "camera":
      return (
        <svg {...common} aria-hidden>
          <path d="M4 8h3l1.5-2h7L17 8h3v12H4z" />
          <circle cx="12" cy="14" r="3.4" />
        </svg>
      );
    case "upload":
      return (
        <svg {...common} aria-hidden>
          <path d="M12 16V4" />
          <path d="M6 10 12 4 18 10" />
          <path d="M4 20h16" />
        </svg>
      );
    case "lock":
      return (
        <svg {...common} aria-hidden>
          <rect x="5" y="11" width="14" height="9" rx="1" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common} aria-hidden>
          <path d="M12 3 4 6v6c0 4.5 3.5 7.5 8 9 4.5-1.5 8-4.5 8-9V6z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common} aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "signature":
      return (
        <svg {...common} aria-hidden>
          <path d="M3 18c2-4 4-4 6 0s4 4 6 0 4-4 6 0" />
          <path d="M7 18c2-8 4-12 6-12s2 4 2 8" />
        </svg>
      );
    default:
      return null;
  }
}
