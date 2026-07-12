// script.js

// ==========================================
// 1. DEFAULT DATA & LOCAL STORAGE SETUP
// ==========================================
const DEFAULT_COURSES = [
    {
        id: 1, name: "Frontend Development (HTML/CSS)", category: "Frontend", desc: "Master the building blocks of the web with responsive structures.",
        total: 2, completed: 1,
        lessons: [
            { id: 101, title: "1. HTML Document Structure", content: "HTML uses semantic tags to build headings, links, and paragraphs.\n\n Browsers read from top to bottom.", code: "<!DOCTYPE html>\n<html>\n<head><title>My Site</title></head>\n<body>\n  <h1>Welcome to LearnAI</h1>\n  <p>Learn clean markup!</p>\n</body>\n</html>" },
            { id: 102, title: "2. CSS Flexbox Layouts", content: "Flexbox aligns items horizontally or vertically with ease. Use display: flex on containers.", code: ".container {\n  display: flex;\n  justify-content: space-between;\n  padding: 20px;\n}" }
        ]
    },
    {
        id: 2, name: "Python Data Science Basics", category: "AI & Data Science", desc: "Learn lists, dictionaries, and mathematical algorithms using Python.",
        total: 1, completed: 0,
        lessons: [
            { id: 201, title: "1. List Comprehensions", content: "Write concise loops inside square brackets to generate lists efficiently.", code: "squares = [x**2 for x in range(5)]\nprint(squares) # Output: [0, 1, 4, 9, 16]" }
        ]
    }
];

const DEFAULT_TODOS = [
    { id: 1, task: "Complete HTML Document Structure lesson", completed: true },
    { id: 2, task: "Practice JavaScript Playground Sandbox", completed: false }
];

// DB Init
if (!localStorage.getItem('learnai_courses')) localStorage.setItem('learnai_courses', JSON.stringify(DEFAULT_COURSES));
if (!localStorage.getItem('learnai_todos')) localStorage.setItem('learnai_todos', JSON.stringify(DEFAULT_TODOS));
if (!localStorage.getItem('learnai_xp')) localStorage.setItem('learnai_xp', '150');
if (!localStorage.getItem('learnai_streak')) localStorage.setItem('learnai_streak', '3');
if (!localStorage.getItem('learnai_user')) localStorage.setItem('learnai_user', JSON.stringify({ name: "Vidhi Yadav", email: "vidhi@domain.com", bio: "Aspiring Data Scientist & Developer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vidhi", certs: ["Frontend Development (HTML/CSS)"] }));
if (!localStorage.getItem('learnai_feedbacks')) localStorage.setItem('learnai_feedbacks', JSON.stringify([{ name: "Rahul Sharma", email: "rahul@test.com", msg: "Loved the UI design!" }]));
if (!localStorage.getItem('learnai_chats')) localStorage.setItem('learnai_chats', JSON.stringify([]));

