/**
 * TinyFish HR Automation Platform - Backend Server
 * Simulates real workflow execution with realistic delays and data
 */

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ============================================================================
// SIMULATED DATA & STATE
// ============================================================================

class WorkflowManager {
  constructor() {
    this.workflows = new Map();
    this.logs = [];
    this.clients = new Set();
    this.initializeWorkflows();
  }

  initializeWorkflows() {
    this.workflows.set('job-aggregation', {
      id: 'job-aggregation',
      name: 'Multi-Platform Job Aggregation',
      status: 'idle',
      progress: 0,
      description: 'Aggregate job postings from LinkedIn, Indeed, Glassdoor',
      jobsCollected: 0,
      sources: ['LinkedIn', 'Indeed', 'Glassdoor', 'ZipRecruiter'],
      jobs: [],
    });

    this.workflows.set('resume-screening', {
      id: 'resume-screening',
      name: 'Intelligent Resume Screening',
      status: 'idle',
      progress: 0,
      description: 'Screen resumes and extract candidate qualifications',
      candidatesProcessed: 0,
      matchScore: 0,
      candidates: [],
    });

    this.workflows.set('interview-scheduling', {
      id: 'interview-scheduling',
      name: 'Interview Scheduling Automation',
      status: 'idle',
      progress: 0,
      description: 'Schedule interviews across calendars and send confirmations',
      scheduledInterviews: 0,
      interviews: [],
    });
  }

  addLog(message, type = 'info') {
    const log = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString(),
    };
    this.logs.push(log);
    
    // Broadcast to all connected WebSocket clients
    this.broadcastLog(log);
    
