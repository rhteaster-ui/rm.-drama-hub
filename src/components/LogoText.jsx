export default function LogoText({ className = "" }) {
  return (
    <span
      className={
        "font-serif italic font-bold tracking-tight text-gradient-amber " + className
      }
      style={{ lineHeight: 1 }}
    >
      rm<span>.</span>
    </span>
  );
}
