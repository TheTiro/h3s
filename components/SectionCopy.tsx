export function SectionTitle({
  children,
  as: Tag = "h2",
  className = "",
}: {
  children: string;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <Tag className={`whitespace-pre-line font-heading text-[2.05rem] font-extrabold uppercase leading-[0.95] tracking-[-0.02em] sm:text-[2.6rem] lg:text-[3rem] ${className}`.trim()}>
      {children}
    </Tag>
  );
}

export function SectionSubtitle({ children }: { children: string }) {
  return (
    <p className="mt-4 font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl">
      {children}
    </p>
  );
}

export function SectionBody({
  children,
  className = "",
}: {
  children: string | readonly string[];
  className?: string;
}) {
  const paragraphs = typeof children === "string" ? [children] : children;

  return (
    <div className="mt-5 space-y-4">
      {paragraphs.map((text) => (
        <p
          key={text}
          className={`break-normal text-justify text-[0.925rem] leading-7 text-muted hyphens-none [overflow-wrap:normal] ${className}`.trim()}
        >
          {text}
        </p>
      ))}
    </div>
  );
}
