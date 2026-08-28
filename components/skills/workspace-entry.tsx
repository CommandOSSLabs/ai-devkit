"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { normalizeSkillId } from "@/lib/skill-id";

/**
 * Resolves /skills/workspace?skill=…&file=…&mode=… onto the statically
 * generated /skills/<id>/workspace page, preserving the file and mode. The
 * query form is the address people share; the per-skill page is what actually
 * gets built, so this keeps both true without duplicating the workspace.
 */
export function WorkspaceEntry({ ids }: { ids: string[] }) {
  const router = useRouter();
  const [missing, setMissing] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const skill = normalizeSkillId(params.get("skill")) ?? "";
    if (!skill || !ids.includes(skill)) {
      setMissing(skill || null);
      return;
    }

    const forward = new URLSearchParams();
    const file = params.get("file");
    const mode = params.get("mode");
    if (file) forward.set("file", file);
    if (mode) forward.set("mode", mode);
    const search = forward.toString();
    router.replace(`/skills/${skill}/workspace${search ? `?${search}` : ""}`);
  }, [ids, router]);

  return (
    <div className="flex h-full min-h-0 flex-1 items-center justify-center">
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-[16px] border border-[var(--border-subtle)] bg-[var(--glass-frame)] px-6 py-14 text-center">
        {missing === null ? (
          <>
            <p className="text-[14px] text-[var(--text-secondary)]">Opening the workspace…</p>
            <Link href="/skills" className="text-[13px] text-[#82AAFF] hover:underline">
              Browse skills instead
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-[18px] font-semibold text-[var(--text-primary)]">No such skill</h1>
            <p className="text-[13.5px] leading-[1.6] text-[var(--text-secondary)]">
              <span className="font-mono">{missing}</span> is not a skill in this repository.
            </p>
            <Link
              href="/skills"
              className="inline-flex h-9 items-center rounded-lg border border-[var(--border-subtle)] px-3 text-[13px] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
            >
              Browse all skills
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default WorkspaceEntry;
