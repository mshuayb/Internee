 // 1. Elements
        const chatForm = document.getElementById('chatForm');
        const messageInput = document.getElementById('messageInput');
        const chatWindow = document.getElementById('chatWindow');

        // 2. Listener
        chatForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const text = messageInput.value.trim();
            
            if (text !== "") {
                addMessage(text, 'user');
                messageInput.value = '';
                
                // Delay for realism
                setTimeout(() => {
                    const reply = getBotReply(text);
                    addMessage(reply, 'bot');
                }, 600);
            }
        });

        // 3. Add to screen
        function addMessage(text, sender) {
            const div = document.createElement('div');
            div.classList.add('message', sender);
            div.textContent = text;
            chatWindow.appendChild(div);
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }

        // 4. THE BRAIN (General Conversation)
        function getBotReply(input) {
            const text = input.toLowerCase();

            // --- Greetings ---
            if (text.match(/^(hi|hello|hey|greetings|sup|yo)/)) {
                const greetings = ["Hello there!", "Hi! How are you?", "Hey! Good to see you.", "Hi! What's on your mind?"];
                return greetings[Math.floor(Math.random() * greetings.length)];
            }

            // --- How are you? ---
            if (text.includes('how are you')) {
                return "I'm just a few lines of code, so I'm feeling great! How about you?";
            }

            // --- Feelings (Sad) ---
            if (text.includes('sad') || text.includes('bad') || text.includes('unhappy') || text.includes('cry')) {
                return "I'm sorry to hear that. Do you want to talk about it?";
            }

            // --- Feelings (Happy) ---
            if (text.includes('happy') || text.includes('good') || text.includes('great') || text.includes('excited')) {
                return "That's awesome! I love hearing positive vibes.";
            }

            // --- Identity ---
            if (text.includes('who are you') || text.includes('your name')) {
                return "I'm ChatterBot. I live in your browser and I love to chat.";
            }
            if (text.includes('who made you') || text.includes('creator')) {
                return "A human developer wrote my code to help me talk to you.";
            }
            if (text.includes('age') || text.includes('old')) {
                return "I was born just a few seconds ago when you opened this page!";
            }

            // --- Love & Compliments ---
            if (text.includes('love') || text.includes('like you')) {
                return "Aww, that's so sweet! I like chatting with you too.";
            }
            if (text.includes('smart') || text.includes('intelligent') || text.includes('clever')) {
                return "Thank you! I try my best to be helpful.";
            }
            if (text.includes('stupid') || text.includes('dumb')) {
                return "I'm still learning, so I might make mistakes. Bear with me!";
            }

            // --- Time & Weather ---
            if (text.includes('time')) return "It is " + new Date().toLocaleTimeString() + " right now.";
            if (text.includes('date')) return "Today is " + new Date().toLocaleDateString();
            if (text.includes('weather')) return "I don't have windows, but I hope it's sunny where you are!";

            // --- Jokes ---
            if (text.includes('joke')) {
                const jokes = [
                    "Why don't scientists trust atoms? Because they make up everything!",
                    "What do you call a fake noodle? An Impasta!",
                    "Why did the scarecrow win an award? Because he was outstanding in his field!",
                    "I told my wife she was drawing her eyebrows too high. She looked surprised."
                ];
                return jokes[Math.floor(Math.random() * jokes.length)];
            }

            // --- Help ---
            if (text.includes('help') || text.includes('can you do')) {
                return "I can chat about feelings, tell jokes, tell the time, and keep you company!";
            }

            // --- Goodbye ---
            if (text.includes('bye') || text.includes('see you') || text.includes('goodbye')) {
                return "Goodbye! Have a wonderful day! 👋";
            }
            if (text.includes('thanks') || text.includes('thank you')) {
                return "You're very welcome!";
            }

            // --- Default (Catch-all) ---
            const defaults = [
                "That's interesting! Tell me more.",
                "I see. Go on...",
                "I'm listening.",
                "Hmm, I'm not sure I understand, but I'm learning!",
                "Could you explain that differently?"
            ];
            return defaults[Math.floor(Math.random() * defaults.length)];
        }