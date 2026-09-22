import {
  Layers,
  Droplets,
  Sparkles,
  Feather,
  Grid,
  Truck,
  Mountain,
} from 'lucide-react';

export const ICON_MAP = {
  Layers,
  Droplets,
  Sparkles,
  Feather,
  Grid,
  Truck,
  Mountain,
};

export const THEME_STYLES = {
  amber: {
    gradient: 'from-amber-500/25 via-amber-600/10 to-slate-950',
    glow: 'group-hover:shadow-amber-500/40',
    icon: 'text-amber-400',
    ring: 'ring-amber-500/30',
    badge: 'bg-amber-500/15 text-amber-400 border-amber-500/40',
  },
  blue: {
    gradient: 'from-blue-500/25 via-blue-600/10 to-slate-950',
    glow: 'group-hover:shadow-blue-500/40',
    icon: 'text-blue-400',
    ring: 'ring-blue-500/30',
    badge: 'bg-blue-500/15 text-blue-400 border-blue-500/40',
  },
  orange: {
    gradient: 'from-orange-500/25 via-orange-600/10 to-slate-950',
    glow: 'group-hover:shadow-orange-500/40',
    icon: 'text-orange-400',
    ring: 'ring-orange-500/30',
    badge: 'bg-orange-500/15 text-orange-400 border-orange-500/40',
  },
  slate: {
    gradient: 'from-slate-400/20 via-stone-600/10 to-slate-950',
    glow: 'group-hover:shadow-slate-400/30',
    icon: 'text-slate-300',
    ring: 'ring-slate-400/30',
    badge: 'bg-slate-500/15 text-slate-300 border-slate-500/40',
  },
  red: {
    gradient: 'from-red-500/25 via-red-600/10 to-slate-950',
    glow: 'group-hover:shadow-red-500/40',
    icon: 'text-red-400',
    ring: 'ring-red-500/30',
    badge: 'bg-red-500/15 text-red-400 border-red-500/40',
  },
  emerald: {
    gradient: 'from-emerald-500/25 via-emerald-600/10 to-slate-950',
    glow: 'group-hover:shadow-emerald-500/40',
    icon: 'text-emerald-400',
    ring: 'ring-emerald-500/30',
    badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40',
  },
};

export const resolveMaterialVisual = (product) => {
  const theme = THEME_STYLES[product?.theme] || THEME_STYLES.amber;
  const Icon = ICON_MAP[product?.iconKey] || Layers;
  return { theme, Icon };
};
