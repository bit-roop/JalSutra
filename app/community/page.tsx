"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  Bookmark,
  BookOpen,
  CalendarDays,
  ChevronRight,
  CheckCircle,
  Clock3,
  Heart,
  HelpCircle,
  Leaf,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Play,
  PlayCircle,
  Share2,
  ShieldCheck,
  X,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import NotificationBell from "@/components/NotificationBell";

const tabs = [
  { label: "All Stories", icon: BookOpen },
  { label: "Wisdom Reels", icon: PlayCircle },
  { label: "Discussions", icon: MessageCircle },
  { label: "Events", icon: CalendarDays },
];

type CommunityTab = (typeof tabs)[number]["label"];

function getActiveTab(tab: string | null): CommunityTab {
  if (tab === "reels") return "Wisdom Reels";
  if (tab === "discussions") return "Discussions";
  if (tab === "events") return "Events";
  return "All Stories";
}

function getTabParam(tab: CommunityTab) {
  if (tab === "Wisdom Reels") return "reels";
  if (tab === "Discussions") return "discussions";
  if (tab === "Events") return "events";
  return "";
}

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

const featuredReel = {
  title: "Flood Prediction through Traditional Knowledge",
  author: "Ramesh Yadav",
  location: "Farmer, Bihar",
  description: "My grandfather could predict floods by observing river color, bird behavior, wind direction, and the smell of wet soil before heavy rain. He believed that nature speaks through small signs that most people overlook. Changes in bird migration, unusual cloud formations, and shifts in river currents often signaled approaching floods. These observations were shared across generations and helped entire villages prepare in advance. Traditional ecological knowledge like this remains valuable even today alongside modern weather forecasting.",
  tags: ["WisdomReel", "TraditionalKnowledge", "FloodAwareness"],
  likes: "1.2K",
  comments: "312",
  shares: "256",
  duration: "0:45",
  cover: "/images/reels/main-reel-cover.jpg",
};

const suggestedReels = [
  {
    title: "Bird migration signs before rain",
    likes: "842",
    comments: "126",
    duration: "0:32",
    cover: "/images/reels/suggested-birds.jpg",
  },
  {
    title: "Fish behavior before monsoon",
    likes: "665",
    comments: "98",
    duration: "0:28",
    cover: "/images/reels/suggested-fish.jpg",
  },
  {
    title: "Sacred grove traditions",
    likes: "1K",
    comments: "143",
    duration: "0:40",
    cover: "/images/reels/suggested-grove.jpg",
  },
];

const discussionQuestion = {
  author: "Ramesh Kumar",
  avatar: "/images/discussions/avatar-ramesh.jpg",
  location: "Darbhanga, Bihar",
  time: "2h ago",
  text: "We are noticing early flooding signs. Birds are flying lower and ants moving rapidly. Does this indicate heavy rain?",
  tags: ["FloodSigns", "TraditionalKnowledge"],
};

const discussionReplies = [
  {
    author: "Dr. Anil Verma",
    avatar: "/images/discussions/avatar-anil.jpg",
    badge: "Analyst Verified",
    time: "1h ago",
    text: "Yes, birds flying lower can indicate increased humidity and falling air pressure. Ants move to higher ground to protect their nests from upcoming floods. These are reliable ecological indicators observed for generations.",
    image: "/images/discussions/discussion-birds.jpg",
    likes: 12,
    tone: "bg-[#eaf6ff]",
    badgeTone: "border-[#9dc9ef] bg-[#d9efff] text-[#1d5b8d]",
  },
  {
    author: "Sita Ram Yadav",
    avatar: "/images/discussions/avatar-sita.jpg",
    badge: "Local Villager",
    time: "45m ago",
    text: "In our village, we have seen this many times. When birds fly low in the evening and ants come out in big numbers, it usually rains heavily within 1-2 days. Our elders taught us to always watch nature.",
    image: "/images/discussions/discussion-ants.jpg",
    likes: 8,
    tone: "bg-[#fff6df]",
    badgeTone: "border-[#c8d7a3] bg-[#edf4d8] text-js-green-dark",
  },
  {
    author: "JalSutra Admin",
    avatar: "/images/discussions/avatar-admin.jpg",
    badge: "Admin Response",
    time: "20m ago",
    text: "IMD forecast indicates heavy rainfall in North Bihar in the next 48 hours. Please stay alert and move to safer places if needed. Avoid low-lying areas and follow local administration instructions.",
    image: "/images/discussions/discussion-flood.jpg",
    likes: 15,
    tone: "bg-[#edf8e7]",
    badgeTone: "border-[#a8d09a] bg-[#dff1d8] text-js-green-dark",
  },
];

