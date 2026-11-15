import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { LayoutDashboard, LogIn, Menu, Phone, Mail, X } from "lucide-react";

import logo from "@/assets/nsis-logo.png.asset.json";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { NAV_LINKS, SCHOOL } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { session } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <div className="hidden bg-primary-deep text-primary-foreground md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5 text-xs font-semibold">
          <span className="opacity-90">{SCHOOL.address}</span>
          <div className="flex items-center gap-5">
            <a href={`tel:${SCHOOL.phoneTel}`} className="flex items-center gap-1.5 hover:text-sun">
              <Phone className="size-3.5" /> {SCHOOL.phoneDisplay}
            </a>
            <a href={`mailto:${SCHOOL.email}`} className="flex items-center gap-1.5 hover:text-sun">
              <Mail className="size-3.5" /> {SCHOOL.email}
            </a>
          </div>
        </div>
        <div className="h-1 flag-bar" />
      </div>

      <nav
        className={cn(
          "transition-all duration-300",
          scrolled ? "bg-background/85 shadow-soft backdrop-blur-xl" : "bg-background/60 backdrop-blur",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <Link to="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
            <motion.img
              src={logo.url}
              alt="Nobel School of Integrated Studies logo"
              className="size-12 md:size-14"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
            <div className="leading-tight">
              <p className="font-display text-base font-bold text-primary-deep md:text-lg">
                Nobel School
              </p>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                of Integrated Studies
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                className="relative rounded-full px-4 py-2 text-sm font-bold text-foreground/80 transition-colors hover:text-primary data-[status=active]:text-primary"
              >
                {({ isActive }) => (
                  <>
                    {l.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-primary-soft"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            {session ? (
              <Button asChild variant="soft">
                <Link to="/dashboard">
                  <LayoutDashboard /> Dashboard
                </Link>
              </Button>
            ) : (
              <Button asChild variant="soft">
                <Link to="/login">
                  <LogIn /> Login
                </Link>
              </Button>
            )}
            <Button asChild variant="apply">
              <Link to="/admissions">Apply Now</Link>
            </Button>
          </div>

          <button
            className="rounded-full p-2 text-primary-deep lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border bg-background lg:hidden"
            >
              <div className="flex flex-col gap-1 px-4 py-4">
                {NAV_LINKS.map((l, i) => (
                  <motion.div
                    key={l.to}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={l.to}
                      activeOptions={{ exact: l.to === "/" }}
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-4 py-3 font-bold text-foreground/80 data-[status=active]:bg-primary-soft data-[status=active]:text-primary"
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Button asChild variant="soft" size="xl">
                    <Link to={session ? "/dashboard" : "/login"} onClick={() => setOpen(false)}>
                      {session ? "Dashboard" : "Login"}
                    </Link>
                  </Button>
                  <Button asChild variant="apply" size="xl">
                    <Link to="/admissions" onClick={() => setOpen(false)}>
                      Apply Now
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
