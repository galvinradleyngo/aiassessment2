import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Zap, 
  BrainCircuit, 
  Eye, 
  ArrowRight, 
  CheckCircle2,
  Scale,
  RotateCcw,
  Plus,
  Trash2,
  Info,
  MessageSquare,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  LayoutDashboard,
  BookOpen,
  Target,
  HelpCircle,
  Download,
  FileText,
  Copy,
  UserCheck,
  ShieldAlert,
  Users,
  Search,
  ListTodo,
  Lock,
  Unlock
} from 'lucide-react';

const html2canvasScript = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
const jsPdfScript = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";

const GRADE_LEVELS = ['Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7 and above'];
const K3_GRADE_LEVELS = ['Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3'];

const AI_LITERACY_SKILLS = [
  {
    id: 'Understanding AI Fundamentals',
    title: 'Understanding AI Fundamentals',
    description: 'Understand foundational knowledge of how AI systems are trained, how they operate, and where they are typically applied.'
  },
  {
    id: 'AI Output Evaluation',
    title: 'AI Output Evaluation',
    description: 'Critically analyse, verify, and improve AI-generated content (e.g., accuracy, relevance, appropriateness).'
  },
  {
    id: 'Input Design and Information Quality',
    title: 'Input Design and Information Quality',
    description: 'Critically design, structure, and refine inputs (e.g. prompts and datasets) to improve the accuracy, relevance, and creativity of AI-generated outputs.'
  },
  {
    id: 'AI Bias & Limitation Awareness',
    title: 'AI Bias & Limitation Awareness',
    description: 'Identify potential biases, reliability issues, and limitations of AI tools, and apply strategies to mitigate them.'
  },
  {
    id: 'AI Integration & Application',
    title: 'AI Integration & Application',
    description: 'Effectively use AI tools to address domain-specific tasks, support problem-solving, and enhance workflow efficiency.'
  },
  {
    id: 'AI Ethics & Responsible Use',
    title: 'AI Ethics & Responsible Use',
    description: 'Understand and apply ethical principles and consider issues such as fairness, privacy, transparency, and accountability in AI use.'
  },
  {
    id: 'AI Reflection & Metacognition',
    title: 'AI Reflection & Metacognition',
    description: "Reflect on AI's role in the thinking, learning, or creating process, including its impact on decision-making and understanding."
  }
];

