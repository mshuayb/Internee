document.addEventListener('DOMContentLoaded', () => {
            let currentStep = 1;
            const totalSteps = 4;
            const form = document.getElementById('multiStepForm');
            
            const steps = document.querySelectorAll('.step');
            const nextBtn = document.getElementById('nextBtn');
            const prevBtn = document.getElementById('prevBtn');
            const submitBtn = document.getElementById('submitBtn');
            const progressBar = document.getElementById('progressBar');
            const stepLabels = document.querySelectorAll('.step-label');
            const formTitle = document.getElementById('formTitle');
            const summaryContent = document.getElementById('summaryContent');
            const successModal = document.getElementById('successModal');

            const titles = ["Personal Details", "Address Info", "Account Setup", "Review"];

            // --- Event Listeners ---
            nextBtn.addEventListener('click', () => {
                if (validateCurrentStep()) {
                    changeStep(1);
                }
            });

            prevBtn.addEventListener('click', () => changeStep(-1));

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                // Final validation just in case
                if(validateCurrentStep()) {
                    submitForm();
                }
            });

            // --- Core Logic ---

            function changeStep(direction) {
                const currentEl = document.querySelector(`.step[data-step="${currentStep}"]`);
                
                // Animation Out
                currentEl.style.opacity = '0';
                currentEl.style.transform = direction === 1 ? 'translateX(-20px)' : 'translateX(20px)';
                currentEl.style.transition = 'all 0.3s ease';

                setTimeout(() => {
                    currentEl.classList.remove('active-step');
                    currentEl.style = ''; // Reset inline styles

                    currentStep += direction;
                    const nextEl = document.querySelector(`.step[data-step="${currentStep}"]`);
                    nextEl.classList.add('active-step');

                    // Animation In
                    nextEl.style.opacity = '0';
                    nextEl.style.transform = direction === 1 ? 'translateX(20px)' : 'translateX(-20px)';
                    
                    // Trigger reflow
                    void nextEl.offsetWidth; 
                    
                    nextEl.style.transition = 'all 0.3s ease';
                    nextEl.style.opacity = '1';
                    nextEl.style.transform = 'translateX(0)';

                    if (currentStep === totalSteps) generateSummary();
                    updateUI();
                }, 300);
            }

            function updateUI() {
                formTitle.textContent = titles[currentStep - 1];
                progressBar.style.width = `${(currentStep / totalSteps) * 100}%`;
                
                stepLabels.forEach((lbl, idx) => {
                    if (idx < currentStep) lbl.classList.add('active');
                    else lbl.classList.remove('active');
                });

                prevBtn.disabled = currentStep === 1;
                if (currentStep === totalSteps) {
                    nextBtn.style.display = 'none';
                    submitBtn.style.display = 'inline-flex';
                } else {
                    nextBtn.style.display = 'inline-flex';
                    submitBtn.style.display = 'none';
                }
            }

            /**
             * ROBUST VALIDATION
             * This function treats ALL inputs on the current step as REQUIRED.
             */
            function validateCurrentStep() {
                const stepEl = document.querySelector(`.step[data-step="${currentStep}"]`);
                const inputs = stepEl.querySelectorAll('input');
                let isStepValid = true;

                inputs.forEach(input => {
                    const val = input.value.trim();
                    const group = input.closest('.input-group');
                    const errorMsg = group.querySelector('.error-message');
                    let errorText = "";

                    // 1. Check if empty (All fields required)
                    if (val === "") {
                        errorText = "This field is required.";
                        isStepValid = false;
                    }
                    // 2. Specific Validations (only if not empty)
                    else if (input.id === 'email') {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(val)) {
                            errorText = "Please enter a valid email address.";
                            isStepValid = false;
                        }
                    }
                    else if (input.id === 'fullName' && val.length < 3) {
                        errorText = "Name must be at least 3 characters.";
                        isStepValid = false;
                    }
                    else if (input.id === 'username' && val.length < 4) {
                        errorText = "Username too short (min 4).";
                        isStepValid = false;
                    }
                    else if (input.id === 'password' && val.length < 6) {
                        errorText = "Password too short (min 6).";
                        isStepValid = false;
                    }
                    else if (input.id === 'confirmPassword') {
                        const pwd = document.getElementById('password').value;
                        if (val !== pwd) {
                            errorText = "Passwords do not match.";
                            isStepValid = false;
                        }
                    }

                    // Apply Error Styles
                    if (!isStepValid && errorText) {
                        // Only show error for THIS specific input if it failed
                        if (errorText !== "") {
                            group.classList.add('error');
                            if(errorMsg) errorMsg.textContent = errorText;
                            console.log(`Validation failed for ${input.id}: ${errorText}`);
                        }
                    } else {
                        group.classList.remove('error');
                    }
                });

                return isStepValid;
            }

            function generateSummary() {
                const data = Object.fromEntries(new FormData(form));
                summaryContent.innerHTML = '';
                
                const labels = {
                    fullName: "Name", email: "Email", phone: "Phone",
                    address: "Address", city: "City", zip: "Zip", username: "Username"
                };

                for (let [key, value] of Object.entries(data)) {
                    if (key.includes('password')) continue;
                    summaryContent.innerHTML += `
                        <div class="summary-item">
                            <h4>${labels[key] || key}</h4>
                            <p>${value}</p>
                        </div>
                    `;
                }
            }

            function submitForm() {
                submitBtn.textContent = "Processing...";
                submitBtn.disabled = true;
                setTimeout(() => {
                    successModal.classList.add('open');
                }, 1500);
            }
        });