
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Book } from "lucide-react";

const NotFound = () => {
  return (
    <div dir="ltr" className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md glass-panel p-8 rounded-lg">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Book className="h-8 w-8 text-emerald-500" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          This page could not be found
        </p>
        
        <Button asChild>
          <Link to="/">
            Return to Quran
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
