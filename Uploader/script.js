// DOM Elements
        const dropArea = document.getElementById('drop-area');
        const fileInput = document.getElementById('file-input');
        const previewContainer = document.getElementById('preview-container');
        const previewImage = document.getElementById('preview-image');
        const progressBar = document.getElementById('progress-bar');
        const progressContainer = document.getElementById('progress-container');
        const statusText = document.getElementById('status-text');
        const galleryGrid = document.getElementById('gallery-grid');
        const toast = document.getElementById('toast');
        const clearBtn = document.getElementById('clear-all');

        // Constants
        const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
        const MAX_SIZE_MB = 2; // Limit size to prevent localStorage overflow

        // --- 1. Drag & Drop Event Listeners ---

        // Prevent default browser behavior (opening the file)
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        // Highlight drop area when dragging over
        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, () => dropArea.classList.add('active'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, () => dropArea.classList.remove('active'), false);
        });

        // Handle File Drop
        dropArea.addEventListener('drop', handleDrop, false);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles(files);
        }

        // Handle Click to Browse
        dropArea.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', function() {
            handleFiles(this.files);
        });

        // --- 2. File Handling & Validation ---

        function handleFiles(files) {
            if (files.length === 0) return;
            
            const file = files[0]; // Handle single file for this demo

            // Validate Type
            if (!ALLOWED_TYPES.includes(file.type)) {
                showToast('Invalid file type! Only JPG, PNG, and GIF allowed.', 'error');
                return;
            }

            // Validate Size (2MB Limit for localStorage safety)
            if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                showToast(`File too large! Max size is ${MAX_SIZE_MB}MB.`, 'error');
                return;
            }

            // Start Process
            uploadFile(file);
        }

        // --- 3. Upload Simulation & Preview ---

        function uploadFile(file) {
            // Show UI elements
            previewContainer.style.display = 'block';
            progressContainer.style.display = 'block';
            progressBar.style.width = '0%';
            statusText.textContent = 'Uploading... 0%';
            previewImage.src = ''; // Clear previous

            // FileReader to get Base64 string for preview
            const reader = new FileReader();

            reader.readAsDataURL(file);
            
            reader.onloadend = () => {
                const base64String = reader.result;
                
                // Simulate Upload Progress with setTimeout
                let progress = 0;
                const interval = setInterval(() => {
                    progress += 5;
                    progressBar.style.width = `${progress}%`;
                    statusText.textContent = `Uploading... ${progress}%`;

                    if (progress >= 100) {
                        clearInterval(interval);
                        statusText.textContent = 'Upload Complete!';
                        statusText.style.color = 'var(--success-color)';
                        
                        // Show Preview
                        previewImage.src = base64String;

                        // Save to LocalStorage
                        saveToLocalStorage(base64String);
                        
                        showToast('Image uploaded successfully!', 'success');
                    }
                }, 50); // Speed of simulation
            };
        }

        // --- 4. LocalStorage Persistence ---

        function saveToLocalStorage(imageData) {
            // Get existing images
            let images = JSON.parse(localStorage.getItem('myImages')) || [];
            
            // Add new image to start of array
            images.unshift(imageData);
            
            // Save back
            localStorage.setItem('myImages', JSON.stringify(images));
            
            // Update Gallery UI
            renderGallery();
        }

        function renderGallery() {
            const images = JSON.parse(localStorage.getItem('myImages')) || [];
            galleryGrid.innerHTML = ''; // Clear current grid

            images.forEach((imgSrc, index) => {
                const div = document.createElement('div');
                div.className = 'gallery-item';
                div.innerHTML = `<img src="${imgSrc}" alt="Saved Image">`;
                
                // Add click to delete functionality
                div.addEventListener('click', () => deleteImage(index));
                
                galleryGrid.appendChild(div);
            });

            // Show/Hide Clear Button based on content
            clearBtn.style.display = images.length > 0 ? 'block' : 'none';
        }

        function deleteImage(index) {
            if(confirm('Delete this image?')) {
                let images = JSON.parse(localStorage.getItem('myImages')) || [];
                images.splice(index, 1);
                localStorage.setItem('myImages', JSON.stringify(images));
                renderGallery();
                showToast('Image deleted.', 'error');
            }
        }

        clearBtn.addEventListener('click', () => {
            if(confirm('Clear all saved images?')) {
                localStorage.removeItem('myImages');
                renderGallery();
                showToast('All images cleared.', 'error');
            }
        });

        // --- 5. Helper Functions ---

        // Custom Toast Notification (No alerts!)
        function showToast(message, type) {
            toast.textContent = message;
            toast.className = `toast ${type} show`;
            
            // Set icon based on type
            const icon = type === 'success' ? '✅ ' : '⚠️ ';
            toast.textContent = icon + message;

            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        // Load Gallery on Page Load
        window.addEventListener('DOMContentLoaded', renderGallery);