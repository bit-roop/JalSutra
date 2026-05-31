import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import AllSubmissions from "@/components/submit-idea/AllSubmissions";

export default function MySubmissionsPage() {
  return (
    <div className="min-h-screen folk-pattern-bg">
      <Sidebar />
      <div className="md:ml-[196px]">
        <Header />
        <AllSubmissions />
      </div>
    </div>
  );
}
