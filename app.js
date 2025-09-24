// Enhanced Speech-to-Text Application - VoiceText Pro
class SpeechToTextPro {
    constructor() {
        this.recognition = null;
        this.isRecognizing = false;
        this.isPaused = false;
        this.finalTranscript = "";
        this.sessionStartTime = null;
        this.wordCount = 0;
        this.charCount = 0;
        this.confidenceSum = 0;
        this.confidenceCount = 0;
        this.speechRate = 0;
        this.timerInterval = null;
        this.animationFrame = null;
        this.audioContext = null;
        this.analyser = null;
        this.microphone = null;
        this.dataArray = null;
        this.wasAutoPaused = false;
        
        this.initializeElements();
        this.initializeEventListeners();
        this.initializeVoiceVisualization();
        this.loadSettings();
        this.animateStats();
        this.setupScrollAnimations();
        this.initializeFAQ();
        
        console.log('VoiceText Pro v3.0 initialized successfully 🎙️');
    }

    initializeElements() {
        try {
            // Navigation
            this.navLinks = document.querySelectorAll('.nav-link');
            this.pages = document.querySelectorAll('.page');
            this.hamburger = document.querySelector('.hamburger');
            this.navMenu = document.querySelector('.nav-menu');

            // Transcription controls
            this.startBtn = document.getElementById('startBtn');
            this.stopBtn = document.getElementById('stopBtn');
            this.pauseBtn = document.getElementById('pauseBtn');
            this.resumeBtn = document.getElementById('resumeBtn');
            this.transcriptArea = document.getElementById('transcript');
            this.languageSel = document.getElementById('language');
            this.statusEl = document.getElementById('status');

            // Action buttons
            this.copyBtn = document.getElementById('copyBtn');
            this.saveTxtBtn = document.getElementById('saveTxtBtn');
            this.saveDocxBtn = document.getElementById('saveDocxBtn');
            this.savePdfBtn = document.getElementById('savePdfBtn');
            this.shareBtn = document.getElementById('shareBtn');
            this.clearBtn = document.getElementById('clearBtn');
            this.formatBtn = document.getElementById('formatBtn');
            this.fullscreenBtn = document.getElementById('fullscreenBtn');

            // Settings and toggles
            this.noiseToggle = document.getElementById('noiseToggle');
            this.autoSave = document.getElementById('autoSave');
            this.darkMode = document.getElementById('darkMode');
            this.autoPunctuation = document.getElementById('autoPunctuation');

            // Analytics elements
            this.wordCountEl = document.getElementById('wordCount');
            this.charCountEl = document.getElementById('charCount');
            this.confidenceFill = document.getElementById('confidenceFill');
            this.confidenceText = document.getElementById('confidenceText');
            this.recordingTime = document.getElementById('recordingTime');
            this.timeSavedEl = document.getElementById('timeSaved');

            // Voice visualization
            this.voiceCanvas = document.getElementById('voiceCanvas');
            this.canvasCtx = this.voiceCanvas?.getContext('2d');

            // Status indicators
            this.statusDot = document.querySelector('.status-dot');
            this.recordingDot = document.querySelector('.recording-dot');

            // FAQ elements
            this.faqItems = document.querySelectorAll('.faq-item');
            
        } catch (error) {
            console.warn('Some elements not found during initialization:', error.message);
        }
    }

