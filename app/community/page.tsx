import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  ChevronRight,
  Heart,
  Leaf,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  PlayCircle,
  Share2,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import NotificationBell from "@/components/NotificationBell";

const tabs = [
  { label: "All Stories", icon: BookOpen, active: true },
  { label: "Wisdom Reels", icon: PlayCircle, active: false },
  { label: "Discussions", icon: MessageCircle, active: false },
  { label: "Events", icon: CalendarDays, active: false },
];

const posts = [
  {
    name: "Sita Devi",
    avatar: "/images/community/avatar-sita.jpg",
    location: "Munger, Bihar",
    time: "2h ago",
    caption: "We made earthen nests in our village for sparrows.",
    hashtags: ["BirdConservation", "EarthenNest"],
    likes: 128,
    comments: 23,
    shares: 16,
    media: [
      "/images/community/sita-main.jpg",
      "/images/community/sita-2.jpg",
      "/images/community/sita-3.jpg",
      "/images/community/sita-4.jpg",
    ],
  },
  {
    name: "Raghunath Yadav",
    avatar: "/images/community/avatar-raghunath.jpg",
    location: "Fisherman, Bhagalpur",
    time: "5h ago",
    caption: "Using big mesh nets helps baby fishes to grow. This is our tradition.",
    hashtags: ["SustainableFishing", "Tradition"],
    likes: 96,
    comments: 8,
    shares: 11,
    media: ["/images/community/fishing-post.jpg"],
  },
];

const nearbyCards = [
  {
    title: "Bird conservation activity nearby",
    body: "Kharagpur, Munger",
    time: "2h ago",
    image: "/images/community/bird-conservation-card.jpg",
    tone: "border-[#a8c085] bg-[#f4f7e9]",
  },
  {
    title: "New mission added",
    body: "Plant 1000 native trees in your village",
    time: "4h ago",
    image: "/images/community/mission-added-card.jpg",
    tone: "border-[#e1c376] bg-[#fff7de]",
  },
  {
    title: "Wetland reported",
    body: "Thank you for helping protect our wetlands.",
    time: "6h ago",
    image: "/images/community/wetland-reported-card.jpg",
    tone: "border-[#9fc4cf] bg-[#edf7f8]",
  },
];

