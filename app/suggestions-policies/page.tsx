import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  MessageCircle,
  Plus,
  ThumbsUp,
} from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const ideas = [
  { title: "Ban harmful fishing nets", author: "Raghunath Yadav", location: "Patna, Bihar", supporters: 256, comments: 18, status: "Under Review", image: "/images/policies/idea-fishing-nets.jpg", description: "Stop the use of fine-mesh nets that catch baby fishes and destroy our river ecosystem." },
  { title: "Restore old ponds of our village", author: "Sita Devi", location: "Munger, Bihar", supporters: 198, comments: 12, status: "In Discussion", image: "/images/policies/idea-pond-restoration.jpg", description: "Revive traditional ponds to increase groundwater and support wildlife." },
  { title: "Create bird safe zones near farms", author: "Aman Raj", location: "Bhagalpur, Bihar", supporters: 142, comments: 8, status: "Under Review", image: "/images/policies/idea-bird-safe-zone.jpg", description: "Avoid use of toxic chemicals near field borders to protect birds and insects." },
  { title: "Plant native trees along roads", author: "Kavita Kumari", location: "Gaya, Bihar", supporters: 121, comments: 9, status: "In Discussion", image: "/images/policies/idea-tree-road.jpg", description: "Planting native trees will provide shade, clean air and support biodiversity." },
];

const updates = [
  { title: "Ban harmful fishing nets", status: "Reviewed", description: "The Dept. of Fisheries has reviewed this suggestion. Stakeholder consultations are completed.", date: "12 May 2025" },
  { title: "Restore old ponds of our village", status: "Approved", description: "The proposal has been approved. Work will begin in selected villages.", date: "08 May 2025" },
  { title: "Create bird safe zones near farms", status: "In Progress", description: "The Forest Dept. is collaborating with local communities. Pilot project in progress.", date: "05 May 2025" },
];

