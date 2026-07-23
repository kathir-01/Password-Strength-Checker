/**
 * SecurePass Analyzer - Modern Cybersecurity Password Intelligence Engine
 * Built with modular Vanilla JavaScript (ES6+)
 * Author: Kathiravan SK
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize App Modules
    ThemeController.init();
    PasswordAnalyzer.init();
    PasswordGenerator.init();
    UIController.init();
});

/* ==========================================================================
   1. Theme Controller Module (Dark / Light Mode)
   ========================================================================== */
const ThemeController = (() => {
    const STORAGE_KEY = 'securepass_theme';
    let themeToggleBtn;

    function init() {
        themeToggleBtn = document.getElementById('themeToggleBtn');
        const currentTheme = getPreferredTheme();
        
        applyTheme(currentTheme, false);
        bindEvents();
    }

    function getPreferredTheme() {
        const savedTheme = localStorage.getItem(STORAGE_KEY);
        if (savedTheme === 'dark' || savedTheme === 'light') {
            return savedTheme;
        }
        // Fallback to system OS preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function applyTheme(theme, persist = false) {
        document.documentElement.setAttribute('data-theme', theme);
        
        if (themeToggleBtn) {
            const isDark = theme === 'dark';
            themeToggleBtn.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
            themeToggleBtn.setAttribute('title', `Switch to ${isDark ? 'light' : 'dark'} mode`);
        }

        if (persist) {
            localStorage.setItem(STORAGE_KEY, theme);
        }
    }

    function bindEvents() {
        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', () => {
                const current = document.documentElement.getAttribute('data-theme') || 'dark';
                const nextTheme = current === 'dark' ? 'light' : 'dark';
                
                applyTheme(nextTheme, true);

                if (window.UIController && window.UIController.showToast) {
                    const iconEmoji = nextTheme === 'light' ? '☀️' : '🌙';
                    window.UIController.showToast(`Switched to ${nextTheme === 'light' ? 'Light' : 'Dark'} Mode ${iconEmoji}`);
                }
            });
        }

        // Listen for OS system theme changes if no manual preference is saved
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            const savedTheme = localStorage.getItem(STORAGE_KEY);
            if (!savedTheme) {
                applyTheme(e.matches ? 'dark' : 'light', false);
            }
        });
    }

    return {
        init,
        applyTheme,
        getPreferredTheme
    };
})();

/* ==========================================================================
   2. Password Analyzer Core Module
   ========================================================================== */
