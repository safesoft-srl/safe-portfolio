import { Button } from "@/components/ui/button";
import { toast } from "sonner";
function App() {
  return (
    <div className="flex-col w-full h-screen">
      <div className="flex flex-col justify-center items-center w-full h-full gap-2">
        <Button size={`lg`} onClick={() => toast.success("Testing button")}>
          Testing button
        </Button>
        <Button variant="secondary">Testing button</Button>
        <Button variant="outline">Testing button</Button>
        <Button variant="destructive">Testing button</Button>
        <Button variant="link">Testing button</Button>
      </div>
    </div>
  );
}

export default App;
