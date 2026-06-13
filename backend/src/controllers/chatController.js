const db = require('../config/db');

exports.chat = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const user = await db.getUserById(req.user.id);
    const role = user ? user.role : 'student';

    let aiResponseText = '';
    const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

    try {
      let prompt = '';
      if (role === 'teacher') {
        prompt = "You are an intelligent, helpful academic AI teaching assistant named EduSphere AI. Assist the teacher/instructor in grading strategies, drafting assignments, generating lesson plans, analyzing student risk levels, and answering academic questions.\n\n";
      } else {
        prompt = "You are an intelligent, helpful academic AI tutor named EduSphere AI. Answer the user's question clearly and academically.\n\n";
      }

      if (history && Array.isArray(history)) {
        history.forEach(msg => {
          prompt += `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.text}\n`;
        });
      }
      prompt += `User: ${message}\nAssistant:`;

      const response = await fetch(`${OLLAMA_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3',
          prompt: prompt,
          stream: false
        })
      });

      if (response.ok) {
        const result = await response.json();
        aiResponseText = result.response;
      } else {
        throw new Error('Ollama failed');
      }
    } catch (err) {
      console.log('Ollama chat connection failed. Generating responsive fallback.');
      
      const msgLower = message.toLowerCase();
      if (role === 'teacher') {
        if (msgLower.includes('lesson plan') || msgLower.includes('syllabus') || msgLower.includes('course')) {
          aiResponseText = "Here is a standard structure for an academic lesson plan:\n1. Objectives (Bloom's Taxonomy)\n2. Materials and Resources\n3. Instructional Steps (Introduction, Guided Practice, Independent Work)\n4. Assessment (Quiz or Discussion).\nI can draft specific modules for your courses if you provide details!";
        } else if (msgLower.includes('grade') || msgLower.includes('assignment') || msgLower.includes('rubric')) {
          aiResponseText = "When designing assignment rubrics, aim for clarity and objectivity. Break evaluation down into categories (e.g., Understanding, Implementation, Structure, Documentation) each graded on a 1-5 scale. This speed-grades student submissions and guarantees transparency.";
        } else if (msgLower.includes('at risk') || msgLower.includes('student') || msgLower.includes('performance')) {
          aiResponseText = "Early intervention is key for at-risk students. Consider scheduling a 1-on-1 review session, sending a supportive study plan reminder, or suggesting they review specific summary flashcards in the EduSphere portal.";
        } else {
          aiResponseText = `That's an interesting question about "${message}". As your AI instructional assistant, I recommend exploring the Student Analytics portal to check your cohort's performance, or updating the Community Announcements to clarify this course concept for your students!`;
        }
      } else {
        if (msgLower.includes('quantum') || msgLower.includes('schrödinger') || msgLower.includes('physics')) {
          aiResponseText = "Quantum mechanics describes the physical properties of nature at the scale of atoms and subatomic particles. Schrödinger's equation is a linear partial differential equation that governs the wave function of a quantum system.";
        } else if (msgLower.includes('python') || msgLower.includes('code') || msgLower.includes('program')) {
          aiResponseText = "Python is a high-level, general-purpose programming language. Its design philosophy emphasizes code readability with the use of significant indentation. Let me know what code snippet you want to write or debug!";
        } else if (msgLower.includes('study') || msgLower.includes('schedule') || msgLower.includes('exam')) {
          aiResponseText = "To optimize your studies, break down topics into small units (the Pomodoro technique), test yourself using flashcards, and make sure to schedule review sessions in your Study Planner.";
        } else {
          aiResponseText = `That's an interesting question about "${message}". I recommend reviewing your lecture syllabus, uploading the PDF slides to the PDF Analyzer, and focusing on the core concepts. Let me know if you would like me to generate a summary or a practice quiz on this topic!`;
        }
      }
    }

    res.json({
      text: aiResponseText,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
