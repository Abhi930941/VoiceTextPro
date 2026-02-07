# 🎙️VoiceText Pro

**VoiceText Pro** is an AI-powered speech-to-text web application that converts real-time voice input into accurate text transcripts. It eliminates manual typing for meetings, interviews, lectures, and content creation, increasing productivity by up to 3x through intelligent voice recognition and automated transcription.

---

## Project Overview

**Project Type:** Frontend Web Application  

**Problem Statement:** Manual note-taking during meetings, lectures, and interviews is time-consuming, prone to errors, and often results in incomplete documentation.

**Solution:** VoiceText Pro solves this by providing instant, accurate transcription with multi-language support and professional export capabilities.

---

## Tech Stack

### Frontend:
- **HTML5** - Semantic structure and layout
- **CSS3** - Advanced styling with animations and responsive design
- **JavaScript** - Core application logic 

### APIs & Libraries:
- **Web Speech API** - Real-time voice recognition
- **Web Audio API** - Audio visualization and processing
- **jsPDF** - PDF generation for professional exports
- **Font Awesome** - Icon library
  
---

## Key Features

- **Real-time Transcription** – Converts speech to text instantly using the Web Speech API  
- **Hindi & English Support** – Easy language switching for bilingual transcription  
- **Voice Commands** – Hands-free punctuation and basic text formatting  
- **Live Audio Visualization** – Real-time waveform display during recording  
- **Pause & Resume** – Control transcription flow without losing content  
- **Dark Mode** – Comfortable interface for long usage sessions  
- **Export Options** – Download transcripts in TXT or PDF format  
- **Auto-save** – Prevents data loss using browser local storage  
- **Text Analytics** – Displays word count and recording duration   
---

## Application Architecture
```
User Interface (HTML/CSS)
         ↓
   Event Listeners (JavaScript)
         ↓
   Web Speech API (Browser)
         ↓
   Audio Processing & Recognition
         ↓
   Real-time Transcript Display
         ↓
   Export Engine (TXT/PDF)
         ↓
   LocalStorage (Auto-save)
```

### Data Flow
1. User grants microphone permission
2. Web Speech API captures audio input
3. Browser processes speech recognition
4. JavaScript receives transcribed text
5. Text displayed in real-time with formatting
6. Auto-save to LocalStorage every 5 seconds
7. User exports to desired format (TXT/PDF)

---

## Usage Guide

### Getting Started
1. Open the application in your browser
2. Navigate to the "Transcribe" section
3. Select your preferred language (Hindi/English)
4. Enable desired features (Noise Reduction, Auto-punctuation)
5. Click "Start" and allow microphone access
6. Begin speaking clearly

### Voice Commands
- **Punctuation:** "comma", "period", "question mark", "exclamation"
- **Formatting:** "new line", "new paragraph", "bullet point"
- **Brackets:** "open bracket", "close bracket", "quote"

### Export Options
- **Copy:** Click "Copy" to copy transcript to clipboard
- **Save TXT:** Download as plain text file
- **Save PDF:** Generate professionally formatted PDF

---

## Project Structure
```
voicetext-pro/
│
├── index.html          # Main HTML structure
├── style.css           # Styling and animations
├── app.js              # Core application logic
└── README.md           # Project documentation
```

---

## Demo & Links

**Live Demo:** https://abhi930941.github.io/VoiceTextPro/ 
**GitHub Repository:** https://github.com/Abhi930941/VoiceTextPro

---

## Why This Project Matters

VoiceText Pro focuses on solving a real productivity problem—manual note-taking during meetings, lectures, and interviews.  
By using modern browser APIs, it provides a fast and accessible way to convert speech into editable text without requiring any backend or paid services.

---

## Contact & Support

**Developer:** Abhishek Sahani  
**LinkedIn:** https://www.linkedin.com/in/abhishek-sahani-447851341  
**Email:** abhishek242443@gmail.com      
**Portfolio** https://abhi930941.github.io/Portfolio/

---
