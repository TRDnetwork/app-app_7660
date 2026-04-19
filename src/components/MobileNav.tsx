export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-bg border-t border-surface md:hidden z-40">
      <div className="flex justify-around items-center h-16">
        <a
          href="#home"
          aria-current="page"
          className="text-accent text-xs font-medium text-center px-2 py-1"
        >
          Home
        </a>
        <a
          href="#about"
          className="text-text-dim hover:text-accent text-xs font-medium text-center px-2 py-1"
        >
          About
        </a>
        <a
          href="#projects"
          className="text-text-dim hover:text-accent text-xs font-medium text-center px-2 py-1"
        >
          Projects
        </a>
        <a
          href="#contact"
          className="text-text-dim hover:text-accent text-xs font-medium text-center px-2 py-1"
        >
          Contact
        </a>
      </div>
    </nav>
  );
}