const PasswordAnalyzer = (() => {
    // Common weak passwords list to check against
    const commonPasswords = [
        '123456', 'password', '123456789', '12345678', '12345', '1234567',
        'qwerty', '111111', '123123', 'admin', 'welcome', 'login', 'iloveyou',
        'monkey', 'dragon', 'sunshine', 'princess', 'football', 'charlie'
    ];

    /**
     * Main analysis method
     * @param {string} password 
     * @returns {Object} Analysis metrics
     */
    function analyze(password) {
        if (!password || password.length === 0) {
            return getEmptyResult();
        }

        const length = password.length;
        const checks = {
            length: length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            symbol: /[^A-Za-z0-9]/.test(password)
        };

        const poolSize = calculatePoolSize(checks);
        const entropy = calculateEntropy(length, poolSize);
        const crackTime = calculateCrackTime(length, poolSize);
        const score = calculateScore(password, checks, entropy);
        const ratingInfo = getRatingInfo(score);
        const suggestions = generateSuggestions(password, checks, length, score);

        return {
            password,
            length,
            checks,
            poolSize,
            entropy: Math.round(entropy * 10) / 10,
            crackTime,
            score,
            rating: ratingInfo.label,
            ratingClass: ratingInfo.className,
            color: ratingInfo.color,
            suggestions
        };
    }

    function getEmptyResult() {
        return {
            password: '',
            length: 0,
            checks: { length: false, uppercase: false, lowercase: false, number: false, symbol: false },
            poolSize: 0,
            entropy: 0,
            crackTime: 'Instant',
            score: 0,
            rating: 'Very Weak',
            ratingClass: 'very-weak',
            color: 'var(--color-red)',
            suggestions: [{
                type: 'info',
                text: 'Type or paste a password above to begin real-time analysis.'
            }]
        };
    }

    /**
     * Calculate character pool size (R)
     */
    function calculatePoolSize(checks) {
        let size = 0;
        if (checks.lowercase) size += 26;
        if (checks.uppercase) size += 26;
        if (checks.number) size += 10;
        if (checks.symbol) size += 33;
        return size === 0 ? 1 : size;
    }

    /**
     * Calculate entropy in bits E = L * log2(R)
     */
    function calculateEntropy(length, poolSize) {
        if (length === 0 || poolSize <= 1) return 0;
        return length * Math.log2(poolSize);
    }

    /**
     * Estimate Crack Time assuming offline GPU hashing (~10 Billion/sec)
     */
    function calculateCrackTime(length, poolSize) {
        if (length === 0) return 'Instant';
        
        // Total possible combinations = R^L
        const combinations = Math.pow(poolSize, length);
        const guessesPerSec = 10000000000; // 10 Billion guesses/second
        const seconds = combinations / (2 * guessesPerSec); // Average time

        if (seconds < 0.01) return 'Instant';
        if (seconds < 60) return `${Math.max(1, Math.round(seconds))} Seconds`;
        
        const minutes = seconds / 60;
        if (minutes < 60) return `${Math.round(minutes)} Minutes`;

        const hours = minutes / 60;
        if (hours < 24) return `${Math.round(hours)} Hours`;

        const days = hours / 24;
        if (days < 365) return `${Math.round(days)} Days`;

        const years = days / 365;
        if (years < 100) return `${Math.round(years)} Years`;
        if (years < 10000) return `${Math.round(years).toLocaleString()} Years`;
        if (years < 1000000) return 'Centuries';
        return 'Eons (>1M Yrs)';
    }

    /**
     * Compute comprehensive 0 - 100 score
     */
    function calculateScore(password, checks, entropy) {
        let score = 0;
        const length = password.length;

        // 1. Length weight (Up to 45 pts)
        if (length >= 16) score += 45;
        else if (length >= 12) score += 35;
        else if (length >= 8) score += 20;
        else score += length * 2.5;

        // 2. Character diversity (Up to 35 pts)
        let typesCount = 0;
        if (checks.lowercase) { score += 7; typesCount++; }
        if (checks.uppercase) { score += 8; typesCount++; }
        if (checks.number) { score += 8; typesCount++; }
        if (checks.symbol) { score += 12; typesCount++; }

        // Bonus for character variety combo
        if (typesCount >= 3) score += 5;
        if (typesCount === 4) score += 10;

        // 3. Entropy factor bonus (Up to 10 pts)
        if (entropy >= 80) score += 10;
        else if (entropy >= 50) score += 5;

        // 4. Penalties
        const lowerPass = password.toLowerCase();
        if (commonPasswords.includes(lowerPass)) {
            score -= 50;
        }

        // Sequential characters penalty
        if (/(1234|2345|3456|4567|5678|6789|abcd|qwer|asdf)/i.test(password)) {
            score -= 15;
        }

        // Repeated characters penalty
        if (/(.)\1{2,}/.test(password)) {
            score -= 15;
        }

        // Single character set penalty
        if (typesCount === 1 && length > 3) {
            score -= 15;
        }

        // Clamp score strictly between 0 and 100
        return Math.max(0, Math.min(100, Math.round(score)));
    }

    /**
     * Get label, color variable, and CSS class based on score
     */
    function getRatingInfo(score) {
        if (score <= 20) return { label: 'Very Weak', className: 'very-weak', color: 'var(--color-red)' };
        if (score <= 40) return { label: 'Weak', className: 'weak', color: 'var(--color-orange)' };
        if (score <= 60) return { label: 'Medium', className: 'medium', color: 'var(--color-yellow)' };
        if (score <= 80) return { label: 'Strong', className: 'strong', color: 'var(--color-cyan)' };
        return { label: 'Very Strong', className: 'very-strong', color: 'var(--color-green)' };
    }

    /**
     * Generate dynamic actionable recommendations
     */
    function generateSuggestions(password, checks, length, score) {
        const list = [];
        const lowerPass = password.toLowerCase();

        if (commonPasswords.includes(lowerPass)) {
            list.push({
                type: 'danger',
                text: 'CRITICAL: This is a widely known weak password! Change it immediately.'
            });
        }

        if (/(.)\1{2,}/.test(password)) {
            list.push({
                type: 'warning',
                text: 'Avoid repeating identical characters consecutively (e.g., "aaa" or "111").'
            });
        }

        if (/(1234|abcd|qwer|asdf)/i.test(password)) {
            list.push({
                type: 'warning',
                text: 'Avoid sequential keyboard patterns (e.g., "1234", "qwerty").'
            });
        }

        if (length < 8) {
            list.push({
                type: 'danger',
                text: 'Password is too short. Use at least 8 characters (12+ recommended).'
            });
        } else if (length < 12) {
            list.push({
                type: 'info',
                text: 'Consider increasing length to 12+ characters for enhanced brute-force resistance.'
            });
        }

        if (!checks.uppercase) {
            list.push({
                type: 'warning',
                text: 'Add at least one uppercase letter (A-Z).'
            });
        }

        if (!checks.lowercase) {
            list.push({
                type: 'warning',
                text: 'Add at least one lowercase letter (a-z).'
            });
        }

        if (!checks.number) {
            list.push({
                type: 'warning',
                text: 'Include numeric digits (0-9).'
            });
        }

        if (!checks.symbol) {
            list.push({
                type: 'warning',
                text: 'Incorporate special symbols (e.g., !@#$%) for maximum entropy.'
            });
        }

        if (score >= 85 && length >= 14 && list.length === 0) {
            list.push({
                type: 'success',
                text: 'Outstanding password! High entropy and robust protection against brute-force attacks.'
            });
        }

        return list;
    }

    return {
        init: () => {},
        analyze
    };
})();

