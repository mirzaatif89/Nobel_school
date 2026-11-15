import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";

import { SCHOOL } from "@/lib/site";

export function WhatsAppButton() {
  return (
    <motion.a
      href={SCHOOL.whatsapp}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: "spring" }}
      whileHover={{ scale: 1.1 }}
      className="fixed bottom-5 right-5 z-40 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lift"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" />
      <MessageCircle className="relative size-7" />
    </motion.a>
  );
}
