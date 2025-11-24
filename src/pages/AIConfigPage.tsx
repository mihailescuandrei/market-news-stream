import { useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Brain, Save, Plus, Trash2, BookOpen, Upload } from "lucide-react";

interface KnowledgeEntry {
  id: string;
  newsType: string;
  historicalReference: string;
  expectedMove: string;
  timeframe: string;
  additionalContext: string;
}

const AIConfigPage = () => {
  const [config, setConfig] = useState({
    agentName: "Market Impact Analyst",
    model: "gpt-4.1-mini-2025-04-14",
    prompt: "You are a Market Impact Analyst. Analyze the provided news article and estimate the potential market impact. Consider:\n- The significance of the news event\n- Potential price movement direction and magnitude\n- Affected market sectors\n- Short-term vs long-term implications\n\nProvide your analysis in a structured format with:\n1. Impact Score (0-10)\n2. Direction (Bullish/Bearish/Neutral)\n3. Affected Assets\n4. Reasoning",
    temperature: 0.7,
    maxTokens: 1000,
    topP: 1,
  });

  const [knowledge, setKnowledge] = useState<KnowledgeEntry[]>([
    {
      id: "1",
      newsType: "Federal Reserve Rate Decision",
      historicalReference: "Rate hikes typically cause -1.5% to -3% in S&P 500 within 24h",
      expectedMove: "-1.5% to -3%",
      timeframe: "24 hours",
      additionalContext: "Tech sector sees larger impact (-2% to -4%). Financials may benefit slightly."
    },
    {
      id: "2",
      newsType: "Major Tech Earnings Beat",
      historicalReference: "Strong FAANG earnings typically lift tech sector +2-3% and broader market +0.5-1%",
      expectedMove: "+2% to +3% (sector), +0.5% to +1% (market)",
      timeframe: "1-2 trading days",
      additionalContext: "Impact amplified if accompanied by strong guidance. Watch for sector rotation."
    }
  ]);

  const [uploadedKnowledge, setUploadedKnowledge] = useState<string>("");

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      toast.info("Processing file...");
      
      // Handle text files
      if (file.type === "text/plain") {
        const text = await file.text();
        setUploadedKnowledge(text);
        toast.success("Text file loaded successfully");
      }
      // Handle Word documents
      else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
               file.type === "application/msword") {
        // For Word docs, we'd need to parse them server-side or use a library
        toast.info("Word document support coming soon. Please use text files for now.");
      }
      else {
        toast.error("Unsupported file type. Please use .txt or .docx files");
      }
    } catch (error) {
      console.error("Error reading file:", error);
      toast.error("Failed to read file");
    }
  };

  const addKnowledgeEntry = () => {
    const newEntry: KnowledgeEntry = {
      id: Date.now().toString(),
      newsType: "",
      historicalReference: "",
      expectedMove: "",
      timeframe: "",
      additionalContext: ""
    };
    setKnowledge([...knowledge, newEntry]);
  };

  const updateKnowledgeEntry = (id: string, field: keyof KnowledgeEntry, value: string) => {
    setKnowledge(knowledge.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const deleteKnowledgeEntry = (id: string) => {
    setKnowledge(knowledge.filter(entry => entry.id !== id));
  };

  const handleSave = () => {
    // TODO: Implement save to backend
    toast.success("Configuration and knowledge saved successfully");
    console.log("Saved config:", config);
    console.log("Saved knowledge:", knowledge);
    console.log("Uploaded knowledge document:", uploadedKnowledge);
  };

  return (
    <div className="min-h-screen bg-terminal">
      <DashboardHeader 
        title="AI AGENT CONFIGURATION"
        description="Configure your Market Impact Analyst agent parameters"
      />
      
      <div className="container mx-auto p-6 max-w-4xl">
        <Card className="bg-terminal-panel border-2 border-terminal-border">
          <CardHeader className="border-b-2 border-terminal-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-terminal-accent/20 flex items-center justify-center">
                <Brain className="w-5 h-5 text-terminal-accent" />
              </div>
              <div>
                <CardTitle className="text-terminal-accent font-mono">
                  MARKET IMPACT ANALYST
                </CardTitle>
                <CardDescription className="text-terminal-text/60 font-mono text-xs">
                  OpenAI-powered news impact analysis agent
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            {/* Agent Name */}
            <div className="space-y-2">
              <Label className="text-terminal-accent font-mono text-sm">
                AGENT NAME
              </Label>
              <Input
                value={config.agentName}
                onChange={(e) => setConfig({ ...config, agentName: e.target.value })}
                className="bg-terminal border-terminal-border text-terminal-text font-mono"
              />
            </div>

            {/* Model Selection */}
            <div className="space-y-2">
              <Label className="text-terminal-accent font-mono text-sm">
                MODEL
              </Label>
              <Select
                value={config.model}
                onValueChange={(value) => setConfig({ ...config, model: value })}
              >
                <SelectTrigger className="bg-terminal border-terminal-border text-terminal-text font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-terminal-panel border-terminal-border">
                  <SelectItem value="gpt-4.1-mini-2025-04-14" className="font-mono">
                    gpt-4.1-mini-2025-04-14
                  </SelectItem>
                  <SelectItem value="gpt-4.1-2025-04-14" className="font-mono">
                    gpt-4.1-2025-04-14
                  </SelectItem>
                  <SelectItem value="gpt-5-mini-2025-08-07" className="font-mono">
                    gpt-5-mini-2025-08-07
                  </SelectItem>
                  <SelectItem value="gpt-5-2025-08-07" className="font-mono">
                    gpt-5-2025-08-07
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* System Prompt */}
            <div className="space-y-2">
              <Label className="text-terminal-accent font-mono text-sm">
                SYSTEM PROMPT
              </Label>
              <Textarea
                value={config.prompt}
                onChange={(e) => setConfig({ ...config, prompt: e.target.value })}
                className="bg-terminal border-terminal-border text-terminal-text font-mono min-h-[200px] text-xs"
              />
            </div>

            {/* Temperature */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-terminal-accent font-mono text-sm">
                  TEMPERATURE
                </Label>
                <span className="text-terminal-accent font-mono text-sm">
                  {config.temperature.toFixed(2)}
                </span>
              </div>
              <Slider
                value={[config.temperature]}
                onValueChange={([value]) => setConfig({ ...config, temperature: value })}
                min={0}
                max={2}
                step={0.1}
                className="py-4"
              />
              <p className="text-terminal-text/60 font-mono text-xs">
                Higher values make output more random, lower values more deterministic
              </p>
            </div>

            {/* Max Tokens */}
            <div className="space-y-2">
              <Label className="text-terminal-accent font-mono text-sm">
                MAX COMPLETION TOKENS
              </Label>
              <Input
                type="number"
                value={config.maxTokens}
                onChange={(e) => setConfig({ ...config, maxTokens: parseInt(e.target.value) })}
                className="bg-terminal border-terminal-border text-terminal-text font-mono"
                min={1}
                max={4096}
              />
              <p className="text-terminal-text/60 font-mono text-xs">
                Maximum number of tokens to generate in the response
              </p>
            </div>

            {/* Top P */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-terminal-accent font-mono text-sm">
                  TOP P (NUCLEUS SAMPLING)
                </Label>
                <span className="text-terminal-accent font-mono text-sm">
                  {config.topP.toFixed(2)}
                </span>
              </div>
              <Slider
                value={[config.topP]}
                onValueChange={([value]) => setConfig({ ...config, topP: value })}
                min={0}
                max={1}
                step={0.05}
                className="py-4"
              />
              <p className="text-terminal-text/60 font-mono text-xs">
                Alternative to temperature for controlling randomness
              </p>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t-2 border-terminal-border">
              <Button
                onClick={handleSave}
                className="w-full bg-terminal-accent hover:bg-terminal-accent/80 text-terminal font-mono font-semibold"
              >
                <Save className="w-4 h-4 mr-2" />
                SAVE CONFIGURATION
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Knowledge Base Section */}
        <Card className="bg-terminal-panel border-2 border-terminal-border mt-6">
          <CardHeader className="border-b-2 border-terminal-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-terminal-success/20 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-terminal-success" />
                </div>
                <div>
                  <CardTitle className="text-terminal-accent font-mono">
                    AGENT KNOWLEDGE BASE
                  </CardTitle>
                  <CardDescription className="text-terminal-text/60 font-mono text-xs">
                    Historical market impact data for different news types
                  </CardDescription>
                </div>
              </div>
              <Button
                onClick={addKnowledgeEntry}
                className="bg-terminal-success hover:bg-terminal-success/80 text-terminal font-mono font-semibold"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                ADD ENTRY
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            {/* File Upload Section */}
            <div className="p-4 bg-terminal border-2 border-terminal-border space-y-3">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-terminal-success" />
                <Label className="text-terminal-accent font-mono text-sm">
                  UPLOAD KNOWLEDGE DOCUMENT
                </Label>
              </div>
              <p className="text-terminal-text/60 font-mono text-xs">
                Upload a text file containing historical market impact data, news type references, and expected market moves.
              </p>
              <Input
                type="file"
                accept=".txt,.doc,.docx"
                onChange={handleFileUpload}
                className="bg-terminal-panel border-terminal-border text-terminal-text font-mono text-xs cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-xs file:font-mono file:bg-terminal-accent file:text-terminal hover:file:bg-terminal-accent/80"
              />
              
              {uploadedKnowledge && (
                <div className="space-y-2">
                  <Label className="text-terminal-accent font-mono text-xs">
                    UPLOADED CONTENT PREVIEW
                  </Label>
                  <Textarea
                    value={uploadedKnowledge}
                    onChange={(e) => setUploadedKnowledge(e.target.value)}
                    className="bg-terminal-panel border-terminal-border text-terminal-text font-mono text-xs min-h-[150px]"
                    placeholder="Your uploaded knowledge will appear here..."
                  />
                  <p className="text-terminal-text/60 font-mono text-xs">
                    This content will be included in the agent's knowledge base when you save the configuration.
                  </p>
                </div>
              )}
            </div>

            <div className="border-t-2 border-terminal-border pt-4" />

            {/* Manual Knowledge Entries */}
            <div className="flex items-center justify-between">
              <Label className="text-terminal-accent font-mono text-sm">
                MANUAL KNOWLEDGE ENTRIES
              </Label>
              <Button
                onClick={addKnowledgeEntry}
                className="bg-terminal-success hover:bg-terminal-success/80 text-terminal font-mono font-semibold"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                ADD ENTRY
              </Button>
            </div>

            <div className="space-y-4">
            {knowledge.map((entry, index) => (
              <div
                key={entry.id}
                className="p-4 bg-terminal border-2 border-terminal-border space-y-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-terminal-accent font-mono text-xs font-bold">
                    ENTRY #{index + 1}
                  </span>
                  <Button
                    onClick={() => deleteKnowledgeEntry(entry.id)}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-terminal-danger hover:bg-terminal-danger/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-terminal-accent font-mono text-xs">
                      NEWS TYPE / CATEGORY
                    </Label>
                    <Input
                      value={entry.newsType}
                      onChange={(e) => updateKnowledgeEntry(entry.id, "newsType", e.target.value)}
                      placeholder="e.g., Federal Reserve Rate Decision"
                      className="bg-terminal-panel border-terminal-border text-terminal-text font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-terminal-accent font-mono text-xs">
                      EXPECTED MOVE
                    </Label>
                    <Input
                      value={entry.expectedMove}
                      onChange={(e) => updateKnowledgeEntry(entry.id, "expectedMove", e.target.value)}
                      placeholder="e.g., -1.5% to -3%"
                      className="bg-terminal-panel border-terminal-border text-terminal-text font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-terminal-accent font-mono text-xs">
                      TIMEFRAME
                    </Label>
                    <Input
                      value={entry.timeframe}
                      onChange={(e) => updateKnowledgeEntry(entry.id, "timeframe", e.target.value)}
                      placeholder="e.g., 24 hours"
                      className="bg-terminal-panel border-terminal-border text-terminal-text font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-terminal-accent font-mono text-xs">
                      HISTORICAL REFERENCE
                    </Label>
                    <Textarea
                      value={entry.historicalReference}
                      onChange={(e) => updateKnowledgeEntry(entry.id, "historicalReference", e.target.value)}
                      placeholder="e.g., Rate hikes typically cause -1.5% to -3% in S&P 500 within 24h"
                      className="bg-terminal-panel border-terminal-border text-terminal-text font-mono text-xs min-h-[60px]"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-terminal-accent font-mono text-xs">
                      ADDITIONAL CONTEXT
                    </Label>
                    <Textarea
                      value={entry.additionalContext}
                      onChange={(e) => updateKnowledgeEntry(entry.id, "additionalContext", e.target.value)}
                      placeholder="e.g., Tech sector sees larger impact. Watch for sector rotation."
                      className="bg-terminal-panel border-terminal-border text-terminal-text font-mono text-xs min-h-[60px]"
                    />
                  </div>
                </div>
              </div>
            ))}

            {knowledge.length === 0 && !uploadedKnowledge && (
              <div className="text-center py-12 text-terminal-text/60 font-mono text-sm">
                No knowledge entries yet. Upload a document or click "ADD ENTRY" to create one.
              </div>
            )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIConfigPage;
