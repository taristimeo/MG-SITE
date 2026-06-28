type StillProps = {
  src: string;
  alt: string;
  className?: string;
};

// Image (still) réelle, recadrée plein cadre.
export function Still({ src, alt, className = "" }: StillProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={`h-full w-full object-cover ${className}`} />
  );
}

export function PlayBadge() {
  return (
    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-black/20 backdrop-blur-[2px] transition-all duration-500 ease-out group-hover:scale-110 group-hover:border-white/80">
      <svg width="15" height="17" viewBox="0 0 15 17" fill="none" aria-hidden>
        <path
          d="M14 7.13L2.5 0.49A1.6 1.6 0 000 1.86v13.28a1.6 1.6 0 002.5 1.37L14 9.87a1.6 1.6 0 000-2.74z"
          fill="currentColor"
          className="text-white"
        />
      </svg>
    </span>
  );
}