export default function CommunityPage() {
  return (
    <div className="min-h-screen overflow-x-hidden folk-pattern-bg">
      <Sidebar />

      <div className="relative min-h-screen pb-24 md:ml-[196px] md:pb-0">
        <header className="sticky top-0 z-20 border-b border-js-gold/25 bg-[#fbf5e8]/95 backdrop-blur md:static">
          <div className="relative mx-auto flex h-[86px] max-w-[1380px] items-center justify-center px-4 md:h-[88px]">
            <div className="hidden items-center gap-5 text-js-green md:flex">
              <DecorativeSprig />
              <h1 className="font-display text-[46px] font-bold leading-none text-js-green-dark">Community</h1>
              <DecorativeSprig flip />
            </div>
            <h1 className="font-display text-[25px] font-bold leading-none text-js-text md:hidden">Community</h1>

            <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 items-center gap-6 text-js-green-dark md:flex">
              <NotificationBell className="relative flex items-center justify-center" iconSize={29} />
              <Link href="/profile" aria-label="Profile">
                <Image
                  src="/images/community/avatar-sita.jpg"
                  alt="Profile"
                  width={46}
                  height={46}
                  className="rounded-full border border-js-gold/40 bg-[#f4e5c5]"
                />
              </Link>
            </div>
          </div>

          <nav className="mx-auto flex max-w-[760px] gap-5 overflow-x-auto px-4 [scrollbar-width:none] md:h-[48px] md:items-center md:justify-center md:gap-12 md:px-0 [&::-webkit-scrollbar]:hidden">
            {tabs.map(({ label, icon: Icon, active }) => (
              <button
                key={label}
                type="button"
                className={
                  active
                    ? "flex h-12 shrink-0 items-center gap-2 border-b-[3px] border-js-green px-1 text-sm font-bold text-js-green-dark md:text-base"
                    : "flex h-12 shrink-0 items-center gap-2 border-b-[3px] border-transparent px-1 text-sm font-semibold text-js-text md:text-base"
                }
              >
                <Icon size={21} className="hidden md:block" strokeWidth={1.8} />
                {label}
              </button>
            ))}
          </nav>
        </header>

        <main className="relative mx-auto grid w-full max-w-[1320px] gap-5 px-4 py-4 md:px-7 md:py-5 min-[1180px]:grid-cols-[minmax(0,680px)_360px] min-[1180px]:justify-center">
          <section className="grid min-w-0 gap-4">
            {posts.map((post, index) => (
              <article
                key={post.name}
                className="rounded-none border-b border-js-gold/20 bg-transparent pb-5 md:rounded-xl md:border md:border-js-gold/25 md:bg-[#fffaf0]/88 md:p-4 md:shadow-card"
              >
                <div className="flex items-start gap-3">
                  <Image
                    src={post.avatar}
                    alt={post.name}
                    width={56}
                    height={56}
                    className="h-12 w-12 shrink-0 rounded-full border border-js-gold/30 bg-[#f4e5c5] md:h-14 md:w-14"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-[17px] font-bold leading-tight text-js-text md:text-[19px]">{post.name}</h2>
                        <p className="mt-1 flex items-center gap-1 text-[13px] font-semibold text-js-green-dark md:text-[15px]">
                          <MapPin size={15} className="hidden fill-js-green text-js-green md:block" strokeWidth={0} />
                          {post.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-sm font-semibold text-js-text-light">
                        <span>{post.time}</span>
                        <MoreHorizontal size={20} className="hidden md:block" />
                      </div>
                    </div>
                    <p className="mt-3 max-w-[560px] text-[20px] font-bold leading-7 text-js-text md:text-[17px] md:font-medium md:leading-6">
                      {post.caption}
                    </p>
                  </div>
                </div>

                {index === 0 ? <NestGrid images={post.media} /> : <SingleImage image={post.media[0]} />}

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 px-1 text-sm font-semibold text-js-green-dark md:text-[15px]">
                  {post.hashtags.map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-[1fr_1fr_auto] border-js-gold/25 px-1 text-[15px] font-medium text-js-text md:border-t md:pt-3">
                  <button type="button" className="flex items-center gap-2">
                    <Heart size={22} className="fill-[#d83c4e] text-[#d83c4e]" strokeWidth={1.5} />
                    <span className="hidden md:inline">Like</span>
                    {post.likes}
                  </button>
                  <button type="button" className="flex items-center gap-2">
                    <MessageCircle size={22} strokeWidth={1.7} />
                    <span className="hidden md:inline">Comment</span>
                    {post.comments}
                  </button>
                  <button type="button" className="flex items-center gap-2">
                    <Share2 size={22} strokeWidth={1.9} />
                    <span className="hidden md:inline">Share</span>
                    <span className="hidden md:inline">{post.shares}</span>
                  </button>
                </div>
              </article>
            ))}
          </section>

          <aside className="hidden min-[1180px]:block">
            <section className="rounded-xl border border-js-gold/25 bg-[#fffaf0]/86 p-4 shadow-card">
              <div className="flex items-center gap-2">
                <Leaf size={20} className="text-js-green" />
                <h2 className="font-display text-[21px] font-bold text-js-green-dark">What&apos;s Happening Nearby</h2>
                <Leaf size={20} className="text-js-green" />
              </div>
              <div className="mt-3 h-px w-28 bg-js-gold/40" />

              <div className="mt-4 grid gap-3">
                {nearbyCards.map((card) => (
                  <article key={card.title} className={`flex items-center gap-4 rounded-xl border p-3 ${card.tone}`}>
                    <Image src={card.image} alt="" width={96} height={80} className="h-[82px] w-[96px] shrink-0 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[18px] font-bold leading-tight text-js-green-dark">{card.title}</h3>
                      <p className="mt-2 text-[15px] leading-5 text-js-text">{card.body}</p>
                      <p className="mt-2 text-sm text-js-text-light">{card.time}</p>
                    </div>
                    <ChevronRight size={25} className="shrink-0 text-js-green-dark" strokeWidth={1.8} />
                  </article>
                ))}

                <button type="button" className="flex h-[56px] items-center justify-between rounded-xl border border-js-gold/25 bg-[#fffaf0] px-4 text-[16px] font-semibold text-js-text">
                  <span className="flex items-center gap-3">
                    <Leaf size={20} className="text-js-green" />
                    View All Activity
                  </span>
                  <ChevronRight size={23} />
                </button>
              </div>
            </section>
          </aside>
        </main>

        <BottomDecoration />
      </div>
    </div>
  );
}

function NestGrid({ images }: { images: string[] }) {
  return (
    <div className="mt-3 grid h-[204px] grid-cols-3 gap-1 overflow-hidden rounded-lg md:h-[214px] md:grid-cols-[1.45fr_0.94fr_0.78fr]">
      <div className="relative col-span-1 row-span-2">
        <Image src={images[0]} alt="Earthen nest for sparrows" fill sizes="(min-width: 768px) 280px, 34vw" className="object-cover" />
      </div>
      <div className="relative hidden md:block">
        <Image src={images[1]} alt="Earthen nests hanging from branch" fill sizes="190px" className="object-cover" />
      </div>
      <div className="relative row-span-2">
        <Image src={images[3]} alt="Bird near an earthen nest" fill sizes="180px" className="object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 text-[0px] font-bold text-white md:hidden md:bg-transparent" />
      </div>
      <div className="relative hidden md:block">
        <Image src={images[2]} alt="Painted clay nest" fill sizes="190px" className="object-cover" />
      </div>
      <div className="relative md:hidden">
        <Image src={images[1]} alt="Earthen nest closeup" fill sizes="33vw" className="object-cover" />
      </div>
    </div>
  );
}

function SingleImage({ image }: { image: string }) {
  return (
    <div className="relative mt-3 h-[164px] overflow-hidden rounded-lg md:h-[138px]">
      <Image src={image} alt="Fishermen using big mesh net" fill sizes="(min-width: 768px) 680px, 100vw" className="object-cover" />
    </div>
  );
}

function DecorativeSprig({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 32"
      className={flip ? "h-8 w-20 -scale-x-100 text-js-green/70" : "h-8 w-20 text-js-green/70"}
      fill="none"
    >
      <path d="M9 19 C32 12 58 11 89 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M23 18 C16 7 8 6 4 13 C10 20 17 22 23 18Z" fill="currentColor" />
      <path d="M43 14 C35 2 27 3 23 10 C30 17 38 19 43 14Z" fill="currentColor" opacity=".82" />
      <path d="M62 12 C55 2 47 3 43 10 C50 16 57 17 62 12Z" fill="currentColor" opacity=".68" />
      <circle cx="88" cy="10" r="3" fill="#c29b55" />
    </svg>
  );
}

function BottomDecoration() {
  return (
    <div className="pointer-events-none fixed bottom-0 left-[196px] right-0 hidden h-[166px] min-[1180px]:block">
      <div className="absolute bottom-4 right-4 h-[150px] w-[520px]">
        <Image src="/images/community/bottom-fish-decoration.png" alt="" fill sizes="520px" className="object-contain object-bottom" />
      </div>
    </div>
  );
}
