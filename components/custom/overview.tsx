import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

import {useTheme} from "@node_modules/next-themes";
import LogoDark from "@public/assets/logo-white.png";
import LogoLight from "@public/assets/logo.png";

export const Overview = () => {
  const { theme, systemTheme } = useTheme()
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
        <p className="flex flex-row justify-center gap-4 items-center">
          <Image src={
            theme === "dark" || (theme === "system" && systemTheme === "dark")
                ? LogoDark
                : LogoLight // Default to light if system is light
          }  alt="Logo" height={60} width={60}/>
        </p>
        <p>
          Rivine is an intelligent assistant that leverages Google&apos;s Gemini for advanced file analytics and visualizations, offering users an
          insightful and interactive experience to simplify data analysis. Created by {' '}
          <Link
              className="font-medium underline underline-offset-4"
              href="https://harivignesh.com"
              target="_blank"
          >
            Harivignesh
          </Link>{' '}.
        </p>

      </div>
    </motion.div>
  );
};