    return log;
  }

  broadcastLog(log) {
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'log',
          data: log,
        }));
      }
    });
  }

  broadcastWorkflowUpdate(workflowId) {
    const workflow = this.workflows.get(workflowId);
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'workflow-update',
          data: workflow,
        }));
      }
    });
  }

  async startWorkflow(workflowId) {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) return null;

    workflow.status = 'running';
    workflow.progress = 0;
    this.broadcastWorkflowUpdate(workflowId);

    if (workflowId === 'job-aggregation') {
      await this.runJobAggregation(workflow);
    } else if (workflowId === 'resume-screening') {
      await this.runResumeScreening(workflow);
    } else if (workflowId === 'interview-scheduling') {
      await this.runInterviewScheduling(workflow);
    }

    workflow.status = 'completed';
    this.broadcastWorkflowUpdate(workflowId);
    
    return workflow;
  }

  async runJobAggregation(workflow) {
    this.addLog('🚀 Starting Job Aggregation Workflow', 'start');
    
    const platforms = [
      { name: 'LinkedIn', jobs: 145 },
      { name: 'Indeed', jobs: 98 },
      { name: 'Glassdoor', jobs: 76 },
      { name: 'ZipRecruiter', jobs: 23 },
    ];

    const sampleJobs = [
      { title: 'Senior Software Engineer', company: 'Google', location: 'San Francisco, CA', salary: '$180K-$220K', source: 'LinkedIn' },
      { title: 'Full Stack Engineer', company: 'Meta', location: 'Menlo Park, CA', salary: '$165K-$210K', source: 'LinkedIn' },
      { title: 'Backend Engineer', company: 'Netflix', location: 'Los Gatos, CA', salary: '$175K-$225K', source: 'Indeed' },
      { title: 'React Developer', company: 'Stripe', location: 'San Francisco, CA', salary: '$160K-$200K', source: 'Indeed' },
      { title: 'DevOps Engineer', company: 'Uber', location: 'San Francisco, CA', salary: '$170K-$215K', source: 'Glassdoor' },
      { title: 'Data Engineer', company: 'Airbnb', location: 'San Francisco, CA', salary: '$155K-$195K', source: 'Glassdoor' },
      { title: 'ML Engineer', company: 'OpenAI', location: 'San Francisco, CA', salary: '$200K-$280K', source: 'ZipRecruiter' },
      { title: 'Cloud Architect', company: 'AWS', location: 'Seattle, WA', salary: '$185K-$240K', source: 'LinkedIn' },
    ];

    let totalJobs = 0;

    for (const platform of platforms) {
      this.addLog(`🔗 Connecting to ${platform.name}...`, 'info');
      await this.sleep(500);

      this.addLog(`🔐 Handling authentication...`, 'info');
      await this.sleep(300);

      this.addLog(`🔍 Searching for Software Engineer jobs...`, 'info');
      await this.sleep(400);

      // Simulate job collection with pagination
      let pagesProcessed = 0;
      const pagesForPlatform = Math.ceil(platform.jobs / 25);

      for (let page = 1; page <= pagesForPlatform; page++) {
        const jobsOnPage = Math.min(25, platform.jobs - (page - 1) * 25);
        this.addLog(`  📄 ${platform.name} page ${page}/${pagesForPlatform}: extracted ${jobsOnPage} jobs`, 'info');
        
        totalJobs += jobsOnPage;
        workflow.jobsCollected = totalJobs;
        workflow.progress = Math.min(90, (totalJobs / 350) * 90);
        this.broadcastWorkflowUpdate('job-aggregation');

        await this.sleep(300);
      }

      this.addLog(`✅ ${platform.name}: Collected ${platform.jobs} jobs`, 'success');
      await this.sleep(200);
    }

    this.addLog('🔄 Deduplicating jobs across platforms...', 'info');
    await this.sleep(500);

    workflow.jobs = sampleJobs.map(job => ({
      ...job,
      id: Math.random().toString(36).substr(2, 9),
      scrapedAt: new Date().toISOString(),
    }));

    workflow.jobsCollected = workflow.jobs.length;
    workflow.progress = 100;
    this.broadcastWorkflowUpdate('job-aggregation');

    this.addLog(`✅ Job Aggregation Complete: ${workflow.jobs.length} unique jobs collected`, 'success');
  }

  async runResumeScreening(workflow) {
    this.addLog('📋 Starting Resume Screening Workflow', 'start');
    
    const sampleCandidates = [
      {
        name: 'Alice Johnson',
        email: 'alice.johnson@email.com',
        skills: ['JavaScript', 'React', 'Node.js', 'Python'],
        experience: 6,
        education: 'BS Computer Science',
        score: 92,
      },
      {
        name: 'Bob Smith',
        email: 'bob.smith@email.com',
        skills: ['Java', 'Spring', 'SQL', 'AWS'],
        experience: 5,
        education: 'BS Computer Engineering',
        score: 88,
      },
      {
        name: 'Carol White',
        email: 'carol.white@email.com',
        skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
        experience: 7,
        education: 'BS Software Engineering',
        score: 95,
      },
      {
        name: 'David Lee',
        email: 'david.lee@email.com',
        skills: ['Python', 'Django', 'FastAPI', 'Machine Learning'],
        experience: 4,
        education: 'MS Data Science',
        score: 85,
      },
      {
        name: 'Eve Martinez',
        email: 'eve.martinez@email.com',
        skills: ['C++', 'Rust', 'Systems Programming', 'Linux'],
        experience: 8,
        education: 'BS Computer Science',
        score: 90,
      },
      {
        name: 'Frank Chen',
        email: 'frank.chen@email.com',
        skills: ['JavaScript', 'Vue.js', 'Node.js', 'MongoDB'],
        experience: 3,
        education: 'Bootcamp Graduate',
        score: 72,
      },
      {
        name: 'Grace Kim',
        email: 'grace.kim@email.com',
        skills: ['React', 'Redux', 'GraphQL', 'TypeScript'],
        experience: 5,
        education: 'BS Computer Science',
        score: 91,
      },
      {
        name: 'Henry Brown',
        email: 'henry.brown@email.com',
        skills: ['Full Stack', 'AWS', 'Docker', 'Kubernetes'],
        experience: 6,
        education: 'BS Information Technology',
        score: 87,
      },
    ];

    this.addLog('🔐 Connecting to ATS (Greenhouse)...', 'info');
    await this.sleep(400);

    this.addLog('🔑 Handling OAuth authentication...', 'info');
    await this.sleep(300);

    this.addLog('📂 Navigating to applications...', 'info');
    await this.sleep(300);

    this.addLog('🔍 Filtering to unreviewed applications...', 'info');
    await this.sleep(200);

    let processedCount = 0;

    for (const candidate of sampleCandidates) {
      this.addLog(`👤 Screening ${candidate.name}...`, 'info');
      
      // Simulate: open candidate, extract resume, parse, score
      await this.sleep(150);
      this.addLog(`  📄 Downloaded resume for ${candidate.name}`, 'info');
      await this.sleep(150);
      this.addLog(`  📊 Scoring: ${candidate.score}/100 (${candidate.experience} years exp, ${candidate.skills.length} skills)`, 'info');

      processedCount++;
      workflow.candidatesProcessed = processedCount;
      workflow.matchScore = Math.round(
        sampleCandidates.slice(0, processedCount).reduce((sum, c) => sum + c.score, 0) / processedCount
      );
      workflow.progress = (processedCount / sampleCandidates.length) * 100;
      this.broadcastWorkflowUpdate('resume-screening');

      await this.sleep(100);
    }

    workflow.candidates = sampleCandidates.sort((a, b) => b.score - a.score);
    workflow.progress = 100;
    this.broadcastWorkflowUpdate('resume-screening');

    this.addLog(`✅ Resume Screening Complete: ${processedCount} candidates scored`, 'success');
  }

  async runInterviewScheduling(workflow) {
    this.addLog('📅 Starting Interview Scheduling Workflow', 'start');
    
    const interviewData = [
      { candidateName: 'Carol White', date: '2026-03-15', time: '10:00 AM', interviewers: ['John Doe', 'Jane Smith'] },
      { candidateName: 'Alice Johnson', date: '2026-03-16', time: '2:00 PM', interviewers: ['John Doe', 'Mike Johnson'] },
      { candidateName: 'Grace Kim', date: '2026-03-17', time: '11:00 AM', interviewers: ['Jane Smith', 'Sarah Williams'] },
      { candidateName: 'Bob Smith', date: '2026-03-18', time: '3:00 PM', interviewers: ['John Doe', 'Sarah Williams'] },
      { candidateName: 'Eve Martinez', date: '2026-03-19', time: '9:00 AM', interviewers: ['Jane Smith', 'Mike Johnson'] },
    ];

    this.addLog('📅 Accessing calendar system...', 'info');
    await this.sleep(400);

    this.addLog('🔐 Authenticating with Google Calendar...', 'info');
    await this.sleep(300);

    let scheduledCount = 0;

    for (const interview of interviewData) {
      this.addLog(`📞 Scheduling interview for ${interview.candidateName}...`, 'info');
      
      await this.sleep(150);
      this.addLog(`  🔍 Checking availability for ${interview.interviewers.join(', ')}...`, 'info');
      await this.sleep(200);

      this.addLog(`  ✅ Found mutual availability: ${interview.date} at ${interview.time}`, 'success');
      await this.sleep(150);

      this.addLog(`  📅 Creating calendar event...`, 'info');
      await this.sleep(200);

      this.addLog(`  📧 Sending interview invitation to ${interview.candidateName}...`, 'info');
      await this.sleep(200);

      this.addLog(`  💾 Updating ATS with interview details...`, 'info');
      await this.sleep(150);

      scheduledCount++;
      workflow.scheduledInterviews = scheduledCount;
      workflow.progress = (scheduledCount / interviewData.length) * 100;
      workflow.interviews.push({
        id: Math.random().toString(36).substr(2, 9),
        ...interview,
      });
      this.broadcastWorkflowUpdate('interview-scheduling');

      await this.sleep(100);
    }

    workflow.progress = 100;
    this.broadcastWorkflowUpdate('interview-scheduling');

    this.addLog(`✅ Interview Scheduling Complete: ${scheduledCount} interviews scheduled`, 'success');
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  pauseWorkflow(workflowId) {
    const workflow = this.workflows.get(workflowId);
    if (workflow && workflow.status === 'running') {
      workflow.status = 'paused';
      this.broadcastWorkflowUpdate(workflowId);
      this.addLog('⏸️  Workflow paused', 'warning');
    }
  }

  getWorkflow(workflowId) {
    return this.workflows.get(workflowId);
  }

  getAllWorkflows() {
    return Array.from(this.workflows.values());
  }

  getLogs() {
    return this.logs;
  }
}

