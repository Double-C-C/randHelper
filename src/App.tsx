import { Separator } from "@/components/ui/separator";
import Header from "./components/Header";
import RandomNumberCard from "./components/RandomNumberCard";
import RandomFileCard from "./components/RandomFileCard";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <Header />
        <RandomNumberCard />
        <Separator />
        <RandomFileCard />
      </div>
    </div>
  );
}

export default App;
