import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Copy, 
  RefreshCw, 
  Check, 
  ChevronRight, 
  Settings2, 
  FileText, 
  Terminal, 
  PenTool, 
  Briefcase, 
  GraduationCap, 
  Gamepad2,
  AlertCircle,
  Zap,
  Download,
  Lightbulb,
  Bookmark,
  Trash2,
  Beaker
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

// Categories and Options
const CATEGORIES = [
  { id: 'content', label: 'Content Creation', icon: PenTool, color: 'bg-indigo-100 text-indigo-600 outline-none hover:bg-slate-100' },
  { id: 'coding', label: 'Coding & Tech', icon: Terminal, color: 'bg-blue-100 text-blue-600' },
  { id: 'business', label: 'Business & Professional', icon: Briefcase, color: 'bg-purple-100 text-purple-600' },
  { id: 'education', label: 'Education & Learning', icon: GraduationCap, color: 'bg-green-100 text-green-600' },
  { id: 'creative', label: 'Creative Writing', icon: Gamepad2, color: 'bg-pink-100 text-pink-600' },
  { id: 'marketing', label: 'Marketing & Sales', icon: Zap, color: 'bg-yellow-100 text-yellow-600' },
  { id: 'productivity', label: 'General Productivity', icon: Check, color: 'bg-indigo-100 text-indigo-600' },
  { id: 'lifestyle', label: 'Lifestyle & Hobbies', icon: Sparkles, color: 'bg-teal-100 text-teal-600' },
];

const TONES = ['Professional', 'Creative', 'Casual', 'Technical', 'Persuasive', 'Empathetic', 'Humorous', 'Authoritative'];
const AUDIENCES = ['General Public', 'Beginners', 'Experts', 'Executive Teams', 'Technical Developers', 'New Learners'];
const FORMATS = ['Standard Blocks', 'Detailed Guide', 'Markdown Table', 'Step-by-Step Script', 'Technical Doc', 'Mathematical Proof', 'Business Memorandum'];

const FRAMEWORKS = [
  { id: 'rtf', label: 'RTF (Role-Task-Format)', desc: 'Best for direct instructions' },
  { id: 'cot', label: 'Chain of Thought', desc: 'Best for complex reasoning' },
  { id: 'care', label: 'CARE (Context-Action-Result)', desc: 'Best for business results' },
  { id: 'risen', label: 'RISEN (Role-Input-Steps)', desc: 'Best for structured data' }
];

const PERSONAS = [
  'Senior Executive', 'Creative Director', 'Lead Developer', 'Academic Researcher', 
  'Marketing Specialist', 'Legal Expert', 'Customer Success', 'Casual Peer', 'Extreme Critic'
];

const DEPTH_LEVELS = [
  { id: 'fundamental', label: 'Fundamental', desc: 'Clear & basic terms' },
  { id: 'intermediate', label: 'Intermediate', desc: 'Standard professional depth' },
  { id: 'visionary', label: 'Visionary', desc: 'Broad, strategic & futuristic' },
  { id: 'granular', label: 'Granular/Detailed', desc: 'Deep technical precision' }
];
const LANGUAGES = [
  { label: 'English', native: 'English' },
  { label: 'Bengali', native: 'বাংলা' },
  { label: 'Hindi', native: 'हिन्दी' },
  { label: 'Urdu', native: 'اردو' },
  { label: 'Arabic', native: 'العربية' },
  { label: 'Spanish', native: 'Español' },
  { label: 'French', native: 'Français' },
  { label: 'German', native: 'Deutsch' },
  { label: 'Japanese', native: '日本語' }
];

const LENGTHS = [
  { id: 'comprehensive', label: 'Comprehensive (Long)' },
  { id: 'concise', label: 'Direct & Concise (Short)' }
];

const CONTENT_TYPES = [
  { id: 'idea', label: 'Idea & Hook Generation' },
  { id: 'script', label: 'Full Script & Visuals' }
];

const DURATIONS = ['< 60s (Shorts/Reels)', '1-3 mins', '5-10 mins', '10+ mins'];

const AI_MODELS = [
  { id: 'chatgpt', label: 'ChatGPT (O1/PT)', color: 'text-emerald-600' },
  { id: 'claude', label: 'Claude 3.5 Sonnet', color: 'text-orange-600' },
  { id: 'gemini', label: 'Gemini 1.5 Pro', color: 'text-blue-600' },
  { id: 'llama', label: 'Llama 3 / OpenSource', color: 'text-purple-600' }
];

const SUGGESTIONS = [
  "Customer service AI strategy",
  "Productivity hacks for remote teams",
  "Dynamic pricing table component",
  "Cyberpunk detective story intro",
  "Startup pitch deck email sequence"
];

