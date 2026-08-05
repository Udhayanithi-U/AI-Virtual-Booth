const roleBank = {
  software: {
    title: "Software Engineer Interview Mode",
    summary: "Coding, projects, debugging, and problem-solving communication.",
    sample: "Good morning. My name is Udhayanithi, and I am an engineering student interested in software development. In my recent project, I built an AI virtual interview booth that helps students practice placement questions using webcam, microphone, live transcript, and instant feedback. My contribution was designing the dashboard, connecting browser speech recognition, calculating pace and confidence cues, and presenting suggestions in a simple way. This project solved the problem of students not getting immediate interview feedback. I learned how to convert technical features into a useful product experience, and I believe that makes me a strong fit for an entry level software engineering role.",
    keywords: ["project", "code", "debug", "algorithm", "testing", "team", "software", "problem", "system", "learning"],
    questions: [
      "Tell me about yourself and explain why you are a good fit for a software engineering role.",
      "Describe one technical project you built. What problem did it solve and what was your contribution?",
      "Explain the difference between an array and a linked list, and when you would use each.",
      "How would you handle a production bug reported by users just before a deadline?",
      "Describe a time you worked in a team. How did you communicate and resolve challenges?"
    ]
  },
  data: {
    title: "Data Analyst Interview Mode",
    summary: "SQL, dashboards, insights, data cleaning, and business storytelling.",
    sample: "I am interested in data analyst roles because I enjoy finding useful patterns from raw information. In one project, I cleaned student performance data, created summary metrics, and built charts to identify which factors affected outcomes. I used spreadsheet functions, basic SQL thinking, and clear visualization so a non-technical audience could understand the result. My main strength is explaining data in simple business language. If selected, I can help teams make better decisions by combining accuracy, curiosity, and communication.",
    keywords: ["data", "sql", "dashboard", "insight", "clean", "metric", "visualization", "analysis", "business", "pattern"],
    questions: [
      "Tell me about a data project where you converted raw data into a useful insight.",
      "How would you clean a dataset that has missing values, duplicates, and inconsistent formats?",
      "Explain the difference between WHERE and HAVING in SQL with an example.",
      "How would you present a dashboard insight to a manager who is not technical?",
      "What metrics would you track to measure whether a placement training program is improving?"
    ]
  },
  frontend: {
    title: "Frontend Developer Interview Mode",
    summary: "UI quality, responsive layouts, accessibility, JavaScript, and product feel.",
    sample: "I am applying for a frontend developer role because I like building interfaces that people can use easily. In my AI interview booth project, I focused on responsive layout, dashboard cards, camera controls, and animated feedback sections. I used HTML, CSS, and JavaScript to create an experience that works without extra setup. I also considered accessibility by using clear labels and readable states. My goal as a frontend developer is to combine design thinking with clean implementation.",
    keywords: ["html", "css", "javascript", "responsive", "accessibility", "ui", "component", "performance", "layout", "user"],
    questions: [
      "Walk me through a frontend project you built and explain your UI decisions.",
      "How do you make a web page responsive for mobile and desktop screens?",
      "Explain event delegation in JavaScript and where it is useful.",
      "How would you improve the performance of a slow dashboard page?",
      "What accessibility checks would you do before releasing a form or interview app?"
    ]
  },
  backend: {
    title: "Backend Developer Interview Mode",
    summary: "APIs, databases, authentication, reliability, and system design basics.",
    sample: "I am interested in backend development because I like designing reliable systems behind the user interface. In a project, I would structure APIs clearly, validate inputs, store data safely, and return meaningful errors. For an interview booth, the backend could save user sessions, transcripts, scores, and video metadata. I understand the importance of authentication, database design, and logging. My strength is breaking a feature into services that are simple to test and maintain.",
    keywords: ["api", "database", "server", "auth", "security", "endpoint", "logging", "validation", "scalable", "service"],
    questions: [
      "Design the backend for this AI interview booth. What APIs and database tables would you create?",
      "Explain REST API status codes you commonly use and why they matter.",
      "How would you secure user interview videos and transcripts?",
      "What is database indexing, and when can it improve performance?",
      "How would you debug a backend endpoint that suddenly became slow?"
    ]
  },
  cloud: {
    title: "Cloud Engineer Interview Mode",
    summary: "Deployment, monitoring, scaling, storage, and production readiness.",
    sample: "I am interested in cloud engineering because I enjoy taking applications from local development to reliable deployment. For this AI interview booth, I would host the frontend, store videos securely, and monitor usage and errors. I would also think about scalability, cost, and backups. My approach is to start simple, automate deployment, and add monitoring early so problems are visible. This helps teams deliver projects that are stable during real user demos.",
    keywords: ["cloud", "deploy", "monitor", "scale", "storage", "backup", "cost", "automation", "server", "reliable"],
    questions: [
      "How would you deploy this interview booth for 1,000 students during placement season?",
      "Explain the difference between vertical scaling and horizontal scaling.",
      "What cloud storage strategy would you use for interview videos?",
      "Which monitoring metrics would you track after deployment?",
      "How would you reduce cloud cost without hurting performance?"
    ]
  },
  cyber: {
    title: "Cybersecurity Analyst Interview Mode",
    summary: "Privacy, threat detection, permissions, secure storage, and risk thinking.",
    sample: "I am interested in cybersecurity because I like protecting user data and finding weaknesses before attackers do. In an AI interview booth, webcam video, microphone audio, and transcripts are sensitive, so permission handling and secure storage are very important. I would reduce risk by collecting only necessary data, encrypting stored files, and showing clear consent to users. My strength is thinking from both the user side and attacker side to improve trust.",
    keywords: ["security", "privacy", "encrypt", "risk", "attack", "permission", "authentication", "authorization", "protect", "threat"],
    questions: [
      "What privacy risks exist in an app that records webcam, microphone, and interview transcripts?",
      "How would you explain phishing to a non-technical user?",
      "What is the difference between authentication and authorization?",
      "How would you investigate suspicious login activity in a placement portal?",
      "What security controls would you add before storing interview videos online?"
    ]
  }
};

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const PRACTICE_HISTORY_LIMIT = 5;
const PRACTICE_DB_NAME = "ai-interview-practice-history";
const PRACTICE_DB_VERSION = 1;
const PRACTICE_STORE = "attempts";

const state = {
  activeQuestionIndex: 0,
  stream: null,
  recognition: null,
  audioContext: null,
  analyser: null,
  mediaRecorder: null,
  recordedChunks: [],
  lastVideoUrl: null,
  pendingVideoBlob: null,
  practiceHistory: [],
  selectedPracticeId: null,
  activeHistoryVideoUrl: null,
  samples: [],
  transcript: "",
  finalTranscript: "",
  liveTranscript: "",
  interimTranscript: "",
  isRecording: false,
  startedAt: null,
  timerId: null,
  energyId: null
};