// ==========================================
// 2. THEME, RIPPLE & ACCORDION (Global UI)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        const currentTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        themeBtn.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

        themeBtn.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        });
    }

    // FAQ Accordion
    document.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', () => {
            const parent = q.parentElement;
            parent.classList.toggle('active');
            document.querySelectorAll('.faq-item').forEach(other => {
                if (other !== parent) other.classList.remove('active');
            });
        });
    });

    // Ripple effect on buttons
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn');
        if (btn && !btn.classList.contains('no-ripple')) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size/2}px`;
            ripple.style.top = `${e.clientY - rect.top - size/2}px`;
            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        }
    });
});

// ==========================================
// 3. AUTHENTICATION (index.html)
// ==========================================
let currentAuthAction = 'login';
let currentAuthRole = 'student';

window.openAuthModal = function(action, role) {
    currentAuthAction = action;
    const modal = document.getElementById('auth-modal');
    if (!modal) return;
    
    document.getElementById('auth-title').textContent = action === 'login' ? "Welcome Back" : "Create Account";
    document.getElementById('auth-submit-btn').textContent = action === 'login' ? "Log In" : "Sign Up Free";
    document.getElementById('field-name').style.display = action === 'register' ? "block" : "none";
    document.getElementById('field-confirm-pass').style.display = action === 'register' ? "block" : "none";
    document.getElementById('password-strength-container').style.display = action === 'register' ? "block" : "none";
    document.getElementById('link-forgot').style.display = action === 'login' ? "block" : "none";
    
    switchAuthType(role);
    modal.style.display = 'flex';
};

window.closeAuthModal = function() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.style.display = 'none';
};

window.switchAuthType = function(role) {
    currentAuthRole = role;
    const btnS = document.getElementById('btn-type-student');
    const btnA = document.getElementById('btn-type-admin');
    if (btnS && btnA) {
        btnS.className = role === 'student' ? 'btn btn-primary' : 'btn btn-secondary';
        btnA.className = role === 'admin' ? 'btn btn-primary' : 'btn btn-secondary';
    }
};

window.openForgotView = function() {
    alert("Simulation: Password reset link has been generated and sent to your email!");
    closeAuthModal();
};

// Password Strength
const authPass = document.getElementById('auth-pass');
const strengthBar = document.getElementById('strength-bar');
if (authPass && strengthBar) {
    authPass.addEventListener('input', (e) => {
        if (currentAuthAction !== 'register') return;
        const val = e.target.value;
        let s = 0;
        if (val.length >= 6) s += 25;
        if (/[A-Z]/.test(val)) s += 25;
        if (/[0-9]/.test(val)) s += 25;
        if (/[^A-Za-z0-9]/.test(val)) s += 25;
        strengthBar.style.width = s + '%';
        if (s <= 25) strengthBar.style.backgroundColor = 'var(--danger)';
        else if (s <= 50) strengthBar.style.backgroundColor = 'var(--warning)';
        else if (s <= 75) strengthBar.style.backgroundColor = '#3b82f6';
        else strengthBar.style.backgroundColor = 'var(--success)';
    });
}

const authForm = document.getElementById('auth-form');
if (authForm) {
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('auth-email').value;
        const alertBox = document.getElementById('auth-alert');
        
        if (currentAuthRole === 'admin') {
            if (email.includes('admin')) {
                localStorage.setItem('learnai_logged_role', 'admin');
                window.location.href = 'app.html';
            } else {
                alertBox.innerHTML = `<div style="background:rgba(239,68,68,0.1); color:var(--danger); padding:10px; border-radius:6px; margin-bottom:12px;">Use any email containing 'admin' to login as admin.</div>`;
            }
        } else {
            if (currentAuthAction === 'register') {
                const pass1 = document.getElementById('auth-pass').value;
                const pass2 = document.getElementById('auth-confirm-pass').value;
                if (pass1 !== pass2) {
                    alertBox.innerHTML = `<div style="background:rgba(239,68,68,0.1); color:var(--danger); padding:10px; border-radius:6px; margin-bottom:12px;">Passwords do not match!</div>`;
                    return;
                }
                const name = document.getElementById('auth-name').value || "New Student";
                const user = JSON.parse(localStorage.getItem('learnai_user'));
                user.name = name; user.email = email;
                localStorage.setItem('learnai_user', JSON.stringify(user));
                
                // Welcome Bonus XP
                let currentXp = parseInt(localStorage.getItem('learnai_xp') || 0);
                localStorage.setItem('learnai_xp', currentXp + 50);
            }
            localStorage.setItem('learnai_logged_role', 'student');
            window.location.href = 'app.html';
        }
    });
}

// Contact Form
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const msg = document.getElementById('message').value;
        const feedbacks = JSON.parse(localStorage.getItem('learnai_feedbacks'));
        feedbacks.unshift({ name, email, msg });
        localStorage.setItem('learnai_feedbacks', JSON.stringify(feedbacks));
        document.getElementById('contact-feedback').innerHTML = `<div style="background:rgba(34,197,94,0.1); color:var(--success); border:1px solid var(--success); padding:12px; border-radius:8px; margin-bottom:16px;">Thanks! Feedback sent to Admin Portal.</div>`;
        contactForm.reset();
    });
}

// ==========================================
// 4. APP PORTAL & ROUTING (app.html)
// ==========================================
let currentLessonObj = null;

window.initApp = function() {
    const role = localStorage.getItem('learnai_logged_role') || 'student';
    const user = JSON.parse(localStorage.getItem('learnai_user'));
    
    if (role === 'admin') {
        document.getElementById('student-menu').style.display = 'none';
        document.getElementById('admin-menu').style.display = 'flex';
        document.getElementById('portal-logo').textContent = "🤖 LearnAI Admin Portal";
        document.getElementById('user-display-name').textContent = "Admin";
        switchAppView('admin-overview');
        renderAdminStats();
    } else {
        document.getElementById('user-display-name').textContent = user.name;
        document.getElementById('user-avatar').src = user.avatar;
        document.querySelectorAll('.user-name-text').forEach(el => el.textContent = user.name);
        document.getElementById('stat-xp').textContent = `${localStorage.getItem('learnai_xp')} XP`;
        document.getElementById('stat-streak').textContent = `${localStorage.getItem('learnai_streak')} Days`;
        document.getElementById('stat-certs').textContent = user.certs.length;
        
        switchAppView('dashboard');
        renderContinueLearning();
        renderTodos();
        renderProfilePage();
        renderChatHistory();
    }
};

window.switchAppView = function(viewName) {
    document.querySelectorAll('.app-view').forEach(v => v.style.display = 'none');
    document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
    
    const target = document.getElementById(`view-${viewName}`);
    if (target) target.style.display = 'block';
    
    const nav = document.getElementById(`nav-${viewName}`);
    if (nav) nav.classList.add('active');
    
    if (viewName === 'modules') renderModulesPage();
    if (viewName === 'admin-overview') renderAdminStats();
    if (viewName === 'admin-students') renderAdminStudents();
};

window.logoutUser = function() {
    localStorage.removeItem('learnai_logged_role');
};

function addXP(amount) {
    let xp = parseInt(localStorage.getItem('learnai_xp') || '0') + amount;
    localStorage.setItem('learnai_xp', xp);
    const xpEl1 = document.getElementById('stat-xp');
    const xpEl2 = document.getElementById('prof-xp');
    if (xpEl1) xpEl1.textContent = `${xp} XP`;
    if (xpEl2) xpEl2.textContent = `${xp} XP`;
}

// --- TODOS & POMODORO ---
function renderTodos() {
    const list = document.getElementById('todo-list');
    if (!list) return;
    list.innerHTML = '';
    const todos = JSON.parse(localStorage.getItem('learnai_todos') || '[]');
    todos.forEach(t => {
        list.innerHTML += `
            <li style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; border:1px solid var(--border); border-radius:6px; background:var(--surface);">
                <div style="display:flex; align-items:center; gap:8px;">
                    <input type="checkbox" ${t.completed ? 'checked' : ''} onchange="toggleTodo(${t.id})">
                    <span style="${t.completed ? 'text-decoration:line-through; color:var(--text-secondary);' : ''}">${t.task}</span>
                </div>
                <button onclick="deleteTodo(${t.id})" style="border:none; background:none; color:var(--danger); cursor:pointer;">🗑️</button>
            </li>`;
    });
}

const todoForm = document.getElementById('todo-form');
if (todoForm) {
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = document.getElementById('todo-input').value.trim();
        if (!text) return;
        const todos = JSON.parse(localStorage.getItem('learnai_todos') || '[]');
        todos.push({ id: Date.now(), task: text, completed: false });
        localStorage.setItem('learnai_todos', JSON.stringify(todos));
        document.getElementById('todo-input').value = '';
        renderTodos();
        addXP(5);
    });
}
window.toggleTodo = function(id) {
    const todos = JSON.parse(localStorage.getItem('learnai_todos'));
    const up = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    localStorage.setItem('learnai_todos', JSON.stringify(up));
    renderTodos();
};
window.deleteTodo = function(id) {
    const todos = JSON.parse(localStorage.getItem('learnai_todos'));
    localStorage.setItem('learnai_todos', JSON.stringify(todos.filter(t => t.id !== id)));
    renderTodos();
};

// Pomodoro Timer
let pomoInterval = null;
let pomoTime = 25 * 60;
let isPomoRunning = false;
const timerDisplay = document.getElementById('pomo-timer');
const startBtn = document.getElementById('pomo-start');
const resetBtn = document.getElementById('pomo-reset');

function updateTimer() {
    if(!timerDisplay) return;
    const m = Math.floor(pomoTime / 60).toString().padStart(2, '0');
    const s = (pomoTime % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${m}:${s}`;
}
if(startBtn) {
    startBtn.addEventListener('click', () => {
        if (!isPomoRunning) {
            isPomoRunning = true;
            startBtn.textContent = 'Pause';
            startBtn.style.backgroundColor = 'var(--warning)';
            pomoInterval = setInterval(() => {
                if (pomoTime > 0) { pomoTime--; updateTimer(); } 
                else {
                    clearInterval(pomoInterval);
                    alert("🎉 Pomodoro session finished! +25 XP!");
                    addXP(25);
                    resetTimerFunc();
                }
            }, 1000);
        } else {
            isPomoRunning = false;
            startBtn.textContent = 'Resume';
            startBtn.style.backgroundColor = 'var(--primary)';
            clearInterval(pomoInterval);
        }
    });
}
function resetTimerFunc() {
    isPomoRunning = false;
    clearInterval(pomoInterval);
    pomoTime = 25 * 60;
    if(startBtn) { startBtn.textContent = 'Start'; startBtn.style.backgroundColor = 'var(--primary)'; }
    updateTimer();
}
if(resetBtn) resetBtn.addEventListener('click', resetTimerFunc);