const App = () => {
  const [step, setStep] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => (
    typeof window === 'undefined' ? true : window.innerWidth >= 1024
  ));
  const [data, setData] = useState({
    courseName: '',
    gradeLevel: '',
    subject: '',
    learningOutcomes: ['', ''], 
    tasks: ['', '', '', ''], 
    assessmentType: '', 
    integratedSubtype: '', 
    essentialTaskIndices: [], 
    humanCompetencyStrategy: '', 
    integrityProvisions: '',
    submissionRequirements: '', 
    integrationFocus: '',
    criticalEngagement: '', 
    redesignedTasks: [
      { task: '', usage: 'AI Expected' },
      { task: '', usage: 'AI Expected' },
      { task: '', usage: 'AI Expected' }
    ],
    aiLiteracySkills: [],
    preAiSkillsDeveloped: '',
    preAiLiteracySkills: [],
    preAiSkillsExplanation: '',
  });

  const blueprintRef = useRef(null);
  const mainRef = useRef(null);

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [step]);

  const updateData = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleOutcomeChange = (index, value) => {
    const newOutcomes = [...data.learningOutcomes];
    newOutcomes[index] = value;
    setData(prev => ({ ...prev, learningOutcomes: newOutcomes }));
  };

  const handleTaskChange = (index, value) => {
    const newTasks = [...data.tasks];
    newTasks[index] = value;
    setData(prev => ({ ...prev, tasks: newTasks }));
  };

  const handleRedesignedTaskChange = (index, value) => {
    const newTasks = [...data.redesignedTasks];
    newTasks[index] = { ...newTasks[index], task: value };
    setData(prev => ({ ...prev, redesignedTasks: newTasks }));
  };

  const setRedesignedTaskUsage = (index, usage) => {
    const newTasks = [...data.redesignedTasks];
    newTasks[index] = { ...newTasks[index], usage };
    setData(prev => ({ ...prev, redesignedTasks: newTasks }));
  };

  const addRedesignedTask = () => {
    setData(prev => ({
      ...prev,
      redesignedTasks: [...prev.redesignedTasks, { task: '', usage: 'AI Expected' }]
    }));
  };

  const removeRedesignedTask = (index) => {
    setData(prev => {
      if (prev.redesignedTasks.length <= 1) return prev;
      return {
        ...prev,
        redesignedTasks: prev.redesignedTasks.filter((_, i) => i !== index)
      };
    });
  };

  const toggleEssential = (index) => {
    setData(prev => {
      const isEssential = prev.essentialTaskIndices.includes(index);
      return {
        ...prev,
        essentialTaskIndices: isEssential 
          ? prev.essentialTaskIndices.filter(i => i !== index)
          : [...prev.essentialTaskIndices, index]
      };
    });
  };

  const nextStep = () => {
    if (step >= 9) return;
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (step <= 1) return;
    setStep(prev => prev - 1);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
          if (step < 9 && step !== 5 && step !== 6 && step !== 7 && step !== 8) {
            e.preventDefault();
            nextStep();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, data]);

  // Load export libraries for image/PDF output.
  useEffect(() => {
    const scripts = [html2canvasScript, jsPdfScript].map((src) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.head.appendChild(script);
      return script;
    });

    return () => {
      scripts.forEach((script) => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, []);

  const captureBlueprintCanvas = async () => {
    if (!blueprintRef.current || !window.html2canvas) return null;

    return window.html2canvas(blueprintRef.current, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff"
    });
  };

  const shareOrDownloadFile = async (blob, filename, mimeType) => {
    const file = new File([blob], filename, { type: mimeType });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: filename });
        return;
      } catch (err) {
        if (err?.name === 'AbortError') return;
        // Sharing failed for a non-cancellation reason; fall through to a direct download.
      }
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadImage = async () => {
    const canvas = await captureBlueprintCanvas();
    if (!canvas) return;

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) return;

    await shareOrDownloadFile(blob, `Blueprint-${data.subject || 'Assessment'}.png`, 'image/png');
  };

  const downloadPdf = async () => {
    if (!window.jspdf?.jsPDF) return;

    const canvas = await captureBlueprintCanvas();
    if (!canvas) return;

    const { jsPDF } = window.jspdf;
    const orientation = canvas.width >= canvas.height ? 'landscape' : 'portrait';
    const pdf = new jsPDF({
      orientation,
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, canvas.width, canvas.height);

    const blob = pdf.output('blob');
    await shareOrDownloadFile(blob, `Blueprint-${data.subject || 'Assessment'}.pdf`, 'application/pdf');
  };

  const getThemeColor = () => {
    if (data.assessmentType === 'AI-Free') return { border: 'border-rose-500', bg: 'bg-rose-50', text: 'text-rose-700', banner: 'bg-rose-600', accent: 'rose' };
    if (data.assessmentType === 'AI-Assisted') return { border: 'border-amber-500', bg: 'bg-amber-50', text: 'text-amber-700', banner: 'bg-amber-600', accent: 'amber' };
    if (data.assessmentType === 'AI-Integrated') return { border: 'border-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', banner: 'bg-emerald-600', accent: 'emerald' };
    return { border: 'border-indigo-500', bg: 'bg-indigo-50', text: 'text-indigo-700', banner: 'bg-indigo-600', accent: 'indigo' };
  };

  const formatListWithAnd = (items) => {
    if (items.length === 0) return "";
    if (items.length === 1) return items[0];
    const lastItem = items[items.length - 1];
    const otherItems = items.slice(0, items.length - 1);
    return `${otherItems.join(", ")} and ${lastItem}`;
  };

  const endWithPeriod = (text) => {
    const trimmed = (text || '').trim();
    if (!trimmed) return trimmed;
    return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
  };

  const toggleAiLiteracySkill = (skillId) => {
    setData((prev) => {
      const isSelected = prev.aiLiteracySkills.includes(skillId);
      return {
        ...prev,
        aiLiteracySkills: isSelected
          ? prev.aiLiteracySkills.filter((id) => id !== skillId)
          : [...prev.aiLiteracySkills, skillId]
      };
    });
  };

  const togglePreAiLiteracySkill = (skillId) => {
    setData((prev) => {
      const isSelected = prev.preAiLiteracySkills.includes(skillId);
      return {
        ...prev,
        preAiLiteracySkills: isSelected
          ? prev.preAiLiteracySkills.filter((id) => id !== skillId)
          : [...prev.preAiLiteracySkills, skillId]
      };
    });
  };

  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
              <label className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Step 1</label>
              <h3 className="text-2xl font-bold text-gray-900">Course/Subject Area Identification</h3>
              <p className="text-sm text-gray-500">Enter the name of the course/subject area for this redesign.</p>
            </div>
            <input
              autoFocus
              className="w-full p-4 bg-white border border-gray-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
              placeholder="e.g., Cost Accounting"
              value={data.courseName}
              onChange={(e) => updateData('courseName', e.target.value)}
            />
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Grade Level</label>
              <select
                className="w-full p-4 bg-white border border-gray-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
                value={data.gradeLevel}
                onChange={(e) => updateData('gradeLevel', e.target.value)}
              >
                <option value="">Select grade level...</option>
                {GRADE_LEVELS.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
              <label className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Step 2</label>
              <h3 className="text-2xl font-bold text-gray-900">Assessment Title</h3>
              <p className="text-sm text-gray-500">What is the performance-based assessment?</p>
            </div>
            <input 
              autoFocus
              className="w-full p-4 bg-white border border-gray-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
              placeholder="e.g., Cost Analysis Report"
              value={data.subject}
              onChange={(e) => updateData('subject', e.target.value)}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
              <label className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Step 3</label>
              <h3 className="text-2xl font-bold text-gray-900">Learning Outcomes</h3>
              <p className="text-sm text-gray-500">List the specific CLOs/Learning Outcomes this assessment provides evidence for.</p>
            </div>
            <div className="space-y-3">
              {data.learningOutcomes.map((outcome, index) => (
                <div key={index} className="flex gap-2 group">
                  <input 
                    className="flex-1 p-4 bg-white border border-gray-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-indigo-100"
                    placeholder={`Outcome ${index + 1}...`}
                    value={outcome}
                    onChange={(e) => handleOutcomeChange(index, e.target.value)}
                  />
                  {data.learningOutcomes.length > 1 && (
                    <button onClick={() => updateData('learningOutcomes', data.learningOutcomes.filter((_, i) => i !== index))} className="p-2 text-gray-300 hover:text-rose-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button onClick={() => updateData('learningOutcomes', [...data.learningOutcomes, ''])} className="text-sm font-bold text-indigo-600 flex items-center gap-1 hover:text-indigo-800 transition-colors">
                <Plus className="w-3 h-3" /> Add Outcome
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
              <label className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Step 4</label>
              <h3 className="text-2xl font-bold text-gray-900">Task Breakdown</h3>
              <p className="text-sm text-gray-500">Identify the sub-set tasks a student performs to complete the assessment.</p>
              <p className="text-xs text-gray-400 italic">ex. Reflection Essay — 1. Brainstorm an idea based on questions, 2. Create an outline, 3. Write a draft, 4. Submit the draft, 5. Review feedback, 6. Rewrite.</p>
            </div>
            <div className="space-y-3">
              {data.tasks.map((task, index) => (
                <div key={index} className="flex gap-2 group">
                  <input 
                    className="flex-1 p-4 bg-white border border-gray-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-indigo-100"
                    placeholder={`Task ${index + 1}...`}
                    value={task}
                    onChange={(e) => handleTaskChange(index, e.target.value)}
                  />
                  {data.tasks.length > 1 && (
                    <button onClick={() => updateData('tasks', data.tasks.filter((_, i) => i !== index))} className="p-2 text-gray-300 hover:text-rose-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => updateData('tasks', [...data.tasks, ''])}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Task
              </button>
            </div>
          </div>
        );
      case 5:
        const stepFiveTasks = data.tasks.filter((task) => task.trim());
        const isK3GradeLevel = K3_GRADE_LEVELS.includes(data.gradeLevel);

        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <div className="space-y-2">
              <label className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Step 5: Strategic Choice</label>
              <h3 className="text-2xl font-bold text-gray-900">Categorize the Assessment</h3>
            </div>

            {isK3GradeLevel && (
              <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50 text-sm text-rose-800">
                <strong>Note:</strong> Based on DepEd guidance, assessments for {data.gradeLevel} ought to be AI-Free.
              </div>
            )}

            <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-5">
              <p className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-3">Tasks To Evaluate</p>
              <div className="space-y-2">
                {stepFiveTasks.length > 0 ? (
                  stepFiveTasks.map((task, index) => (
                    <div key={`${task}-${index}`} className="flex gap-2 text-sm font-medium text-gray-700 bg-white border border-indigo-100/70 rounded-xl px-3 py-2">
                      <span className="text-indigo-500 font-black">{index + 1}.</span>
                      <span className="break-words">{task}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No tasks yet. Add tasks in Step 4 to guide your category decision.</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  id: 'AI-Free', icon: <ShieldAlert className="w-6 h-6" />, title: 'AI-Free', guide: "Do students apply the intended outcomes in all these tasks?",
                  detail: "If yes, all tasks will need to be performed by students unaided by AI.",
                  color: 'border-rose-200 hover:border-rose-400 bg-rose-50/50', activeColor: 'border-rose-600 bg-rose-600 text-white'
                },
                {
                  id: 'AI-Assisted', icon: <Zap className="w-6 h-6" />, title: 'AI-Assisted', guide: "Do students apply the intended outcomes in some tasks but not all?",
                  detail: "Look for tasks that lead to the product but where students don't directly apply the learning outcomes — these \"adjacent tasks\" are where AI use can be permitted.",
                  color: 'border-amber-200 hover:border-amber-400 bg-amber-50/50', activeColor: 'border-amber-600 bg-amber-600 text-white'
                },
                {
                  id: 'AI-Integrated', icon: <BrainCircuit className="w-6 h-6" />, title: 'AI-Integrated', guide: "Is AI already integrated in the professional field or authentic situations where the learning outcomes are applied?",
                  detail: "In real, non-academic situations, is AI already part of how these tasks get done — has it changed the way professionals perform them?",
                  color: 'border-emerald-200 hover:border-emerald-400 bg-emerald-50/50', activeColor: 'border-emerald-600 bg-emerald-600 text-white'
                }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => updateData('assessmentType', p.id)}
                  className={`p-6 rounded-3xl border-2 text-left transition-all flex flex-col h-full ${data.assessmentType === p.id ? p.activeColor : p.color}`}
                >
                  <div className="mb-4">{p.icon}</div>
                  <h4 className="font-bold text-base mb-2">{p.title}</h4>
                  <p className="text-sm leading-relaxed font-medium opacity-90">{p.guide}</p>
                  <p className="text-xs leading-relaxed mt-2 opacity-75">{p.detail}</p>
                </button>
              ))}
            </div>
          </div>
        );
      case 6:
        if (data.assessmentType === 'AI-Free') {
          return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <label className="text-xs font-bold text-rose-600 uppercase tracking-widest">Step 6: AI-Free Confirmation</label>
                <h3 className="text-2xl font-bold text-gray-900">Integrity & Performance</h3>
                <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl">
                  <p className="text-sm text-rose-900 leading-relaxed font-medium">
                    Since this is an <strong>AI-Free assessment</strong>, students are prohibited from using AI in all tasks. 
                    Please select the primary strategy to ensure that they perform them personally.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { id: 'Proctoring', title: 'Supervised Work', desc: 'Students perform the assessment on-site with direct supervision.' },
                  { id: 'Validation (Oral/Viva)', title: 'Present/Defend the Work', desc: 'Students defend their work to verify authorship.' },
                  { id: 'Documentation', title: 'Document the Process', desc: 'Students submit documentary evidence of their work process.' }
                ].map(strategy => (
                  <button 
                    key={strategy.id}
                    onClick={() => updateData('humanCompetencyStrategy', strategy.id)}
                    className={`p-5 rounded-2xl border-2 text-left transition-all flex flex-col gap-1 ${data.humanCompetencyStrategy === strategy.id ? 'border-rose-600 bg-rose-50 shadow-md shadow-rose-100' : 'border-gray-100 bg-white hover:border-rose-200'}`}
                  >
                    <span className="text-sm font-bold text-rose-800">{strategy.title}</span>
                    <span className="text-sm text-rose-600/70">{strategy.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        }
        if (data.assessmentType === 'AI-Integrated') {
          return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
              <div className="space-y-2">
                <label className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Step 6: Integration Path</label>
                <h3 className="text-2xl font-bold text-gray-900">Select Integration Type</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <button
                  onClick={() => updateData('integratedSubtype', 'ObjectOfStudy')}
                  className={`p-6 rounded-3xl border-2 text-left transition-all flex flex-col gap-3 ${data.integratedSubtype === 'ObjectOfStudy' ? 'border-emerald-600 bg-emerald-50 shadow-md shadow-emerald-100' : 'border-gray-100 bg-white hover:border-emerald-200'}`}
                >
                  <Search className={`w-6 h-6 ${data.integratedSubtype === 'ObjectOfStudy' ? 'text-emerald-600' : 'text-gray-400'}`} />
                  <div>
                    <h4 className="font-bold text-gray-900">AI as Object of Study</h4>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">AI use is prevalent in the field; CLOs/Learning Outcomes require students to analyze and evaluate AI's role.</p>
                  </div>
                </button>
                <button
                  onClick={() => updateData('integratedSubtype', 'Collaborator')}
                  className={`p-6 rounded-3xl border-2 text-left transition-all flex flex-col gap-3 ${data.integratedSubtype === 'Collaborator' ? 'border-emerald-600 bg-emerald-50 shadow-md shadow-emerald-100' : 'border-gray-100 bg-white hover:border-emerald-200'}`}
                >
                  <Users className={`w-6 h-6 ${data.integratedSubtype === 'Collaborator' ? 'text-emerald-600' : 'text-gray-400'}`} />
                  <div>
                    <h4 className="font-bold text-gray-900">AI as Collaborator</h4>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">AI is woven into the professional workflow of performing job-critical tasks.</p>
                  </div>
                </button>
              </div>
              {data.integratedSubtype && (
                <div className="mt-6 space-y-2 animate-in slide-in-from-top-4">
                  <p className="text-sm font-bold text-gray-700">Specific focus of this integration:</p>
                  <textarea 
                    className="w-full h-32 p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-emerald-100 text-sm"
                    placeholder={data.integratedSubtype === 'ObjectOfStudy' ? "Evaluating AI's role in the field..." : "Co-creating outputs with AI..."}
                    value={data.integrationFocus}
                    onChange={(e) => updateData('integrationFocus', e.target.value)}
                  />
                </div>
              )}
            </div>
          );
        }
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
              <label className="text-xs font-bold text-amber-600 uppercase tracking-widest">Step 6: Task Alignment</label>
              <h3 className="text-2xl font-bold text-gray-900">Select Core Human Tasks</h3>
              <p className="text-sm text-gray-500">Select the tasks where students <strong>must</strong> apply the CLOs/Learning Outcomes without AI assistance.</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {data.tasks.map((task, index) => task.trim() && (
                <button
                  key={index}
                  onClick={() => toggleEssential(index)}
                  className={`p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${data.essentialTaskIndices.includes(index) ? 'border-amber-600 bg-amber-50 shadow-sm shadow-amber-100' : 'border-gray-100 bg-white hover:border-amber-200'}`}
                >
                  <span className="text-sm font-bold">{task}</span>
                  {data.essentialTaskIndices.includes(index) && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                </button>
              ))}
            </div>
          </div>
        );
      case 7:
        const isIntegrated = data.assessmentType === 'AI-Integrated';
        const isAssisted = data.assessmentType === 'AI-Assisted';
        const themeStep7 = getThemeColor();
        const integrationTypeLabel = data.integratedSubtype === 'ObjectOfStudy'
          ? 'AI as Object of Study'
          : data.integratedSubtype === 'Collaborator'
            ? 'AI as Collaborator'
            : 'Not selected yet';
        
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="space-y-2">
              <label className={`text-xs font-bold ${themeStep7.text} uppercase tracking-widest`}>Step 7: Safeguards & Usage</label>
              <h3 className="text-2xl font-bold text-gray-900">Integrity & AI Guidelines</h3>
            </div>
            
            <div className="space-y-6">
              {isIntegrated && (
                <div className="space-y-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-emerald-700">Integration Type</p>
                    <p className="text-sm font-bold text-emerald-900">{integrationTypeLabel}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-emerald-700">Specific Focus of This Integration</p>
                    <p className="text-sm text-emerald-900 whitespace-pre-wrap break-words">
                      {data.integrationFocus?.trim() || 'No specific focus entered yet.'}
                    </p>
                  </div>
                </div>
              )}

              {isIntegrated && (
                <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-100 space-y-4">
                  <p className="text-xs font-black uppercase tracking-widest text-emerald-700">Redesigned Assessment Tasks</p>
                  <div className="space-y-3">
                    {data.redesignedTasks.map((item, index) => (
                      <div key={index} className="rounded-xl border border-emerald-100 bg-white p-3 space-y-3">
                        <div className="flex gap-2 items-start">
                          <input
                            className="flex-1 p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-100 text-sm"
                            placeholder={`Redesigned task ${index + 1}...`}
                            value={item.task}
                            onChange={(e) => handleRedesignedTaskChange(index, e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => removeRedesignedTask(index)}
                            disabled={data.redesignedTasks.length <= 1}
                            className={`p-2 rounded-lg transition-colors ${data.redesignedTasks.length <= 1 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-300 hover:text-rose-500'}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setRedesignedTaskUsage(index, 'Human Only')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border inline-flex items-center gap-1 transition-colors ${item.usage === 'Human Only' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-white text-gray-500 border-gray-200 hover:border-amber-200'}`}
                          >
                            <Lock className="w-3 h-3" /> Human Only
                          </button>
                          <button
                            type="button"
                            onClick={() => setRedesignedTaskUsage(index, 'AI Expected')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border inline-flex items-center gap-1 transition-colors ${item.usage === 'AI Expected' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-white text-gray-500 border-gray-200 hover:border-emerald-200'}`}
                          >
                            <Zap className="w-3 h-3" /> AI Expected
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addRedesignedTask}
                      className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
                    >
                      <Plus className="w-3 h-3" /> Add redesigned task
                    </button>
                  </div>
                </div>
              )}

              {/* Task Summary Reference */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Original Tasks</p>
                <div className="grid gap-2">
                    {data.tasks.filter(t => t.trim()).map((t, i) => {
                    const assessmentType = (data.assessmentType || '').trim().toLowerCase();
                    const isAiFree = assessmentType === 'ai-free';
                    const isCore = isAiFree || (isAssisted ? data.essentialTaskIndices.includes(i) : false);
                        const isIntegratedMode = data.assessmentType === 'AI-Integrated';
                        return (
                            <div key={i} className="flex items-center gap-2 text-sm font-bold py-1 border-b border-gray-100 last:border-0">
                                {isIntegratedMode ? (
                              <div className="flex items-center gap-2 text-amber-600">
                                <Lock className="w-3 h-3" />
                                <span>[Human Only]</span>
                                    </div>
                                ) : isCore ? (
                                    <div className="flex items-center gap-2 text-amber-600">
                                        <Lock className="w-3 h-3" />
                                    <span>[Human Only]</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-emerald-500">
                                        <Unlock className="w-3 h-3" />
                                        <span>[AI Permitted]</span>
                                    </div>
                                )}
                                <span className="text-gray-700 truncate">{t}</span>
                            </div>
                        )
                    })}
                </div>
              </div>

              {isIntegrated && (
                <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <p className="text-sm font-bold text-emerald-800 mb-2">How will you ensure critical engagement with AI? Any additional requirements?</p>
                  <textarea 
                    className="w-full h-24 p-3 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-100"
                    placeholder="e.g., Prompt logs, version history, or a breakdown of AI contributions..."
                    value={data.submissionRequirements}
                    onChange={(e) => updateData('submissionRequirements', e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-4">
                <p className="text-sm font-bold text-gray-700">Select verification strategy:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { id: 'Proctoring', title: 'Supervised Work' },
                    { id: 'Validation (Oral/Viva)', title: 'Present/Defend the Work' },
                    { id: 'Documentation', title: 'Document the Process' }
                  ].map(strategy => (
                    <button 
                      key={strategy.id}
                      onClick={() => updateData('humanCompetencyStrategy', strategy.id)}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${data.humanCompetencyStrategy === strategy.id ? `border-${themeStep7.accent}-600 bg-${themeStep7.accent}-50 text-${themeStep7.accent}-700 shadow-sm` : 'border-gray-100 bg-white hover:border-gray-200 text-gray-500'}`}
                    >
                      <span className="text-sm font-bold">{strategy.title}</span>
                    </button>
                  ))}
                </div>

                <p className="text-sm font-bold text-gray-700 mt-2">Integrity Implementation Details:</p>
                <textarea 
                  className={`w-full h-24 p-3 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-${themeStep7.accent}-100`}
                  placeholder="Describe exactly how this verification will be managed (e.g., 'A 5-minute viva will be conducted for each group to discuss their prompt strategy')..."
                  value={data.integrityProvisions}
                  onChange={(e) => updateData('integrityProvisions', e.target.value)}
                />
              </div>

            </div>
          </div>
        );
      case 8:
        if (data.assessmentType === 'AI-Free') {
          return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
              <div className="space-y-2">
                <label className="text-xs font-bold text-rose-600 uppercase tracking-widest">Step 8: Pre-AI Skills</label>
                <h3 className="text-2xl font-bold text-gray-900">Are there Pre-AI skills that might be developed in this assessment?</h3>
                <p className="text-sm text-gray-500">Pre-AI skills are foundational human competencies (e.g., critical thinking, reasoning) that can transfer into AI literacy skills.</p>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => updateData('preAiSkillsDeveloped', 'yes')}
                  className={`flex-1 p-5 rounded-2xl border-2 text-center font-bold transition-all ${data.preAiSkillsDeveloped === 'yes' ? 'border-rose-600 bg-rose-50 text-rose-700 shadow-md shadow-rose-100' : 'border-gray-100 bg-white text-gray-500 hover:border-rose-200'}`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => updateData('preAiSkillsDeveloped', 'no')}
                  className={`flex-1 p-5 rounded-2xl border-2 text-center font-bold transition-all ${data.preAiSkillsDeveloped === 'no' ? 'border-rose-600 bg-rose-50 text-rose-700 shadow-md shadow-rose-100' : 'border-gray-100 bg-white text-gray-500 hover:border-rose-200'}`}
                >
                  No
                </button>
              </div>

              {data.preAiSkillsDeveloped === 'yes' && (
                <div className="space-y-6 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-gray-700">Explain what pre-AI skills are developed and how</p>
                    <textarea
                      className="w-full h-28 p-3 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-100"
                      placeholder="ex. In this assessment, learners are asked to give several ways to answer the same problem — this builds critical thinking that can lead to the AI literacy skill of AI output evaluation."
                      value={data.preAiSkillsExplanation}
                      onChange={(e) => updateData('preAiSkillsExplanation', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2 pt-2">
                    <p className="text-sm font-bold text-gray-700">Which AI literacy skills do these help develop?</p>
                    <p className="text-sm text-gray-500">Check all that apply.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {AI_LITERACY_SKILLS.map((skill) => {
                      const isSelected = data.preAiLiteracySkills.includes(skill.id);
                      return (
                        <label
                          key={skill.id}
                          className={`flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition-all ${isSelected ? 'border-rose-400 bg-rose-50' : 'border-gray-200 bg-white hover:border-rose-200'}`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => togglePreAiLiteracySkill(skill.id)}
                            className="mt-1 h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-400"
                          />
                          <span className="space-y-1">
                            <span className="block text-sm font-bold text-gray-900">{skill.title}</span>
                            <span className="block text-sm text-gray-600 leading-relaxed">{skill.description}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        }

        const requiresAiLiteracy = ['AI-Assisted', 'AI-Integrated'].includes(data.assessmentType);

        if (!requiresAiLiteracy) {
          return null;
        }

        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <div className="space-y-2">
              <label className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Step 8: AI Literacy Skills</label>
              <h3 className="text-2xl font-bold text-gray-900">Check Relevant DEC AI Literacy Skills</h3>
              <p className="text-sm text-gray-500">Check all AI literacy skills assessed in this AI-Assisted or AI-Integrated assessment.</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {AI_LITERACY_SKILLS.map((skill) => {
                const isSelected = data.aiLiteracySkills.includes(skill.id);
                return (
                  <label
                    key={skill.id}
                    className={`flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition-all ${isSelected ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 bg-white hover:border-indigo-200'}`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleAiLiteracySkill(skill.id)}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-400"
                    />
                    <span className="space-y-1">
                      <span className="block text-sm font-bold text-gray-900">{skill.title}</span>
                      <span className="block text-sm text-gray-600 leading-relaxed">{skill.description}</span>
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="space-y-2 pt-4 border-t border-gray-100">
              <p className="text-sm font-bold text-gray-700">Strategy for Critical Engagement</p>
              <p className="text-sm text-gray-500">Describe how AI literacy skills will be practiced here.</p>
              <textarea
                className="w-full h-24 p-3 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100"
                placeholder="How will students demonstrate critical engagement while practicing the selected AI literacy skills?"
                value={data.criticalEngagement}
                onChange={(e) => updateData('criticalEngagement', e.target.value)}
              />
            </div>
          </div>
        );
      case 9:
        const theme = getThemeColor();
        const outcomesList = data.learningOutcomes.filter(o => o.trim()).join("; ");
        const essentialTasks = data.essentialTaskIndices.map(i => data.tasks[i]);
        const auxiliaryTasks = data.tasks.filter((_, i) => !data.essentialTaskIndices.includes(i) && _.trim());
        const redesignedTasksForBlueprint = (data.redesignedTasks || []).filter((item) => item.task.trim());
        const selectedAiLiteracySkills = AI_LITERACY_SKILLS.filter((skill) => data.aiLiteracySkills.includes(skill.id));
        const selectedPreAiLiteracySkills = AI_LITERACY_SKILLS.filter((skill) => data.preAiLiteracySkills.includes(skill.id));
        
        const getPolicyText = () => {
          if (data.assessmentType === 'AI-Free') {
            return `This is an AI-FREE ASSESSMENT. The use of AI is prohibited. It is critical that you are able to do this unaided by AI, since this provides evidence of the following Course Learning Outcomes: ${outcomesList || '[CLOs]'}.\n\nTo ensure your personal performance: ${endWithPeriod(data.integrityProvisions || '[Implementation details]')}`;
          }
          if (data.assessmentType === 'AI-Assisted') {
            const tasksString = formatListWithAnd(auxiliaryTasks);
            const coreTasksNames = formatListWithAnd(essentialTasks);
            return `This is an AI-ASSISTED ASSESSMENT. You are allowed to use AI for the following tasks: ${tasksString || '[tasks]'}. However, the use of AI is strictly prohibited for the following core tasks: ${coreTasksNames || '[tasks]'}.\n\nYour independent performance of these core tasks will be verified as follows: ${endWithPeriod(data.integrityProvisions || '[Implementation details]')}${data.criticalEngagement ? `\n\nYou are also expected to demonstrate critical engagement with AI outputs: ${data.criticalEngagement}` : ''}`;
          }
          return `This is an AI-INTEGRATED ASSESSMENT. AI use is expected. To demonstrate Course Learning Outcomes, you must provide the following accountability evidence: ${endWithPeriod(data.submissionRequirements || '[Accountability evidence]')}\n\nTo ensure critical engagement with AI: ${endWithPeriod(data.integrityProvisions || '[Implementation details]')}${data.criticalEngagement ? `\n\nRequirement for critical engagement: ${data.criticalEngagement}` : ''}`;
        };

        return (
          <div className="space-y-8 animate-in zoom-in-95 duration-500 pb-20">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Final Blueprint</h3>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={prevStep} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 whitespace-nowrap">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={() => setStep(1)} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-200 whitespace-nowrap">
                  <RotateCcw className="w-4 h-4" /> Restart
                </button>
                <button onClick={downloadImage} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-indigo-700 transition-colors whitespace-nowrap">
                  <Download className="w-4 h-4" /> Save Image
                </button>
                <button onClick={downloadPdf} className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-black transition-colors whitespace-nowrap">
                  <Download className="w-4 h-4" /> Save PDF
                </button>
              </div>
            </div>

            <div ref={blueprintRef} className={`bg-white border-2 ${theme.border} rounded-[2rem] overflow-hidden shadow-2xl`}>
              <div className={`${theme.banner} p-6 text-white m-0`}>
                <div className="flex justify-between items-start">
                  <div className="max-w-[70%]">
                    <p className="text-xs font-black uppercase tracking-widest opacity-80">Design Artifact</p>
                    <h4 className="text-xl font-bold leading-tight mt-1">AI-Responsive Blueprint</h4>
                    <p className="text-sm font-bold opacity-90 mt-1">{data.courseName || 'Course/Subject Area'}: {data.subject || 'Assessment'}</p>
                  </div>
                  <div className="bg-white/20 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-white/30 text-center">
                    {data.assessmentType}
                  </div>
                </div>
              </div>
              
              <div className="p-8 space-y-6 bg-white">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className={`p-5 rounded-2xl border-2 ${theme.border} bg-white`}>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Target Outcomes</p>
                    <ul className="space-y-2">
                      {data.learningOutcomes.filter(o => o.trim()).map((o, i) => (
                        <li key={i} className="text-sm font-semibold text-gray-700 leading-relaxed flex gap-2">
                            <CheckCircle2 className={`w-3 h-3 mt-0.5 flex-shrink-0 ${theme.text}`} />
                            {o}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={`p-5 rounded-2xl border-2 ${theme.border} bg-white`}>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Task Breakdown</p>
                    <ul className="space-y-2">
                      {data.assessmentType === 'AI-Integrated'
                        ? redesignedTasksForBlueprint.map((item, i) => (
                            <li key={i} className="flex items-start justify-between text-sm font-semibold text-gray-700 bg-gray-50/50 p-2 rounded-lg border border-gray-100 gap-2">
                              <span className="flex-1 min-w-0 whitespace-normal break-words leading-relaxed">{item.task}</span>
                              <div className="flex-shrink-0 pt-0.5">
                                <span className={`px-2 py-0.5 text-xs font-black uppercase rounded ${item.usage === 'Human Only' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}>
                                  {item.usage}
                                </span>
                              </div>
                            </li>
                          ))
                        : data.tasks.filter(t => t.trim()).map((t, i) => {
                            const assessmentType = (data.assessmentType || '').trim().toLowerCase();
                            const isEssential = assessmentType === 'ai-free' || data.essentialTaskIndices.includes(i);
                            return (
                              <li key={i} className="flex items-start justify-between text-sm font-semibold text-gray-700 bg-gray-50/50 p-2 rounded-lg border border-gray-100 gap-2">
                                <span className="flex-1 min-w-0 whitespace-normal break-words leading-relaxed">{t}</span>
                                <div className="flex-shrink-0 pt-0.5">
                                    {data.assessmentType === 'AI-Assisted' && (
                                    <span className={`px-2 py-0.5 text-xs font-black uppercase rounded ${isEssential ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}>
                                        {isEssential ? 'Human' : 'AI-Permitted'}
                                    </span>
                                    )}
                                    {data.assessmentType === 'AI-Free' && (
                                    <span className="px-2 py-0.5 text-xs font-black uppercase rounded bg-rose-100 text-rose-700 border border-rose-200">
                                      Human Only
                                    </span>
                                    )}
                                </div>
                              </li>
                            );
                          })}
                    </ul>
                  </div>
                </div>

                <div className={`p-6 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200`}>
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <p className="text-xs font-black uppercase tracking-widest text-indigo-600">Syllabus Statement Preview (Student-Facing)</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-200 text-sm text-gray-700 leading-relaxed font-medium whitespace-pre-wrap">
                    {getPolicyText()}
                  </div>
                </div>

                {['AI-Assisted', 'AI-Integrated'].includes(data.assessmentType) && (
                  <div className={`p-5 rounded-2xl border-2 ${theme.border} bg-white`}>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">DEC AI Literacy Skills Assessed</p>
                    {selectedAiLiteracySkills.length > 0 ? (
                      <ul className="space-y-2">
                        {selectedAiLiteracySkills.map((skill) => (
                          <li key={skill.id} className="text-sm text-gray-700 leading-relaxed flex gap-2">
                            <CheckCircle2 className={`w-3 h-3 mt-1 flex-shrink-0 ${theme.text}`} />
                            <span>
                              <span className="font-semibold">{skill.title}:</span> {skill.description}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No AI literacy skills selected.</p>
                    )}
                  </div>
                )}

                {data.assessmentType === 'AI-Free' && (
                  <div className={`p-5 rounded-2xl border-2 ${theme.border} bg-white`}>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Pre-AI Skills Developed</p>
                    {data.preAiSkillsDeveloped === 'yes' ? (
                      <div className="space-y-4">
                        {selectedPreAiLiteracySkills.length > 0 ? (
                          <ul className="space-y-2">
                            {selectedPreAiLiteracySkills.map((skill) => (
                              <li key={skill.id} className="text-sm text-gray-700 leading-relaxed flex gap-2">
                                <CheckCircle2 className={`w-3 h-3 mt-1 flex-shrink-0 ${theme.text}`} />
                                <span>
                                  <span className="font-semibold">{skill.title}:</span> {skill.description}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500 italic">No AI literacy skills selected.</p>
                        )}
                        {data.preAiSkillsExplanation?.trim() && (
                          <div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Explanation</p>
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{data.preAiSkillsExplanation}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No pre-AI skills identified for this assessment.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderSidebarContent = () => {
    const filledOriginalTasks = data.tasks.filter((task) => task.trim());

    return (
    <div className="p-6 flex-1 overflow-y-auto space-y-8 min-w-0 lg:min-w-[320px]">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
        <LayoutDashboard className="w-4 h-4 text-indigo-600" />
        <span className="text-xs font-black uppercase tracking-widest text-gray-400">Blueprint Snapshot</span>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Course/Subject Area</label>
            <p className="text-sm font-bold text-gray-800 truncate">{data.courseName || '...'}</p>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Assessment</label>
            <p className="text-sm font-bold text-gray-800 truncate">{data.subject || '...'}</p>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <Target className="w-3 h-3 text-indigo-600" />
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">CLOs/Learning Outcomes</label>
          </div>
          <div className="space-y-1">
            {data.learningOutcomes.filter(o => o.trim()).length > 0 ? (
              data.learningOutcomes.filter(o => o.trim()).map((o, i) => (
                <p key={i} className="text-sm font-medium text-gray-600 leading-tight border-l-2 border-indigo-100 pl-2 py-0.5">{o}</p>
              ))
            ) : (
              <p className="text-sm italic text-gray-300">None added yet</p>
            )}
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <ListTodo className="w-3 h-3 text-indigo-600" />
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tasks</label>
          </div>
          <div className="space-y-1">
            {filledOriginalTasks.length > 0 ? (
              filledOriginalTasks.map((task, i) => (
                <p key={i} className="text-sm font-medium text-gray-600 leading-tight border-l-2 border-indigo-100 pl-2 py-0.5 break-words">
                  {task}
                </p>
              ))
            ) : (
              <p className="text-sm italic text-gray-300">No tasks added yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  };

  const totalSteps = 9;
  const progressStep = step;
  const isFinalInputStep = step === 8;
  const isNextDisabled =
    (step === 5 && !data.assessmentType) ||
    (step === 6 && !data.humanCompetencyStrategy && data.assessmentType === 'AI-Free') ||
    (step === 6 && data.assessmentType === 'AI-Integrated' && !data.integratedSubtype) ||
    (step === 8 && ['AI-Assisted', 'AI-Integrated'].includes(data.assessmentType) && data.aiLiteracySkills.length === 0) ||
    (step === 8 && data.assessmentType === 'AI-Free' && !data.preAiSkillsDeveloped) ||
    (step === 8 && data.assessmentType === 'AI-Free' && data.preAiSkillsDeveloped === 'yes' && data.preAiLiteracySkills.length === 0);

  return (
    <div className="h-dvh bg-[#FBFBFD] text-[#1D1D1F] font-sans flex flex-col">
      <nav className="h-16 border-b border-gray-200 bg-white sticky top-0 z-50 px-3 sm:px-6 flex items-center justify-between w-full shadow-sm gap-3">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 transition-colors flex-shrink-0">
            {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 flex-shrink-0">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xs sm:text-base tracking-tight uppercase text-indigo-950 truncate">AI-Responsive Studio<span className="hidden sm:inline"> - BASIC ED Edition</span></span>
          </div>
        </div>
        <div className="h-1.5 w-12 sm:w-48 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
          <div className="h-full bg-indigo-600 transition-all duration-500 ease-out" style={{ width: `${(progressStep / totalSteps) * 100}%` }} />
        </div>
      </nav>

      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed top-16 inset-x-0 bottom-0 z-30 bg-black/25"
        />
      )}

      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        <aside className={`lg:hidden fixed top-16 bottom-0 left-0 z-40 w-80 max-w-[85vw] bg-white border-r border-gray-100 transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {renderSidebarContent()}
        </aside>

        <aside className={`hidden lg:flex bg-white border-r border-gray-100 transition-all duration-300 ease-in-out flex-col overflow-hidden ${isSidebarOpen ? 'w-80' : 'w-0'}`}>
          {renderSidebarContent()}
        </aside>

        <main ref={mainRef} className="flex-1 overflow-y-auto bg-gray-50/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <div className="min-h-[450px]">{renderStepContent()}</div>
            {step < 9 && (
              <div className="mt-12 flex items-center justify-between pt-8 border-t border-gray-100">
                <button onClick={prevStep} disabled={step === 1} className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-400 hover:text-gray-900'}`}>
                  Back
                </button>
                <button 
                  onClick={nextStep} 
                  disabled={isNextDisabled}
                  className={`flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all ${isNextDisabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                >
                  {isFinalInputStep ? 'Finalize Blueprint' : 'Next Step'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;