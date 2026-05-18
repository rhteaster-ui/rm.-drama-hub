export default function GlassCard({ as: Tag = "div", amber = false, className = "", children, ...rest }) {
  const base = amber ? "glass-amber" : "glass";
  return (
    <Tag className={base + " rounded-2xl " + className} {...rest}>
      {children}
    </Tag>
  );
}
