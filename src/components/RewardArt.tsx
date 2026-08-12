/** A crystal ball, earned by sitting with the gong. */
export function OrbArt({ colour, size = 148 }: { colour: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 140 158"
      width={size}
      height={(size * 158) / 140}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse cx="70" cy="150" rx="36" ry="9" fill="black" opacity="0.055" />
      <path d="M48 128Q70 142 92 128L97 135Q70 157 43 135Z" fill="#C8B89A" />
      <ellipse cx="70" cy="129" rx="27" ry="8" fill="#D4C5A9" />
      <circle cx="70" cy="70" r="64" fill={colour} opacity="0.1" />
      <circle cx="70" cy="70" r="57" fill="white" />
      <circle cx="70" cy="70" r="57" fill={colour} opacity="0.42" />
      <circle cx="70" cy="70" r="36" fill={colour} opacity="0.18" />
      <ellipse
        cx="52"
        cy="50"
        rx="18"
        ry="13"
        fill="white"
        opacity="0.55"
        transform="rotate(-20 52 50)"
      />
      <circle cx="46" cy="46" r="9" fill="white" opacity="0.38" />
      <text x="52" y="86" fontSize="28" opacity="0.75">
        ✨
      </text>
    </svg>
  );
}

/** A written spell, earned by journaling. A page torn from Aldric's own book. */
export function SpellArt({ colour, size = 148 }: { colour: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 140 158"
      width={size}
      height={(size * 158) / 140}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse cx="70" cy="150" rx="34" ry="8" fill="black" opacity="0.055" />
      <circle cx="70" cy="72" r="60" fill={colour} opacity="0.12" />
      <path
        d="M32 18h64l14 14v104a6 6 0 0 1-6 6H32a6 6 0 0 1-6-6V24a6 6 0 0 1 6-6Z"
        fill="white"
        stroke="#1B1624"
        strokeWidth="2.5"
      />
      <path d="M96 18v14h14Z" fill="#1B1624" opacity="0.15" />
      <path d="M96 18l14 14H96Z" stroke="#1B1624" strokeWidth="2.5" fill="none" />
      <rect x="38" y="46" width="46" height="3" rx="1.5" fill={colour} />
      <rect x="38" y="58" width="60" height="2.5" rx="1.25" fill="#1B1624" opacity="0.18" />
      <rect x="38" y="68" width="52" height="2.5" rx="1.25" fill="#1B1624" opacity="0.18" />
      <rect x="38" y="78" width="58" height="2.5" rx="1.25" fill="#1B1624" opacity="0.18" />
      <circle cx="70" cy="106" r="17" fill={colour} opacity="0.22" />
      <circle cx="70" cy="106" r="17" stroke={colour} strokeWidth="2" fill="none" />
      <text x="61" y="114" fontSize="17" fill="#1B1624" opacity="0.7">
        ✦
      </text>
      <text x="14" y="36" fontSize="14" fill={colour}>
        ✦
      </text>
      <text x="112" y="126" fontSize="11" fill={colour} opacity="0.8">
        ✦
      </text>
    </svg>
  );
}
