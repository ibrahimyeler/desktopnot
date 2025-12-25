import Link from "next/link";

const navItems = [
  { label: "Neden HomeSupper?", href: "#problem" },
  { label: "Nasıl Çalışır?", href: "#how-it-works" },
  { label: "Kimler İçin?", href: "#who-is-it-for" },
  { label: "Model", href: "#starting-model" },
];

export function TopNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-100/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-18 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#00ff88] text-sm font-black text-gray-900 shadow-sm">
            HS
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight text-gray-900">
              HomeSupper
            </span>
            <span className="text-[11px] text-gray-500">
              Akşam yemeğini düşünmeyi bırak.
            </span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-gray-600 sm:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-2 py-1 text-xs tracking-tight text-gray-600 transition-colors hover:text-gray-900"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right CTA */}
        <Link
          href="#cta"
          className="hidden items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-black sm:flex"
        >
          <span>Erken kayıt</span>
        </Link>
      </div>
    </header>
  );
}


