import { Link } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import logo from "@/assets/nsis-logo.png.asset.json";
import { NAV_LINKS, SCHOOL } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer id="contact" className="relative mt-24 overflow-hidden bg-primary-deep text-primary-foreground">
      <div className="h-1.5 flag-bar" />
      <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-primary/30 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-[1.4fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-4">
            <img src={logo.url} alt="" className="size-20 rounded-full bg-primary-foreground p-1" />
            <div>
              <p className="font-display text-2xl font-bold">{SCHOOL.name}</p>
              <p className="mt-1 text-sm font-bold uppercase tracking-[0.2em] text-sun">
                {SCHOOL.tagline} · {SCHOOL.town}
              </p>
            </div>
          </div>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-primary-foreground/75">
            A safe, caring and supportive school where every child is encouraged to learn, grow
            and reach for success.
          </p>
        </div>

        <div>
          <p className="font-display text-lg font-semibold">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm text-primary-foreground/80">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-sun">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/login" className="hover:text-sun">
                Staff login
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-display text-lg font-semibold">Get in touch</p>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/85">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-sun" /> {SCHOOL.address}
            </li>
            <li>
              <a href={`tel:${SCHOOL.phoneTel}`} className="flex gap-3 hover:text-sun">
                <Phone className="mt-0.5 size-4 shrink-0 text-sun" /> {SCHOOL.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={SCHOOL.whatsapp} target="_blank" rel="noreferrer" className="flex gap-3 hover:text-sun">
                <MessageCircle className="mt-0.5 size-4 shrink-0 text-sun" /> WhatsApp us
              </a>
            </li>
            <li>
              <a href={`mailto:${SCHOOL.email}`} className="flex gap-3 hover:text-sun">
                <Mail className="mt-0.5 size-4 shrink-0 text-sun" /> {SCHOOL.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-5 text-center text-xs text-primary-foreground/60">
        © {new Date().getFullYear()} {SCHOOL.name}, {SCHOOL.town}. All rights reserved.
      </div>
    </footer>
  );
}
