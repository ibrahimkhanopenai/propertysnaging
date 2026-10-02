/** Inline stroke icons — no icon library needed (keeps bundle tiny). */
const paths = {
  phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />,
  whatsapp: <path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.2A8.5 8.5 0 1 1 21 12z" />,
  shield: (<><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z" /><path d="M9 12l2 2 4-4" /></>),
  badge: (<><circle cx="12" cy="9" r="6" /><path d="M8.5 14l-1.5 7 5-3 5 3-1.5-7" /></>),
  clock: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  check: <path d="M5 12l5 5 9-10" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  pin: (<><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>),
  mail: (<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>),
  download: <path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 20h14" />,
  chevron: <path d="M6 9l6 6 6-6" />,
  home: (<><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /><path d="M9.5 15l2 2 3.5-4" /></>),
  wall: (<><rect x="3" y="4" width="18" height="16" rx="1" /><path d="M3 9h18M3 15h18M9 4v5M15 9v6M9 15v5" /></>),
  bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7z" />,
  drop: <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />,
  snow: <path d="M12 2v20M4.9 6l14.2 12M19.1 6L4.9 18M9 4l3 3 3-3M9 20l3-3 3 3" />,
  thermo: (<><path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z" /><path d="M12 9v7" /></>),
  kitchen: (<><rect x="4" y="3" width="16" height="18" rx="1.5" /><path d="M4 10h16M8 6v1M8 13v3" /></>),
  shower: (<><path d="M4 21V8a4 4 0 0 1 8 0" /><path d="M9 8h6" /><path d="M10 12v1M13 12v1M16 12v1M11 16v1M14 16v1" /></>),
  building: (<><path d="M4 21V5l8-3v19" /><path d="M12 9l8 3v9" /><path d="M2 21h20M8 8v1M8 12v1M8 16v1M16 15v1" /></>),
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />,
  camera: (<><path d="M4 7h3l2-3h6l2 3h3v13H4z" /><circle cx="12" cy="13" r="3.5" /></>),
  file: (<><path d="M6 2h9l5 5v15H6z" /><path d="M14 2v6h6M9 13h8M9 17h6" /></>),
  search: (<><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>),
  users: (<><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6" /></>),
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, size = 20, className, title }: { name: IconName; size?: number; className?: string; title?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      {paths[name]}
    </svg>
  );
}