const els = {
  activeQuestion: document.getElementById("activeQuestion"),
  questionButtons: document.getElementById("questionButtons"),
  roleSelect: document.getElementById("roleSelect"),
  roleSummary: document.getElementById("roleSummary"),
  coachTitle: document.getElementById("coachTitle"),
  coachSummary: document.getElementById("coachSummary"),
  newQuestionBtn: document.getElementById("newQuestionBtn"),
  sampleBtn: document.getElementById("sampleBtn"),
  lastVideoBtn: document.getElementById("lastVideoBtn"),
  closeVideoBtn: document.getElementById("closeVideoBtn"),
  videoReview: document.getElementById("videoReview"),
  reviewVideo: document.getElementById("reviewVideo"),
  videoReviewNote: document.getElementById("videoReviewNote"),
  generateReportBtn: document.getElementById("generateReportBtn"),
  historySummary: document.getElementById("historySummary"),
  historyList: document.getElementById("historyList"),
  startBtn: document.getElementById("startBtn"),
  stopBtn: document.getElementById("stopBtn"),
  clearBtn: document.getElementById("clearBtn"),
  manualTranscript: document.getElementById("manualTranscript"),
  analyzeTypedBtn: document.getElementById("analyzeTypedBtn"),
  correctAiBtn: document.getElementById("correctAiBtn"),
  correctionPanel: document.getElementById("correctionPanel"),
  correctedEnglish: document.getElementById("correctedEnglish"),
  mistakeList: document.getElementById("mistakeList"),
  keySuggestionList: document.getElementById("keySuggestionList"),
  camera: document.getElementById("camera"),
  cameraPlaceholder: document.getElementById("cameraPlaceholder"),
  statusDot: document.getElementById("statusDot"),
  statusText: document.getElementById("statusText"),
  timer: document.getElementById("timer"),
  transcript: document.getElementById("transcript"),
  confidenceScore: document.getElementById("confidenceScore"),
  scoreRing: document.getElementById("scoreRing"),
  verdictText: document.getElementById("verdictText"),
  paceScore: document.getElementById("paceScore"),
  paceLabel: document.getElementById("paceLabel"),
  energyScore: document.getElementById("energyScore"),
  energyLabel: document.getElementById("energyLabel"),
  clarityScore: document.getElementById("clarityScore"),
  clarityLabel: document.getElementById("clarityLabel"),
  wbmScore: document.getElementById("wbmScore"),
  wbmLabel: document.getElementById("wbmLabel"),
  feedbackBadge: document.getElementById("feedbackBadge"),
  feedbackList: document.getElementById("feedbackList"),
  paceBar: document.getElementById("paceBar"),
  confidenceBar: document.getElementById("confidenceBar"),
  clarityBar: document.getElementById("clarityBar"),
  roleBar: document.getElementById("roleBar"),
  wbmBar: document.getElementById("wbmBar"),
  engineStatus: document.getElementById("engineStatus"),
  keywordCloud: document.getElementById("keywordCloud"),
  structureSignal: document.getElementById("structureSignal"),
  keywordSignal: document.getElementById("keywordSignal"),
  toneSignal: document.getElementById("toneSignal"),
  nextAction: document.getElementById("nextAction"),
  waveform: document.getElementById("waveform")
};

function init() {
  renderQuestions();
  renderKeywordCloud([]);
  setQuestion(0);
  wireEvents();
  setRingScore(0);
  drawIdleWaveform();
  loadPracticeHistory();
  if (!SpeechRecognition) {
    setFeedback([
      "Speech recognition is not available in this browser. Use recent Chrome or Edge for live transcript analysis.",
      "Camera and voice energy can still work after microphone permission is granted."
    ], "Browser warning");
  }
}

function wireEvents() {
  els.startBtn.addEventListener("click", startInterview);
  els.stopBtn.addEventListener("click", stopInterview);
  els.clearBtn.addEventListener("click", resetSession);
  els.analyzeTypedBtn.addEventListener("click", analyzeTypedAnswer);
  els.correctAiBtn.addEventListener("click", correctWithAi);
  els.manualTranscript.addEventListener("input", syncManualTranscript);
  els.sampleBtn.addEventListener("click", loadSampleAnswer);
  els.roleSelect.addEventListener("change", updateRole);
  els.lastVideoBtn.addEventListener("click", showLastVideo);
  els.generateReportBtn.addEventListener("click", () => generatePracticeReport(state.selectedPracticeId));
  els.closeVideoBtn.addEventListener("click", () => els.videoReview.classList.remove("visible"));
  els.newQuestionBtn.addEventListener("click", () => {
    const next = (state.activeQuestionIndex + 1) % getQuestions().length;
    setQuestion(next);
  });
}

function renderQuestions() {
  els.questionButtons.innerHTML = "";
  getQuestions().forEach((question, index) => {
    const button = document.createElement("button");
    button.className = "question-button";
    button.type = "button";
    button.textContent = question;
    button.addEventListener("click", () => setQuestion(index));
    els.questionButtons.appendChild(button);
  });
}

function setQuestion(index) {
  state.activeQuestionIndex = index;
  els.activeQuestion.textContent = getQuestions()[index];
  document.querySelectorAll(".question-button").forEach((button, buttonIndex) => {
    button.classList.toggle("active", buttonIndex === index);
  });
}

async function startInterview() {
  try {
    resetAnalysisOnly();
    state.stream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
      audio: true
    });

    els.camera.srcObject = state.stream;
    els.cameraPlaceholder.classList.add("hidden");
    state.startedAt = Date.now();
    state.isRecording = true;
    state.timerId = setInterval(updateTimer, 500);
    document.body.classList.add("recording");

    startAudioMeter(state.stream);
    startVideoRecorder(state.stream);
    startSpeechRecognition();
    setRecordingUi(true);
  } catch (error) {
    setFeedback([
      "Camera or microphone permission was blocked. Allow browser access, then press Start Answer again.",
      `Technical detail: ${error.message}`
    ], "Permission needed");
  }
}

function stopInterview() {
  state.isRecording = false;
  stopVideoRecorder();
  stopRecognition();
  clearInterval(state.timerId);
  cancelAnimationFrame(state.energyId);
  document.body.classList.remove("recording");
  setRecordingUi(false);
  els.statusText.textContent = "Finalizing transcript";
  setTimeout(() => {
    analyzeAnswer();
    stopTracks();
  }, 900);
}

function startVideoRecorder(stream) {
  state.recordedChunks = [];
  state.pendingVideoBlob = null;
  if (!window.MediaRecorder) {
    els.lastVideoBtn.disabled = true;
    return;
  }

  const recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      state.recordedChunks.push(event.data);
    }
  };
  recorder.onstop = () => {
    if (!state.recordedChunks.length) return;
    if (state.lastVideoUrl) URL.revokeObjectURL(state.lastVideoUrl);
    const blob = new Blob(state.recordedChunks, { type: "video/webm" });
    state.pendingVideoBlob = blob;
    state.lastVideoUrl = URL.createObjectURL(blob);
    els.reviewVideo.src = state.lastVideoUrl;
    els.lastVideoBtn.disabled = false;
    els.videoReview.classList.add("visible");
  };
  recorder.start();
  state.mediaRecorder = recorder;
}

function stopVideoRecorder() {
  if (state.mediaRecorder && state.mediaRecorder.state !== "inactive") {
    state.mediaRecorder.stop();
  }
  state.mediaRecorder = null;
}

function startSpeechRecognition() {
  if (!SpeechRecognition) {
    els.statusText.textContent = "Speech-to-text unavailable";
    setFeedback([
      "Speech-to-text is not available in this browser. Open the app in Chrome or Edge and allow microphone permission.",
      "Voice energy and video recording can still work, but transcript, WPM, and NLP feedback need browser speech recognition."
    ], "Browser warning");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    let newFinalTranscript = "";
    let interimTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const text = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        newFinalTranscript += `${text} `;
      } else {
        interimTranscript += `${text} `;
      }
    }

    state.finalTranscript = `${state.finalTranscript} ${newFinalTranscript}`.trim();
    state.transcript = state.finalTranscript;
    state.interimTranscript = interimTranscript.trim() || state.interimTranscript;
    state.liveTranscript = `${state.finalTranscript} ${interimTranscript}`.trim();
    const combined = state.liveTranscript;
    updateTranscript(combined);
    els.statusText.textContent = combined ? "Speech-to-text active" : "Listening";
  };

  recognition.onerror = (event) => {
    els.statusText.textContent = "Speech-to-text interrupted";
    if (event.error === "not-allowed") {
      setFeedback([
        "Microphone permission for speech-to-text was blocked. Allow microphone permission in the browser address bar and try again.",
        "Use Chrome or Edge for live transcript, WPM, pace, and NLP analysis."
      ], "Mic blocked");
    } else if (event.error === "network") {
      setFeedback([
        "Chrome's speech-to-text service could not connect. Voice energy still works because your mic is active, but transcript scoring needs speech-to-text.",
        "Use the Backup transcript box below: type or paste your answer, then click Analyze Typed Answer."
      ], "Speech network issue");
    } else if (event.error === "no-speech" || event.error === "audio-capture") {
      setFeedback([
        "The mic is active, but no clear words reached browser speech recognition.",
        "Move closer to the mic, speak in English, or use the Backup transcript box to unlock WPM, clarity, confidence, and AI feedback."
      ], "Speech not detected");
    }
  };

  recognition.onend = () => {
    const latestTranscript = state.liveTranscript || state.finalTranscript || state.interimTranscript;
    state.liveTranscript = latestTranscript.trim();
    if (!state.finalTranscript && state.liveTranscript) {
      state.finalTranscript = state.liveTranscript;
    }
    if (state.isRecording && state.recognition) {
      try {
        recognition.start();
      } catch (error) {
        els.statusText.textContent = "Speech-to-text restarting";
      }
    }
  };

  recognition.start();
  state.recognition = recognition;
}

