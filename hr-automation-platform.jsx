import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Clock, AlertCircle, Zap, Target, Calendar, FileText, TrendingUp, Play, Pause, Settings, MoreVertical } from 'lucide-react';

const HRAutomationPlatform = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [workflows, setWorkflows] = useState([
    {
      id: 'job-aggregation',
      name: 'Multi-Platform Job Aggregation',
      status: 'running',
      progress: 65,
      description: 'Aggregate job postings from LinkedIn, Indeed, Glassdoor',
      jobsCollected: 342,
      sources: ['LinkedIn', 'Indeed', 'Glassdoor', 'ZipRecruiter'],
    },
    {
      id: 'resume-screening',
      name: 'Intelligent Resume Screening',
      status: 'completed',
      progress: 100,
      description: 'Screen resumes and extract candidate qualifications',
      candidatesProcessed: 128,
      matchScore: 87,
    },
    {
      id: 'interview-scheduling',
      name: 'Interview Scheduling Automation',
      status: 'idle',
      progress: 0,
      description: 'Schedule interviews across calendars and send confirmations',
      scheduledInterviews: 0,
    },
  ]);

  const [selectedWorkflow, setSelectedWorkflow] = useState('job-aggregation');
  const [logs, setLogs] = useState([]);
  const logsEndRef = useRef(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString(),
    }]);
  };

  const startWorkflow = (workflowId) => {
    setWorkflows(prev => prev.map(w => 
      w.id === workflowId ? { ...w, status: 'running', progress: 0 } : w
    ));
    addLog(`🚀 Starting workflow: ${workflows.find(w => w.id === workflowId)?.name}`, 'start');
    
    // Simulate workflow execution
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setWorkflows(prev => prev.map(w => 
          w.id === workflowId ? { ...w, status: 'completed', progress: 100 } : w
        ));
        addLog(`✅ Workflow completed successfully`, 'success');
      } else {
        setWorkflows(prev => prev.map(w => 
          w.id === workflowId ? { ...w, progress } : w
        ));
      }
    }, 1500);
  };

  const pauseWorkflow = (workflowId) => {
    setWorkflows(prev => prev.map(w => 
      w.id === workflowId ? { ...w, status: 'paused' } : w
    ));
    addLog(`⏸️  Workflow paused`, 'warning');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Animated background grid */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#334155_1px,transparent_1px),linear-gradient(#334155_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500">
                    TinyFish HR Automation
                  </h1>
                  <p className="text-slate-400 text-sm mt-1">Multi-step web workflow automation for recruitment</p>
                </div>
              </div>
              <button className="p-3 hover:bg-slate-800 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Navigation */}
            <div className="flex gap-2 border-b border-slate-700/50 pb-4">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
                { id: 'workflows', label: 'Workflows', icon: Zap },
                { id: 'logs', label: 'Execution Logs', icon: FileText },
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-blue-500/20 text-blue-300 border-b-2 border-blue-400'
                        : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Jobs Aggregated', value: '342', icon: Target, color: 'from-blue-500 to-cyan-400' },
                  { label: 'Candidates Screened', value: '128', icon: FileText, color: 'from-purple-500 to-pink-400' },
                  { label: 'Interviews Scheduled', value: '34', icon: Calendar, color: 'from-green-500 to-emerald-400' },
                  { label: 'Time Saved (hrs)', value: '156', icon: Clock, color: 'from-orange-500 to-red-400' },
                ].map((metric, idx) => {
                  const Icon = metric.icon;
                  return (
                    <div key={idx} className="group relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm p-6 hover:border-slate-600 transition-all hover:shadow-xl hover:shadow-blue-500/10">
                      <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                      <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-slate-400 text-sm font-medium">{metric.label}</span>
                          <Icon className={`w-5 h-5 text-transparent bg-clip-text bg-gradient-to-r ${metric.color}`} />
                        </div>
                        <p className="text-3xl font-bold text-slate-100">{metric.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Active Workflow Spotlight */}
              <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm p-8">
                <h2 className="text-xl font-bold text-slate-100 mb-6">Active Workflows</h2>
                <div className="space-y-6">
                  {workflows.map(workflow => (
                    <div key={workflow.id} className="group relative overflow-hidden rounded-lg border border-slate-700/30 bg-slate-900/40 p-6 hover:border-slate-600 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-slate-100 text-lg">{workflow.name}</h3>
                          <p className="text-slate-400 text-sm mt-1">{workflow.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {workflow.status === 'running' && (
                            <button
                              onClick={() => pauseWorkflow(workflow.id)}
                              className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
                            >
                              <Pause className="w-5 h-5 text-orange-400" />
                            </button>
                          )}
                          {workflow.status === 'idle' && (
                            <button
                              onClick={() => startWorkflow(workflow.id)}
                              className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
                            >
                              <Play className="w-5 h-5 text-green-400" />
                            </button>
                          )}
                          <button className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors">
                            <MoreVertical className="w-5 h-5 text-slate-500" />
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-slate-400 font-medium">Progress</span>
                          <span className="text-xs text-slate-300 font-bold">{Math.round(workflow.progress)}%</span>
                        </div>
                        <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                            style={{ width: `${workflow.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Workflow Stats */}
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        {workflow.jobsCollected !== undefined && (
                          <div className="bg-slate-800/50 rounded-lg p-3">
                            <p className="text-slate-400 text-xs">Jobs Collected</p>
                            <p className="text-slate-100 font-bold text-lg">{workflow.jobsCollected}</p>
                          </div>
                        )}
                        {workflow.candidatesProcessed !== undefined && (
                          <div className="bg-slate-800/50 rounded-lg p-3">
                            <p className="text-slate-400 text-xs">Candidates Processed</p>
                            <p className="text-slate-100 font-bold text-lg">{workflow.candidatesProcessed}</p>
                          </div>
                        )}
                        {workflow.matchScore !== undefined && (
                          <div className="bg-slate-800/50 rounded-lg p-3">
                            <p className="text-slate-400 text-xs">Match Score</p>
                            <p className="text-slate-100 font-bold text-lg">{workflow.matchScore}%</p>
                          </div>
                        )}
                        {workflow.sources && (
                          <div className="bg-slate-800/50 rounded-lg p-3 col-span-3">
                            <p className="text-slate-400 text-xs mb-2">Sources</p>
                            <div className="flex flex-wrap gap-2">
                              {workflow.sources.map((source, idx) => (
                                <span key={idx} className="inline-block px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs font-medium">
                                  {source}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-4 right-4">
                        {workflow.status === 'running' && (
                          <div className="flex items-center gap-2 text-orange-400 text-xs font-bold">
                            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                            Running
                          </div>
                        )}
                        {workflow.status === 'completed' && (
                          <div className="flex items-center gap-2 text-green-400 text-xs font-bold">
                            <CheckCircle2 className="w-4 h-4" />
                            Complete
                          </div>
                        )}
                        {workflow.status === 'paused' && (
                          <div className="flex items-center gap-2 text-yellow-400 text-xs font-bold">
                            <Clock className="w-4 h-4" />
                            Paused
                          </div>
                        )}
                        {workflow.status === 'idle' && (
                          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                            <AlertCircle className="w-4 h-4" />
                            Idle
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Workflows Tab */}
          {activeTab === 'workflows' && (
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm p-8">
              <h2 className="text-2xl font-bold text-slate-100 mb-8">Workflow Architecture</h2>
              <div className="space-y-8">
                {[
                  {
                    title: '1. Job Aggregation Workflow',
                    steps: [
                      'Navigate to LinkedIn Jobs with agentic search',
                      'Handle authentication (session management)',
                      'Scroll and paginate through results',
                      'Extract job titles, companies, requirements',
                      'Fill filters form (salary, location, seniority)',
                      'Repeat for Indeed, Glassdoor, ZipRecruiter',
                      'Aggregate and deduplicate results',
                      'Store in centralized database',
                    ],
                    complexity: 'High',
                    timeSaved: '8 hours/week',
                  },
                  {
                    title: '2. Resume Screening Workflow',
                    steps: [
                      'Access applicant tracking system (ATS)',
                      'Login with credentials',
                      'Navigate to applications inbox',
                      'Download resume PDFs',
                      'Extract text and structure',
                      'Compare against job requirements',
                      'Score candidates (skills match, experience)',
                      'Generate screening report',
                      'Flag top candidates for manual review',
                    ],
                    complexity: 'Very High',
                    timeSaved: '12 hours/week',
                  },
                  {
                    title: '3. Interview Scheduling Workflow',
                    steps: [
                      'Extract candidate availability from forms',
                      'Access hiring manager calendar (OAuth)',
                      'Check real-time availability',
                      'Navigate email to compose interview invites',
                      'Fill form with candidate details',
                      'Submit and confirm booking',
                      'Extract confirmation details',
                      'Update ATS with interview date',
                      'Send automated reminders',
                    ],
                    complexity: 'Very High',
                    timeSaved: '6 hours/week',
                  },
                ].map((workflow, idx) => (
                  <div key={idx} className="border border-slate-700/30 rounded-lg bg-slate-900/30 p-6">
                    <h3 className="text-lg font-bold text-slate-100 mb-2">{workflow.title}</h3>
                    <div className="flex gap-4 mb-4">
                      <span className="inline-block px-3 py-1 bg-red-500/20 text-red-300 rounded text-xs font-semibold">
                        Complexity: {workflow.complexity}
                      </span>
                      <span className="inline-block px-3 py-1 bg-green-500/20 text-green-300 rounded text-xs font-semibold">
                        {workflow.timeSaved} saved
                      </span>
                    </div>
                    <div className="space-y-2">
                      {workflow.steps.map((step, stepIdx) => (
                        <div key={stepIdx} className="flex items-start gap-3 text-slate-300 text-sm">
                          <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-blue-300">{stepIdx + 1}</span>
                          </div>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Logs Tab */}
          {activeTab === 'logs' && (
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-100">Execution Logs</h2>
                <button
                  onClick={() => addLog('📋 Logs cleared', 'info')}
                  className="px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
                >
                  Clear Logs
                </button>
              </div>
              
              <div className="bg-slate-900/50 rounded-lg border border-slate-700/30 font-mono text-xs overflow-hidden flex flex-col" style={{ height: '500px' }}>
                <div className="overflow-y-auto flex-1 p-4 space-y-2">
                  {logs.length === 0 ? (
                    <div className="text-slate-500 text-center py-12">
                      <p>No logs yet. Start a workflow to see execution details.</p>
                    </div>
                  ) : (
                    logs.map(log => (
                      <div key={log.id} className="flex gap-3">
                        <span className="text-slate-600 min-w-fit">[{log.timestamp}]</span>
                        <span className={`${
                          log.type === 'start' ? 'text-blue-400' :
                          log.type === 'success' ? 'text-green-400' :
                          log.type === 'warning' ? 'text-yellow-400' :
                          'text-slate-400'
                        }`}>
                          {log.message}
                        </span>
                      </div>
                    ))
                  )}
                  <div ref={logsEndRef}></div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-16 border-t border-slate-700/50 bg-slate-900/50 py-6">
          <div className="max-w-7xl mx-auto px-6 text-center text-slate-500 text-sm">
            <p>TinyFish Web Agent API • Real-world multi-step workflow automation for HR/Recruitment</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HRAutomationPlatform;
