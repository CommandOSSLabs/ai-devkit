"use client";

import { useEffect } from "react";
import { rememberSkill } from "@/lib/recent-skills";

/** Records that this skill was opened, so the catalog can sort by recency. */
export function RememberSkill({ id }: { id: string }) {
  useEffect(() => {
    rememberSkill(id);
  }, [id]);
  return null;
}

export default RememberSkill;