export default function SuggestionsPoliciesPage() {
  return (
    <div className="min-h-screen folk-pattern-bg">
      <Sidebar />
      <div className="md:ml-[196px]">
        <Header />
        <main className="px-4 py-5 pb-24 md:px-5 md:pb-6">
          <div className="mx-auto max-w-[1320px]">
            <h1 className="font-display text-3xl font-bold text-js-green-dark md:text-4xl">Suggestions &amp; Policy Ideas</h1>
            <div className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
              <div>
                <section className="relative overflow-hidden rounded-2xl border border-[#dbc9aa] bg-[#fff7dc]/90 shadow-[0_5px_16px_rgba(91,63,35,0.10)]">
                  <Image src="/images/policies/policy-hero.png" alt="" width={1100} height={360} className="h-[240px] w-full object-contain object-right sm:h-[255px]" />
                  <div className="absolute inset-0 flex max-w-[560px] flex-col justify-center bg-gradient-to-r from-[#fffaf0] via-[#fffaf0]/90 to-transparent p-5 md:p-8">
                    <h2 className="font-display text-2xl font-bold leading-tight text-js-green-dark md:text-3xl">Have an idea to protect our environment?</h2>
                    <p className="mt-2 text-sm leading-6 text-js-text">Share your suggestion or policy idea with the government.</p>
                    <Link href="/submit-idea" className="mt-4 inline-flex w-fit items-center gap-2 rounded-lg bg-js-green px-4 py-2.5 text-sm font-semibold text-[#fff8df]"><Plus size={17} />Submit New Idea</Link>
                  </div>
                </section>

                <section className="mt-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h2 className="font-display text-xl font-bold text-js-green-dark">Popular Ideas</h2>
                    <label className="flex items-center gap-2 rounded-lg border border-[#dbc9aa] bg-[#fffaf0]/90 px-3 py-2 text-xs text-js-text">Sort By:
                      <select className="bg-transparent font-semibold outline-none"><option>Latest</option><option>Most Supported</option></select>
                    </label>
                  </div>
                  <div className="grid gap-3 lg:grid-cols-2">
                    {ideas.map((idea) => <IdeaCard key={idea.title} {...idea} />)}
                  </div>
                  <div className="mt-4 text-center">
                    <Link href="/ideas" className="inline-flex rounded-lg border border-js-green px-6 py-2.5 text-sm font-semibold text-js-green">View More Ideas</Link>
                  </div>
                </section>
              </div>

              <aside className="space-y-5">
                <section className="rounded-2xl border border-[#dbc9aa] bg-[#fffaf0]/90 p-4 shadow-[0_5px_16px_rgba(91,63,35,0.10)]">
                  <h2 className="flex items-center gap-2 font-display text-xl font-bold text-js-green-dark"><Building2 size={21} />Government Updates</h2>
                  <p className="mt-1 text-xs text-js-text-light">See responses and actions from authorities.</p>
                  <div className="mt-3 space-y-3">{updates.map((update) => <UpdateCard key={update.title} {...update} />)}</div>
                </section>
                <section className="rounded-2xl border border-[#dbc9aa] bg-[#fffaf0]/90 p-4 shadow-[0_5px_16px_rgba(91,63,35,0.10)]">
                  <h2 className="font-display text-xl font-bold text-js-green-dark">Status Tracking</h2>
                  <p className="mt-1 text-xs text-js-text-light">Track the overall progress of ideas</p>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <Stat icon={ClipboardCheck} count="15" label="Reviewed" />
                    <Stat icon={CheckCircle2} count="8" label="Approved" />
                    <Stat icon={Clock3} count="5" label="Action Taken" />
                  </div>
                  <Link href="/policy-updates" className="mt-3 block rounded-lg border border-js-green px-3 py-2 text-center text-xs font-semibold text-js-green">View All Updates</Link>
                </section>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function IdeaCard({ title, author, location, supporters, comments, status, image, description }: typeof ideas[number]) {
  return <article className="grid grid-cols-[minmax(0,1fr)_118px] gap-3 rounded-xl border border-[#e3d3b8] bg-[#fffaf0]/90 p-3 shadow-[0_2px_8px_rgba(91,63,35,0.06)]">
    <div className="min-w-0"><h3 className="font-bold text-js-text">{title}</h3><p className="mt-1 text-xs text-js-text-light">Proposed by {author}</p><p className="text-xs text-js-text-light">{location}</p><p className="mt-3 text-xs leading-5 text-js-text">{description}</p><div className="mt-3 flex flex-wrap gap-3 text-xs text-js-text-light"><span className="flex items-center gap-1"><ThumbsUp size={14} />{supporters} Supporters</span><span className="flex items-center gap-1"><MessageCircle size={14} />{comments} Comments</span></div></div>
    <div className="flex flex-col items-end justify-between gap-2"><Image src={image} alt="" width={236} height={200} className="h-[100px] w-[118px] rounded-lg object-cover" /><span className={`text-xs font-semibold ${status === "Under Review" ? "text-[#a95f38]" : "text-[#4a90b8]"}`}>{status}</span></div>
  </article>;
}

function UpdateCard({ title, status, description, date }: typeof updates[number]) {
  return <article className="rounded-xl border border-[#e3d3b8] bg-[#fffdf7] p-3"><div className="flex items-start justify-between gap-2"><h3 className="text-sm font-bold text-js-text">{title}</h3><span className={`shrink-0 rounded px-2 py-1 text-[10px] font-bold ${status === "In Progress" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>{status}</span></div><p className="mt-2 text-xs leading-5 text-js-text">{description}</p><div className="mt-3 flex items-center justify-between gap-2 text-[11px]"><span className="text-js-text-light">Responded on {date}</span><button type="button" className="font-semibold text-js-green">View Response</button></div></article>;
}

function Stat({ icon: Icon, count, label }: { icon: typeof ClipboardCheck; count: string; label: string }) {
  return <div className="rounded-lg border border-[#e3d3b8] bg-[#fffdf7] p-2 text-center"><Icon size={22} className="mx-auto text-js-green" /><strong className="mt-1 block text-xl text-js-text">{count}</strong><span className="text-[10px] font-bold text-js-text">{label}</span></div>;
}