const manager = new WorkflowManager();

// ============================================================================
// WEBSOCKET HANDLERS
// ============================================================================

wss.on('connection', (ws) => {
  console.log('Client connected');
  manager.clients.add(ws);

  // Send initial state
  ws.send(JSON.stringify({
    type: 'initial-state',
    data: {
      workflows: manager.getAllWorkflows(),
      logs: manager.getLogs(),
    },
  }));

  ws.on('close', () => {
    manager.clients.delete(ws);
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// ============================================================================
// REST API ENDPOINTS
// ============================================================================

app.get('/api/workflows', (req, res) => {
  res.json(manager.getAllWorkflows());
});

app.get('/api/workflows/:id', (req, res) => {
  const workflow = manager.getWorkflow(req.params.id);
  if (!workflow) {
    return res.status(404).json({ error: 'Workflow not found' });
  }
  res.json(workflow);
});

app.post('/api/workflows/:id/start', async (req, res) => {
  const workflow = await manager.startWorkflow(req.params.id);
  if (!workflow) {
    return res.status(404).json({ error: 'Workflow not found' });
  }
  res.json(workflow);
});

app.post('/api/workflows/:id/pause', (req, res) => {
  manager.pauseWorkflow(req.params.id);
  res.json({ status: 'paused' });
});

app.get('/api/logs', (req, res) => {
  res.json(manager.getLogs());
});

app.get('/api/dashboard', (req, res) => {
  const workflows = manager.getAllWorkflows();
  const totalJobs = workflows.find(w => w.id === 'job-aggregation')?.jobsCollected || 0;
  const totalCandidates = workflows.find(w => w.id === 'resume-screening')?.candidatesProcessed || 0;
  const totalInterviews = workflows.find(w => w.id === 'interview-scheduling')?.scheduledInterviews || 0;

  res.json({
    metrics: {
      jobsAggregated: totalJobs,
      candidatesScreened: totalCandidates,
      interviewsScheduled: totalInterviews,
      timeSaved: Math.round((totalJobs * 0.15 + totalCandidates * 0.08 + totalInterviews * 0.12)),
    },
    workflows,
    logs: manager.getLogs().slice(-20), // Last 20 logs
  });
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`✅ TinyFish HR Automation Platform running on http://localhost:${PORT}`);
  console.log(`   Dashboard: http://localhost:${PORT}`);
  console.log(`   API: http://localhost:${PORT}/api`);
});

module.exports = { app, manager };
