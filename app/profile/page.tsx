import Image from "next/image";
import Link from "next/link";
import {
  Award,
  BookOpen,
  Bookmark,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  Droplets,
  Leaf,
  MapPin,
  PlayCircle,
  ScrollText,
  ShieldCheck,
  Sprout,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

const stats = [
  { label: "Missions Joined", value: "16", icon: ClipboardList },
  { label: "Knowledge Shared", value: "24", icon: BookOpen },
  { label: "Eco Points", value: "880", icon: Leaf },
];

const badges = [
  { name: "Bird Friend", image: "/images/profile/badges/bird-friend-badge.png" },
  { name: "Water Protector", image: "/images/profile/badges/water-protector-badge.png" },
  { name: "Traditional Knowledge Keeper", image: "/images/profile/badges/tradition-keeper-badge.png" },
  { name: "Green Warrior", image: "/images/profile/badges/green-warrior-badge.png" },
];

const contributions = [
  { label: "My Missions", icon: ClipboardList, href: "/living-traditions-missions" },
  { label: "My Knowledge Entries", icon: BookOpen, href: "/share-traditional-knowledge" },
  { label: "My Wisdom Reels", icon: PlayCircle, href: "/community?tab=reels" },
  { label: "My Report", icon: Bookmark, href: "/profile/report" },
  { label: "My Certificates", icon: ScrollText, href: "#achievements" },
];

const activities = [
  { label: "Shared knowledge on", detail: "Water Conservation", time: "2h ago", icon: Droplets, tone: "bg-[#e6f3f2] text-js-blue-dark" },
  { label: "Joined mission:", detail: "Plant for Rivers", time: "1d ago", icon: Sprout, tone: "bg-[#eaf1d8] text-js-green" },
  { label: "Earned badge:", detail: "Green Warrior", time: "3d ago", icon: Award, tone: "bg-[#f6ecd3] text-js-gold" },
  { label: "Saved place:", detail: "Ganga Ghat, Patna", time: "5d ago", icon: MapPin, tone: "bg-[#e8efda] text-js-green" },
];

const cardClass = "rounded-xl border border-js-gold/25 bg-[#fffaf0]/90 shadow-card";

export default function ProfilePage() {
  return (
    <div className="min-h-screen overflow-x-hidden folk-pattern-bg">
      <Sidebar />
      <main className="relative min-h-screen pb-24 md:ml-[196px] md:pb-7">
        <div className="mx-auto grid w-full max-w-[1320px] gap-5 px-4 py-4 md:px-7 md:py-6 min-[1180px]:grid-cols-[minmax(0,1fr)_340px]">
          <section className="grid min-w-0 gap-4">
            <ProfileCard />
            <Stats />
            <Badges />
            <Contributions />
          </section>

          <aside className="grid content-start gap-4">
            <RecentActivity />
            <Achievements />
            <QuoteCard />
          </aside>
        </div>
      </main>
    </div>
  );
}

function ProfileCard() {
  return (
    <section className={`${cardClass} relative overflow-hidden p-5 md:p-6`}>
      <Image
        src="/images/profile/profile-watermark.png"
        alt=""
        fill
        sizes="320px"
        className="pointer-events-none hidden object-contain object-right opacity-30 md:block"
      />
      <div className="relative z-10 flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
        <Image
          src="/images/profile/sita-devi-profile.png"
          alt="Sita Devi"
          width={176}
          height={176}
          priority
          className="h-36 w-36 shrink-0 rounded-full border-2 border-js-gold/35 object-cover shadow-card md:h-44 md:w-44"
        />
        <div>
          <h1 className="font-display text-3xl font-bold text-js-green-dark md:text-[36px]">Sita Devi</h1>
          <span className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#eaf1d8] px-3 py-2 text-sm font-bold text-js-green-dark">
            <ShieldCheck size={18} className="fill-js-green text-white" />
            Jal Guardian
          </span>
          <p className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-js-text sm:justify-start md:text-base">
            <MapPin size={18} className="text-js-green" />
            Madhubani, Bihar
          </p>
          <p className="mt-2 flex items-center justify-center gap-2 text-sm font-semibold text-js-text sm:justify-start md:text-base">
            <CalendarDays size={18} className="text-js-green" />
            Member since May 2024
          </p>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className={`${cardClass} grid grid-cols-3 overflow-hidden`}>
      {stats.map(({ label, value, icon: Icon }) => (
        <article key={label} className="flex min-w-0 flex-col items-center justify-center border-r border-js-gold/20 px-2 py-4 text-center last:border-r-0 md:flex-row md:gap-4 md:px-4 md:text-left">
          <span className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#eef2dc] text-js-green md:flex">
            <Icon size={27} strokeWidth={1.7} />
          </span>
          <div>
            <p className="text-xs font-bold leading-tight text-js-text md:text-[15px]">{label}</p>
            <p className="mt-2 font-display text-3xl font-bold leading-none text-js-green-dark md:text-[38px]">{value}</p>
          </div>
        </article>
      ))}
    </section>
  );
}

function Badges() {
  return (
    <section id="badges" className={`${cardClass} scroll-mt-4 p-4 md:p-5`}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-bold text-js-green-dark">My Badges</h2>
        <Link href="#badges" className="flex items-center gap-1 text-sm font-bold text-js-green transition-colors hover:text-js-green-dark">
          View All <ChevronRight size={16} />
        </Link>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {badges.map((badge) => (
          <article key={badge.name} className="text-center">
            <Image src={badge.image} alt={badge.name} width={120} height={120} className="mx-auto h-auto w-full max-w-[116px]" />
            <p className="mx-auto mt-2 max-w-[150px] text-sm font-bold leading-tight text-js-text">{badge.name}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Contributions() {
  return (
    <section className={`${cardClass} p-4 md:p-5`}>
      <h2 className="font-display text-2xl font-bold text-js-green-dark">My Contributions</h2>
      <div className="mt-3 overflow-hidden rounded-xl border border-js-gold/20 bg-[#fffdf6]/65">
        {contributions.map(({ label, icon: Icon, href }) => (
          <Link key={label} href={href} className="flex min-h-[54px] w-full items-center gap-4 border-b border-js-gold/15 px-4 text-left text-sm font-semibold text-js-text transition-colors last:border-b-0 hover:bg-[#f4eedc] md:text-base">
            <Icon size={21} className="shrink-0 text-js-green-dark" strokeWidth={1.7} />
            <span className="flex-1">{label}</span>
            <ChevronRight size={20} className="text-js-green-dark" />
          </Link>
        ))}
      </div>
    </section>
  );
}

function RecentActivity() {
  return (
    <section className={`${cardClass} p-4`}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-[22px] font-bold text-js-green-dark">Recent Activity</h2>
        <Link href="/community" className="text-sm font-bold text-js-green transition-colors hover:text-js-green-dark">View All</Link>
      </div>
      <div className="mt-3 grid gap-2">
        {activities.map(({ label, detail, time, icon: Icon, tone }) => (
          <article key={detail} className="flex items-center gap-3 rounded-lg px-1 py-2 transition-colors hover:bg-[#f4eedc]">
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-js-gold/20 ${tone}`}>
              <Icon size={22} strokeWidth={1.8} />
            </span>
            <div className="min-w-0">
              <p className="text-[13px] leading-5 text-js-text">
                {label} <span className="font-bold">{detail}</span>
              </p>
              <p className="text-xs text-js-text-light">{time}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Achievements() {
  return (
    <section id="achievements" className={`${cardClass} scroll-mt-4 p-4`}>
      <h2 className="font-display text-[22px] font-bold text-js-green-dark">Achievements</h2>
      <div className="mt-3 flex items-center gap-4">
        <div className="relative flex h-[124px] w-[124px] shrink-0 items-center justify-center rounded-full bg-[conic-gradient(#4f8a38_0_88%,#e3dfca_88%_100%)]">
          <div className="flex h-[105px] w-[105px] flex-col items-center justify-center rounded-full bg-[#fffaf0]">
            <span className="font-display text-[34px] font-bold leading-none text-js-green-dark">880</span>
            <span className="mt-1 text-xs font-bold text-js-text">Eco Points</span>
          </div>
          <Leaf size={25} className="absolute bottom-1 right-0 fill-js-green text-js-green" />
        </div>
        <div>
          <p className="text-base font-bold text-js-green-dark">Great going, Sita!</p>
          <p className="mt-2 text-sm leading-5 text-js-text-light">You&apos;re helping create a greener tomorrow.</p>
        </div>
      </div>
      <Link href="#achievements" className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-js-gold/25 bg-[#eef0d9] text-sm font-bold text-js-green-dark transition-colors hover:bg-[#e4e9c7]">
        <Leaf size={17} className="fill-js-green text-js-green" />
        See All Achievements
      </Link>
    </section>
  );
}

function QuoteCard() {
  return (
    <section className={`${cardClass} relative min-h-[168px] overflow-hidden bg-[#eef0d9] p-5`}>
      <p className="relative z-10 max-w-[220px] font-display text-xl font-semibold italic leading-7 text-js-green-dark">
        <span className="mr-1 text-4xl leading-none text-js-green">&ldquo;</span>
        Water connects us all. Let&apos;s protect it together.
        <span className="ml-1 text-2xl text-js-green">&rdquo;</span>
      </p>
      <Image
        src="/images/profile/profile-footer-bird.png"
        alt=""
        width={190}
        height={132}
        className="absolute bottom-0 right-0 w-[46%] max-w-[170px] object-contain object-bottom"
      />
    </section>
  );
}