// --- MODULES & LESSONS ---
function renderContinueLearning() {
    const container = document.getElementById('continue-learning-list');
    if (!container) return;
    container.innerHTML = '';
    const courses = JSON.parse(localStorage.getItem('learnai_courses') || '[]');
    courses.forEach(c => {
        const pct = c.total > 0 ? Math.round((c.completed / c.total) * 100) : 0;
        container.innerHTML += `
            <div>
                <div style="display:flex; justify-content:space-between; font-size:14px; margin-bottom:6px;"><strong>${c.name}</strong><span>${pct}% Complete</span></div>
                <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${pct}%;"></div></div>
                <a href="javascript:void(0)" onclick="openLessonView(${c.id}, 0)" style="font-size:13px; color:var(--primary); font-weight:600;">Resume Module →</a>
            </div>`;
    });
}

function renderModulesPage() {
    const grid = document.getElementById('courses-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const courses = JSON.parse(localStorage.getItem('learnai_courses') || '[]');
    courses.forEach(c => {
        const pct = c.total > 0 ? Math.round((c.completed / c.total) * 100) : 0;
        grid.innerHTML += `
            <div class="card" style="display:flex; flex-direction:column; justify-content:space-between; height:240px;">
                <div>
                    <span style="font-size:11px; background:rgba(37,99,235,0.1); color:var(--primary); padding:4px 8px; border-radius:4px; font-weight:700;">${c.category}</span>
                    <h3 style="font-size:18px; margin:12px 0 6px;">${c.name}</h3>
                    <p style="color:var(--text-secondary); font-size:13px;">${c.desc}</p>
                </div>
                <div>
                    <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:6px;"><span>${c.completed}/${c.total} Lessons</span><span>${pct}%</span></div>
                    <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${pct}%;"></div></div>
                    <button onclick="openLessonView(${c.id}, 0)" class="btn btn-primary" style="width:100%; padding:8px;">Start Learning</button>
                </div>
            </div>`;
    });
}

window.openLessonView = function(courseId, lessonIndex) {
    const courses = JSON.parse(localStorage.getItem('learnai_courses'));
    const course = courses.find(c => c.id === courseId);
    if (!course || !course.lessons[lessonIndex]) return;
    
    currentLessonObj = { courseId, lessonIndex, lesson: course.lessons[lessonIndex], courseName: course.name };
    document.getElementById('lesson-course-name').textContent = course.name;
    document.getElementById('lesson-title').textContent = currentLessonObj.lesson.title;
    document.getElementById('lesson-content').textContent = currentLessonObj.lesson.content;
    document.getElementById('lesson-code').textContent = currentLessonObj.lesson.code;
    
    document.getElementById('nav-lesson').style.display = 'flex';
    switchAppView('lesson');
};

window.markLessonComplete = function() {
    if (!currentLessonObj) return;
    const courses = JSON.parse(localStorage.getItem('learnai_courses'));
    const idx = courses.findIndex(c => c.id === currentLessonObj.courseId);
    if (idx !== -1 && courses[idx].completed < courses[idx].total) {
        courses[idx].completed++;
        localStorage.setItem('learnai_courses', JSON.stringify(courses));
        addXP(15);
        alert("🎉 Lesson Completed! +15 XP Points!");
        renderContinueLearning();
    }
};
window.printLessonPDF = function() { window.print(); };

// --- QUIZ ---
window.startLessonQuiz = function() {
    const modal = document.getElementById('quiz-modal');
    if (!modal) return;
    document.getElementById('quiz-q-title').textContent = "Q: Which tag is used to create a hyperlink in HTML?";
    document.getElementById('quiz-options').innerHTML = `
        <label style="padding:10px; border:1px solid var(--border); border-radius:6px; display:block; cursor:pointer;"><input type="radio" name="qz" value="a"> &lt;a&gt; Tag</label>
        <label style="padding:10px; border:1px solid var(--border); border-radius:6px; display:block; cursor:pointer;"><input type="radio" name="qz" value="b"> &lt;link&gt; Tag</label>
        <label style="padding:10px; border:1px solid var(--border); border-radius:6px; display:block; cursor:pointer;"><input type="radio" name="qz" value="c"> &lt;href&gt; Tag</label>
    `;
    modal.style.display = 'flex';
};

window.submitQuizAnswer = function() {
    const sel = document.querySelector('input[name="qz"]:checked');
    if (!sel) return alert("Select an option first!");
    if (sel.value === 'a') {
        alert("🎉 Correct! You passed the module quiz and earned +50 XP and a Certificate!");
        addXP(50);
        document.getElementById('quiz-modal').style.display = 'none';
        const user = JSON.parse(localStorage.getItem('learnai_user'));
        if (currentLessonObj && !user.certs.includes(currentLessonObj.courseName)) {
            user.certs.push(currentLessonObj.courseName);
            localStorage.setItem('learnai_user', JSON.stringify(user));
            renderProfilePage();
            document.getElementById('stat-certs').textContent = user.certs.length;
        }
    } else {
        alert("❌ Incorrect answer. Try again!");
    }
};


// --- AI CHATBOT ENGINE ---
function generateBotResponse(msg) {
    const text = msg.toLowerCase();
    if(text.includes("html")) return "HTML (HyperText Markup Language) provides structure to a webpage using elements like <h1>, <p>, and <div>.";
    if(text.includes("css")) return "CSS handles styling! Try this:\n\n```css\nbody { background: #f4f4f4; }\n```";
    if(text.includes("js") || text.includes("javascript")) return "JavaScript adds interactivity. E.g.: `alert('Hello!');`";
    if(text.includes("quiz")) return "Here is a quick question: What does HTML stand for? (Reply with the answer)";
    return "I received your query: '" + msg + "'. I can help you with HTML, CSS, JavaScript, and Python!";
}

const chatForm = document.getElementById('chat-form');
if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('chat-input');
        const msg = input.value.trim();
        if(!msg) return;
        
        appendChat(msg, 'student');
        input.value = '';
        
        // Simulating thinking
        setTimeout(() => {
            const reply = generateBotResponse(msg);
            appendChat(reply, 'bot');
            
            // Save to DB
            const chats = JSON.parse(localStorage.getItem('learnai_chats') || '[]');
            chats.unshift({ q: msg, a: reply, date: new Date().toLocaleDateString() });
            localStorage.setItem('learnai_chats', JSON.stringify(chats));
            renderChatHistory();
            addXP(2); // reward chatting
        }, 600);
    });
}