/* ==========================================================================
   3. Password Generator Core Module
   ========================================================================== */
const PasswordGenerator = (() => {
    const pools = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    /**
     * Generate cryptographically secure random password
     */
    function generate(options) {
        const { length, uppercase, lowercase, numbers, symbols } = options;

        let charPool = '';
        const mandatoryChars = [];

        if (uppercase) {
            charPool += pools.uppercase;
            mandatoryChars.push(getRandomChar(pools.uppercase));
        }
        if (lowercase) {
            charPool += pools.lowercase;
            mandatoryChars.push(getRandomChar(pools.lowercase));
        }
        if (numbers) {
            charPool += pools.numbers;
            mandatoryChars.push(getRandomChar(pools.numbers));
        }
        if (symbols) {
            charPool += pools.symbols;
            mandatoryChars.push(getRandomChar(pools.symbols));
        }

        // Fallback if no option is checked
        if (charPool === '') {
            charPool = pools.lowercase + pools.numbers;
            mandatoryChars.push(getRandomChar(pools.lowercase));
        }

        const remainingLength = Math.max(0, length - mandatoryChars.length);
        const resultChars = [...mandatoryChars];

        for (let i = 0; i < remainingLength; i++) {
            resultChars.push(getRandomChar(charPool));
        }

        // Cryptographic shuffle
        return shuffleArray(resultChars).join('');
    }

    /**
     * Secure random character selection using Web Crypto API
     */
    function getRandomChar(sourceString) {
        const randomBuffer = new Uint32Array(1);
        window.crypto.getRandomValues(randomBuffer);
        return sourceString[randomBuffer[0] % sourceString.length];
    }

    /**
     * Fisher-Yates shuffle with crypto randomness
     */
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const randomBuffer = new Uint32Array(1);
            window.crypto.getRandomValues(randomBuffer);
            const j = randomBuffer[0] % (i + 1);
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    return {
        init: () => {},
        generate
    };
})();

/* ==========================================================================
   4. UI Controller Module
   ========================================================================== */
