import { motion } from 'framer-motion';
import { BottomNavigation } from './BottomNavigation';
import { TopBanner } from './TopBanner';

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-dvh bg-logcom-paper text-logcom-ink transition-colors duration-300 poligon:bg-poligon-950 poligon:text-poligon-50">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(124,154,63,0.18),transparent_32rem),linear-gradient(135deg,rgba(74,93,35,0.08),transparent_45%)] poligon:bg-[radial-gradient(circle_at_top_left,rgba(124,154,63,0.16),transparent_30rem),linear-gradient(135deg,rgba(6,10,7,0.96),rgba(15,23,18,0.98))]" />
      <div className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col px-4 pb-28 pt-4 sm:px-6 lg:px-8">
        <TopBanner />
        <motion.main
          key="app-content"
          className="flex-1"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.main>
      </div>
      <BottomNavigation />
    </div>
  );
}
