import { useState } from "react";

export default function ImageWithFallback({ src, alt = "", className = "", ...rest }) {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div
        className={
          "flex items-center justify-center bg-gradient-to-br from-[#1a1308] via-[#0d0a07] to-black " +
          className
        }
      >
        <span className="font-serif italic font-bold text-gradient-amber text-2xl opacity-80">
          rm.
        </span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setErr(true)}
      loading="lazy"
      className={className}
      {...rest}
    />
  );
}
