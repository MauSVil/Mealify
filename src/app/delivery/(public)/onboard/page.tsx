"use client";

import type { Value } from "expry";

import { AnimatePresence, motion } from "framer-motion";
import Form from "@/components/formity/FormWrapper";
import ky from "ky";


const DeliveryOnboardPage = () => {
  const handleReturn = async (result: Value) => {
    try {
      const { data } = await ky.post('/api/delivery/complete-onboarding', { json: result }).json() as { data: string, error?: string };
      window.location.href = data;
    } catch (e) {
      console.error(e);
    }
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

export default DeliveryOnboardPage;
