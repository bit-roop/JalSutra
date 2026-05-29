import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  Bird,
  Droplet,
  Fish,
  Leaf,
  Sprout,
  Tractor,
  Users,
  Activity,
  Bookmark,
  Star,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import OrnamentalCard from "@/components/OrnamentalCard";
import { missions } from "@/lib/missions";

const categories = [
  { label: "All", icon: null },
  { label: "Birds", icon: Bird },
  { label: "Fish", icon: Fish },
  { label: "Water", icon: Droplet },
  { label: "Plants", icon: Leaf },
  { label: "Farming", icon: Tractor },
];

type LivingTraditionsMissionsPageProps = {
  searchParams?: {
    category?: string;
  };
};

const alerts = [
  { title: "Water level in your area has improved", time: "2h ago", icon: Droplet, bg: "#dbeeff", color: "#2f7fa5" },
  { title: "New Planting Mission starts tomorrow", time: "5h ago", icon: Sprout, bg: "#e6ebc6", color: "#55753a" },
  { title: "Spotted: Indian Roller in your region!", time: "1d ago", icon: Bird, bg: "#f0dba7", color: "#445b38" },
  { title: "Community meeting this Sunday", time: "2d ago", icon: Users, bg: "#f2ceb9", color: "#445b38" },
];

const activity = [
  { text: "Ramesh Kumar joined Earthen Nest for Sparrow", time: "1h ago", image: "/images/missions/earthen-nest.jpg" },
  { text: "Sunita Devi earned 150 points in Summer Water Bowl", time: "3h ago", image: "/images/missions/summer-water-bowl.jpg" },
  { text: "New mission posted by JalSutra Community", time: "5h ago", icon: Sprout },
  { text: "Mahesh Patel shared a photo from their village pond", time: "1d ago", image: "/images/missions/big-mesh.jpg" },
];

function joinedLabel(participants: number) {
  if (participants >= 1000) {
    return `${(participants / 1000).toFixed(1)}k joined`;
  }

  return `${participants.toLocaleString()} joined`;
}

function TitleSeparator({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 76 16"
      className={flip ? "h-4 w-16 rotate-180 text-js-green" : "h-4 w-16 text-js-green"}
      fill="none"
    >
      <path d="M3 8 H60" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M15 8 C11 2 6 3 3 7 C8 10 12 11 15 8Z" fill="currentColor" opacity="0.72" />
      <path d="M28 8 C24 2 19 3 16 7 C21 10 25 11 28 8Z" fill="currentColor" opacity="0.58" />
      <path d="M41 8 C37 2 32 3 29 7 C34 10 38 11 41 8Z" fill="currentColor" opacity="0.46" />
    </svg>
  );
}

