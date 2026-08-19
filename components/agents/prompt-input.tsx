"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Bot, Check, ChevronDown, Plus, Send, Square } from "lucide-react";

// Hand-built from a component doc (props table + a consumer usage example),
// not a full source dump like most other adapted references this session —
// `npx shadcn add @beui/prompt-input` needs a components.json this repo
// doesn't have and won't get (same call made for the earlier Watermelon
// registry attempt), so this implements the documented API/behavior
// directly against this project's own design tokens.

export type PromptModel = { value: string; label: string; icon?: React.ReactNode };
export type PromptAction = { value: string; label: string; description?: string; icon?: React.ReactNode };

export interface PromptInputProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  models?: PromptModel[];
  model?: string;
  defaultModel?: string;
  onModelChange?: (model: string) => void;
  actions?: PromptAction[];
  onAction?: (action: string) => void;
  onSubmit?: (value: string, model?: string) => void | Promise<void>;
  loading?: boolean;
  onStop?: () => void;
  minRows?: number;
  maxRows?: number;
  leadingAction?: React.ReactNode;
  className?: string;
}

const LINE_HEIGHT_PX = 20;

function useOutsideClick(ref: React.RefObject<HTMLElement | null>, onOutside: () => void, active: boolean) {
  React.useEffect(() => {
    if (!active) return;
    const onPointerDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOutside();
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [ref, onOutside, active]);
}

function ActionsMenu({ actions, onAction }: { actions: PromptAction[]; onAction?: (action: string) => void }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setOpen(false), open);

  if (actions.length === 0) return null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Prompt actions"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-tertiary)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
      >
        <Plus size={16} strokeWidth={1.75} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="absolute bottom-full left-0 z-20 mb-2 w-64 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.35)]"
          >
            {actions.map((a) => (
              <button
                key={a.value}
                type="button"
                role="menuitem"
                onClick={() => {
                  onAction?.(a.value);
                  setOpen(false);
                }}
                className="flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-[var(--bg-elevated)]"
              >
                <span className="mt-0.5 text-[var(--text-tertiary)] [&_svg]:h-4 [&_svg]:w-4">{a.icon}</span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-[13px] font-medium text-[var(--text-primary)]">{a.label}</span>
                  {a.description && <span className="text-[11.5px] text-[var(--text-tertiary)]">{a.description}</span>}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ModelSelect({
  models,
  model,
  onChange,
}: {
  models: PromptModel[];
  model?: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setOpen(false), open);

  if (models.length === 0) return null;
  const active = models.find((m) => m.value === model) ?? models[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-2.5 text-[12.5px] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
      >
        <span className="text-[var(--text-tertiary)] [&_svg]:h-3.5 [&_svg]:w-3.5">{active?.icon ?? <Bot size={14} />}</span>
        <span className="max-w-[130px] truncate">{active?.label}</span>
        <ChevronDown size={12} strokeWidth={1.75} className="text-[var(--text-tertiary)]" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="absolute bottom-full right-0 z-20 mb-2 w-56 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.35)]"
          >
            {models.map((m) => {
              const selected = m.value === active?.value;
              return (
                <button
                  key={m.value}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    onChange(m.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors ${
                    selected ? "text-[#82AAFF]" : "text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                  }`}
                >
                  <span className="text-[var(--text-tertiary)] [&_svg]:h-3.5 [&_svg]:w-3.5">{m.icon ?? <Bot size={14} />}</span>
                  <span className="flex-1 truncate">{m.label}</span>
                  {selected && <Check size={13} strokeWidth={2} />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SendButton({
  loading,
  disabled,
  onSend,
  onStop,
  reduceMotion,
}: {
  loading: boolean;
  disabled: boolean;
  onSend: () => void;
  onStop?: () => void;
  reduceMotion: boolean | null;
}) {
  return (
    <button
      type="button"
      onClick={loading ? onStop : onSend}
      disabled={!loading && disabled}
      aria-label={loading ? "Stop" : "Send"}
      className={`relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
        disabled && !loading
          ? "bg-[var(--bg-elevated)] text-[var(--text-disabled)]"
          : "bg-[#82AAFF] text-[var(--bg-surface)] hover:bg-[#82AAFF]/90"
      }`}
    >
      {loading && !reduceMotion && (
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-lg bg-[#82AAFF]"
          animate={{ scale: [1, 1.5], opacity: [0.45, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={loading ? "stop" : "send"}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.14 }}
          className="relative z-10 flex items-center justify-center"
        >
          {loading ? <Square size={12} strokeWidth={2} fill="currentColor" /> : <Send size={14} strokeWidth={2} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

export function PromptInput({
  value,
  defaultValue = "",
  onValueChange,
  models = [],
  model,
  defaultModel,
  onModelChange,
  actions = [],
  onAction,
  onSubmit,
  loading = false,
  onStop,
  minRows = 2,
  maxRows = 8,
  leadingAction,
  className = "",
}: PromptInputProps) {
  const reduceMotion = useReducedMotion();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const isValueControlled = value !== undefined;
  const currentValue = isValueControlled ? value : internalValue;

  const [internalModel, setInternalModel] = React.useState(defaultModel ?? models[0]?.value);
  const isModelControlled = model !== undefined;
  const currentModel = isModelControlled ? model : internalModel;

  const resize = React.useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const min = minRows * LINE_HEIGHT_PX;
    const max = maxRows * LINE_HEIGHT_PX;
    el.style.height = `${Math.min(Math.max(el.scrollHeight, min), max)}px`;
  }, [minRows, maxRows]);

  React.useEffect(() => {
    resize();
  }, [currentValue, resize]);

  const setValue = (next: string) => {
    if (!isValueControlled) setInternalValue(next);
    onValueChange?.(next);
  };

  const setModel = (next: string) => {
    if (!isModelControlled) setInternalModel(next);
    onModelChange?.(next);
  };

  const submit = () => {
    const trimmed = currentValue.trim();
    if (!trimmed || loading) return;
    onSubmit?.(trimmed, currentModel);
    if (!isValueControlled) setInternalValue("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div
      className={`flex flex-col gap-2 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors focus-within:border-[#82AAFF]/50 ${className}`}
    >
      <textarea
        ref={textareaRef}
        value={currentValue}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        rows={minRows}
        placeholder="Ask anything…"
        className="min-h-0 w-full resize-none bg-transparent text-[14px] leading-5 text-[var(--text-primary)] outline-none placeholder:text-[var(--text-disabled)]"
      />
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">{leadingAction ?? <ActionsMenu actions={actions} onAction={onAction} />}</div>
        <div className="flex items-center gap-1.5">
          <ModelSelect models={models} model={currentModel} onChange={setModel} />
          <SendButton
            loading={loading}
            disabled={currentValue.trim().length === 0}
            onSend={submit}
            onStop={onStop}
            reduceMotion={reduceMotion}
          />
        </div>
      </div>
    </div>
  );
}

export default PromptInput;