function appendChat(text, sender) {
    const list = document.getElementById('chat-history');
    if(!list) return;
    const div = document.createElement('div');
    div.className = `chat-bubble ${sender}`;
    // simple markdown parser for code blocks
    let formattedText = text.replace(/```(.*?)```/gs, "<pre><code>$1</code></pre>");
    div.innerHTML = formattedText;
    list.appendChild(div);
    list.scrollTop = list.scrollHeight;
}

function renderChatHistory() {
    const box = document.getElementById('search-results-box');
    if(!box) return;
    const chats = JSON.parse(localStorage.getItem('learnai_chats') || '[]');
    box.innerHTML = chats.length === 0 ? "<p style='font-size:12px; color:var(--text-secondary); text-align:center;'>No history yet.</p>" : "";
    chats.forEach(c => {
        box.innerHTML += `<div style="padding:10px; background:var(--surface); border:1px solid var(--border); border-radius:6px; cursor:pointer;" onclick="document.getElementById('chat-input').value='${c.q}'; document.getElementById('chat-input').focus();"><strong>Q:</strong> ${c.q.substring(0,25)}... <div style="font-size:10px; color:var(--text-secondary); margin-top:4px;">${c.date}</div></div>`;
    });
}


// --- PLAYGROUND ---
window.switchEditorTab = function(lang, el) {
    document.querySelectorAll('.editor-tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('pg-html').style.display = lang === 'html' ? 'block' : 'none';
    document.getElementById('pg-css').style.display = lang === 'css' ? 'block' : 'none';
    document.getElementById('pg-js').style.display = lang === 'js' ? 'block' : 'none';
};
window.runPlayground = function() {
    const html = document.getElementById('pg-html').value;
    const css = `<style>${document.getElementById('pg-css').value}</style>`;
    const js = `<script>${document.getElementById('pg-js').value}<\/script>`;
    document.getElementById('pg-preview').srcdoc = html + css + js;
};
window.resetPlayground = function() {
    document.getElementById('pg-html').value = "<h1>Hello from LearnAI!</h1>\n<button id='btn'>Click Me!</button>";
    document.getElementById('pg-css').value = "body { font-family: sans-serif; padding: 20px; }\nh1 { color: #2563eb; }";
    document.getElementById('pg-js').value = "document.getElementById('btn').addEventListener('click', () => alert('Reset!'));";
    runPlayground();
};

// --- PROFILE ---
function renderProfilePage() {
    const user = JSON.parse(localStorage.getItem('learnai_user'));
    if (!user || !document.getElementById('prof-name')) return;
    document.getElementById('prof-name').value = user.name;
    document.getElementById('prof-email').value = user.email;
    document.getElementById('prof-bio').value = user.bio;
    document.getElementById('profile-edit-avatar').src = user.avatar;
    document.getElementById('prof-xp').textContent = `${localStorage.getItem('learnai_xp')} XP`;
    
    const certList = document.getElementById('cert-list');
    certList.innerHTML = '';
    user.certs.forEach((c, i) => {
        certList.innerHTML += `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; border:1px dashed var(--border); border-radius:8px; background:var(--surface-hover);">
                <div><strong>${c}</strong><br><span style="font-size:11px; color:var(--text-secondary);">ID: CERT-2026-${i+101}</span></div>
                <button onclick="printCertModal('${c}', 'CERT-2026-${i+101}')" class="btn btn-primary" style="padding:6px 12px; font-size:12px;">View</button>
            </div>`;
    });
}

window.changeAvatarSeed = function() {
    const rand = Math.random().toString(36).substring(7);
    const url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${rand}`;
    document.getElementById('profile-edit-avatar').src = url;
    document.getElementById('user-avatar').src = url;
    const user = JSON.parse(localStorage.getItem('learnai_user'));
    user.avatar = url;
    localStorage.setItem('learnai_user', JSON.stringify(user));
};

const profForm = document.getElementById('profile-form');
if(profForm) {
    profForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('learnai_user'));
        user.name = document.getElementById('prof-name').value;
        user.bio = document.getElementById('prof-bio').value;
        localStorage.setItem('learnai_user', JSON.stringify(user));
        alert("Profile Updated!");
        initApp();
    });
}

window.printCertModal = function(course, code) {
    const user = JSON.parse(localStorage.getItem('learnai_user'));
    document.getElementById('cert-print-name').textContent = user.name;
    document.getElementById('cert-print-course').textContent = course;
    document.getElementById('cert-print-code').textContent = code;
    document.getElementById('cert-modal').style.display = 'flex';
};

// --- ADMIN PORTAL ---
function renderAdminStats() {
    const courses = JSON.parse(localStorage.getItem('learnai_courses'));
    const fbs = JSON.parse(localStorage.getItem('learnai_feedbacks') || '[]');
    document.getElementById('adm-tot-courses').textContent = courses.length;
    document.getElementById('adm-tot-students').textContent = "1"; // Mock student count
    
    const tbody = document.getElementById('adm-feedback-table');
    if(!tbody) return;
    tbody.innerHTML = '';
    fbs.forEach((f, i) => {
        tbody.innerHTML += `<tr><td><strong>${f.name}</strong></td><td>${f.email}</td><td>${f.msg}</td><td><button onclick="deleteFeedback(${i})" style="color:var(--danger); border:none; background:none; cursor:pointer;">Delete</button></td></tr>`;
    });
}
window.deleteFeedback = function(i) {
    const fbs = JSON.parse(localStorage.getItem('learnai_feedbacks'));
    fbs.splice(i, 1);
    localStorage.setItem('learnai_feedbacks', JSON.stringify(fbs));
    renderAdminStats();
};

function renderAdminStudents() {
    const tbody = document.getElementById('adm-students-table');
    if(!tbody) return;
    const user = JSON.parse(localStorage.getItem('learnai_user'));
    tbody.innerHTML = `<tr><td><strong>${user.name}</strong></td><td>${user.email}</td><td>${localStorage.getItem('learnai_xp')} XP</td><td>${localStorage.getItem('learnai_streak')}</td><td><button onclick="alert('Student data is active in LocalStorage.')" class="btn btn-secondary" style="padding:4px 8px; font-size:11px;">Manage</button></td></tr>`;
}

const formAddCourse = document.getElementById('form-add-course');
if(formAddCourse) {
    formAddCourse.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('add-c-name').value;
        const desc = document.getElementById('add-c-desc').value;
        const cat = document.getElementById('add-c-cat').value;
        const courses = JSON.parse(localStorage.getItem('learnai_courses'));
        courses.push({ id: Date.now(), name, category: cat, desc, total: 1, completed: 0, lessons: [{ id: Date.now()+1, title: "1. Intro", content: "New course created.", code: "// code here" }] });
        localStorage.setItem('learnai_courses', JSON.stringify(courses));
        alert(`Course "${name}" created!`);
        formAddCourse.reset();
        renderAdminStats();
    });
}