const nearbyDiscussions = [
  {
    title: "Water logging in low lying areas",
    location: "Samastipur, Bihar",
    comments: 12,
    image: "/images/discussions/nearby-waterlogging.jpg",
  },
  {
    title: "Fish not coming near the surface",
    location: "Saharsa, Bihar",
    comments: 7,
    image: "/images/discussions/nearby-fish.jpg",
  },
  {
    title: "Community preparing for monsoon",
    location: "Madhubani, Bihar",
    comments: 9,
    image: "/images/discussions/nearby-community.jpg",
  },
];

const trendingTopics = ["FloodAlert", "FishBreeding", "Wetlands"];

const verificationEvents = [
  {
    name: "Ganga Ghat Cleanliness Drive",
    location: "Bhagalpur, Bihar",
    status: "Upcoming",
    image: "/images/events/verification-ganga.jpg",
  },
  {
    name: "Talab Safai Abhiyan",
    location: "Ranchi, Jharkhand",
    status: "Ongoing",
    image: "/images/events/verification-talab.jpg",
  },
  {
    name: "Nadi Kinare Plantation Drive",
    location: "Dhanbad, Jharkhand",
    status: "Ongoing",
    image: "/images/events/verification-riverbank.jpg",
  },
  {
    name: "Plastic Free Market Campaign",
    location: "Hazaribagh, Jharkhand",
    status: "Completed",
    image: "/images/events/verification-market.jpg",
  },
  {
    name: "School Sapling Drive",
    location: "Jamshedpur, Jharkhand",
    status: "Completed",
    image: "/images/events/verification-sapling.jpg",
  },
];

