import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Activity, CheckCircle2, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface AgentLog {
  id: string;
  timestamp: string;
  agentName: string;
  model: string;
  request: string;
  response: string;
  tokensUsed: number;
  status: "success" | "error";
  executionTime: number;
}

// Mock data for demonstration
const mockLogs: AgentLog[] = [
  {
    id: "1",
    timestamp: "2025-01-24T18:30:45",
    agentName: "Market Impact Analyst",
    model: "gpt-4.1-mini",
    request: "Analyze market impact: Fed announces interest rate decision maintaining rates at 5.25%",
    response: "NEUTRAL TO SLIGHTLY POSITIVE. Market likely priced in rate hold. Short-term: Minimal volatility expected. Bonds may strengthen slightly. Tech sector could see modest gains.",
    tokensUsed: 342,
    status: "success",
    executionTime: 1.2
  },
  {
    id: "2",
    timestamp: "2025-01-24T18:25:12",
    agentName: "Market Impact Analyst",
    model: "gpt-4.1-mini",
    request: "Analyze market impact: Tesla announces Q4 earnings beat, revenue up 15% YoY",
    response: "BULLISH. Strong earnings beat signals robust demand. Expected impact: TSLA +3-5% premarket, EV sector +2%, tech indices +0.5%. Watch for guidance on production targets.",
    tokensUsed: 298,
    status: "success",
    executionTime: 1.5
  },
  {
    id: "3",
    timestamp: "2025-01-24T18:20:33",
    agentName: "Market Impact Analyst",
    model: "gpt-4.1-mini",
    request: "Analyze market impact: Major cybersecurity breach at Fortune 500 company",
    response: "BEARISH. Sector-wide concern expected. Cybersecurity stocks may rise +5-8%. Affected company -10-15%. Expect ripple effect across tech sector -1-2%. Insurance sector volatility.",
    tokensUsed: 315,
    status: "success",
    executionTime: 1.8
  }
];

const AIAgentsLogsPage = () => {
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  const toggleExpand = (logId: string) => {
    setExpandedLog(expandedLog === logId ? null : logId);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }) + " GMT+2";
  };

  return (
    <div className="min-h-screen bg-terminal">
      <DashboardHeader />
      <main className="container mx-auto px-2 py-2">
        <Card className="bg-terminal-panel border-2 border-terminal-border">
          <CardHeader className="border-b-2 border-terminal-border">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-terminal-accent" />
              <CardTitle className="text-terminal-accent font-mono font-bold uppercase">
                AI AGENTS EXECUTION LOGS
              </CardTitle>
            </div>
            <CardDescription className="text-terminal-text font-mono text-xs">
              Real-time monitoring of AI agent requests and responses
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-240px)]">
              <div className="divide-y-2 divide-terminal-border">
                {mockLogs.map((log) => (
                  <div key={log.id} className="p-4 hover:bg-terminal-panel/50 transition-colors">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-terminal-accent font-mono font-bold text-sm uppercase">
                            {log.agentName}
                          </span>
                          <Badge 
                            variant="outline" 
                            className="border-terminal-border text-terminal-text bg-terminal font-mono text-[10px]"
                          >
                            {log.model}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] text-terminal-text font-mono">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimestamp(log.timestamp)}
                          </div>
                          <div>
                            {log.tokensUsed} tokens
                          </div>
                          <div>
                            {log.executionTime}s
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {log.status === "success" ? (
                          <CheckCircle2 className="w-4 h-4 text-terminal-success" />
                        ) : (
                          <XCircle className="w-4 h-4 text-terminal-danger" />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpand(log.id)}
                          className="h-6 w-6 p-0 text-terminal-accent hover:bg-terminal-border/20"
                        >
                          {expandedLog === log.id ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      {/* Request Preview */}
                      <div>
                        <div className="text-[10px] text-terminal-accent/70 font-mono uppercase mb-1">
                          REQUEST
                        </div>
                        <div className="text-xs text-terminal-text font-mono leading-relaxed">
                          {expandedLog === log.id ? log.request : log.request.substring(0, 100) + "..."}
                        </div>
                      </div>

                      {/* Response */}
                      {expandedLog === log.id && (
                        <div className="pt-2 border-t border-terminal-border/50">
                          <div className="text-[10px] text-terminal-accent/70 font-mono uppercase mb-1">
                            RESPONSE
                          </div>
                          <div className="text-xs text-terminal-text font-mono leading-relaxed bg-terminal/50 p-3 border border-terminal-border/30">
                            {log.response}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AIAgentsLogsPage;