export default function LivingTraditionsMissionsPage({ searchParams }: LivingTraditionsMissionsPageProps) {
  const activeCategory = categories.some((category) => category.label === searchParams?.category)
    ? searchParams?.category
    : "All";
  const visibleMissions =
    activeCategory && activeCategory !== "All"
      ? missions.filter((mission) => mission.category === activeCategory)
      : missions;

  return (
    <div className="min-h-screen overflow-x-hidden folk-pattern-bg">
      <Sidebar />

      <div className="md:ml-[196px] min-h-screen pb-24 md:pb-5">
        <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-4 px-4 py-4 md:px-5 min-[1180px]:grid min-[1180px]:grid-cols-[minmax(0,1fr)_304px]">
          <main className="min-w-0 rounded-xl border border-js-brown/20 bg-[#fbf7eb]/78 px-4 py-4 shadow-card md:px-6 md:py-6">
            <div className="hidden items-center justify-center gap-6 md:flex">
              <TitleSeparator />
              <h1 className="whitespace-nowrap text-center font-display text-[31px] font-bold leading-tight text-js-green-dark min-[1320px]:text-[38px]">
                Living Traditions Missions
              </h1>
              <TitleSeparator flip />
            </div>

            <div className="mb-4 flex items-center gap-3 md:hidden">
              <Link href="/" className="flex h-9 w-9 items-center justify-center rounded-full text-js-text" aria-label="Back home">
                <span className="text-3xl leading-none">‹</span>
              </Link>
              <h1 className="min-w-0 flex-1 whitespace-nowrap text-center font-display text-[17px] font-bold leading-tight text-js-text">
                Living Traditions Missions
              </h1>
              <span className="h-9 w-9" />
            </div>

            <nav
              aria-label="Mission categories"
              className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] md:mt-5 md:justify-center md:gap-3 md:overflow-visible [&::-webkit-scrollbar]:hidden"
            >
              {categories.map(({ label, icon: Icon }, index) => (
                <Link
                  key={label}
                  href={
                    label === "All"
                      ? "/living-traditions-missions"
                      : `/living-traditions-missions?category=${encodeURIComponent(label)}`
                  }
                  className={
                    activeCategory === label
                      ? "flex h-10 shrink-0 items-center gap-2 rounded-xl bg-js-green px-6 text-sm font-semibold text-[#fff8df] shadow-card md:min-w-[78px] md:justify-center"
                      : "flex h-10 shrink-0 items-center gap-2 rounded-xl border border-js-gold/30 bg-[#fbf7eb]/78 px-5 text-sm font-semibold text-js-text shadow-sm"
                  }
                  aria-current={activeCategory === label ? "page" : undefined}
                >
                  {Icon ? (
                    <Icon
                      size={19}
                      className={activeCategory === label ? "text-[#fff8df]" : "text-js-green"}
                      strokeWidth={2}
                    />
                  ) : null}
                  {label}
                </Link>
              ))}
            </nav>

            <section className="relative mt-2 overflow-hidden rounded-xl border border-js-gold/25 md:mt-3">
              <Image
                src="/images/missions/missions-banner.jpg"
                alt="Traditional tree planting mission illustration"
                width={844}
                height={206}
                className="hidden h-[174px] w-full object-cover md:block"
                priority
              />
              <div className="relative block h-[104px] w-full overflow-hidden bg-[#fbf7eb] md:hidden">
                <Image
                  src="/images/missions/missions-banner.jpg"
                  alt="Traditional tree planting mission illustration"
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority
                />
              </div>
            </section>

            <h2 className="mt-6 text-[20px] font-bold text-js-text md:hidden">Popular Missions</h2>

            <section id="popular-missions" className="mt-4 grid gap-4 md:grid-cols-2 md:gap-5">
              {visibleMissions.map((mission, index) => (
                <Link
                  key={mission.id}
                  href={`/living-traditions-missions/${mission.id}`}
                  className="block"
                >
                  <OrnamentalCard
                    className="feature-card h-full rounded-xl border-js-brown/20 bg-[#fbf7eb]/86"
                    innerClassName="h-full"
                    accent={mission.category === "Fish" ? "river" : "leaf"}
                    ornament="none"
                  >
                    <article className="relative h-full overflow-hidden rounded-xl md:grid md:grid-cols-[47%_53%]">
                      <div className="relative h-[190px] md:h-full md:min-h-[228px]">
                        <Image
                          src={mission.image}
                          alt={mission.title}
                          fill
                          sizes="(min-width: 768px) 220px, 100vw"
                          className="object-cover"
                        />
                        <span className="absolute bottom-3 left-3 rounded-md border border-js-green/20 bg-[#eef2df]/95 px-2.5 py-1 text-sm font-bold text-js-green-dark shadow-sm md:hidden">
                          {mission.category}
                        </span>
                        <Bookmark className="absolute right-3 top-3 text-[#fff8df] drop-shadow md:hidden" size={28} strokeWidth={2.2} />
                      </div>

                      <div className="flex min-h-[176px] flex-col p-4 md:min-h-0 md:p-5">
                        <div className="mb-3 hidden items-start gap-2 md:flex">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-js-green text-sm font-bold text-[#fff8df]">
                            {index + 1}
                          </span>
                          <h3 className="font-display text-[21px] font-bold leading-tight text-js-green-dark">
                            {mission.title}
                          </h3>
                        </div>
                        <h3 className="text-[22px] font-bold leading-tight text-js-text md:hidden">{mission.title}</h3>
                        <p className="mt-2 text-[15px] font-semibold leading-7 text-js-text-light md:mt-0 md:text-[14px] md:font-medium md:leading-6">
                          {mission.description}
                        </p>
                        <div className="mt-auto flex items-end justify-between border-js-gold/20 pt-4 md:border-t">
                          <div className="flex items-center gap-2 text-js-text">
                            <Users size={19} className="text-js-green-dark" fill="currentColor" strokeWidth={0} />
                            <div>
                              <p className="hidden text-sm font-bold md:block md:text-[15px]">{mission.participants.toLocaleString()}</p>
                              <p className="hidden text-xs text-js-text-light md:block">Participants</p>
                              <p className="text-sm font-bold md:hidden">{joinedLabel(mission.participants)}</p>
                            </div>
                          </div>
                          <div className="hidden h-9 w-px bg-js-gold/25 md:block" />
                          <div className="text-right text-js-green-dark">
                            <div className="hidden items-center gap-1 md:flex">
                              <Star size={20} className="fill-js-green text-js-green" />
                              <p className="text-[17px] font-bold">{mission.points}</p>
                            </div>
                            <p className="text-[22px] font-bold md:hidden">
                              {mission.id === "sparrow" ? 500 : mission.id === "mesh" ? 600 : 400}
                            </p>
                            <p className="text-xs text-js-text-light">Points</p>
                          </div>
                        </div>
                      </div>
                    </article>
                  </OrnamentalCard>
                </Link>
              ))}
            </section>

            <footer className="mt-5 hidden items-center justify-center gap-4 text-center text-sm text-js-text-light md:flex">
              <TitleSeparator />
              <span>Every tradition is a step towards a sustainable future.</span>
              <TitleSeparator flip />
            </footer>
          </main>

          <aside className="hidden min-w-0 flex-col gap-3 min-[1180px]:flex">
            <OrnamentalCard accent="leaf" ornament="quiet" innerClassName="p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-js-green text-[#fff8df]">
                    <Bell size={24} />
                  </span>
                  <h2 className="font-display text-[22px] font-bold text-js-green-dark">Alerts</h2>
                </div>
                <Link href="#alerts" className="text-sm font-medium text-js-green">
                  View all
                </Link>
              </div>
              <div id="alerts" className="rounded-lg border border-js-gold/20 bg-[#fffaf0]/54 px-3">
                {alerts.map(({ title, time, icon: Icon, bg, color }) => (
                  <div key={title} className="flex gap-3 border-b border-dashed border-js-gold/30 py-3 last:border-b-0">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full" style={{ background: bg, color }}>
                      <Icon size={28} />
                    </span>
                    <div>
                      <p className="text-[15px] leading-snug text-js-text">{title}</p>
                      <p className="mt-1 text-xs text-js-text-light">{time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </OrnamentalCard>

            <OrnamentalCard accent="earth" ornament="quiet" innerClassName="p-4">
              <div className="mb-3 flex items-center justify-between border-b border-js-gold/25 pb-3">
                <div className="flex items-center gap-3">
                  <Activity size={30} className="text-js-green" />
                  <h2 className="font-display text-[22px] font-bold text-js-green-dark">Recent Activity</h2>
                </div>
                <Link href="#recent-activity" className="text-sm font-medium text-js-green">
                  View all
                </Link>
              </div>
              <div id="recent-activity">
                {activity.map(({ text, time, image, icon: Icon }) => (
                  <div key={text} className="flex gap-3 border-b border-js-gold/15 py-3 last:border-b-0">
                    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e6ebc6] text-js-green">
                      {image ? (
                        <Image src={image} alt="" fill sizes="40px" className="object-cover" />
                      ) : Icon ? (
                        <Icon size={23} />
                      ) : null}
                    </span>
                    <p className="flex-1 text-[14px] leading-snug text-js-text">{text}</p>
                    <span className="text-xs text-js-text-light">{time}</span>
                  </div>
                ))}
              </div>
              <div className="relative mt-4 h-[104px] overflow-hidden rounded-lg border border-js-gold/20">
                <Image src="/images/missions/quote-illustration.jpg" alt="Jal quote illustration" fill sizes="304px" className="object-cover" />
              </div>
            </OrnamentalCard>
          </aside>
        </div>
      </div>
    </div>
  );
}