function startAudioMeter(stream) {
  state.audioContext = new AudioContext();
  const source = state.audioContext.createMediaStreamSource(stream);
  state.analyser = state.audioContext.createAnalyser();
  state.analyser.fftSize = 1024;
  source.connect(state.analyser);

  const data = new Uint8Array(state.analyser.fftSize);

  function sample() {
    state.analyser.getByteTimeDomainData(data);
    let sum = 0;
    for (const value of data) {
      const centered = value - 128;
      sum += centered * centered;
    }
    const rms = Math.sqrt(sum / data.length);
    state.samples.push(rms);
    const liveEnergy = Math.min(100, Math.round(rms * 4));
    els.energyScore.textContent = `${liveEnergy}%`;
    els.energyLabel.textContent = liveEnergy > 45 ? "Strong tone" : liveEnergy > 22 ? "Steady tone" : "Low volume";
    drawWaveform(data, liveEnergy);
    state.energyId = requestAnimationFrame(sample);
  }

  sample();
}

function analyzeAnswer() {
  const transcript = sanitizeTranscript(state.liveTranscript || state.finalTranscript || state.interimTranscript || state.transcript || getTypedTranscript());
  const durationSeconds = Math.max(1, Math.round(((Date.now() - state.startedAt) || 1) / 1000));
  const words = transcript.match(/\b[\w']+\b/g) || [];
  const wordCount = words.length;
  const minutes = durationSeconds / 60;
  const pace = Math.round(wordCount / minutes);
  const fillers = countFillers(transcript);
  const avgEnergy = average(state.samples);
  const energyStability = calculateStability(state.samples);
  const clarity = calculateClarity(wordCount, fillers, transcript);
  const content = analyzeContent(transcript, avgEnergy, energyStability);
  const balance = analyzeWordBalance(transcript, words, content.matchedKeywords);
  const paceQuality = Math.round(scoreRange(pace, 115, 155, 70));
  const confidence = wordCount
    ? calculateConfidence({ pace, clarity, avgEnergy, energyStability, wordCount, durationSeconds, roleRelevance: content.roleRelevance, structureScore: content.structureScore, wordBalance: balance.score })
    : 0;
  const result = { confidence, pace, clarity, fillers, wordCount, durationSeconds, avgEnergy, energyStability, content, balance };
  const feedback = buildFeedback(result);

  els.paceScore.textContent = wordCount ? `${pace} wpm` : "-- wpm";
  els.paceLabel.textContent = labelPace(pace, wordCount);
  els.energyScore.textContent = state.samples.length ? `${Math.round(Math.min(100, avgEnergy * 4))}%` : "--";
  els.energyLabel.textContent = labelEnergy(avgEnergy, energyStability);
  els.clarityScore.textContent = `${clarity}%`;
  els.clarityLabel.textContent = fillers ? `${fillers} filler words detected` : "Low filler usage";
  els.wbmScore.textContent = wordCount ? `${balance.score}%` : "--%";
  els.wbmLabel.textContent = wordCount ? balance.label : "Word balance waiting";
  els.confidenceScore.textContent = `${confidence}%`;
  setRingScore(confidence);
  els.paceBar.style.width = `${wordCount ? paceQuality : 0}%`;
  els.confidenceBar.style.width = `${confidence}%`;
  els.clarityBar.style.width = `${clarity}%`;
  els.roleBar.style.width = `${content.roleRelevance}%`;
  els.wbmBar.style.width = `${wordCount ? balance.score : 0}%`;
  els.feedbackBadge.textContent = confidence >= 78 ? "Strong answer" : confidence >= 58 ? "Developing" : "Needs practice";
  els.verdictText.textContent = buildVerdict(confidence, pace, clarity);
  updateEnginePanel(content, wordCount);

  setFeedback(feedback, els.feedbackBadge.textContent);
  if (wordCount) {
    updateTranscript(transcript);
  }
  els.statusText.textContent = wordCount ? "Analysis ready" : "Transcript not captured";
  savePracticeAttempt(result, feedback, transcript);
}

function buildFeedback(result) {
  if (!result.wordCount) {
    return [
      "No clear transcript was captured. Speak for at least 30 to 45 seconds in Chrome or Edge and keep the mic close.",
      "Try answering with a simple structure: introduction, key technical example, result, and learning."
    ];
  }

  const feedback = [];
  const roleName = els.roleSelect.options[els.roleSelect.selectedIndex].text;

  if (result.confidence >= 78) {
    feedback.push(`Executive impression for ${roleName}: confident and interview-ready. Your answer has useful length, audible energy, and a clear rhythm.`);
  } else if (result.confidence >= 58) {
    feedback.push("Executive impression: promising but still developing. The answer has a base to build on, but needs sharper structure and steadier delivery.");
  } else {
    feedback.push("Executive impression: needs rehearsal before final placement rounds. Aim for a fuller response with steadier volume and fewer pauses.");
  }

  if (result.pace < 110) {
    feedback.push("Increase your pace slightly. Placement interviews usually feel stronger around 120 to 155 words per minute.");
  } else if (result.pace > 170) {
    feedback.push("Slow down a little. Fast answers can sound nervous and make technical points harder to follow.");
  } else {
    feedback.push("Your speaking pace is interview-friendly and easy to follow.");
  }

  if (result.fillers > 5) {
    feedback.push("Reduce filler words like um, uh, like, and basically. Pause silently for one second instead.");
  }

  if (result.clarity < 65) {
    feedback.push(`Improve clarity by using the STAR format: situation, task, action, result. Add one ${roleName.toLowerCase()} example with measurable impact.`);
  } else {
    feedback.push("Your clarity is solid. To improve further, add a sharper final sentence about impact or learning.");
  }

  if (result.balance.score < 62) {
    feedback.push(`WBM insight: ${result.balance.coaching}`);
  } else {
    feedback.push(`WBM insight: balanced answer. You combined ${result.balance.primaryStrength} with enough supporting detail.`);
  }

  if (result.avgEnergy < 6) {
    feedback.push("Your mic energy was low. Sit closer to the microphone and project your voice naturally.");
  }

  if (result.energyStability < 58) {
    feedback.push("Tone stability can improve. Keep the same volume through technical details instead of dropping your voice at the end of sentences.");
  }

  if (result.content.roleRelevance < 45) {
    feedback.push("Role relevance is weak. Add more keywords and examples connected to the selected job role.");
  }

  if (result.content.structureScore < 55) {
    feedback.push("The AI engine did not detect a complete story structure. Include problem, action, result, and learning in one flow.");
  }

  if (!result.balance.hasClosing) {
    feedback.push("Add a stronger closing line: connect your example to why the company should trust you in the selected role.");
  }

  return feedback;
}

function analyzeTypedAnswer() {
  const typedTranscript = getTypedTranscript();
  if (!typedTranscript) {
    setFeedback([
      "Type or paste your answer in Backup transcript first.",
      "After that, the app can calculate speech pace, clarity, WBM, confidence, role relevance, and AI feedback."
    ], "Transcript needed");
    return;
  }

  stopTracks();
  stopRecognition();
  clearInterval(state.timerId);
  cancelAnimationFrame(state.energyId);
  document.body.classList.remove("recording");
  const typedWords = typedTranscript.match(/\b[\w']+\b/g) || [];
  const estimatedSeconds = Math.max(35, Math.round((typedWords.length / 135) * 60));
  state.startedAt = Date.now() - estimatedSeconds * 1000;
  state.transcript = typedTranscript;
  state.finalTranscript = typedTranscript;
  state.liveTranscript = typedTranscript;
  if (!state.samples.length) {
    state.samples = Array.from({ length: 120 }, (_, index) => 11 + Math.sin(index / 8) * 1.8);
  }
  updateTranscript(typedTranscript);
  els.timer.textContent = formatDuration(estimatedSeconds);
  setRecordingUi(false);
  els.statusText.textContent = "Typed transcript analyzed";
  analyzeAnswer();
}

function correctWithAi() {
  const transcript = sanitizeTranscript(state.liveTranscript || state.finalTranscript || state.transcript || getTypedTranscript());
  if (!transcript) {
    els.correctionPanel.classList.add("visible");
    els.correctedEnglish.textContent = "No transcript is available yet. Speak first, or type your answer in Backup transcript.";
    renderMistakes(["Capture or type an answer before using Correct with AI."]);
    renderKeySuggestions(getActiveRole().keywords.slice(0, 6));
    setFeedback([
      "Correct with AI needs transcript text. Use live speech-to-text or the Backup transcript box.",
      "After correction, you can include the suggested role keys in your next answer."
    ], "Transcript needed");
    return;
  }

  const correction = buildLanguageCoach(transcript);
  els.correctionPanel.classList.add("visible");
  els.correctedEnglish.textContent = correction.corrected;
  renderMistakes(correction.mistakes);
  renderKeySuggestions(correction.keys);
  setFeedback([
    `Correct with AI: ${correction.summary}`,
    `Stronger answer line: ${correction.strongerLine}`,
    `Include these key points next: ${correction.keys.join(", ")}.`
  ], "English coach ready");
}

function buildLanguageCoach(transcript) {
  let corrected = ` ${transcript} `;
  const mistakes = [];
  const replacements = [
    [/\bi am created\b/gi, "I created", "Use 'I created' instead of 'I am created'."],
    [/\bi am built\b/gi, "I built", "Use 'I built' instead of 'I am built'."],
    [/\bi have build\b/gi, "I have built", "Use 'I have built' for completed project work."],
    [/\bi done\b/gi, "I did", "Use 'I did' or 'I completed' instead of 'I done'."],
    [/\bi did dashboard\b/gi, "I designed the dashboard", "Say exactly what you designed, built, or implemented."],
    [/\bone project\b/gi, "a project", "Use 'a project' for a singular project example."],
    [/\bit help\b/gi, "it helps", "Use 'it helps' for present-tense product explanation."],
    [/\bmyself ([a-z])/gi, "My name is $1", "Say 'My name is...' instead of starting with 'Myself...'."],
    [/\bdoes not getting\b/gi, "does not get", "Use the base verb after 'does not'."],
    [/\bdid not got\b/gi, "did not get", "Use 'did not get', not 'did not got'."],
    [/\bmore better\b/gi, "better", "Avoid double comparatives like 'more better'."],
    [/\bpeoples\b/gi, "people", "People is already plural."],
    [/\bstuffs\b/gi, "things", "Use 'things' or a specific noun instead of 'stuffs'."],
    [/\bcrct\b/gi, "correct", "Use complete formal words in interview answers."]
  ];

  replacements.forEach(([pattern, replacement, note]) => {
    pattern.lastIndex = 0;
    const match = corrected.match(pattern);
    if (match) {
      corrected = corrected.replace(pattern, replacement);
      const fixedPhrase = match[0].replace(pattern, replacement);
      mistakes.push(`Grammar point: change "${match[0].trim()}" to "${fixedPhrase.trim()}". ${note}`);
    }
  });

  const fillerMatches = transcript.toLowerCase().match(/\b(um|uh|like|basically|actually|you know|i mean)\b/g) || [];
  if (fillerMatches.length) {
    mistakes.push(`Reduce filler words: ${[...new Set(fillerMatches)].join(", ")}.`);
  }

  const words = transcript.match(/\b[\w']+\b/g) || [];
  if (words.length < 45) {
    mistakes.push("Answer is too short. Add project proof, result, and learning.");
  }

  if (!/[.!?]/.test(transcript)) {
    mistakes.push("Use short sentence breaks so the answer sounds planned.");
  }

  if (!/\b(result|impact|improved|reduced|learned|solved|outcome)\b/i.test(transcript)) {
    mistakes.push("Add a result or learning sentence to show impact.");
  }

  if (!/\b(i believe|i can|my strength|strong fit|good fit|contribute)\b/i.test(transcript)) {
    mistakes.push("Add one confident closing line about why you fit the role.");
  }

  corrected = polishSentenceCasing(corrected);
  const role = getActiveRole();
  const lowerText = transcript.toLowerCase();
  const missingRoleKeys = role.keywords.filter((keyword) => !lowerText.includes(keyword)).slice(0, 5);
  const keys = missingRoleKeys.length ? missingRoleKeys : role.keywords.slice(0, 5);
  const strongerLine = buildStrongerLine(role, keys);

  return {
    corrected,
    mistakes: mistakes.length ? mistakes : ["Good verbal clarity. Improve by adding one measurable result and a confident closing line."],
    keys,
    strongerLine,
    summary: mistakes.length ? `${mistakes.length} improvement areas found in grammar, fillers, structure, or closing.` : "Your English is clear; now make the answer more role-specific."
  };
}

function polishSentenceCasing(text) {
  return text
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\bi\b/g, "I")
    .replace(/(^\w|[.!?]\s+\w)/g, (match) => match.toUpperCase());
}

function buildStrongerLine(role, keys) {
  const roleName = els.roleSelect.options[els.roleSelect.selectedIndex].text.toLowerCase();
  return `I can contribute as a ${roleName} by using ${keys.slice(0, 3).join(", ")} to build reliable solutions and communicate results clearly.`;
}

function renderMistakes(items) {
  els.mistakeList.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    els.mistakeList.appendChild(li);
  });
}

function renderKeySuggestions(keys) {
  els.keySuggestionList.innerHTML = "";
  keys.forEach((key) => {
    const chip = document.createElement("span");
    chip.textContent = key;
    els.keySuggestionList.appendChild(chip);
  });
}

function syncManualTranscript() {
  const typedTranscript = getTypedTranscript();
  if (!typedTranscript || state.liveTranscript || state.finalTranscript) return;
  state.transcript = typedTranscript;
}

function getTypedTranscript() {
  return sanitizeTranscript(els.manualTranscript.value || "");
}

function buildVerdict(confidence, pace, clarity) {
  if (confidence >= 82 && clarity >= 78) {
    return "Panel-ready answer with strong communication control.";
  }
  if (confidence >= 65) {
    return `Good foundation. Tune ${pace > 170 ? "speed" : "structure"} to sound more composed.`;
  }
  return "Practice once more using a beginning, project proof, and confident closing line.";
}

function calculateConfidence({ pace, clarity, avgEnergy, energyStability, wordCount, durationSeconds, roleRelevance, structureScore, wordBalance }) {
  const paceScore = scoreRange(pace, 115, 155, 70);
  const lengthScore = scoreRange(durationSeconds, 45, 120, 45);
  const energyScore = Math.min(100, avgEnergy * 6);
  const wordScore = Math.min(100, wordCount * 2);
  return Math.round((paceScore * 0.18) + (clarity * 0.18) + (energyScore * 0.14) + (energyStability * 0.1) + (wordScore * 0.07) + (roleRelevance * 0.12) + (structureScore * 0.11) + (wordBalance * 0.1));
}

function analyzeContent(transcript, avgEnergy, energyStability) {
  const text = transcript.toLowerCase();
  const role = getActiveRole();
  const matchedKeywords = role.keywords.filter((keyword) => text.includes(keyword));
  const roleRelevance = Math.min(100, Math.round((matchedKeywords.length / Math.max(1, role.keywords.length)) * 125));
  const structureSignals = [
    ["situation", "project", "problem", "challenge"],
    ["task", "goal", "responsibility", "needed"],
    ["action", "built", "created", "implemented", "used", "designed"],
    ["result", "improved", "reduced", "solved", "learned", "impact"]
  ];
  const detectedStructure = structureSignals.map((group) => group.some((term) => text.includes(term)));
  const structureScore = Math.round((detectedStructure.filter(Boolean).length / detectedStructure.length) * 100);
  const positiveWords = ["confident", "strong", "improved", "solved", "built", "learned", "clear", "reliable", "secure", "useful"];
  const uncertainWords = ["maybe", "actually", "basically", "confused", "nervous", "hard", "problem"];
  const positivity = positiveWords.filter((word) => text.includes(word)).length;
  const uncertainty = uncertainWords.filter((word) => text.includes(word)).length;
  const toneScore = Math.max(20, Math.min(100, Math.round(58 + positivity * 8 - uncertainty * 5 + avgEnergy * 1.5 + energyStability * 0.12)));

  return {
    matchedKeywords,
    roleRelevance,
    detectedStructure,
    structureScore,
    toneScore
  };
}

function updateEnginePanel(content, wordCount) {
  renderKeywordCloud(content.matchedKeywords);
  els.engineStatus.textContent = wordCount ? "Analysis complete" : "Low signal";
  els.structureSignal.textContent = `${content.structureScore}% structure match: ${labelStructure(content.detectedStructure)}`;
  els.keywordSignal.textContent = `${content.matchedKeywords.length}/${getActiveRole().keywords.length} role signals found: ${content.matchedKeywords.join(", ") || "none yet"}`;
  els.toneSignal.textContent = `${content.toneScore}% tone confidence from word choice and voice stability.`;
  els.nextAction.textContent = content.roleRelevance >= 60
    ? "Improve the final answer by adding one measurable result and a stronger closing line."
    : `Add more ${els.roleSelect.options[els.roleSelect.selectedIndex].text.toLowerCase()} terms from the highlighted role signal bank.`;
}

function labelStructure(detected) {
  const labels = ["situation", "task", "action", "result"];
  return labels.filter((_, index) => detected[index]).join(", ") || "no STAR signals detected";
}

function renderKeywordCloud(matchedKeywords) {
  els.keywordCloud.innerHTML = "";
  getActiveRole().keywords.forEach((keyword) => {
    const chip = document.createElement("span");
    chip.textContent = keyword;
    chip.classList.toggle("matched", matchedKeywords.includes(keyword));
    els.keywordCloud.appendChild(chip);
  });
}

function calculateClarity(wordCount, fillers, transcript) {
  if (!wordCount) return 0;
  const sentenceCount = Math.max(1, (transcript.match(/[.!?]/g) || []).length);
  const fillerPenalty = Math.min(35, fillers * 4);
  const lengthBonus = Math.min(20, wordCount / 5);
  const sentenceBonus = Math.min(12, sentenceCount * 3);
  return Math.max(20, Math.min(100, Math.round(68 + lengthBonus + sentenceBonus - fillerPenalty)));
}

function analyzeWordBalance(transcript, words, matchedKeywords) {
  if (!words.length) {
    return {
      score: 0,
      label: "Word balance waiting",
      coaching: "Speak a complete answer so the AI can compare technical, action, result, and confidence language.",
      primaryStrength: "no signal",
      hasClosing: false
    };
  }

  const text = transcript.toLowerCase();
  const uniqueRatio = new Set(words.map((word) => word.toLowerCase())).size / words.length;
  const actionWords = countMatches(text, ["built", "build", "created", "designed", "designing", "implemented", "connected", "connecting", "calculated", "calculating", "presented", "presenting", "solved", "debugged", "analyzed", "deployed", "secured", "improved", "tested"]);
  const outcomeWords = countMatches(text, ["result", "impact", "improved", "reduced", "increased", "learned", "learning", "solved", "useful", "immediate", "success", "efficient", "accurate", "reliable"]);
  const confidenceWords = countMatches(text, ["i can", "i will", "my strength", "confident", "ready", "fit", "strong fit", "contribute", "responsible", "interested"]);
  const structureWords = countMatches(text, ["first", "then", "because", "therefore", "finally", "for example", "in my project", "in my recent project", "my contribution", "this project"]);
  const technicalDensity = Math.min(100, matchedKeywords.length * 15 + actionWords * 5);
  const actionDensity = Math.min(100, actionWords * 14);
  const outcomeDensity = Math.min(100, outcomeWords * 14);
  const confidenceDensity = Math.min(100, confidenceWords * 16);
  const flowDensity = Math.min(100, structureWords * 13 + uniqueRatio * 40);
  const score = Math.round(12 + (technicalDensity * 0.22) + (actionDensity * 0.22) + (outcomeDensity * 0.22) + (confidenceDensity * 0.16) + (flowDensity * 0.18));
  const strengths = [
    ["technical proof", technicalDensity],
    ["action verbs", actionDensity],
    ["result language", outcomeDensity],
    ["confidence phrases", confidenceDensity],
    ["answer flow", flowDensity]
  ].sort((a, b) => b[1] - a[1]);
  const weakest = strengths[strengths.length - 1][0];
  const hasClosing = /\b(thank you|that is why|this makes me|i believe|i can contribute|strong fit|good fit|ready for)\b/.test(text);

  return {
    score: Math.max(18, Math.min(100, score)),
    label: score >= 78 ? "Balanced proof" : score >= 62 ? "Good balance" : `Needs ${weakest}`,
    coaching: buildWordBalanceCoaching(weakest),
    primaryStrength: strengths[0][0],
    hasClosing
  };
}

function countMatches(text, terms) {
  return terms.reduce((count, term) => count + (text.includes(term) ? 1 : 0), 0);
}

function buildWordBalanceCoaching(weakest) {
  const coaching = {
    "technical proof": "add two role-specific technical words and name the tool, method, or concept you used.",
    "action verbs": "say exactly what you built, designed, analyzed, fixed, or improved.",
    "result language": "include the result, impact, learning, or measurable improvement from your example.",
    "confidence phrases": "use one direct confidence line such as 'I can contribute by...' or 'my strength is...'.",
    "answer flow": "connect ideas with first, then, because, and finally so the answer feels planned."
  };
  return coaching[weakest] || "balance your answer with technical proof, action, result, and a confident closing.";
}

function sanitizeTranscript(text) {
  return text
    .replace(/\s+/g, " ")
    .replace(/\b(.{3,80})\s+\1\b/gi, "$1")
    .trim();
}

function calculateStability(samples) {
  if (samples.length < 5) return 45;
  const avg = average(samples);
  const variance = average(samples.map((sample) => Math.pow(sample - avg, 2)));
  return Math.max(35, Math.min(100, Math.round(100 - Math.sqrt(variance) * 5)));
}

function scoreRange(value, min, max, fallback) {
  if (!Number.isFinite(value) || value <= 0) return fallback;
  if (value >= min && value <= max) return 100;
  const distance = value < min ? min - value : value - max;
  return Math.max(35, 100 - distance * 1.4);
}

function countFillers(text) {
  const matches = text.toLowerCase().match(/\b(um|uh|like|basically|actually|so|you know|i mean)\b/g);
  return matches ? matches.length : 0;
}

function labelPace(pace, wordCount) {
  if (!wordCount) return "No speech captured";
  if (pace < 110) return "A little slow";
  if (pace > 170) return "Too fast";
  return "Balanced pace";
}

function labelEnergy(avgEnergy, stability) {
  if (!avgEnergy) return "No mic data";
  if (avgEnergy < 6) return "Low voice energy";
  if (stability < 58) return "Uneven tone";
  return "Steady tone";
}

function setRecordingUi(isRecording) {
  els.startBtn.disabled = isRecording;
  els.stopBtn.disabled = !isRecording;
  els.statusDot.classList.toggle("recording", isRecording);
  els.statusText.textContent = isRecording ? "Recording answer" : "Analysis ready";
}

function setRingScore(score) {
  const degrees = Math.round((score / 100) * 360);
  const color = score >= 78 ? "var(--teal)" : score >= 58 ? "var(--amber)" : "var(--red)";
  els.scoreRing.style.background = `radial-gradient(circle closest-side, #171d2d 72%, transparent 73%), conic-gradient(${color} ${degrees}deg, rgba(219, 229, 241, 0.18) 0deg)`;
}

function drawWaveform(data, energy) {
  const canvas = els.waveform;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(2, 6, 23, 0.16)";
  ctx.fillRect(0, 0, width, height);

  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, "#67e8f9");
  gradient.addColorStop(0.5, "#22c55e");
  gradient.addColorStop(1, "#60a5fa");

  ctx.lineWidth = 4;
  ctx.strokeStyle = gradient;
  ctx.beginPath();

  const slice = width / data.length;
  for (let i = 0; i < data.length; i += 1) {
    const value = data[i] / 128;
    const y = (value * height) / 2;
    if (i === 0) {
      ctx.moveTo(0, y);
    } else {
      ctx.lineTo(i * slice, y);
    }
  }
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 255, 255, 0.82)";
  ctx.font = "700 16px Inter, sans-serif";
  ctx.fillText(`Live voice energy ${energy}%`, 18, 28);
}

function drawIdleWaveform() {
  const canvas = els.waveform;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(2, 6, 23, 0.58)";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "rgba(103, 232, 249, 0.5)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let x = 0; x < width; x += 12) {
    const y = height / 2 + Math.sin(x / 28) * 10;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
  ctx.font = "700 16px Inter, sans-serif";
  ctx.fillText("Voice waveform will animate while you speak", 18, 28);
}

function updateTranscript(text) {
  els.transcript.textContent = text || "Your answer will appear here while you speak.";
  els.transcript.classList.toggle("transcript-empty", !text);
  if (text && !els.manualTranscript.value.trim()) {
    els.manualTranscript.value = text;
  }
}

function setFeedback(items, badge) {
  els.feedbackBadge.textContent = badge;
  els.feedbackList.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    els.feedbackList.appendChild(li);
  });
}