const UIController = (() => {
    // DOM Elements
    let passwordInput, clearBtn, togglePasswordBtn, eyeOpenIcon, eyeClosedIcon, inputContainer;
    let strengthBadge, strengthRating, progressFill, scoreText, scoreSubText, scoreRing;
    let entropyVal, crackTimeVal, checklistItems, suggestionsContainer;
    
    // Generator DOM Elements
    let generatedPasswordText, copyGenBtn, useGenBtn, genLengthSlider, genLengthVal;
    let optUppercase, optLowercase, optNumbers, optSymbols, generateBtn;
    let presetMaxBtn, presetMemorableBtn, presetPinBtn;
    let toast, toastMsg;

    function init() {
        cacheDOM();
        bindEvents();
        
        // Initial setup
        generateNewPassword();
        updateAnalysis('');
    }

    function cacheDOM() {
        passwordInput = document.getElementById('passwordInput');
        clearBtn = document.getElementById('clearBtn');
        togglePasswordBtn = document.getElementById('togglePasswordBtn');
        eyeOpenIcon = togglePasswordBtn.querySelector('.eye-open');
        eyeClosedIcon = togglePasswordBtn.querySelector('.eye-closed');
        inputContainer = document.getElementById('inputContainer');

        strengthBadge = document.getElementById('strengthBadge');
        strengthRating = document.getElementById('strengthRating');
        progressFill = document.getElementById('progressFill');
        scoreText = document.getElementById('scoreText');
        scoreSubText = document.getElementById('scoreSubText');
        scoreRing = document.getElementById('scoreRing');

        entropyVal = document.getElementById('entropyVal');
        crackTimeVal = document.getElementById('crackTimeVal');
        checklistItems = document.querySelectorAll('.check-item');
        suggestionsContainer = document.getElementById('suggestionsContainer');

        // Generator
        generatedPasswordText = document.getElementById('generatedPassword');
        copyGenBtn = document.getElementById('copyGenBtn');
        useGenBtn = document.getElementById('useGenBtn');
        genLengthSlider = document.getElementById('genLengthSlider');
        genLengthVal = document.getElementById('genLengthVal');
        
        optUppercase = document.getElementById('optUppercase');
        optLowercase = document.getElementById('optLowercase');
        optNumbers = document.getElementById('optNumbers');
        optSymbols = document.getElementById('optSymbols');
        generateBtn = document.getElementById('generateBtn');

        presetMaxBtn = document.getElementById('presetMax');
        presetMemorableBtn = document.getElementById('presetMemorable');
        presetPinBtn = document.getElementById('presetPin');

        toast = document.getElementById('toast');
        toastMsg = document.getElementById('toastMsg');
    }

    function bindEvents() {
        // Password Input Real-time events
        passwordInput.addEventListener('input', (e) => {
            const val = e.target.value;
            clearBtn.style.display = val.length > 0 ? 'flex' : 'none';
            updateAnalysis(val);
        });

        clearBtn.addEventListener('click', () => {
            passwordInput.value = '';
            clearBtn.style.display = 'none';
            passwordInput.focus();
            updateAnalysis('');
        });

        // Show/Hide password toggle
        togglePasswordBtn.addEventListener('click', () => {
            const isPassword = passwordInput.getAttribute('type') === 'password';
            passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
            eyeOpenIcon.style.display = isPassword ? 'none' : 'block';
            eyeClosedIcon.style.display = isPassword ? 'block' : 'none';
        });

        // Generator length slider
        genLengthSlider.addEventListener('input', (e) => {
            genLengthVal.textContent = e.target.value;
            generateNewPassword();
        });

        // Generator options
        [optUppercase, optLowercase, optNumbers, optSymbols].forEach(checkbox => {
            checkbox.addEventListener('change', generateNewPassword);
        });

        // Generate button click
        generateBtn.addEventListener('click', () => {
            const spinIcon = generateBtn.querySelector('.spin-icon');
            spinIcon.classList.add('spinning');
            generateNewPassword();
            setTimeout(() => spinIcon.classList.remove('spinning'), 400);
        });

        // Presets
        presetMaxBtn.addEventListener('click', () => {
            setGeneratorState(20, true, true, true, true);
        });

        presetMemorableBtn.addEventListener('click', () => {
            setGeneratorState(14, true, true, false, false);
        });

        presetPinBtn.addEventListener('click', () => {
            setGeneratorState(8, false, false, true, false);
        });

        // Copy generated password
        copyGenBtn.addEventListener('click', () => {
            const pass = generatedPasswordText.textContent;
            if (pass && pass !== 'Click Generate below') {
                copyToClipboard(pass, 'Password copied to clipboard!');
            }
        });

        // Use in Analyzer
        useGenBtn.addEventListener('click', () => {
            const pass = generatedPasswordText.textContent;
            if (pass && pass !== 'Click Generate below') {
                passwordInput.value = pass;
                clearBtn.style.display = 'flex';
                updateAnalysis(pass);
                showToast('Password loaded into Analyzer!');
                passwordInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

    /**
     * Update all analysis UI elements dynamically
     */
    function updateAnalysis(password) {
        const result = PasswordAnalyzer.analyze(password);

        // 1. Update Badge & Strength Rating
        strengthBadge.textContent = result.rating;
        strengthBadge.className = `badge ${result.ratingClass}`;
        
        strengthRating.textContent = result.rating;
        strengthRating.style.color = result.color;

        // 2. Progress Bar
        progressFill.style.width = `${result.score}%`;
        progressFill.style.backgroundColor = result.color;
        progressFill.style.boxShadow = `0 0 12px ${result.color}`;

        // Update step labels active states
        const stepLabels = document.querySelectorAll('.step-label');
        stepLabels.forEach((label) => {
            label.classList.remove('active');
        });
        if (password.length > 0) {
            const activeStepIdx = Math.min(4, Math.floor(result.score / 20.01));
            const activeLabel = document.getElementById(`step-${activeStepIdx}`);
            if (activeLabel) activeLabel.classList.add('active');
        }

        // 3. Dynamic Glow on Input Box
        inputContainer.className = 'input-wrapper';
        if (password.length > 0) {
            inputContainer.classList.add(`glow-${result.ratingClass}`);
        }

        // 4. Radial Score Ring & Values
        scoreText.textContent = result.score;
        scoreText.style.color = result.color;
        scoreSubText.textContent = `${result.score} / 100 Index`;

        // Radial ring circumference is 213.6
        const maxOffset = 213.6;
        const offset = maxOffset - (result.score / 100) * maxOffset;
        scoreRing.style.strokeDashoffset = offset;
        scoreRing.style.stroke = result.color;

        // 5. Metrics Cards
        entropyVal.textContent = `${result.entropy} bits`;
        crackTimeVal.textContent = result.crackTime;

        // 6. Requirements Checklist
        checklistItems.forEach(item => {
            const rule = item.getAttribute('data-rule');
            const icon = item.querySelector('.check-icon');
            const isPassed = result.checks[rule];

            if (isPassed) {
                item.classList.add('passed');
                icon.textContent = '✓';
            } else {
                item.classList.remove('passed');
                icon.textContent = '✖';
            }
        });

        // 7. Suggestions
        renderSuggestions(result.suggestions);
    }

    /**
     * Render suggestions dynamically
     */
    function renderSuggestions(suggestions) {
        suggestionsContainer.innerHTML = '';
        suggestions.forEach(item => {
            const div = document.createElement('div');
            div.className = `suggestion-item ${item.type}`;
            
            let iconSvg = '';
            if (item.type === 'danger' || item.type === 'warning') {
                iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
            } else if (item.type === 'success') {
                iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
            } else {
                iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
            }

            div.innerHTML = `${iconSvg}<span>${item.text}</span>`;
            suggestionsContainer.appendChild(div);
        });
    }

    /**
     * Generate new password in generator output
     */
    function generateNewPassword() {
        const options = {
            length: parseInt(genLengthSlider.value, 10),
            uppercase: optUppercase.checked,
            lowercase: optLowercase.checked,
            numbers: optNumbers.checked,
            symbols: optSymbols.checked
        };

        const newPass = PasswordGenerator.generate(options);
        generatedPasswordText.textContent = newPass;
    }

    function setGeneratorState(length, upper, lower, num, sym) {
        genLengthSlider.value = length;
        genLengthVal.textContent = length;
        optUppercase.checked = upper;
        optLowercase.checked = lower;
        optNumbers.checked = num;
        optSymbols.checked = sym;
        generateNewPassword();
    }

    /**
     * Copy to clipboard helper with Toast
     */
    function copyToClipboard(text, successMessage) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                showToast(successMessage);
            }).catch(() => {
                fallbackCopyTextToClipboard(text, successMessage);
            });
        } else {
            fallbackCopyTextToClipboard(text, successMessage);
        }
    }

    function fallbackCopyTextToClipboard(text, successMessage) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            showToast(successMessage);
        } catch (err) {
            showToast('Failed to copy');
        }
        document.body.removeChild(textArea);
    }

    let toastTimer;
    function showToast(message) {
        toastMsg.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    return {
        init,
        showToast
    };
})();

// Expose UIController globally for ThemeController toast integration
window.UIController = UIController;