export default function App() {
  // AI Initialization (Inside component for reliable env access)
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

  // UI State
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTone, setSelectedTone] = useState('');
  const [selectedAudience, setSelectedAudience] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedLength, setSelectedLength] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini');
  const [negativeConstraints, setNegativeConstraints] = useState('');
  
  // Advanced Features State
  const [selectedFramework, setSelectedFramework] = useState('');
  const [selectedPersona, setSelectedPersona] = useState('');
  const [selectedDepth, setSelectedDepth] = useState('');
  const [creativityLevel, setCreativityLevel] = useState(0.5);
  const [useCoT, setUseCoT] = useState(false);

  // Content Creation Specific State
  const [selectedContentType, setSelectedContentType] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [customDuration, setCustomDuration] = useState('');
  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // App State
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [showVariablesPanel, setShowVariablesPanel] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [savedPrompts, setSavedPrompts] = useState<{id: string, text: string, date: string}[]>(() => {
    const saved = localStorage.getItem('prompt_guru_library');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync saved prompts to localStorage
  useEffect(() => {
    localStorage.setItem('prompt_guru_library', JSON.stringify(savedPrompts));
  }, [savedPrompts]);

  const saveToLibrary = () => {
    const final = getFinalPrompt();
    if (!final) return;
    const newItem = {
      id: Date.now().toString(),
      text: final,
      date: new Date().toLocaleDateString()
    };
    setSavedPrompts(prev => [newItem, ...prev]);
  };

  const deleteFromLibrary = (id: string) => {
    setSavedPrompts(prev => prev.filter(item => item.id !== id));
  };

  // Refiner State
  const [refinementTip, setRefinementTip] = useState<string | null>(null);
  const [isRefining, setIsRefining] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Watch for description changes to provide tips
  useEffect(() => {
    const timer = setTimeout(() => {
      if (description.trim().length > 10 && description.trim().length < 100) {
        provideRefinementTip();
      } else if (description.trim().length === 0) {
        setRefinementTip(null);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [description]);

  const provideRefinementTip = async () => {
    try {
      setIsRefining(true);
      const prompt = `Analyze this prompt concept: "${description}". 
      In EXACTLY one short sentence (max 15 words), provide a specific tip to make it better. 
      Do not use intro text. If the concept is already very detailed, just say "Excellent concept complexity."`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      
      const tip = response.text || "";
      setRefinementTip(tip);
    } catch (err) {
      console.error("Refinement failed:", err);
    } finally {
      setIsRefining(false);
    }
  };

  const stats = generatedPrompt ? {
    words: generatedPrompt.split(/\s+/).filter(Boolean).length,
    chars: generatedPrompt.length
  } : null;

  // Extract variables from prompt like [VARIABLE_NAME]
  useEffect(() => {
    if (generatedPrompt) {
      const regex = /\[([A-Z0-9_]+)\]/g;
      const matches = [...generatedPrompt.matchAll(regex)];
      const newVars: Record<string, string> = {};
      matches.forEach(match => {
        if (!newVars[match[1]]) {
          newVars[match[1]] = "";
        }
      });
      setVariables(newVars);
      setShowVariablesPanel(Object.keys(newVars).length > 0);
    }
  }, [generatedPrompt]);

  const getFinalPrompt = () => {
    if (!generatedPrompt) return "";
    let final = generatedPrompt;
    Object.entries(variables).forEach(([key, value]) => {
      const escapedKey = `\\[${key}\\]`;
      if (value.trim()) {
        final = final.replace(new RegExp(escapedKey, 'g'), value);
      } else {
        // Automatically remove empty/unused placeholders for a clean prompt
        final = final.replace(new RegExp(escapedKey, 'g'), "").replace(/\s\s+/g, ' ').trim();
      }
    });
    return final;
  };

  const enhanceDescription = async () => {
    if (!description.trim()) return;
    setError(null);
    try {
      setIsEnhancing(true);
      const prompt = `Act as an expert prompt enhancer. Expand and refine this basic concept into a more detailed, professional, and clear descriptive paragraph (max 50 words): "${description}". Focus on adding context, goals, and specific parameters. Output ONLY the enhanced text.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      
      const enhanced = (response.text || "").trim();
      setDescription(enhanced);
    } catch (err) {
      console.error("Enhancement failed:", err);
      setError('Magic Enhance failed. Please check your concept or connection.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const generatePrompt = async () => {
    // Basic validation
    const errors: string[] = [];
    if (!description.trim()) errors.push('description');
    if (!selectedCategory) errors.push('category');
    if (!selectedTone) errors.push('tone');
    if (!selectedFormat) errors.push('format');
    if (!selectedAudience) errors.push('audience');
    if (!selectedPersona) errors.push('persona');

    if (errors.length > 0) {
      setValidationErrors(errors);
      setError('Essential Components Missing: Please complete the fields highlighted in red.');
      return;
    }

    setValidationErrors([]);
    setIsGenerating(true);
    setError(null);
    setGeneratedPrompt(null);

    const category = CATEGORIES.find(c => c.id === selectedCategory)?.label || "General";
    
    // Video Scripting Specialization
    let scriptSpecialization = "";
    if (selectedCategory === 'content' && selectedContentType === 'script') {
      scriptSpecialization = `
      CRITICAL FOCUS: DIALOGUE DOMINANCE.
      This is a full video script blueprint. You MUST prioritize the SPOKEN DIALOGUE above all else.
      - Mandate a structure where [DIALOGUE/VOICEOVER] is the primary column/section.
      - Visual descriptions ([VISUALS]) must be secondary and strictly support the dialogue.
      - Ensure the word count of the dialogue matches the duration: ${isCustomDuration ? customDuration + ' mins' : selectedDuration}.
      - AVOID any "meta-talk" or fluff instructions. Focus on generating natural, high-impact verbal narration.
      - Mandate character names or "VO" markers for every line of dialogue.
      `;
    }

    // Framework Logic
    const frameworkInstr = {
      rtf: "FRAMEWORK: ROLE-TASK-FORMAT. Clearly define WHO you are, WHAT specifically must be done, and the exact FORMAT output.",
      cot: "FRAMEWORK: CHAIN-OF-THOUGHT. Instruct the AI to 'Think step-by-step', 'Explain reasoning before final answer', and 'Check for logical consistency'.",
      care: "FRAMEWORK: CONTEXT-ACTION-RESULT-EXAMPLE. Provide deep background, the specific action items, the desired business outcome, and a representative example.",
      risen: "FRAMEWORK: ROLE-INPUT-STEPS-EXPECTATIONS. Define identity, provide seed data, outline execution steps, and specify quality expectations."
    }[selectedFramework] || "";

    const depthInstr = {
      fundamental: "DEPTH: Use clear, jargon-free language suitable for core understanding.",
      intermediate: "DEPTH: Standard professional depth with common terminology.",
      visionary: "DEPTH: Focus on strategic implications, future trends, and high-level conceptual goals.",
      granular: "DEPTH: Extremely detailed, technical precision, exhaustive parameters, and edge-case handling."
    }[selectedDepth] || "";

    const directnessInstr = "DO NOT include any filler text or 'here is your prompt' introductions. Start immediately with the prompt content.";
    
    const globalNegative = `
    CRITICAL NEGATIVE CONSTRAINTS:
    - No robotic filler like "As an AI..." or "I hope this helps."
    - Purely professional and realistic execution.
    ${negativeConstraints ? `- STRICTLY AVOID: ${negativeConstraints}` : ''}
    `;

    const modelPatterns = {
      chatgpt: "STYLE: Optimized for GPT-4/O1. Use system-level imperatives and delimited logic blocks.",
      claude: "STYLE: Optimized for Claude. Use XML-style structural tags for hierarchy and safety layers.",
      gemini: "STYLE: Optimized for Gemini. Focus on multimodal readiness and direct markdown hierarchical flow.",
      llama: "STYLE: Optimized for Llama. Use explicit numbering and strong task-boundary markers."
    }[selectedModel as keyof typeof modelPatterns] || "";
    
    const systemPrompt = `You are an Expert Prompt Engineer.
    Mission: Write a high-performance, realistic prompt for "${description}".
    
    ${scriptSpecialization}
    
    INSTRUCTIONS FOR THE GENERATED PROMPT:
    1. ROLE: The AI must act as a ${selectedPersona}.
    2. TONE: Use a ${selectedTone} tone.
    3. TARGET AUDIENCE: ${selectedAudience}.
    4. FRAMEWORK: ${frameworkInstr}.
    5. DEPTH: ${depthInstr}.
    6. FORMAT: Ensure the output is in ${selectedFormat} format.
    7. STYLE: Optimized for ${selectedModel.toUpperCase()}. ${modelPatterns}.
    8. CREATIVITY: ${creativityLevel > 0.8 ? 'Extremely creative/out-of-the-box' : 'Precise and analytical'}.
    
    RULES FOR THIS OUTPUT:
    - START IMMEDIATELY with the prompt. 
    - Output ONLY the engineered prompt text.
    - NO introduction like "Here is your prompt".
    - The generated prompt must instruct the final AI to respond in ${selectedLanguage}.
    ${useCoT ? "- The generated prompt must mandate Chain-of-Thought reasoning (Think step by step)." : ""}
    ${globalNegative}
    
    Your goal is to provide the raw text of the prompt that I can copy and paste directly into another AI.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: systemPrompt,
      });
      
      const text = response.text;
      if (text) {
        setGeneratedPrompt(text);
        setHistory(prev => [text, ...prev].slice(0, 5));
      }
    } catch (err) {
      console.error(err);
      setError('Failed to generate prompt. Please check your connection.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    const final = getFinalPrompt();
    if (final) {
      navigator.clipboard.writeText(final);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    }
  };

  const downloadPrompt = () => {
    const final = getFinalPrompt();
    if (!final) return;
    const blob = new Blob([final], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart-prompt-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const applySuggestion = (sug: string) => {
    setDescription(sug);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto flex flex-col">
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">PromptGuru</h1>
              <p className="text-sm text-slate-500 font-medium leading-none">AI Prompt Engineering Studio</p>
            </div>
          </div>
        </div>
        <div className="hidden md:flex gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            AI Engine: Gemini 3.1
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
            Build v1.0.4
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        
        {/* Sidebar portion (Input Section) */}
        <div className="lg:col-span-12 xl:col-span-4 flex flex-col gap-6">
          
          {/* Main Input Control */}
          <div className="polished-card p-6 flex flex-col h-full bg-white">
            <div className="flex-1 space-y-6">
              <div className={`p-4 rounded-2xl border transition-all duration-300 ${validationErrors.includes('description') ? 'border-red-400 bg-red-50/20 shadow-none' : 'bg-white border-transparent'}`}>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block flex items-center gap-2">
                    <Settings2 className="w-4 h-4 text-indigo-500" /> 
                    Base Concept
                  </label>
                  {validationErrors.includes('description') && <span className="text-[10px] font-bold text-red-500 animate-pulse uppercase">Enter Concept</span>}
                </div>
                <div className="flex gap-2">
                  <textarea
                    className="polished-input h-28 resize-none text-base border-slate-200 flex-1"
                    placeholder='e.g. "Customer service AI strategy" or "A story about a lost dog"'
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      if (validationErrors.includes('description')) setValidationErrors(prev => prev.filter(v => v !== 'description'));
                    }}
                  />
                  <button 
                    onClick={enhanceDescription}
                    disabled={isEnhancing || !description.trim()}
                    className={`p-3 rounded-xl border border-indigo-100 flex flex-col items-center justify-center gap-1 transition-all ${
                      description.trim() ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100' : 'bg-slate-50 text-slate-300 pointer-events-none'
                    }`}
                    title="Magic Enhance"
                  >
                    <Sparkles className={`w-5 h-5 ${isEnhancing ? 'animate-spin' : ''}`} />
                    <span className="text-[8px] font-black uppercase">Magic</span>
                  </button>
                </div>

                {/* AI Refinement Tip */}
                <AnimatePresence>
                  {refinementTip && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 p-2 bg-indigo-50 border border-indigo-100 rounded-lg flex items-start gap-2"
                    >
                      <Lightbulb className="w-3.5 h-3.5 text-indigo-500 mt-0.5 flex-shrink-0" />
                      <div>
                         <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-tight mb-0.5">Architect Insight</p>
                         <p className="text-[10px] text-slate-600 font-medium leading-tight italic">"{refinementTip}"</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Quick Suggestions */}
                <div className="mt-3">
                  <div className="flex items-center gap-2 mb-2">
                     <Lightbulb className="w-3 h-3 text-indigo-400" />
                     <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Examples</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 font-sans">
                    {SUGGESTIONS.map(s => (
                      <button
                        key={s}
                        onClick={() => applySuggestion(s)}
                        className="text-[9px] font-medium px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-colors truncate max-w-[130px] border border-transparent hover:border-slate-300"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-2xl border transition-all duration-300 ${validationErrors.includes('category') ? 'border-red-400 bg-red-50/20 shadow-none' : 'bg-slate-50/50 border-slate-100 shadow-sm'}`}>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Core Category</label>
                  {validationErrors.includes('category') && <span className="text-[10px] font-bold text-red-500 animate-pulse uppercase">Select One</span>}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          if (validationErrors.includes('category')) setValidationErrors(prev => prev.filter(v => v !== 'category'));
                        }}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${
                          isSelected 
                            ? 'border-indigo-200 bg-indigo-50 text-indigo-700 font-bold shadow-sm' 
                            : 'border-white bg-white text-slate-500 hover:border-slate-100'
                        }`}
                      >
                        <cat.icon className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                        <span className="text-[9px] uppercase tracking-wide truncate">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <AnimatePresence>
                {selectedCategory === 'content' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-4 border-l-2 border-indigo-200 pl-4 py-1"
                  >
                    <div>
                       <label className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-2 block uppercase">Scripting Intensity</label>
                       <div className="flex flex-col gap-1.5">
                         {CONTENT_TYPES.map(ct => (
                           <button
                             key={ct.id}
                             onClick={() => setSelectedContentType(ct.id)}
                             className={`text-left px-3 py-2 rounded-lg text-[10px] font-bold border transition-all ${
                               selectedContentType === ct.id 
                                 ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' 
                                 : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-100'
                             }`}
                           >
                             {ct.label}
                           </button>
                         ))}
                       </div>
                    </div>
                    <div>
                       <label className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-2 block uppercase">Video Duration</label>
                       <div className="flex flex-wrap gap-2 mb-3">
                         {DURATIONS.map(d => (
                           <button
                             key={d}
                             onClick={() => {
                               setSelectedDuration(d);
                               setIsCustomDuration(false);
                             }}
                             className={`px-3 py-2 rounded-lg text-[9px] font-bold border transition-all ${
                               !isCustomDuration && selectedDuration === d 
                                 ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' 
                                 : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-100'
                             }`}
                           >
                             {d}
                           </button>
                         ))}
                         <button
                           onClick={() => setIsCustomDuration(true)}
                           className={`px-3 py-2 rounded-lg text-[9px] font-bold border transition-all ${
                             isCustomDuration 
                               ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' 
                               : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-100'
                           }`}
                         >
                           Custom
                         </button>
                       </div>
                       
                       {isCustomDuration && (
                         <div className="animate-in fade-in zoom-in-95 duration-200">
                           <div className="relative">
                             <input 
                              type="number"
                              value={customDuration}
                              onChange={(e) => setCustomDuration(e.target.value)}
                              placeholder="Enter minutes (e.g. 20)"
                              className="polished-input py-2 px-3 text-[10px] font-bold border-indigo-100 focus:border-indigo-300 pr-12"
                             />
                             <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-indigo-400 pointer-events-none">
                               MINS
                             </div>
                           </div>
                         </div>
                       )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-5 pt-2">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">AI Engine Selection</label>
                  <div className="grid grid-cols-2 gap-2">
                    {AI_MODELS.map(m => (
                      <button
                        key={m.id}
                        onClick={() => setSelectedModel(m.id)}
                        className={`text-[10px] font-black px-4 py-3 rounded-2xl border transition-all text-left flex items-center justify-between ${
                          selectedModel === m.id 
                            ? 'border-indigo-600 bg-slate-900 text-white shadow-lg scale-[1.02]' 
                            : 'border-slate-100 bg-white text-slate-400 hover:border-indigo-200'
                        }`}
                      >
                        {m.label}
                        <div className={`w-1.5 h-1.5 rounded-full ${m.id === selectedModel ? 'bg-indigo-400 animate-pulse' : 'bg-slate-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className={validationErrors.includes('persona') ? 'p-1 bg-red-50 rounded-lg' : ''}>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Persona</label>
                        {validationErrors.includes('persona') && <span className="text-[8px] font-bold text-red-500 animate-pulse uppercase">Required</span>}
                      </div>
                      <select 
                        value={selectedPersona}
                        onChange={(e) => {
                          setSelectedPersona(e.target.value);
                          if (validationErrors.includes('persona')) setValidationErrors(prev => prev.filter(v => v !== 'persona'));
                        }}
                        className={`polished-input py-2 text-xs ${validationErrors.includes('persona') ? 'border-red-300' : ''}`}
                      >
                        <option value="">Role as...</option>
                        {PERSONAS.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <div className={validationErrors.includes('tone') ? 'p-1 bg-red-50 rounded-lg' : ''}>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Tone</label>
                      <select 
                        value={selectedTone}
                        onChange={(e) => {
                          setSelectedTone(e.target.value);
                          if (validationErrors.includes('tone')) setValidationErrors(prev => prev.filter(v => v !== 'tone'));
                        }}
                        className={`polished-input py-2 text-xs ${validationErrors.includes('tone') ? 'border-red-300' : ''}`}
                      >
                        <option value="">Select Tone...</option>
                        {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className={validationErrors.includes('audience') ? 'p-1 bg-red-50 rounded-lg' : ''}>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Audience</label>
                      <select 
                        value={selectedAudience}
                        onChange={(e) => {
                          setSelectedAudience(e.target.value);
                          if (validationErrors.includes('audience')) setValidationErrors(prev => prev.filter(v => v !== 'audience'));
                        }}
                        className={`polished-input py-2 text-xs ${validationErrors.includes('audience') ? 'border-red-300' : ''}`}
                      >
                        <option value="">Select Audience...</option>
                        {AUDIENCES.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Language</label>
                      <select 
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="polished-input py-2 text-xs"
                      >
                        {LANGUAGES.map(l => <option key={l.label} value={l.label}>{l.native}</option>)}
                      </select>
                    </div>
                  </div>

                <div className={`p-4 rounded-2xl border transition-all duration-300 ${validationErrors.includes('format') ? 'border-red-400 bg-red-50/20 shadow-none' : 'bg-slate-50/50 border-slate-100 shadow-sm'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Blueprint Format</label>
                    {validationErrors.includes('format') && <span className="text-[10px] font-bold text-red-500 animate-pulse uppercase">Required</span>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {FORMATS.map(f => (
                      <button
                        key={f}
                        onClick={() => {
                          setSelectedFormat(f);
                          if (validationErrors.includes('format')) setValidationErrors(prev => prev.filter(v => v !== 'format'));
                        }}
                        className={`px-3 py-1.5 text-[9px] font-bold rounded-full transition-all border ${
                          selectedFormat === f 
                            ? 'border-indigo-600 bg-indigo-600 text-white shadow-md' 
                            : 'border-white bg-white text-slate-500 hover:border-slate-100 shadow-sm'
                        }`}
                      >
                        {f.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Advanced Options Toggle */}
                <div className="pt-4 mt-4 border-t border-slate-100">
                   <button 
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="w-full flex items-center justify-between group py-1"
                   >
                     <div className="flex items-center gap-2">
                        <Settings2 className={`w-4 h-4 transition-colors ${showAdvanced ? 'text-indigo-600' : 'text-slate-300'}`} />
                        <span className={`text-[11px] font-black uppercase tracking-widest ${showAdvanced ? 'text-indigo-600' : 'text-slate-400'}`}>Advanced Parameters</span>
                     </div>
                     <motion.div
                       animate={{ rotate: showAdvanced ? 90 : 0 }}
                       transition={{ type: "spring", stiffness: 300 }}
                     >
                       <ChevronRight className={`w-4 h-4 ${showAdvanced ? 'text-indigo-600' : 'text-slate-300'}`} />
                     </motion.div>
                   </button>

                   <AnimatePresence>
                     {showAdvanced && (
                       <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden space-y-6 pt-6"
                       >
                          <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">Engineering Framework</label>
                            <div className="grid grid-cols-2 gap-2">
                              {FRAMEWORKS.map(fw => (
                                <button
                                  key={fw.id}
                                  onClick={() => setSelectedFramework(fw.id)}
                                  className={`group p-2.5 rounded-2xl border text-left transition-all ${
                                    selectedFramework === fw.id 
                                      ? 'border-indigo-600 bg-slate-900 text-white shadow-lg' 
                                      : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200 shadow-sm'
                                  }`}
                                >
                                  <p className="text-[9px] font-black uppercase mb-0.5">{fw.label}</p>
                                  <p className={`text-[7px] leading-tight font-medium ${selectedFramework === fw.id ? 'text-slate-400' : 'text-slate-400'}`}>{fw.desc}</p>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">Technical Depth</label>
                            <div className="grid grid-cols-2 gap-2">
                              {DEPTH_LEVELS.map(level => (
                                <button
                                  key={level.id}
                                  onClick={() => setSelectedDepth(level.id)}
                                  className={`p-2.5 rounded-xl border transition-all text-left ${
                                    selectedDepth === level.id 
                                      ? 'border-indigo-200 bg-indigo-50 text-indigo-700 font-black shadow-sm' 
                                      : 'border-slate-100 bg-white text-slate-500 shadow-sm'
                                  }`}
                                >
                                  <p className="text-[10px] uppercase tracking-tighter mb-0.5 font-bold">{level.label}</p>
                                  <p className="text-[8px] font-medium text-slate-400 leading-none">{level.desc}</p>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                             <div>
                               <p className="text-[10px] font-black text-indigo-700 uppercase tracking-widest leading-none mb-1">Reasoning Protocol</p>
                               <p className="text-[8px] text-indigo-400 font-bold uppercase tracking-widest">Chain of Thought Mode</p>
                             </div>
                             <button 
                                onClick={() => setUseCoT(!useCoT)}
                                className={`w-10 h-5 rounded-full relative transition-colors ${useCoT ? 'bg-indigo-600' : 'bg-slate-200'}`}
                             >
                                <motion.div animate={{ x: useCoT ? 22 : 2 }} className="w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm" />
                             </button>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Creativity Index</label>
                              <span className="text-[10px] font-black text-indigo-600 bg-white px-2 py-0.5 rounded border border-indigo-100">{Math.round(creativityLevel * 100)}%</span>
                            </div>
                            <input 
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={creativityLevel}
                              onChange={(e) => setCreativityLevel(parseFloat(e.target.value))}
                              className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between mt-1 text-[8px] font-black text-slate-400 uppercase tracking-tighter">
                              <span>Exact</span>
                              <span>Balanced</span>
                              <span>Creative</span>
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Negative Constraints</label>
                            <input
                              type="text"
                              className="polished-input py-3 text-[10px] font-bold rounded-xl"
                              placeholder="e.g. No fluff, No jargon..."
                              value={negativeConstraints}
                              onChange={(e) => setNegativeConstraints(e.target.value)}
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block font-black">Information Density</label>
                            <div className="flex gap-2">
                              {LENGTHS.map(l => (
                                <button
                                  key={l.id}
                                  onClick={() => setSelectedLength(l.id)}
                                  className={`flex-1 py-2.5 text-[10px] font-black rounded-xl border transition-all ${
                                    selectedLength === l.id 
                                      ? 'border-indigo-600 bg-slate-900 text-white shadow-md' 
                                      : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200 shadow-sm'
                                  }`}
                                >
                                  {l.id === 'concise' ? 'COMPACT' : 'EXHAUSTIVE'}
                                </button>
                              ))}
                            </div>
                          </div>
                       </motion.div>
                     )}
                   </AnimatePresence>
                </div>
              </div>
            </div>

            <button
              onClick={generatePrompt}
              disabled={isGenerating}
              className="btn-indigo w-full py-4 text-sm mt-8 flex items-center justify-center gap-3"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Generate Detailed Prompt
                </>
              )}
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p className="text-xs font-bold">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content (Output Section) */}
        <div className="lg:col-span-12 xl:col-span-8 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {generatedPrompt ? (
              <motion.div
                key="output"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex flex-col gap-6 h-full"
              >
                  <div className="flex-1 flex flex-col">
                    {/* Header moved to inside glass-panel if we want it tighter, but keeping outside for consistency */}
                    <header className="flex justify-between items-center mb-6">
                      <div>
                        <h2 className="text-lg font-bold text-slate-800">Blueprint Preview</h2>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedFramework && (
                            <span className="px-2 py-0.5 bg-slate-900 text-white text-[8px] font-black rounded uppercase tracking-widest">
                              {selectedFramework.toUpperCase()} System
                            </span>
                          )}
                          {selectedDepth && (
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 text-[8px] font-black rounded uppercase tracking-widest">
                              {selectedDepth.toUpperCase()} Depth
                            </span>
                          )}
                          {useCoT && (
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 text-[8px] font-black rounded uppercase tracking-widest">
                              Thinking Protocol Active
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {/* Header actions removed to consolidate at bottom */}
                      </div>
                    </header>

                  <div className="flex-1 glass-panel p-0 overflow-hidden relative min-h-[500px] flex flex-col border-none shadow-2xl">
                    <div className="bg-slate-900/90 backdrop-blur-md px-6 py-3 flex items-center justify-between border-b border-slate-800">
                       <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-400/50"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-400/50"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/50"></div>
                       </div>
                       <div className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                          <Terminal className="w-3 h-3" />
                          ARCHITECT_BLUEPRINT_STABLE
                       </div>
                    </div>
                    
                    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-white/40 text-slate-800 selection:bg-indigo-100 italic font-medium leading-relaxed tracking-wide text-base border-t border-white/20">
                      <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap selection:bg-indigo-600 selection:text-white">
                        {getFinalPrompt()}
                      </pre>
                    </div>

                    <div className="mt-2 flex flex-row items-center gap-2 p-4 pt-4 border-t border-slate-100/30">
                      <button 
                        onClick={generatePrompt}
                        disabled={isGenerating}
                        className="flex-none px-4 py-3 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-[10px] md:text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm hover:border-indigo-300 hover:text-indigo-600 transition-all active:scale-95 uppercase"
                      >
                        <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} /> 
                        Regenerate
                      </button>

                      <button 
                        onClick={copyToClipboard}
                        className={`flex-1 py-3 rounded-xl text-[10px] md:text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md ${
                          hasCopied 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                      >
                        {hasCopied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                        {hasCopied ? 'Copied' : 'Copy'}
                      </button>

                      <button 
                        onClick={saveToLibrary}
                        className={`flex-none px-4 py-3 rounded-xl text-[10px] md:text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 border ${
                          savedPrompts.some(p => p.text === getFinalPrompt())
                            ? 'bg-slate-900 border-slate-900 text-white'
                            : 'bg-white border-slate-100 text-slate-800 hover:border-indigo-400'
                        }`}
                      >
                        <motion.div
                          animate={savedPrompts.some(p => p.text === getFinalPrompt()) ? { scale: [1, 1.3, 1] } : {}}
                        >
                          <Bookmark 
                            className={`w-3.5 h-3.5 ${savedPrompts.some(p => p.text === getFinalPrompt()) ? 'fill-white' : 'fill-none'}`} 
                          />
                        </motion.div>
                        {savedPrompts.some(p => p.text === getFinalPrompt()) ? 'Saved' : 'Save'}
                      </button>
                    </div>
                  </div>

                  <footer className="mt-6 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest border-t border-slate-200 pt-4">
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-indigo-400" /> Optimal</span>
                      {stats && (
                        <>
                          <span className="text-slate-300">|</span>
                          <span>{stats.words} Words</span>
                          <span className="text-slate-300">|</span>
                          <span>{stats.chars} Chars</span>
                        </>
                      )}
                    </div>
                    <div className="text-indigo-400">Model: {selectedModel.toUpperCase()}</div>
                  </footer>
                </div>

                {/* Why this works panel re-styled */}
                <div className="polished-card p-6 bg-slate-50 border-indigo-100 flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-indigo-500" /> Understanding the Logic
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                         <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Expert Identity</span>
                         <p className="text-xs text-slate-500 leading-relaxed">
                           The prompt establishes a high-level persona to ensure specialized domain knowledge.
                         </p>
                      </div>
                      <div className="space-y-1">
                         <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Zero-Shot Precision</span>
                         <p className="text-xs text-slate-500 leading-relaxed">
                           Engineered constraints focus the model's output on your exact structural needs.
                         </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-panel p-16 flex flex-col items-center justify-center text-center h-full border-dashed border-slate-300"
              >
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-inner border transition-all duration-500 ${
                  isGenerating 
                    ? 'bg-indigo-600 border-indigo-400 scale-110 shadow-indigo-200 animate-pulse' 
                    : 'bg-indigo-50 border-indigo-100'
                }`}>
                  <Sparkles className={`w-10 h-10 transition-colors ${
                    isGenerating ? 'text-white animate-spin' : 'text-indigo-300'
                  }`} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {isGenerating ? 'Synthesizing Architecture' : 'Prompt Laboratory'}
                </h3>
                <p className="text-slate-500 max-w-sm font-medium text-sm">
                  {isGenerating ? (
                    <span className="flex flex-col items-center gap-2">
                      <span>Our AI Architect is engineering your request into a high-performance blueprint.</span>
                      <span className="flex items-center gap-1.5 mt-2">
                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                      </span>
                    </span>
                  ) : (
                    'Configure your concept in the architectural panel to your left. Your generated blueprint will manifest here.'
                  )}
                </p>
                
                <div className="mt-10 flex flex-wrap justify-center gap-3 opacity-60">
                   <div className="px-4 py-1.5 bg-slate-100 text-[10px] font-bold text-slate-500 rounded-lg">RAG-FRAMEWORK</div>
                   <div className="px-4 py-1.5 bg-slate-100 text-[10px] font-bold text-slate-500 rounded-lg">CHAIN-OF-THOUGHT</div>
                   <div className="px-4 py-1.5 bg-slate-100 text-[10px] font-bold text-slate-500 rounded-lg">STRUCTURED_DATA</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Prompt Library Section */}
      {savedPrompts.length > 0 && (
        <section className="mt-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-white">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Prompt Library</h2>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Your Private Collection</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedPrompts.map(item => (
              <div key={item.id} className="polished-card p-5 bg-white border-slate-100 group relative flex flex-col h-full">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{item.date}</span>
                  <button 
                    onClick={() => deleteFromLibrary(item.id)}
                    className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs text-slate-600 line-clamp-4 leading-relaxed font-mono italic">
                    {item.text}
                  </p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(item.text);
                    }}
                    className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
                  >
                    <Copy className="w-3 h-3" /> Copy Prompt
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="mt-16 py-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6 font-medium">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-slate-800 text-white rounded-lg flex items-center justify-center text-[10px] font-bold">PG</div>
            <span className="text-sm font-bold text-slate-800">PromptGuru</span>
          </div>
          <div className="w-px h-6 bg-slate-200"></div>
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em]">Crafted with Precision by Monuwar</p>
        </div>
        
        {history.length > 0 && (
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Session History:</span>
             <div className="flex -space-x-1.5">
                {history.map((_, i) => (
                  <div key={i} className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-600 shadow-sm relative z-[10]">
                    {history.length - i}
                  </div>
                ))}
             </div>
          </div>
        )}
      </footer>
    </div>
  );
}
