import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import OrnamentalCard from "@/components/OrnamentalCard";

type PlaceholderPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
};

export default function PlaceholderPage({
  eyebrow,
  title,
  description,
  primaryHref = "/",
  primaryLabel = "Back Home",
}: PlaceholderPageProps) {
  return (
    <div className="min-h-screen overflow-x-hidden folk-pattern-bg">
      <Sidebar />
      <main className="md:ml-[196px] flex min-h-screen items-center justify-center px-4 py-8 pb-24 md:pb-8">
        <OrnamentalCard className="w-full max-w-2xl" accent="leaf" ornament="top-bottom">
          <div className="p-6 text-center md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-js-green">{eyebrow}</p>
            <h1 className="mt-3 font-display text-3xl font-bold text-js-green-dark md:text-4xl">{title}</h1>
            <p className="mx-auto mt-4 max-w-xl text-js-text-light">{description}</p>
            <Link
              href={primaryHref}
              className="mt-6 inline-flex rounded-xl bg-js-green px-5 py-2.5 font-semibold text-[#fff8df] shadow-card"
            >
              {primaryLabel}
            </Link>
          </div>
        </OrnamentalCard>
      </main>
    </div>
  );
}
