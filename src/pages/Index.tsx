import { TrendingUp, LogOut } from "lucide-react";
import { DashboardNav } from "@/components/DashboardNav";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User, Session } from "@supabase/supabase-js";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
      navigate("/auth");
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-terminal">
      <header className="border-b-2 border-terminal-border bg-terminal-panel">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 border-2 border-terminal-accent bg-terminal">
                <TrendingUp className="w-6 h-6 text-terminal-accent" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-terminal-accent font-mono uppercase tracking-wider">
                  Market Intelligence
                </h1>
                <p className="text-xs text-terminal-text font-mono uppercase tracking-wide">
                  AI-Powered Financial News Analysis
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-terminal-text font-mono text-xs">
                {user.email}
              </span>
              <Button
                onClick={handleSignOut}
                variant="ghost"
                size="sm"
                className="text-terminal-accent hover:bg-terminal-border/20 font-mono"
              >
                <LogOut className="w-4 h-4 mr-2" />
                SIGN OUT
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2 text-terminal-accent font-mono">
            WELCOME TO YOUR TRADING PLATFORM
          </h2>
          <p className="text-terminal-text/80 font-mono text-sm">
            Access real-time market data, news analysis, and AI agent tools all in one place
          </p>
        </div>

        <DashboardNav />
      </main>
    </div>
  );
};

export default Index;
