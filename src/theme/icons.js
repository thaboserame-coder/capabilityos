/**
 * Maps the string `iconKey` values stored in data modules (tiers, badges) to
 * actual lucide-react icon components.
 *
 * Why this exists: keeping icon *components* out of `src/data/*` means that
 * data stays plain, serialisable JS/JSON — it could be fetched from a CMS or
 * API tomorrow without any change to its shape. UI components import this
 * map to resolve a tier's or badge's `iconKey` to the component that should
 * be rendered.
 */
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Check,
  ChevronRight,
  Loader2,
  RefreshCw,
  Shield,
  Target,
  Users,
} from "lucide-react";

/** @type {Record<string, React.ComponentType>} */
export const ICONS = {
  target: Target,
  users: Users,
  shield: Shield,
  award: Award,
  bookOpen: BookOpen,
  check: Check,
  chevronRight: ChevronRight,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  loader: Loader2,
  refresh: RefreshCw,
};

/**
 * Resolve an icon key to its component, falling back to BookOpen so a
 * missing/typo'd key never crashes the UI — it just renders a generic icon.
 * @param {string} key
 * @returns {React.ComponentType}
 */
export function getIcon(key) {
  return ICONS[key] ?? BookOpen;
}