export default function CommunityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = getActiveTab(searchParams.get("tab"));
  const [activeReel, setActiveReel] = useState(featuredReel);

  function updateTab(label: CommunityTab) {
    const tabParam = getTabParam(label);
    router.push(tabParam ? `/community?tab=${tabParam}` : "/community");
  }

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
            {tabs.map(({ label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                onClick={() => updateTab(label)}
                className={
                  activeTab === label
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

        {activeTab === "Wisdom Reels" ? (
          <WisdomReelsTab activeReel={activeReel} onSelectReel={(reel) => setActiveReel({ ...featuredReel, ...reel, shares: featuredReel.shares })} />
        ) : activeTab === "Discussions" ? (
          <DiscussionsTab />
        ) : activeTab === "Events" ? (
          <EventsTab />
        ) : (
          <AllStoriesContent />
        )}

        {activeTab === "All Stories" ? <BottomDecoration /> : null}
      </div>
    </div>
  );
}

function EventsTab() {
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  return (
    <>
      <main className="relative mx-auto grid w-full max-w-[1320px] gap-5 px-4 py-4 md:px-7 md:py-5 min-[1180px]:grid-cols-[minmax(0,760px)_350px] min-[1180px]:justify-center">
        <section className="grid min-w-0 gap-5">
          <section>
            <h2 className="mb-2 flex items-center gap-2 text-[22px] font-bold text-js-green-dark">
              <Leaf size={22} />
              Upcoming Event
            </h2>
            <article className="overflow-hidden rounded-xl border border-js-gold/25 bg-[#fffaf0]/92 shadow-card md:grid md:grid-cols-[350px_1fr]">
              <div className="relative h-[235px] md:h-full">
                <Image src="/images/events/upcoming-ganga-ghat.jpg" alt="Ganga Ghat Cleanliness Drive" fill sizes="350px" className="object-cover" />
              </div>
              <div className="relative p-4 md:p-5">
                <span className="absolute right-4 top-4 rounded-md bg-[#fff0df] px-3 py-1 text-xs font-bold text-js-orange">Upcoming</span>
                <h3 className="max-w-[260px] text-[22px] font-bold leading-tight text-js-green-dark">Ganga Ghat Cleanliness Drive</h3>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[13px] font-semibold text-js-text">
                  <span className="flex items-center gap-1.5"><CalendarDays size={16} /> 25 May 2025</span>
                  <span className="flex items-center gap-1.5"><Clock3 size={16} /> 7:00 AM - 10:00 AM</span>
                  <span className="flex items-center gap-1.5"><MapPin size={16} /> Ganga Ghat, Bhagalpur, Bihar</span>
                </div>
                <p className="mt-4 text-[14px] font-semibold leading-5 text-js-text">
                  Let&apos;s come together as a community to clean our sacred Ganga Ghat and make it clean, green and beautiful.
                </p>
                <p className="mt-1 text-[14px] font-semibold text-js-text">Your small step can bring a big change.</p>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-[#edf5df] px-3 py-2 text-xs font-bold text-js-green-dark">Environment</span>
                  <span className="rounded-md bg-[#fff0df] px-3 py-2 text-xs font-bold text-js-orange">Community</span>
                  <button type="button" onClick={() => setIsJoinOpen(true)} className="ml-auto rounded-md bg-js-green-dark px-5 py-2.5 text-sm font-bold text-white">
                    Join Event
                  </button>
                </div>
              </div>
            </article>
          </section>

          <section>
            <h2 className="mb-2 flex items-center gap-2 text-[22px] font-bold text-js-green-dark">
              <Leaf size={22} />
              Ongoing &amp; Completed Events
            </h2>
            <div className="grid overflow-hidden rounded-xl border border-js-gold/25 bg-[#fffaf0]/92 shadow-card md:grid-cols-2">
              <ImpactEventCard
                title="Talab Safai Abhiyan"
                location="Kanke Talab, Ranchi, Jharkhand"
                status="Ongoing"
                before="/images/events/ongoing-talab-before.jpg"
                after="/images/events/ongoing-talab-current.jpg"
                afterLabel="Current Progress"
                progress={65}
              />
              <ImpactEventCard
                title="Plastic Free Market Campaign"
                location="Hazaribagh Market, Jharkhand"
                status="Completed"
                before="/images/events/completed-market-before.jpg"
                after="/images/events/completed-market-after.jpg"
                afterLabel="After"
              />
            </div>
          </section>

        </section>

        <VerificationPanel />
      </main>
      {isJoinOpen ? <JoinEventModal onClose={() => setIsJoinOpen(false)} /> : null}
    </>
  );
}

function ImpactEventCard({
  title,
  location,
  status,
  before,
  after,
  afterLabel,
  progress,
}: {
  title: string;
  location: string;
  status: string;
  before: string;
  after: string;
  afterLabel: string;
  progress?: number;
}) {
  return (
    <article className="border-b border-js-gold/25 p-4 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[19px] font-bold text-js-green-dark">{title}</h3>
          <p className="mt-1 flex items-center gap-1 text-[13px] font-semibold text-js-text"><MapPin size={14} /> {location}</p>
        </div>
        <span className={status === "Ongoing" ? "rounded-md bg-[#e6f0ff] px-2 py-1 text-xs font-bold text-[#28608f]" : "rounded-md bg-[#edf5df] px-2 py-1 text-xs font-bold text-js-green-dark"}>
          {status}
        </span>
      </div>
      {progress ? (
        <div className="mt-4">
          <div className="flex justify-between text-xs font-bold text-js-text"><span>Progress</span><span>{progress}% Completed</span></div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e1dfd2]"><div className="h-full rounded-full bg-js-green" style={{ width: `${progress}%` }} /></div>
        </div>
      ) : null}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <EventImage image={before} label="Before" />
        <EventImage image={after} label={afterLabel} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-bold">
        <span className="flex items-center gap-1.5 rounded-md bg-[#edf5df] px-2.5 py-2 text-js-green-dark"><ShieldCheck size={17} /> Verified Impact</span>
        <span className="text-js-text-light">Before/After validated by AI</span>
      </div>
    </article>
  );
}

function EventImage({ image, label }: { image: string; label: string }) {
  return (
    <div>
      <p className="mb-1 text-xs font-bold text-js-text">{label}</p>
      <div className="relative h-[112px] overflow-hidden rounded-lg">
        <Image src={image} alt={label} fill sizes="180px" className="object-cover" />
      </div>
    </div>
  );
}

function VerificationPanel() {
  return (
    <aside className="overflow-hidden rounded-xl border border-js-gold/25 bg-[#fffaf0]/92 shadow-card">
      <div className="bg-[#a74620] p-4 text-white">
        <h2 className="text-[21px] font-bold">Event Verification Panel</h2>
        <p className="mt-1 text-xs font-semibold">AI + Community + Government Verified</p>
      </div>
      <div className="grid grid-cols-4 border-b border-js-gold/20 p-3 text-center text-xs font-bold">
        {["All", "Upcoming", "Ongoing", "Completed"].map((tab, index) => (
          <button key={tab} type="button" className={index === 0 ? "rounded-full bg-js-green px-2 py-2 text-white" : "px-1 py-2 text-js-text"}>
            {tab}
          </button>
        ))}
      </div>
      <div className="px-3">
        {verificationEvents.map((event) => (
          <article key={event.name} className="flex gap-3 border-b border-js-gold/20 py-3">
            <Image src={event.image} alt="" width={88} height={74} className="h-[74px] w-[88px] shrink-0 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <h3 className="text-[14px] font-bold leading-tight text-js-green-dark">{event.name}</h3>
              <p className="mt-1 text-xs font-semibold text-js-text-light">{event.location}</p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <span className={event.status === "Upcoming" ? "rounded bg-[#fff0df] px-2 py-1 text-[11px] font-bold text-js-orange" : event.status === "Ongoing" ? "rounded bg-[#e6f0ff] px-2 py-1 text-[11px] font-bold text-[#28608f]" : "rounded bg-[#edf5df] px-2 py-1 text-[11px] font-bold text-js-green-dark"}>
                  {event.status}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-js-green-dark"><ShieldCheck size={14} /> Govt. Verified</span>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="relative h-[74px]">
        <Image src="/images/events/verification-footer.png" alt="" fill sizes="350px" className="object-cover" />
      </div>
    </aside>
  );
}

function JoinEventModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/35 px-4">
      <div className="w-full max-w-md rounded-xl border border-js-gold/25 bg-[#fffaf0] p-5 shadow-card">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[22px] font-bold text-js-green-dark">Join Event</h2>
          <button type="button" onClick={onClose} aria-label="Close modal" className="text-js-text-light"><X size={24} /></button>
        </div>
        <div className="mt-5 grid gap-3 text-sm">
          <p><span className="font-bold">Event Name:</span> Ganga Ghat Cleanliness Drive</p>
          <p><span className="font-bold">Date:</span> 25 May 2025</p>
          <p><span className="font-bold">Location:</span> Ganga Ghat, Bhagalpur, Bihar</p>
        </div>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-md border border-js-gold/30 px-4 py-2 text-sm font-bold text-js-text">Cancel</button>
          <button type="button" onClick={onClose} className="rounded-md bg-js-green px-4 py-2 text-sm font-bold text-white">Confirm Participation</button>
        </div>
      </div>
    </div>
  );
}

function DiscussionsTab() {
  const [isAskOpen, setIsAskOpen] = useState(false);

  return (
    <>
      <main className="relative mx-auto grid w-full max-w-[1320px] gap-5 px-4 py-4 md:px-7 md:py-5 min-[1180px]:grid-cols-[minmax(0,760px)_350px] min-[1180px]:justify-center">
        <section className="grid min-w-0 gap-3 md:gap-4">
          <QuestionCard />
          {discussionReplies.map((reply) => (
            <ReplyCard key={reply.author} reply={reply} />
          ))}
        </section>

        <aside className="grid min-w-0 gap-4">
          <NearbyDiscussionsPanel />
          <TrendingTopicsPanel />
          <AskQuestionCard onOpen={() => setIsAskOpen(true)} />
        </aside>
      </main>

      {isAskOpen ? <AskQuestionModal onClose={() => setIsAskOpen(false)} /> : null}
    </>
  );
}

function QuestionCard() {
  return (
    <article className="rounded-xl border border-js-gold/20 bg-[#fffdf8]/94 p-4 shadow-card md:p-5">
      <div className="flex items-start gap-3 md:gap-4">
        <Image
          src={discussionQuestion.avatar}
          alt={discussionQuestion.author}
          width={70}
          height={70}
          className="h-16 w-16 shrink-0 rounded-full border border-js-gold/30 object-cover md:h-[72px] md:w-[72px]"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[18px] font-bold leading-tight text-js-text md:text-[19px]">{discussionQuestion.author}</h2>
              <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] font-semibold text-js-text-light">
                <span className="flex items-center gap-1">
                  <MapPin size={16} className="fill-js-green text-js-green" strokeWidth={0} />
                  {discussionQuestion.location}
                </span>
                <span>•</span>
                <span>{discussionQuestion.time}</span>
              </p>
            </div>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#9fc4cf] bg-[#eaf7ff] text-[#0d659b] md:h-11 md:w-11">
              <HelpCircle size={28} strokeWidth={2.2} />
            </span>
          </div>

          <p className="mt-3 max-w-[570px] text-[19px] font-semibold leading-7 text-js-text md:text-[21px] md:leading-8">
            {discussionQuestion.text}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[16px] font-bold text-js-green-dark">
            {discussionQuestion.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 border-t border-js-gold/20 pt-3 text-[15px] font-bold md:text-[16px]">
        <button type="button" className="flex items-center justify-center gap-2 text-[#116fac]">
          <Share2 size={19} className="-scale-x-100" />
          Reply
        </button>
        <button type="button" className="flex items-center justify-center gap-2 text-[#c5544d]">
          <Heart size={21} />
          Like
        </button>
        <button type="button" className="flex items-center justify-center gap-2 text-js-green-dark">
          <Share2 size={20} />
          Share
        </button>
      </div>
    </article>
  );
}

function ReplyCard({ reply }: { reply: (typeof discussionReplies)[number] }) {
  return (
    <article className={`overflow-hidden rounded-xl border border-js-gold/18 shadow-card ${reply.tone}`}>
      <div className="grid md:grid-cols-[1fr_198px]">
        <div className="flex min-w-0 gap-3 p-4 md:p-4">
          <Image
            src={reply.avatar}
            alt={reply.author}
            width={58}
            height={58}
            className="h-14 w-14 shrink-0 rounded-full border border-js-gold/25 object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[18px] font-bold leading-tight text-js-text">{reply.author}</h3>
              <span className={`rounded-md border px-2 py-0.5 text-[13px] font-bold ${reply.badgeTone}`}>{reply.badge}</span>
              <CheckCircle size={17} className="fill-js-green text-js-green" />
            </div>
            <p className="mt-0.5 text-[14px] font-semibold text-js-text-light">{reply.time}</p>
            <p className="mt-2 text-[15px] font-semibold leading-6 text-js-text md:text-[14px] md:leading-5">{reply.text}</p>
            <div className="mt-3 flex items-center gap-8 text-[15px] font-bold">
              <button type="button" className="flex items-center gap-2 text-[#116fac]">
                <Share2 size={18} className="-scale-x-100" />
                Reply
              </button>
              <button type="button" className="flex items-center gap-2 text-js-text-light">
                <Heart size={20} className="text-[#c5544d]" />
                {reply.likes}
              </button>
            </div>
          </div>
        </div>
        <div className="relative h-[190px] md:h-auto">
          <Image src={reply.image} alt="" fill sizes="(min-width: 1180px) 198px, 100vw" className="object-cover" />
        </div>
      </div>
    </article>
  );
}

function NearbyDiscussionsPanel() {
  return (
    <section className="rounded-xl border border-js-gold/25 bg-[#fffaf0]/90 p-4 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-[20px] font-bold text-js-green-dark">
          <MapPin size={24} className="fill-js-green text-js-green" strokeWidth={0} />
          Active Discussions Nearby
        </h2>
        <button type="button" className="hidden items-center gap-1 text-sm font-bold text-js-green-dark md:flex">
          View all <ChevronRight size={17} />
        </button>
      </div>
      <div className="mt-4 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] min-[1180px]:grid min-[1180px]:gap-0 min-[1180px]:overflow-visible [&::-webkit-scrollbar]:hidden">
        {nearbyDiscussions.map((item) => (
          <article
            key={item.title}
            className="flex w-[220px] shrink-0 items-center gap-3 border-js-gold/20 py-2 min-[1180px]:w-full min-[1180px]:border-b min-[1180px]:last:border-b-0"
          >
            <Image src={item.image} alt="" width={72} height={72} className="h-[70px] w-[70px] shrink-0 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <h3 className="text-[15px] font-bold leading-tight text-js-text">{item.title}</h3>
              <p className="mt-1 text-[13px] font-semibold text-js-text-light">{item.location}</p>
            </div>
            <span className="flex shrink-0 items-center gap-1 text-[13px] font-bold text-js-green-dark">
              <MessageCircle size={15} />
              {item.comments}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

function TrendingTopicsPanel() {
  return (
    <section className="rounded-xl border border-js-gold/25 bg-[#fffaf0]/90 p-4 shadow-card">
      <h2 className="flex items-center gap-2 text-[20px] font-bold text-js-green-dark">
        <Leaf size={22} className="fill-js-green text-js-green" />
        Trending Topics
      </h2>
      <div className="mt-4 flex flex-wrap gap-3">
        {trendingTopics.map((topic) => (
          <button
            key={topic}
            type="button"
            className="rounded-lg border border-js-gold/30 bg-[#fff4d7] px-4 py-2 text-[16px] font-bold text-[#146399]"
          >
            #{topic}
          </button>
        ))}
      </div>
    </section>
  );
}

function AskQuestionCard({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="relative min-h-[124px] overflow-hidden rounded-xl border border-[#6aa9cf] bg-[#1e8bd0] p-5 text-left text-white shadow-card"
    >
      <div className="relative z-10 max-w-[230px]">
        <h2 className="text-[22px] font-bold leading-tight">Ask a Question</h2>
        <p className="mt-2 text-[15px] font-semibold leading-5 text-white/95">Share your knowledge, ask or learn from community</p>
      </div>
      <span className="absolute right-6 top-1/2 flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-full bg-[#fff8df] text-[46px] font-bold leading-none text-[#1e8bd0]">
        ?
      </span>
      <div className="absolute bottom-0 left-0 right-0 h-7 border-t border-white/35 bg-[#116fac]/45" />
    </button>
  );
}

function AskQuestionModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/35 px-4">
      <div className="w-full max-w-md rounded-xl border border-js-gold/25 bg-[#fffaf0] p-5 shadow-card">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[22px] font-bold text-js-green-dark">Ask a Question</h2>
          <button type="button" onClick={onClose} aria-label="Close modal" className="text-js-text-light">
            <X size={24} />
          </button>
        </div>
        <form className="mt-5 grid gap-4" onSubmit={(event) => { event.preventDefault(); onClose(); }}>
          <label className="grid gap-2 text-sm font-bold text-js-text">
            Title
            <input className="h-11 rounded-lg border border-js-gold/30 bg-white px-3 font-medium outline-none focus:border-js-green" />
          </label>
          <label className="grid gap-2 text-sm font-bold text-js-text">
            Description
            <textarea className="min-h-[120px] rounded-lg border border-js-gold/30 bg-white px-3 py-2 font-medium outline-none focus:border-js-green" />
          </label>
          <button type="submit" className="h-11 rounded-lg bg-js-green px-4 text-base font-bold text-white">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

function AllStoriesContent() {
  return (
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
  );
}

function WisdomReelsTab({
  activeReel,
  onSelectReel,
}: {
  activeReel: typeof featuredReel;
  onSelectReel: (reel: (typeof suggestedReels)[number]) => void;
}) {
  return (
    <main className="relative mx-auto grid w-full max-w-[1320px] gap-5 px-4 py-4 md:px-7 md:py-5 min-[1180px]:grid-cols-[minmax(0,760px)_300px] min-[1180px]:justify-center">
      <section className="min-w-0">
        <article className="overflow-hidden rounded-2xl border border-js-gold/25 bg-[#fffaf0]/90 shadow-card">
          <div className="relative h-[560px] overflow-hidden md:h-[520px]">
            <Image src={activeReel.cover} alt={activeReel.title} fill sizes="(min-width: 1180px) 760px, 100vw" className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/8 to-black/12" />
            <span className="absolute left-5 top-5 flex items-center gap-2 rounded-lg bg-black/55 px-3 py-1.5 text-sm font-bold text-white">
              <Play size={15} fill="currentColor" />
              {activeReel.duration}
            </span>
            <MoreHorizontal size={28} className="absolute right-5 top-5 rotate-90 text-white" />
            <div className="absolute bottom-8 left-5 max-w-[540px] pr-16 md:bottom-5 md:left-8">
              <h2 className="font-display text-[34px] font-bold leading-tight text-[#fff8df] drop-shadow md:text-[30px]">
                {activeReel.title}
              </h2>
            </div>
            <div className="absolute bottom-12 right-5 flex flex-col items-center gap-5 text-white">
              <ReelAction icon={<Heart size={27} className="fill-[#df394b] text-[#df394b]" />} label={activeReel.likes} />
              <ReelAction icon={<MessageCircle size={30} />} label={activeReel.comments} />
              <ReelAction icon={<Share2 size={30} />} label={activeReel.shares} />
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-start gap-4">
              <Image
                src="/images/reels/avatar-ramesh.jpg"
                alt="Ramesh Yadav"
                width={58}
                height={58}
                className="h-14 w-14 rounded-full border border-js-gold/25 object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[18px] font-bold text-js-green-dark">
                  {activeReel.author} <span className="font-medium text-js-text-light">– {activeReel.location}</span>
                </p>
                <p className="mt-2 max-w-xl text-[16px] leading-6 text-js-text">{activeReel.description}</p>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[15px] font-semibold text-js-green-dark">
                  {activeReel.tags.map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </div>
              </div>
              <MoreHorizontal size={24} className="hidden rotate-90 text-js-text-light md:block" />
            </div>
          </div>
        </article>
      </section>

      <SuggestedReelsPanel onSelectReel={onSelectReel} />
    </main>
  );
}

function SuggestedReelsPanel({ onSelectReel }: { onSelectReel: (reel: (typeof suggestedReels)[number]) => void }) {
  return (
    <aside className="min-w-0">
      <section className="rounded-xl border border-js-gold/25 bg-[#fffaf0]/86 p-4 shadow-card">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-[22px] font-bold text-js-green-dark">
            <Leaf size={18} className="text-js-green" />
            Suggested Reels
          </h2>
          <button type="button" className="text-sm font-bold text-js-orange md:hidden">See All</button>
        </div>
        <div className="h-px w-full bg-js-gold/25" />
        <div className="mt-4 flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] md:grid md:gap-4 md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden">
          {suggestedReels.map((reel) => (
            <button
              key={reel.title}
              type="button"
              onClick={() => onSelectReel(reel)}
              className="w-[210px] shrink-0 overflow-hidden rounded-xl border border-js-gold/25 bg-[#fffaf0] text-left shadow-sm md:w-full"
            >
              <div className="relative h-[150px] md:h-[120px]">
                <Image src={reel.cover} alt={reel.title} fill sizes="220px" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute left-3 top-3 flex items-center gap-1 rounded-md bg-black/55 px-2 py-1 text-xs font-bold text-white">
                  <Play size={11} fill="currentColor" />
                  {reel.duration}
                </span>
                <MoreHorizontal size={22} className="absolute right-2 top-2 rotate-90 text-white" />
                <span className="absolute inset-0 m-auto flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-js-green-dark">
                  <Play size={20} fill="currentColor" />
                </span>
              </div>
              <div className="p-3">
                <h3 className="min-h-[48px] text-[16px] font-bold leading-snug text-js-text">{reel.title}</h3>
                <div className="mt-3 flex items-center justify-between text-sm text-js-text">
                  <span className="flex items-center gap-1"><Heart size={17} /> {reel.likes}</span>
                  <span className="flex items-center gap-1"><MessageCircle size={17} /> {reel.comments}</span>
                  <Bookmark size={18} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
}

function ReelAction({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button type="button" className="flex flex-col items-center gap-1 text-sm font-bold drop-shadow">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/92 text-js-text shadow-card">{icon}</span>
      {label}
    </button>
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