    initializeEventListeners() {
        // Navigation
        if (this.navLinks) {
            this.navLinks.forEach(link => {
                link.addEventListener('click', (e) => this.handleNavigation(e));
            });
        }

        if (this.hamburger && this.navMenu) {
            this.hamburger.addEventListener('click', () => {
                this.navMenu.classList.toggle('active');
                this.hamburger.classList.toggle('active');
            });
            
            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.hamburger.contains(e.target) && !this.navMenu.contains(e.target)) {
                    this.navMenu.classList.remove('active');
                    this.hamburger.classList.remove('active');
                }
            });
        }

        // Transcription controls
        if (this.startBtn) this.startBtn.addEventListener('click', () => this.startRecognition());
        if (this.stopBtn) this.stopBtn.addEventListener('click', () => this.stopRecognition());
        if (this.pauseBtn) this.pauseBtn.addEventListener('click', () => this.pauseRecognition());
        if (this.resumeBtn) this.resumeBtn.addEventListener('click', () => this.resumeRecognition());

        // Action buttons
        if (this.copyBtn) this.copyBtn.addEventListener('click', () => this.copyTranscript());
        if (this.saveTxtBtn) this.saveTxtBtn.addEventListener('click', () => this.saveAsText());
        if (this.saveDocxBtn) this.saveDocxBtn.addEventListener('click', () => this.saveAsDocx());
        if (this.savePdfBtn) this.savePdfBtn.addEventListener('click', () => this.saveAsPdf());
        if (this.shareBtn) this.shareBtn.addEventListener('click', () => this.shareTranscript());
        if (this.clearBtn) this.clearBtn.addEventListener('click', () => this.clearTranscript());
        if (this.formatBtn) this.formatBtn.addEventListener('click', () => this.formatText());
        if (this.fullscreenBtn) this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());

        // Settings
        if (this.languageSel) this.languageSel.addEventListener('change', () => this.updateLanguage());
        if (this.noiseToggle) this.noiseToggle.addEventListener('change', () => this.toggleNoiseReduction());
        if (this.autoSave) this.autoSave.addEventListener('change', () => this.toggleAutoSave());
        if (this.darkMode) this.darkMode.addEventListener('change', () => this.toggleDarkMode());
        if (this.autoPunctuation) this.autoPunctuation.addEventListener('change', () => this.toggleAutoPunctuation());

        // Real-time updates
        if (this.transcriptArea) {
            this.transcriptArea.addEventListener('input', () => this.updateCounts());
        }

        // Feature page mode toggles
        const modeButtons = document.querySelectorAll('.mode-btn');
        const modeContents = document.querySelectorAll('.mode-content');
        
        modeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const mode = button.dataset.mode;
                
                // Update button states
                modeButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Update content visibility
                modeContents.forEach(content => {
                    content.classList.remove('active');
                });
                const targetContent = document.getElementById(mode + '-features');
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });

        // Fullscreen change event
        document.addEventListener('fullscreenchange', () => {
            if (this.fullscreenBtn) {
                const icon = document.fullscreenElement ? 'fa-compress' : 'fa-expand';
                this.fullscreenBtn.innerHTML = `<i class="fas ${icon}"></i>`;
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Handle orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                if (this.voiceCanvas) {
                    this.initializeVoiceVisualization();
                }
            }, 100);
        });

        // Handle visibility changes to pause/resume appropriately
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                if (this.isRecognizing && !this.isPaused) {
                    this.pauseRecognition();
                    this.wasAutoPaused = true;
                }
            } else if (document.visibilityState === 'visible') {
                if (this.wasAutoPaused && this.isPaused) {
                    this.resumeRecognition();
                    this.wasAutoPaused = false;
                }
            }
        });

        // Add copy functionality to command tags
        document.querySelectorAll('.command-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                const command = tag.textContent.replace(/"/g, '');
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(command).then(() => {
                        this.showFeedback(tag, 'Copied!', 'success');
                    }).catch(() => {
                        console.warn('Failed to copy command');
                    });
                }
            });
        });
    }

    initializeFAQ() {
        if (this.faqItems) {
            this.faqItems.forEach(item => {
                const question = item.querySelector('.faq-question');
                if (question) {
                    question.addEventListener('click', () => {
                        // Close other FAQ items
                        this.faqItems.forEach(otherItem => {
                            if (otherItem !== item) {
                                otherItem.classList.remove('active');
                            }
                        });
                        // Toggle current FAQ item
                        item.classList.toggle('active');
                    });
                }
            });
        }
    }

    initializeVoiceVisualization() {
        if (!this.voiceCanvas) return;
        
        // Set canvas size based on container
        const container = this.voiceCanvas.parentElement;
        if (container) {
            this.voiceCanvas.width = container.offsetWidth || 300;
            this.voiceCanvas.height = 100;
        } else {
            this.voiceCanvas.width = 300;
            this.voiceCanvas.height = 100;
        }
    }

    setupScrollAnimations() {
        // Only setup if Intersection Observer is supported
        if (!('IntersectionObserver' in window)) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe feature cards and other elements
        document.querySelectorAll('.feature-card').forEach(card => {
            observer.observe(card);
        });
    }

    animateStats() {
        // Animate the statistics on the home page
        const statElements = [
            { id: 'stat-languages', finalValue: 2, suffix: '+' },
            { id: 'stat-accuracy', finalValue: 99, suffix: '%' }
        ];

        statElements.forEach(stat => {
            const element = document.getElementById(stat.id);
            if (!element) return;

            let current = 0;
            const duration = 2500;
            const increment = stat.finalValue / (duration / 16);
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= stat.finalValue) {
                    element.textContent = stat.finalValue + stat.suffix;
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(current) + stat.suffix;
                }
            }, 16);
        });
    }

    handleNavigation(e) {
        e.preventDefault();
        const target = e.target.closest('.nav-link');
        if (!target) return;
        
        const page = target.dataset.page;
        if (!page) return;
        
        // Hide all pages
        if (this.pages) {
            this.pages.forEach(p => p.classList.remove('visible'));
        }
        
        // Show selected page
        const targetPage = document.getElementById(`page-${page}`);
        if (targetPage) {
            targetPage.classList.add('visible');
        }

        // Update nav active states
        if (this.navLinks) {
            this.navLinks.forEach(l => l.classList.remove('active'));
            target.classList.add('active');
        }

        // Close mobile menu
        if (this.navMenu && this.hamburger) {
            this.navMenu.classList.remove('active');
            this.hamburger.classList.remove('active');
        }

        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    handleKeyboardShortcuts(e) {
        // Only handle shortcuts if not typing in text areas
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        // Ctrl+Alt+S to start/stop recording
        if (e.ctrlKey && e.altKey && e.key === 's') {
            e.preventDefault();
            if (this.isRecognizing) {
                this.stopRecognition();
            } else {
                this.startRecognition();
            }
        }
        
        // Ctrl+Alt+P to pause/resume recording
        if (e.ctrlKey && e.altKey && e.key === 'p') {
            e.preventDefault();
            if (this.isRecognizing && !this.isPaused) {
                this.pauseRecognition();
            } else if (this.isPaused) {
                this.resumeRecognition();
            }
        }
        
        // Ctrl+Alt+C to clear transcript
        if (e.ctrlKey && e.altKey && e.key === 'c') {
            e.preventDefault();
            this.clearTranscript();
        }

        // Escape key to close mobile menu
        if (e.key === 'Escape') {
            if (this.navMenu && this.navMenu.classList.contains('active')) {
                this.navMenu.classList.remove('active');
                this.hamburger.classList.remove('active');
            }
        }
    }

    createRecognition() {
        if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
            this.updateStatus("⚠️ Speech Recognition not supported. Use Chrome/Edge.", 'error');
            if (this.startBtn) this.startBtn.disabled = true;
            return null;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = this.languageSel?.value || 'hi-IN';
        recognition.interimResults = true;
        recognition.continuous = true;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => this.handleRecognitionStart();
        recognition.onerror = (event) => this.handleRecognitionError(event);
        recognition.onend = () => this.handleRecognitionEnd();
        recognition.onresult = (event) => this.handleRecognitionResult(event);

        return recognition;
    }

    handleRecognitionStart() {
        this.isRecognizing = true;
        this.isPaused = false;
        this.sessionStartTime = Date.now();
        
        this.updateStatus("🎙️ Listening... Speak now!", 'recording');
        this.updateControlStates();
        this.startTimer();
        this.setupAudioVisualization();
    }

    handleRecognitionError(event) {
        let message = "⚠️ ";
        switch(event.error) {
            case "not-allowed":
                message += "Microphone access denied. Please allow microphone access.";
                break;
            case "no-speech":
                message += "No speech detected. Please try speaking clearly.";
                break;
            case "network":
                message += "Network error. Please check your internet connection.";
                break;
            case "service-not-allowed":
                message += "Speech recognition service not allowed.";
                break;
            case "bad-grammar":
                message += "Grammar error in recognition.";
                break;
            default:
                message += `Recognition error: ${event.error}`;
        }
        
        this.updateStatus(message, 'error');
        this.resetControlStates();
        console.error('Speech recognition error:', event);
    }

    handleRecognitionEnd() {
        this.isRecognizing = false;
        if (!this.isPaused) {
            this.updateStatus("🛑 Recognition stopped.", 'idle');
            this.resetControlStates();
        }
        this.stopTimer();
        this.stopAudioVisualization();
    }

    handleRecognitionResult(event) {
        let interim = "";
        
        try {
            for (let i = event.resultIndex; i < event.results.length; i++) {
                let speech = this.replaceCommands(event.results[i][0].transcript);
                let confidence = event.results[i][0].confidence || 0.8;
                
                if (event.results[i].isFinal) {
                    this.finalTranscript += speech + " ";
                    this.confidenceSum += confidence;
                    this.confidenceCount++;
                } else {
                    interim += speech;
                }
            }
            
            if (this.transcriptArea) {
                this.transcriptArea.value = this.finalTranscript + interim;
                this.transcriptArea.scrollTop = this.transcriptArea.scrollHeight;
            }
            
            this.updateCounts();
            this.updateConfidence();
            
            if (this.autoSave?.checked) {
                this.autoSaveTranscript();
            }
        } catch (error) {
            console.error('Error processing recognition result:', error);
        }
    }

    replaceCommands(text) {
        if (!this.autoPunctuation?.checked) return text;
        
        return text
            .replace(/\bcomma\b/gi, ",")
            .replace(/\bfull stop\b|\bperiod\b/gi, ".")
            .replace(/\bquestion mark\b/gi, "?")
            .replace(/\bexclamation mark\b|\bexclamation\b/gi, "!")
            .replace(/\bnew line\b/gi, "\n")
            .replace(/\bnew paragraph\b/gi, "\n\n")
            .replace(/\bheading\b/gi, "\n\n# ")
            .replace(/\bbullet point\b/gi, "\n• ")
            .replace(/\bcolon\b/gi, ":")
            .replace(/\bsemicolon\b/gi, ";")
            .replace(/\bopen bracket\b/gi, "(")
            .replace(/\bclose bracket\b/gi, ")")
            .replace(/\bquote\b/gi, '"')
            .replace(/\bdash\b/gi, "-")
            .replace(/\bindent\b/gi, "\t")
            .replace(/\bcapital\s+([a-z])/gi, (match, letter) => letter.toUpperCase());
    }

    startRecognition() {
        try {
            this.finalTranscript = this.transcriptArea?.value || "";
            this.recognition = this.createRecognition();
            if (this.recognition) {
                this.recognition.start();
            }
        } catch (error) {
            this.updateStatus("⚠️ Error starting recognition. Please try again.", 'error');
            console.error('Error starting recognition:', error);
        }
    }

    stopRecognition() {
        try {
            if (this.recognition) {
                this.recognition.stop();
            }
            this.updateAnalytics();
        } catch (error) {
            console.error('Error stopping recognition:', error);
        }
    }

    pauseRecognition() {
        try {
            this.isPaused = true;
            if (this.recognition) {
                this.recognition.stop();
            }
            this.updateStatus("⏸ Paused. Click Resume to continue.", 'paused');
            if (this.pauseBtn) this.pauseBtn.disabled = true;
            if (this.resumeBtn) this.resumeBtn.disabled = false;
        } catch (error) {
            console.error('Error pausing recognition:', error);
        }
    }

    resumeRecognition() {
        try {
            this.recognition = this.createRecognition();
            if (this.recognition) {
                this.recognition.start();
            }
            if (this.resumeBtn) this.resumeBtn.disabled = true;
            if (this.pauseBtn) this.pauseBtn.disabled = false;
        } catch (error) {
            this.updateStatus("⚠️ Error resuming recognition. Please try again.", 'error');
            console.error('Error resuming recognition:', error);
        }
    }

    updateControlStates() {
        if (this.startBtn) this.startBtn.disabled = true;
        if (this.stopBtn) this.stopBtn.disabled = false;
        if (this.pauseBtn) this.pauseBtn.disabled = false;
        if (this.resumeBtn) this.resumeBtn.disabled = true;
    }

    resetControlStates() {
        if (this.startBtn) this.startBtn.disabled = false;
        if (this.stopBtn) this.stopBtn.disabled = true;
        if (this.pauseBtn) this.pauseBtn.disabled = true;
        if (this.resumeBtn) this.resumeBtn.disabled = true;
    }

    updateStatus(message, type = 'idle') {
        if (this.statusEl) {
            this.statusEl.textContent = message;
            
            // Update status indicator
            if (this.statusDot) {
                this.statusDot.className = 'status-dot';
                if (type === 'recording') {
                    this.statusDot.classList.add('recording');
                } else if (type === 'paused') {
                    this.statusDot.classList.add('paused');
                } else if (type === 'error') {
                    this.statusDot.classList.add('error');
                }
            }
        }
    }

    updateCounts() {
        const text = this.transcriptArea?.value || '';
        this.wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
        this.charCount = text.length;
        
        if (this.wordCountEl) this.wordCountEl.textContent = this.wordCount;
        if (this.charCountEl) this.charCountEl.textContent = this.charCount;
        
        // Calculate time saved (assuming 40 WPM typing speed)
        const timeSavedMinutes = this.wordCount / 40;
        const hours = Math.floor(timeSavedMinutes / 60);
        const minutes = Math.floor(timeSavedMinutes % 60);
        
        if (this.timeSavedEl) {
            this.timeSavedEl.textContent = `Time saved: ${hours}h ${minutes}m`;
        }
    }

    updateConfidence() {
        if (this.confidenceCount > 0) {
            const avgConfidence = (this.confidenceSum / this.confidenceCount) * 100;
            if (this.confidenceFill) {
                this.confidenceFill.style.width = `${avgConfidence}%`;
                
                // Change color based on confidence level
                if (avgConfidence >= 90) {
                    this.confidenceFill.style.background = 'var(--success-color)';
                } else if (avgConfidence >= 70) {
                    this.confidenceFill.style.background = 'var(--warning-color)';
                } else {
                    this.confidenceFill.style.background = 'var(--error-color)';
                }
            }
            if (this.confidenceText) {
                this.confidenceText.textContent = `${Math.round(avgConfidence)}%`;
            }
        }
    }

    startTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        this.timerInterval = setInterval(() => {
            if (this.sessionStartTime && this.recordingTime) {
                const elapsed = Date.now() - this.sessionStartTime;
                const minutes = Math.floor(elapsed / 60000);
                const seconds = Math.floor((elapsed % 60000) / 1000);
                this.recordingTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                
                // Update recording dot animation
                if (this.recordingDot) {
                    this.recordingDot.classList.add('recording');
                }
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        // Remove recording dot animation
        if (this.recordingDot) {
            this.recordingDot.classList.remove('recording');
        }
    }

    setupAudioVisualization() {
        if (!this.voiceCanvas || !navigator.mediaDevices) return;
        
        navigator.mediaDevices.getUserMedia({ 
            audio: {
                echoCancellation: true,
                noiseSuppression: this.noiseToggle?.checked || false,
                autoGainControl: true
            }
        })
        .then(stream => {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.analyser = this.audioContext.createAnalyser();
                this.microphone = this.audioContext.createMediaStreamSource(stream);
                this.microphone.connect(this.analyser);
                
                this.analyser.fftSize = 256;
                this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
                
                this.drawVisualization();
            } catch (audioError) {
                console.warn('Audio context error:', audioError);
            }
        })
        .catch(err => {
            console.warn('Audio visualization error:', err);
        });
    }

    drawVisualization() {
        if (!this.canvasCtx || !this.analyser || !this.voiceCanvas) return;
        
        this.animationFrame = requestAnimationFrame(() => this.drawVisualization());
        
        this.analyser.getByteFrequencyData(this.dataArray);
        
        this.canvasCtx.clearRect(0, 0, this.voiceCanvas.width, this.voiceCanvas.height);
        
        const barWidth = (this.voiceCanvas.width / this.dataArray.length) * 2.5;
        let x = 0;
        
        for (let i = 0; i < this.dataArray.length; i++) {
            const barHeight = (this.dataArray[i] / 255) * this.voiceCanvas.height;
            
            const gradient = this.canvasCtx.createLinearGradient(0, 0, 0, this.voiceCanvas.height);
            gradient.addColorStop(0, '#1e3a8a');
            gradient.addColorStop(0.5, '#3b82f6');
            gradient.addColorStop(1, '#1e40af');
            
            this.canvasCtx.fillStyle = gradient;
            this.canvasCtx.fillRect(x, this.voiceCanvas.height - barHeight, barWidth, barHeight);
            
            x += barWidth + 1;
        }
    }

    stopAudioVisualization() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close();
            this.audioContext = null;
        }
        if (this.canvasCtx && this.voiceCanvas) {
            this.canvasCtx.clearRect(0, 0, this.voiceCanvas.width, this.voiceCanvas.height);
        }
    }

    updateLanguage() {
        if (this.recognition) {
            this.recognition.lang = this.languageSel.value;
        }
        const selectedOption = this.languageSel.options[this.languageSel.selectedIndex];
        this.updateStatus(`🌍 Language changed to ${selectedOption.text}`, 'info');
        this.saveSettings();
    }

    toggleNoiseReduction() {
        const enabled = this.noiseToggle?.checked;
        this.updateStatus(enabled ? "🧹 Noise Reduction: Enabled" : "🧹 Noise Reduction: Disabled", 'info');
        this.saveSettings();
    }

    toggleAutoSave() {
        const enabled = this.autoSave?.checked;
        this.updateStatus(enabled ? "💾 Auto Save: Enabled" : "💾 Auto Save: Disabled", 'info');
        this.saveSettings();
        
        if (enabled) {
            this.autoSaveTranscript();
        }
    }

    toggleAutoPunctuation() {
        const enabled = this.autoPunctuation?.checked;
        this.updateStatus(enabled ? "🔤 Voice Punctuation: Enabled" : "🔤 Voice Punctuation: Disabled", 'info');
        this.saveSettings();
    }

    toggleDarkMode() {
        const enabled = this.darkMode?.checked;
        document.body.classList.toggle('dark-theme', enabled);
        this.updateStatus(enabled ? "🌙 Dark mode enabled" : "☀️ Light mode enabled", 'info');
        this.saveSettings();
    }

    copyTranscript() {
        const text = this.transcriptArea?.value;
        if (!text) {
            this.updateStatus("⚠️ No text to copy.", 'error');
            return;
        }
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    this.updateStatus("📋 Copied to clipboard!", 'success');
                    this.showFeedback(this.copyBtn, 'Copied!', 'success');
                })
                .catch(() => this.updateStatus("⚠️ Copy failed.", 'error'));
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                this.updateStatus("📋 Copied to clipboard!", 'success');
                this.showFeedback(this.copyBtn, 'Copied!', 'success');
            } catch (err) {
                this.updateStatus("⚠️ Copy failed.", 'error');
            }
            document.body.removeChild(textArea);
        }
    }

    saveAsText() {
        const text = this.transcriptArea?.value || '';
        if (!text) {
            this.updateStatus("⚠️ No text to save.", 'error');
            return;
        }
        
        try {
            const timestamp = new Date().toISOString().slice(0, 16).replace('T', '_');
            const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
            this.downloadFile(blob, `VoiceText_Pro_${timestamp}.txt`);
            this.updateStatus("💾 Saved as .txt file.", 'success');
        } catch (error) {
            this.updateStatus("⚠️ Save failed.", 'error');
            console.error('Save as text error:', error);
        }
    }

    async saveAsDocx() {
        try {
            const text = this.transcriptArea?.value || '';
            if (!text) {
                this.updateStatus("⚠️ No text to save.", 'error');
                return;
            }
            
            if (typeof window.docx === 'undefined') {
                this.updateStatus("⚠️ DOCX library not loaded.", 'error');
                return;
            }

            const { Document, Packer, Paragraph, TextRun, HeadingLevel } = window.docx;
            const timestamp = new Date().toISOString().slice(0, 16).replace('T', '_');
            
            const paragraphs = text.split('\n').map(line => {
                if (line.startsWith('# ')) {
                    return new Paragraph({
                        text: line.substring(2),
                        heading: HeadingLevel.HEADING_1,
                    });
                } else if (line.startsWith('• ')) {
                    return new Paragraph({
                        text: line.substring(2),
                        bullet: {
                            level: 0
                        }
                    });
                } else {
                    return new Paragraph({
                        children: [new TextRun(line || ' ')],
                    });
                }
            });
            
            const doc = new Document({
                sections: [{
                    properties: {},
                    children: [
                        new Paragraph({
                            text: "VoiceText Pro Transcript",
                            heading: HeadingLevel.TITLE,
                        }),
                        new Paragraph({
                            text: `Generated on: ${new Date().toLocaleString()}`,
                            spacing: { after: 400 }
                        }),
                        ...paragraphs
                    ]
                }]
            });
            
            const blob = await Packer.toBlob(doc);
            this.downloadFile(blob, `VoiceText_Pro_${timestamp}.docx`);
            this.updateStatus("💾 Saved as .docx file.", 'success');
        } catch (error) {
            console.error('DOCX save error:', error);
            this.updateStatus("⚠️ DOCX export failed.", 'error');
        }
    }

    saveAsPdf() {
        try {
            const text = this.transcriptArea?.value || '';
            if (!text) {
                this.updateStatus("⚠️ No text to save.", 'error');
                return;
            }
            
            if (typeof window.jspdf === 'undefined') {
                this.updateStatus("⚠️ PDF library not loaded.", 'error');
                return;
            }

            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF();
            const timestamp = new Date().toISOString().slice(0, 16).replace('T', '_');
            
            // Add title
            pdf.setFontSize(20);
            pdf.text('VoiceText Pro Transcript', 20, 30);
            
            // Add date
            pdf.setFontSize(12);
            pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, 45);
            
            // Add stats
            pdf.text(`Words: ${this.wordCount} | Characters: ${this.charCount}`, 20, 55);
            
            // Add content
            pdf.setFontSize(11);
            const lines = pdf.splitTextToSize(text, 170);
            let yPosition = 70;
            
            for (let i = 0; i < lines.length; i++) {
                if (yPosition > 270) {
                    pdf.addPage();
                    yPosition = 20;
                }
                pdf.text(lines[i], 20, yPosition);
                yPosition += 6;
            }
            
            pdf.save(`VoiceText_Pro_${timestamp}.pdf`);
            this.updateStatus("💾 Saved as .pdf file.", 'success');
        } catch (error) {
            console.error('PDF save error:', error);
            this.updateStatus("⚠️ PDF export failed.", 'error');
        }
    }

    shareTranscript() {
        const text = this.transcriptArea?.value || '';
        if (!text) {
            this.updateStatus("⚠️ No text to share.", 'error');
            return;
        }
        
        if (navigator.share) {
            navigator.share({
                title: "VoiceText Pro Transcript",
                text: text,
            }).then(() => {
                this.updateStatus("🔗 Shared successfully!", 'success');
            }).catch(() => {
                this.copyTranscript();
            });
        } else {
            this.copyTranscript();
            this.updateStatus("📋 Copied to clipboard (share not supported).", 'info');
        }
    }

    clearTranscript() {
        if (confirm('Are you sure you want to clear the transcript? This cannot be undone.')) {
            this.finalTranscript = "";
            if (this.transcriptArea) this.transcriptArea.value = "";
            this.updateCounts();
            this.confidenceSum = 0;
            this.confidenceCount = 0;
            this.updateConfidence();
            this.updateStatus("🗑️ Transcript cleared.", 'info');
        }
    }

    formatText() {
        let text = this.transcriptArea?.value || '';
        if (!text) {
            this.updateStatus("⚠️ No text to format.", 'error');
            return;
        }
        
        try {
            // Basic text formatting
            text = text.replace(/\s+/g, ' '); // Replace multiple spaces with single space
            text = text.replace(/\s+([,.!?])/g, '$1'); // Remove spaces before punctuation
            text = text.replace(/([.!?])\s*([a-z])/g, '$1 $2'); // Ensure space after sentence endings
            text = text.charAt(0).toUpperCase() + text.slice(1); // Capitalize first letter
            
            // Capitalize after sentence endings
            text = text.replace(/([.!?]\s+)([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase());
            
            // Fix common issues
            text = text.replace(/\bi\b/g, 'I'); // Capitalize standalone 'i'
            text = text.replace(/\s+$/g, ''); // Remove trailing spaces
            
            if (this.transcriptArea) {
                this.transcriptArea.value = text;
                this.finalTranscript = text;
            }
            this.updateCounts();
            this.updateStatus("✨ Text formatted successfully!", 'success');
            this.showFeedback(this.formatBtn, '✓', 'success');
        } catch (error) {
            this.updateStatus("⚠️ Formatting failed.", 'error');
            console.error('Format text error:', error);
        }
    }

    toggleFullscreen() {
        const container = this.transcriptArea?.parentElement;
        if (!container) return;
        
        try {
            if (!document.fullscreenElement) {
                if (container.requestFullscreen) {
                    container.requestFullscreen();
                } else if (container.webkitRequestFullscreen) {
                    container.webkitRequestFullscreen();
                } else if (container.msRequestFullscreen) {
                    container.msRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
        } catch (error) {
            console.error('Fullscreen toggle error:', error);
        }
    }

    autoSaveTranscript() {
        if (!this.autoSave?.checked) return;
        
        const text = this.transcriptArea?.value || '';
        if (!text) return;
        
        try {
            localStorage.setItem('voicetext_autosave', text);
        } catch (error) {
            console.warn('Auto save failed:', error);
        }
    }

    loadAutoSaved() {
        try {
            const saved = localStorage.getItem('voicetext_autosave');
            if (saved && this.transcriptArea) {
                this.transcriptArea.value = saved;
                this.finalTranscript = saved;
                this.updateCounts();
                this.updateStatus("💾 Auto-saved content loaded.", 'info');
            }
        } catch (error) {
            console.warn('Auto load failed:', error);
        }
    }

    downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }

    updateAnalytics() {
        if (this.sessionStartTime) {
            const elapsed = Date.now() - this.sessionStartTime;
            const minutes = elapsed / 60000;
            this.speechRate = minutes > 0 ? Math.round(this.wordCount / minutes) : 0;
        }
    }

    showFeedback(element, message, type = 'info') {
        if (!element) return;
        
        const feedback = document.createElement('div');
        feedback.className = `feedback ${type}`;
        feedback.textContent = message;
        
        const rect = element.getBoundingClientRect();
        feedback.style.position = 'fixed';
        feedback.style.left = `${rect.left + window.scrollX}px`;
        feedback.style.top = `${rect.top + window.scrollY - 30}px`;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            feedback.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(feedback);
            }, 300);
        }, 2000);
    }

    saveSettings() {
        try {
            const settings = {
                language: this.languageSel?.value || 'hi-IN',
                noiseReduction: this.noiseToggle?.checked || false,
                autoSave: this.autoSave?.checked || false,
                darkMode: this.darkMode?.checked || false,
                autoPunctuation: this.autoPunctuation?.checked || false
            };
            localStorage.setItem('voicetext_settings', JSON.stringify(settings));
        } catch (error) {
            console.warn('Settings save failed:', error);
        }
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('voicetext_settings');
            if (saved) {
                const settings = JSON.parse(saved);
                
                if (this.languageSel && settings.language) {
                    this.languageSel.value = settings.language;
                }
                if (this.noiseToggle) {
                    this.noiseToggle.checked = settings.noiseReduction;
                }
                if (this.autoSave) {
                    this.autoSave.checked = settings.autoSave;
                }
                if (this.darkMode) {
                    this.darkMode.checked = settings.darkMode;
                    document.body.classList.toggle('dark-theme', settings.darkMode);
                }
                if (this.autoPunctuation) {
                    this.autoPunctuation.checked = settings.autoPunctuation;
                }
            }
        } catch (error) {
            console.warn('Settings load failed:', error);
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.voiceTextApp = new SpeechToTextPro();
});

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}