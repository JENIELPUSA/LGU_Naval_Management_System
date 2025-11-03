export const Footer = () => {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-xs sm:gap-4 sm:px-4 sm:py-3 sm:text-base">
      <p className="font-medium text-slate-900 dark:text-slate-50">
        © 2025 LGU Naval Management System All Rights Reserved
      </p>
      <div className="flex flex-wrap justify-end gap-x-1.5 sm:gap-x-2">
        <a href="#" className="link text-xs sm:text-base">
          Privacy Policy
        </a>
        <a href="#" className="link text-xs sm:text-base">
          Terms of Service
        </a>
      </div>
    </footer>
  );
};