import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { BottomNavigation } from './BottomNavigation';
import { TopBanner } from './TopBanner';
import { useLogcomStore } from '../../store/useLogcomStore';

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const poligonMode = useLogcomStore((state) => state.poligonMode);

  useEffect(() => {
    document.documentElement.classList.toggle('poligon', poligonMode);
  }, [poligonMode]);

  return (
    <div className="min-h-dvh bg-logcom-paper text-logcom-ink transition-colors duration-300 poligon:bg-poligon-950 poligon:text-poligon-50">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(124,154,63,0.22),transparent_30rem),radial-gradient(circle_at_bottom_right,rgba(182,162,104,0.28),transparent_34rem),linear-gradient(135deg,rgba(247,242,231,1),rgba(231,220,195,1))] transition-colors duration-300 poligon:bg-[radial-gradient(circle_at_top_left,rgba(159,232,112,0.12),transparent_28rem),radial-gradient(circle_at_bottom_right,rgba(74,93,35,0.16),transparent_34rem),linear-gradient(135deg,rgba(8,16,8,1),rgba(15,23,18,1))]" />
      <div className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col px-3 pb-28 pt-3 sm:px-6 sm:pb-32 sm:pt-4 lg:px-8">
        <TopBanner />
        <motion.main
          key="app-content"
          className="flex-1 pt-4 sm:pt-6"
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
