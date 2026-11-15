import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, BookOpenCheck, FlaskConical, HeartHandshake, ShieldCheck, Sparkles, Trophy, Users } from "lucide-react";

import award from "@/assets/award-ceremony.jpg.asset.json";
import boys from "@/assets/boys-performance.jpg.asset.json";
import girls from "@/assets/girls-performance.jpg.asset.json";
import principal from "@/assets/principal-portrait.jpg.asset.json";
import science from "@/assets/science-exhibition.jpg.asset.json";
import assembly from "@/assets/students-assembly.jpg.asset.json";
import trip from "@/assets/trip-outing.jpg.asset.json";
import { HeroSceneSlot } from "@/components/three/HeroSceneSlot";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { SCHOOL } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nobel School of Integrated Studies | Learn & Grow in Pindsultani" },
      {
        name: "description",
        content:
          "A caring, challenging school on Main Pindi Kohat Road, Pindsultani. Classes from Play Group to Class Ten. Apply online today.",
      },
      { property: "og:title", content: "Nobel School of Integrated Studies, Pindsultani" },
      { property: "og:description", content: "Learn & Grow — Play Group to Class Ten. Online admissions open." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const FEATURES = [
  { icon: HeartHandshake, title: "Caring & supportive", text: "A safe, orderly and caring environment where every child feels valued.", tone: "bg-accent/10 text-accent" },
  { icon: BookOpenCheck, title: "Learning that fits", text: "Instruction that respects individual differences and learning styles.", tone: "bg-primary-soft text-primary" },
  { icon: FlaskConical, title: "Hands-on activities", text: "Science exhibitions, stage performances and trips that bring lessons to life.", tone: "bg-sky-soft text-sky" },
  { icon: ShieldCheck, title: "Moral training", text: "Strong character and values nurtured alongside academic success.", tone: "bg-sun-soft text-primary-deep" },
];

const MARQUEE = ["Learn & Grow", "Play Group to Class Ten", "Science Exhibitions", "Annual Functions", "Moral Training", "Caring Teachers", "Educational Trips", "Prize Distribution"];

function Index() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-hero">
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-6 px-6 pb-12 pt-10 lg:grid-cols-[1.05fr_1fr] lg:pb-20 lg:pt-16">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-accent shadow-soft"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              Admissions open
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 text-balance text-5xl font-bold leading-[1.02] text-primary-deep md:text-7xl"
            >
              Where little minds <span className="italic text-primary">learn</span> &{" "}
              <span className="relative inline-block text-accent">
                grow
                <motion.svg
                  viewBox="0 0 200 20"
                  className="absolute -bottom-2 left-0 w-full"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                >
                  <motion.path
                    d="M2 15 Q 50 2 100 12 T 198 8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.8, duration: 0.9 }}
                  />
                </motion.svg>
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
            >
              {SCHOOL.name}, {SCHOOL.town} — a challenging, caring place to learn, with parents,
              teachers and community working together for every child.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Button asChild variant="apply" size="xl">
                <Link to="/admissions">
                  Apply Now <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="soft" size="xl">
                <Link to="/about">Discover our school</Link>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-10 flex flex-wrap items-center gap-6 text-sm font-bold text-primary-deep"
            >
              <span className="flex items-center gap-2"><Users className="size-5 text-primary" /> Play Group – Class Ten</span>
              <span className="flex items-center gap-2"><Trophy className="size-5 text-accent" /> Activities & awards</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="relative h-[380px] md:h-[520px]"
          >
            <div className="absolute inset-10 rounded-full bg-primary-soft blur-3xl" />
            <HeroSceneSlot />
          </motion.div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="overflow-hidden border-y border-border bg-primary py-4 text-primary-foreground">
        <div className="flex w-max animate-marquee gap-10">
          {[...MARQUEE, ...MARQUEE].map((m, i) => (
            <span key={i} className="flex items-center gap-10 font-display text-xl font-semibold">
              {m} <Sparkles className="size-5 text-sun" />
            </span>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section id="about" className="mx-auto max-w-7xl scroll-mt-32 px-6 py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-accent">Why parents choose us</p>
          <h2 className="mt-3 text-4xl font-bold text-primary-deep md:text-5xl">A school that feels like family</h2>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -8, rotate: -1 }}
                className="h-full rounded-3xl border border-border bg-card p-7 shadow-soft transition-shadow hover:shadow-lift"
              >
                <div className={`flex size-14 items-center justify-center rounded-2xl ${f.tone}`}>
                  <f.icon className="size-7" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-primary-deep">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section className="bg-paper py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-accent">Life at NSIS</p>
              <h2 className="mt-3 text-4xl font-bold text-primary-deep md:text-5xl">Moments that make us proud</h2>
            </div>
            <Button asChild variant="green" size="lg">
              <Link to="/about">More about us <ArrowRight /></Link>
            </Button>
          </Reveal>
          <div className="mt-12 grid auto-rows-[200px] grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { src: girls.url, label: "Annual function", cls: "col-span-2 row-span-2" },
              { src: science.url, label: "Science exhibition", cls: "row-span-2" },
              { src: boys.url, label: "Stage performance", cls: "" },
              { src: award.url, label: "Prize distribution", cls: "" },
              { src: assembly.url, label: "Our students", cls: "col-span-2" },
              { src: trip.url, label: "Educational trip", cls: "col-span-2" },
            ].map((g, i) => (
              <Reveal key={g.label} delay={i * 0.06} className={`group relative overflow-hidden rounded-3xl shadow-soft ${g.cls}`}>
                <img src={g.src} alt={g.label} loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 rounded-full bg-card/90 px-3 py-1 text-xs font-extrabold text-primary-deep backdrop-blur">
                  {g.label}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRINCIPAL */}
      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal className="relative mx-auto w-full max-w-sm">
          <div className="absolute -inset-4 rotate-6 rounded-[2.5rem] bg-primary" />
          <div className="absolute -inset-4 -rotate-3 rounded-[2.5rem] bg-accent/80" />
          <img src={principal.url} alt="Principal of Nobel School" className="relative aspect-[4/5] w-full rounded-[2rem] object-cover shadow-lift" />
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-accent">Principal's message</p>
          <h2 className="mt-3 text-4xl font-bold text-primary-deep md:text-5xl">Every child can shine</h2>
          <blockquote className="mt-6 border-l-4 border-primary pl-6 font-display text-xl italic leading-relaxed text-foreground/80">
            “Our school promotes a safe, orderly, caring and supportive environment. Each student’s
            self-esteem is fostered by positive relationships with students and staff.”
          </blockquote>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            We strive to have our parents, teachers and community members actively involved in
            our students’ learning and moral training — so every child learns, grows and succeeds.
          </p>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="px-6">
        <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-green-gradient px-8 py-16 text-center text-primary-foreground shadow-lift md:px-16">
          <motion.div
            className="absolute -left-10 -top-10 size-48 rounded-full border-[18px] border-primary-foreground/10"
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute -bottom-16 -right-10 size-56 rounded-full bg-accent/30 blur-2xl" />
          <h2 className="relative text-balance text-4xl font-bold md:text-5xl">Start your child’s journey today</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Fill the online admission form in a few minutes. Our admissions team will contact you
            to discuss the next steps.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="apply" size="xl">
              <Link to="/admissions">Apply online <ArrowRight /></Link>
            </Button>
            <Button asChild variant="glass" size="xl">
              <a href={SCHOOL.whatsapp} target="_blank" rel="noreferrer">WhatsApp {SCHOOL.phoneDisplay}</a>
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
