import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  width?: number | string;
}

export function Logo({ className, width = 32 }: LogoProps) {
  const height = typeof width === "number" ? Math.round((width * 41) / 56) : width;
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 56 41"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        <defs>
          <linearGradient id="topLeaf" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#087F7D" />
            <stop offset="55%" stopColor="#13A99F" />
            <stop offset="100%" stopColor="#20B9A8" />
          </linearGradient>
          <linearGradient id="bottomLeaf" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#103D79" />
            <stop offset="100%" stopColor="#0877B9" />
          </linearGradient>
          <linearGradient id="sparkle" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#20B6A7" />
            <stop offset="100%" stopColor="#087D83" />
          </linearGradient>
        </defs>
        <path
          d="M17.1 27.1 C16.8 18.2 20.3 11.5 27.1 7.2 C34.5 2.7 44.5 1.4 54.8 0.2 C52.9 9.1 49.4 16.1 42.4 19.5 C34.8 23.1 24.9 24.6 17.1 27.1Z"
          fill="url(#topLeaf)"
        />
        <path
          d="M17.8 40.3 C17.2 32.2 20.1 26.5 26.9 23.2 C34.2 19.8 42.4 17.7 49.4 15.7 C47.9 23.3 44.5 29.2 37.5 32.7 C31.8 35.6 23.9 38.3 17.8 40.3Z"
          fill="url(#bottomLeaf)"
        />
        <path
          d="M12.8 17.3 C11.4 18.8 10.5 21.3 10.5 24.5 C10.5 25.7 10.8 26.6 11.5 27.1 L14.1 28.1 C13.6 24.2 14.2 20.2 16.1 17.1 C15.1 16.9 13.8 17 12.8 17.3Z"
          fill="#086D70"
        />
        <path
          d="M8.1 24.5 C9.1 27.1 10.5 28.3 13.5 29.2 C10.5 30.1 9.1 31.5 8.1 34.7 C7.1 31.5 5.7 30.1 2.7 29.2 C5.7 28.3 7.1 27.1 8.1 24.5Z"
          fill="url(#sparkle)"
        />
      </svg>
      <div className="flex flex-col leading-none">
        <span className="text-slate-main font-bold tracking-tight text-sm">
          Smart
        </span>
        <span className="text-teal-primary font-bold tracking-tight text-sm">
          Copilot
        </span>
      </div>
    </div>
  );
}

export function LogoInline({ className }: { className?: string } = {}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Logo width={26} />
    </div>
  );
}
