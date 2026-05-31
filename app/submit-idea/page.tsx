import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import SubmitIdeaForm from "@/components/submit-idea/SubmitIdeaForm";

export default function SubmitIdeaPage() {
  return (
    <div className="min-h-screen folk-pattern-bg">
      <Sidebar />
      <div className="md:ml-[196px]">
        <Header />
        <SubmitIdeaForm />
      </div>
    </div>
  );
}