function updateTimer() {
  const elapsed = Math.round((Date.now() - state.startedAt) / 1000);
  els.timer.textContent = formatDuration(elapsed);
}

function formatDuration(elapsed) {
  const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const seconds = String(elapsed % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function resetSession() {
  stopVideoRecorder();
  stopTracks();
  stopRecognition();
  clearInterval(state.timerId);
  cancelAnimationFrame(state.energyId);
  document.body.classList.remove("recording");
  resetAnalysisOnly();
  setRecordingUi(false);
  els.statusText.textContent = "Ready to start";
}

function resetAnalysisOnly() {
  state.samples = [];
  state.transcript = "";
  state.finalTranscript = "";
  state.liveTranscript = "";
  state.interimTranscript = "";
  els.manualTranscript.value = "";
  els.correctionPanel.classList.remove("visible");
  els.correctedEnglish.textContent = "Analyze or capture a transcript, then use Correct with AI.";
  renderMistakes(["Waiting for transcript."]);
  renderKeySuggestions(getActiveRole().keywords.slice(0, 5));
  state.startedAt = null;
  state.isRecording = false;
  updateTranscript("");
  els.timer.textContent = "00:00";
  els.confidenceScore.textContent = "--%";
  setRingScore(0);
  els.verdictText.textContent = "Complete an answer to unlock the AI communication score.";
  els.paceBar.style.width = "0%";
  els.confidenceBar.style.width = "0%";
  els.clarityBar.style.width = "0%";
  els.roleBar.style.width = "0%";
  els.paceScore.textContent = "-- wpm";
  els.paceLabel.textContent = "Waiting for answer";
  els.energyScore.textContent = "--";
  els.energyLabel.textContent = "Mic not active";
  els.clarityScore.textContent = "--%";
  els.clarityLabel.textContent = "Transcript needed";
  els.wbmScore.textContent = "--%";
  els.wbmLabel.textContent = "Word balance waiting";
  els.wbmBar.style.width = "0%";
  setFeedback([
    `Start the camera and answer the selected ${els.roleSelect.options[els.roleSelect.selectedIndex].text} question.`,
    "The app will estimate pace, tone stability, filler words, clarity, role relevance, and confidence cues."
  ], "Not analyzed");
  els.engineStatus.textContent = "Standby";
  els.structureSignal.textContent = "Waiting for answer";
  els.keywordSignal.textContent = "Waiting for role match";
  els.toneSignal.textContent = "Waiting for audio";
  els.nextAction.textContent = "Answer one question to receive targeted coaching.";
  renderKeywordCloud([]);
  drawIdleWaveform();
}

function loadSampleAnswer() {
  stopTracks();
  stopRecognition();
  clearInterval(state.timerId);
  cancelAnimationFrame(state.energyId);
  document.body.classList.remove("recording");
  state.samples = Array.from({ length: 180 }, (_, index) => 13 + Math.sin(index / 6) * 2.8 + Math.random() * 1.5);
  const answer = getActiveRole().sample;
  const answerWords = answer.match(/\b[\w']+\b/g) || [];
  const sampleSeconds = Math.max(44, Math.round((answerWords.length / 136) * 60));
  state.startedAt = Date.now() - sampleSeconds * 1000;
  state.transcript = answer;
  state.finalTranscript = answer;
  state.liveTranscript = answer;
  updateTranscript(answer);
  els.timer.textContent = formatDuration(sampleSeconds);
  setRecordingUi(false);
  els.statusText.textContent = "Sample analyzed";
  analyzeAnswer();
}

function updateRole() {
  state.activeQuestionIndex = 0;
  renderQuestions();
  setQuestion(0);
  resetAnalysisOnly();
  const role = getActiveRole();
  els.roleSummary.textContent = role.summary;
  els.coachTitle.textContent = role.title;
  els.coachSummary.textContent = role.summary;
  els.statusText.textContent = "Role mode updated";
}

function getActiveRole() {
  return roleBank[els.roleSelect.value];
}

function getQuestions() {
  return getActiveRole().questions;
}

function showLastVideo() {
  if (!state.practiceHistory.length && !state.lastVideoUrl) return;
  els.videoReview.classList.add("visible");
  if (state.practiceHistory.length) {
    selectHistoryAttempt(state.practiceHistory[0].id);
    return;
  }
  els.reviewVideo.play().catch(() => {});
}

function openPracticeDb() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("IndexedDB is not available in this browser."));
      return;
    }

    const request = indexedDB.open(PRACTICE_DB_NAME, PRACTICE_DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(PRACTICE_STORE)) {
        db.createObjectStore(PRACTICE_STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function readPracticeAttempts() {
  const db = await openPracticeDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(PRACTICE_STORE, "readonly");
    const store = transaction.objectStore(PRACTICE_STORE);
    const request = store.getAll();
    request.onsuccess = () => {
      db.close();
      resolve((request.result || []).sort((a, b) => b.createdAt - a.createdAt));
    };
    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

async function writePracticeAttempts(attempts) {
  const db = await openPracticeDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(PRACTICE_STORE, "readwrite");
    const store = transaction.objectStore(PRACTICE_STORE);
    const clearRequest = store.clear();

    clearRequest.onsuccess = () => {
      attempts.forEach((attempt) => store.put(attempt));
    };
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

async function loadPracticeHistory() {
  try {
    state.practiceHistory = await readPracticeAttempts();
    renderPracticeHistory();
  } catch (error) {
    state.practiceHistory = [];
    renderPracticeHistory();
    els.videoReviewNote.textContent = "Practice history is unavailable in this browser, but the latest video can still be reviewed during this session.";
  }
}

async function savePracticeAttempt(result, feedback, transcript) {
  if (!state.pendingVideoBlob) return;

  const roleName = els.roleSelect.options[els.roleSelect.selectedIndex].text;
  const attempt = {
    id: `practice-${Date.now()}`,
    createdAt: Date.now(),
    roleKey: els.roleSelect.value,
    roleName,
    questionIndex: state.activeQuestionIndex,
    question: getQuestions()[state.activeQuestionIndex],
    videoBlob: state.pendingVideoBlob,
    transcript,
    feedback,
    metrics: {
      confidence: result.confidence,
      pace: result.wordCount ? result.pace : 0,
      clarity: result.clarity,
      wbm: result.wordCount ? result.balance.score : 0,
      words: result.wordCount,
      duration: result.durationSeconds,
      avgEnergy: result.avgEnergy,
      energyStability: result.energyStability,
      verdict: buildVerdict(result.confidence, result.pace, result.clarity)
    }
  };

  state.pendingVideoBlob = null;
  const nextHistory = [attempt, ...state.practiceHistory].slice(0, PRACTICE_HISTORY_LIMIT);

  try {
    await writePracticeAttempts(nextHistory);
    state.practiceHistory = nextHistory;
    renderPracticeHistory();
    selectHistoryAttempt(attempt.id);
    els.lastVideoBtn.disabled = false;
    els.statusText.textContent = "Practice saved to history";
  } catch (error) {
    state.practiceHistory = nextHistory;
    renderPracticeHistory();
    selectHistoryAttempt(attempt.id);
    els.statusText.textContent = "Saved for this session only";
  }
}

function renderPracticeHistory() {
  els.lastVideoBtn.disabled = !state.practiceHistory.length && !state.lastVideoUrl;
  els.generateReportBtn.disabled = !state.selectedPracticeId;
  els.historyList.innerHTML = "";

  if (!state.practiceHistory.length) {
    els.historySummary.innerHTML = "<strong>No saved practices yet.</strong><span>Finish one recorded answer to save the video and result here.</span>";
    return;
  }

  const bestScore = Math.max(...state.practiceHistory.map((attempt) => attempt.metrics.confidence));
  els.historySummary.innerHTML = `
    <strong>${state.practiceHistory.length}/${PRACTICE_HISTORY_LIMIT} practices saved</strong>
    <span>Best score: ${bestScore}% confidence. New attempts automatically replace the oldest one.</span>
  `;

  state.practiceHistory.forEach((attempt, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "history-item";
    button.dataset.historyId = attempt.id;
    button.innerHTML = `
      <span class="history-rank">#${index + 1}</span>
      <span>
        <strong>${escapeHtml(attempt.roleName)} · ${attempt.metrics.confidence}%</strong>
        <small>${formatHistoryDate(attempt.createdAt)} · ${attempt.metrics.pace || "--"} wpm · ${attempt.metrics.clarity}% clarity · ${attempt.metrics.wbm || "--"}% WBM</small>
      </span>
    `;
    button.addEventListener("click", () => selectHistoryAttempt(attempt.id));
    els.historyList.appendChild(button);
  });
}

function selectHistoryAttempt(id) {
  const attempt = state.practiceHistory.find((item) => item.id === id);
  if (!attempt) return;

  state.selectedPracticeId = id;
  els.generateReportBtn.disabled = false;
  restorePracticeAttempt(attempt);

  if (state.activeHistoryVideoUrl) URL.revokeObjectURL(state.activeHistoryVideoUrl);
  state.activeHistoryVideoUrl = URL.createObjectURL(attempt.videoBlob);
  els.reviewVideo.src = state.activeHistoryVideoUrl;
  els.videoReviewNote.innerHTML = `
    <strong>${escapeHtml(attempt.metrics.verdict)}</strong>
    <span>${escapeHtml(attempt.question)}</span>
  `;
  els.historySummary.innerHTML = `
    <strong>${attempt.metrics.confidence}% confidence · ${attempt.metrics.words} words · ${formatDuration(attempt.metrics.duration)}</strong>
    <span>${attempt.feedback.slice(0, 2).map(escapeHtml).join(" ")}</span>
  `;
  document.querySelectorAll(".history-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.historyId === id);
  });
  els.reviewVideo.play().catch(() => {});
}

function restorePracticeAttempt(attempt) {
  const roleKey = attempt.roleKey || findRoleKeyByName(attempt.roleName) || els.roleSelect.value;
  if (roleBank[roleKey] && els.roleSelect.value !== roleKey) {
    els.roleSelect.value = roleKey;
    renderQuestions();
  }

  const questionIndex = Number.isInteger(attempt.questionIndex)
    ? attempt.questionIndex
    : Math.max(0, getQuestions().indexOf(attempt.question));
  setQuestion(Math.max(0, questionIndex));
  updateRoleCopyOnly();

  stopTracks();
  stopRecognition();
  clearInterval(state.timerId);
  cancelAnimationFrame(state.energyId);
  document.body.classList.remove("recording");
  state.startedAt = Date.now() - Math.max(1, attempt.metrics.duration) * 1000;
  state.samples = buildHistoryEnergySamples(attempt.metrics);
  state.transcript = attempt.transcript || "";
  state.finalTranscript = state.transcript;
  state.liveTranscript = state.transcript;
  state.interimTranscript = "";
  updateTranscript(state.transcript);

  const snapshot = buildAttemptSnapshot(attempt);
  const feedback = attempt.feedback && attempt.feedback.length ? attempt.feedback : buildFeedback(snapshot);
  paintResult(snapshot, feedback);
  showGrammarCoachForAttempt(state.transcript);
  els.timer.textContent = formatDuration(attempt.metrics.duration || 0);
  els.statusText.textContent = "Previous practice restored";
}

function buildAttemptSnapshot(attempt) {
  const transcript = sanitizeTranscript(attempt.transcript || "");
  const words = transcript.match(/\b[\w']+\b/g) || [];
  const avgEnergy = attempt.metrics.avgEnergy || 12;
  const energyStability = attempt.metrics.energyStability || 72;
  const content = analyzeContent(transcript, avgEnergy, energyStability);
  const balance = analyzeWordBalance(transcript, words, content.matchedKeywords);

  return {
    confidence: attempt.metrics.confidence || 0,
    pace: attempt.metrics.pace || 0,
    clarity: attempt.metrics.clarity || 0,
    fillers: countFillers(transcript),
    wordCount: attempt.metrics.words || words.length,
    durationSeconds: attempt.metrics.duration || 0,
    avgEnergy,
    energyStability,
    content,
    balance
  };
}

function paintResult(result, feedback) {
  const paceQuality = Math.round(scoreRange(result.pace, 115, 155, 70));

  els.paceScore.textContent = result.wordCount ? `${result.pace} wpm` : "-- wpm";
  els.paceLabel.textContent = labelPace(result.pace, result.wordCount);
  els.energyScore.textContent = `${Math.round(Math.min(100, result.avgEnergy * 4))}%`;
  els.energyLabel.textContent = labelEnergy(result.avgEnergy, result.energyStability);
  els.clarityScore.textContent = `${result.clarity}%`;
  els.clarityLabel.textContent = result.fillers ? `${result.fillers} filler words detected` : "Low filler usage";
  els.wbmScore.textContent = result.wordCount ? `${result.balance.score}%` : "--%";
  els.wbmLabel.textContent = result.wordCount ? result.balance.label : "Word balance waiting";
  els.confidenceScore.textContent = `${result.confidence}%`;
  setRingScore(result.confidence);
  els.paceBar.style.width = `${result.wordCount ? paceQuality : 0}%`;
  els.confidenceBar.style.width = `${result.confidence}%`;
  els.clarityBar.style.width = `${result.clarity}%`;
  els.roleBar.style.width = `${result.content.roleRelevance}%`;
  els.wbmBar.style.width = `${result.wordCount ? result.balance.score : 0}%`;
  els.feedbackBadge.textContent = result.confidence >= 78 ? "Strong answer" : result.confidence >= 58 ? "Developing" : "Needs practice";
  els.verdictText.textContent = buildVerdict(result.confidence, result.pace, result.clarity);
  updateEnginePanel(result.content, result.wordCount);
  setFeedback(feedback, els.feedbackBadge.textContent);
  setRecordingUi(false);
}

function showGrammarCoachForAttempt(transcript) {
  const correction = buildLanguageCoach(transcript);
  els.correctionPanel.classList.add("visible");
  els.correctedEnglish.textContent = correction.corrected;
  renderMistakes(correction.mistakes);
  renderKeySuggestions(correction.keys);
}

function buildHistoryEnergySamples(metrics) {
  const energy = metrics.avgEnergy || 12;
  return Array.from({ length: 120 }, (_, index) => energy + Math.sin(index / 7) * 1.5);
}

function findRoleKeyByName(roleName) {
  return Object.keys(roleBank).find((key) => {
    const option = [...els.roleSelect.options].find((item) => item.value === key);
    return option && option.text === roleName;
  });
}

function updateRoleCopyOnly() {
  const role = getActiveRole();
  els.roleSummary.textContent = role.summary;
  els.coachTitle.textContent = role.title;
  els.coachSummary.textContent = role.summary;
  renderKeywordCloud([]);
}

function generatePracticeReport(id) {
  const attempt = state.practiceHistory.find((item) => item.id === id);
  if (!attempt) {
    setFeedback(["Select one saved practice first, then click Generate Professional PDF Report."], "Report needed");
    return;
  }

  const snapshot = buildAttemptSnapshot(attempt);
  const correction = buildLanguageCoach(attempt.transcript || "");
  const reportWindow = window.open("", "_blank", "width=980,height=1200");
  if (!reportWindow) {
    setFeedback(["The browser blocked the report popup. Allow popups for this page, then try Generate Professional PDF Report again."], "Popup blocked");
    return;
  }

  const reportDate = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(attempt.createdAt));
  const feedback = attempt.feedback && attempt.feedback.length ? attempt.feedback : buildFeedback(snapshot);
  const matchedKeywords = snapshot.content.matchedKeywords.length ? snapshot.content.matchedKeywords.join(", ") : "No strong role keywords detected";
  const safeFileName = `Interview-Practice-Report-${formatReportDateForFile(attempt.createdAt)}`;

  reportWindow.document.write(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>${safeFileName}</title>
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            background: #e5edf7;
            color: #111827;
            font-family: "Segoe UI", Arial, sans-serif;
          }
          .page {
            width: 210mm;
            min-height: 297mm;
            margin: 18px auto;
            padding: 28px;
            background: #ffffff;
            box-shadow: 0 18px 60px rgba(15, 23, 42, 0.18);
          }
          .hero {
            padding: 24px;
            border-radius: 22px;
            background: linear-gradient(135deg, #0f172a, #1d4ed8 54%, #0f766e);
            color: #ffffff;
          }
          .eyebrow {
            margin: 0 0 7px;
            color: #bae6fd;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 0.16em;
            text-transform: uppercase;
          }
          h1, h2, h3, p { margin-top: 0; }
          h1 { margin-bottom: 8px; font-size: 30px; }
          .hero p { margin-bottom: 0; color: #dbeafe; line-height: 1.55; }
          .meta {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin: 18px 0;
          }
          .box, .metric, .section {
            border: 1px solid #d8e2f0;
            border-radius: 16px;
            background: #f8fbff;
          }
          .box { padding: 14px; }
          .box span, .metric span {
            display: block;
            color: #64748b;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }
          .box strong { display: block; margin-top: 6px; font-size: 14px; line-height: 1.35; }
          .metrics {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 10px;
            margin-bottom: 18px;
          }
          .metric { padding: 16px 12px; text-align: center; }
          .metric strong { display: block; margin-top: 8px; color: #0f172a; font-size: 24px; }
          .score-high strong { color: #047857; }
          .score-mid strong { color: #b45309; }
          .score-low strong { color: #b91c1c; }
          .section {
            margin-top: 16px;
            padding: 18px;
          }
          .section h2 {
            margin-bottom: 10px;
            color: #0f172a;
            font-size: 18px;
          }
          ul { margin: 0; padding-left: 20px; line-height: 1.55; }
          li { margin-bottom: 7px; }
          .transcript, .corrected {
            padding: 14px;
            border-radius: 12px;
            background: #ffffff;
            color: #334155;
            line-height: 1.65;
            white-space: pre-wrap;
          }
          .corrected {
            border-left: 5px solid #0ea5e9;
          }
          .signature {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            margin-top: 22px;
            padding-top: 14px;
            border-top: 1px solid #d8e2f0;
            color: #64748b;
            font-size: 12px;
          }
          .print-tip {
            position: sticky;
            top: 0;
            z-index: 5;
            padding: 10px;
            background: #0f172a;
            color: #ffffff;
            text-align: center;
          }
          .print-tip button {
            margin-left: 12px;
            padding: 8px 14px;
            border: 0;
            border-radius: 999px;
            background: #22c55e;
            color: #052e16;
            font-weight: 900;
            cursor: pointer;
          }
          @page { size: A4; margin: 12mm; }
          @media print {
            body { background: #ffffff; }
            .page { width: auto; min-height: auto; margin: 0; padding: 0; box-shadow: none; }
            .print-tip { display: none; }
            .section { break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="print-tip">Professional report ready. Click Print, then choose “Save as PDF”. <button onclick="window.print()">Print / Save PDF</button></div>
        <main class="page">
          <section class="hero">
            <p class="eyebrow">AI Virtual Interview Booth</p>
            <h1>Practice Performance Report</h1>
            <p>${escapeHtml(snapshot.confidence >= 78 ? "Interview-ready performance with strong communication signals." : snapshot.confidence >= 58 ? "Good foundation with clear next improvement areas." : "Needs more rehearsal before final placement rounds.")}</p>
          </section>

          <section class="meta">
            <div class="box"><span>Candidate</span><strong>Udhayanithi</strong></div>
            <div class="box"><span>Role Mode</span><strong>${escapeHtml(attempt.roleName)}</strong></div>
            <div class="box"><span>Practice Date</span><strong>${escapeHtml(reportDate)}</strong></div>
          </section>

          <section class="section">
            <h2>Interview Question</h2>
            <p>${escapeHtml(attempt.question)}</p>
          </section>

          <section class="metrics">
            <div class="metric ${scoreClass(snapshot.confidence)}"><span>Confidence</span><strong>${snapshot.confidence}%</strong></div>
            <div class="metric"><span>Pace</span><strong>${snapshot.pace || "--"}</strong></div>
            <div class="metric ${scoreClass(snapshot.clarity)}"><span>Clarity</span><strong>${snapshot.clarity}%</strong></div>
            <div class="metric ${scoreClass(snapshot.balance.score)}"><span>WBM</span><strong>${snapshot.balance.score}%</strong></div>
            <div class="metric"><span>Words</span><strong>${snapshot.wordCount}</strong></div>
          </section>

          <section class="section">
            <h2>AI Verdict</h2>
            <p>${escapeHtml(buildVerdict(snapshot.confidence, snapshot.pace, snapshot.clarity))}</p>
            <p><strong>Role keywords found:</strong> ${escapeHtml(matchedKeywords)}</p>
            <p><strong>STAR structure:</strong> ${escapeHtml(labelStructure(snapshot.content.detectedStructure))}</p>
          </section>

          <section class="section">
            <h2>Feedback Points</h2>
            <ul>${feedback.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          </section>

          <section class="section">
            <h2>Grammar Mistakes Pointed Out</h2>
            <ul>${correction.mistakes.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          </section>

          <section class="section">
            <h2>Corrected English Version</h2>
            <div class="corrected">${escapeHtml(correction.corrected)}</div>
          </section>

          <section class="section">
            <h2>Original Transcript</h2>
            <div class="transcript">${escapeHtml(attempt.transcript || "No transcript captured.")}</div>
          </section>

          <section class="section">
            <h2>Recommended Keywords for Next Attempt</h2>
            <p>${correction.keys.map(escapeHtml).join(" • ")}</p>
          </section>

          <div class="signature">
            <span>Generated by AI Virtual Interview Booth</span>
            <span>${escapeHtml(safeFileName)}</span>
          </div>
        </main>
      </body>
    </html>
  `);
  reportWindow.document.close();
  reportWindow.focus();
  setTimeout(() => reportWindow.print(), 400);
}

function scoreClass(score) {
  if (score >= 78) return "score-high";
  if (score >= 58) return "score-mid";
  return "score-low";
}

function formatReportDateForFile(timestamp) {
  const date = new Date(timestamp);
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
    String(date.getHours()).padStart(2, "0"),
    String(date.getMinutes()).padStart(2, "0")
  ].join("-");
}

function formatHistoryDate(timestamp) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(timestamp));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function stopTracks() {
  if (state.stream) {
    state.stream.getTracks().forEach((track) => track.stop());
    state.stream = null;
  }
  if (state.audioContext) {
    state.audioContext.close();
    state.audioContext = null;
  }
  els.camera.srcObject = null;
  els.cameraPlaceholder.classList.remove("hidden");
}

function stopRecognition() {
  if (state.recognition) {
    state.recognition.stop();
    state.recognition = null;
  }
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

init();
