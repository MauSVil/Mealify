"use client";

import type { Value } from "expry";

import { AnimatePresence, motion } from "framer-motion";
import Form from "@/components/DeliveryOnboard/Form";


export default function Home() {
  function handleReturn(result: Value) {
    console.log(result);
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key="form"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="h-full"
      >
        <Form onReturn={handleReturn} />
      </motion.div>
    </AnimatePresence>
  );
}
