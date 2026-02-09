    </div>
    <script>
    (function () {
        const DEFAULT_MAX_SIZE = 50 * 1024 * 1024;
        const inputState = new WeakMap();

        function formatBytes(bytes) {
            const value = Number(bytes || 0);
            if (!Number.isFinite(value) || value <= 0) return '0 B';
            const units = ['B', 'KB', 'MB', 'GB'];
            let unitIndex = 0;
            let size = value;
            while (size >= 1024 && unitIndex < units.length - 1) {
                size /= 1024;
                unitIndex += 1;
            }
            return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
        }

        function ensureInputId(input, index) {
            if (!input.id) {
                input.id = `upload-input-${index + 1}`;
            }
            return input.id;
        }

        function ensureInputUi(input, index) {
            const inputId = ensureInputId(input, index);
            const group = input.closest('.form-group') || input.parentElement;
            if (!group) return null;

            let dropzone = group.querySelector(`.upload-dropzone[data-for="${inputId}"]`);
            if (!dropzone) {
                dropzone = document.createElement('div');
                dropzone.className = 'upload-dropzone';
                dropzone.dataset.for = inputId;
                dropzone.tabIndex = 0;
                dropzone.setAttribute('role', 'button');
                dropzone.textContent = 'Drag and drop files here, or click to browse.';
                input.insertAdjacentElement('beforebegin', dropzone);
            }

            let summary = group.querySelector(`.upload-summary[data-for="${inputId}"]`);
            if (!summary) {
                summary = document.createElement('p');
                summary.className = 'upload-summary';
                summary.dataset.for = inputId;
                summary.textContent = 'No files selected.';
                input.insertAdjacentElement('afterend', summary);
            }

            let error = group.querySelector(`.upload-error[data-for="${inputId}"]`);
            if (!error) {
                error = document.createElement('p');
                error.className = 'upload-error';
                error.dataset.for = inputId;
                error.hidden = true;
                summary.insertAdjacentElement('afterend', error);
            }

            return { dropzone, summary, error };
        }

        function getAcceptTokens(input) {
            const accept = (input.getAttribute('accept') || '').trim();
            if (!accept) return [];
            return accept.split(',').map((token) => token.trim().toLowerCase()).filter(Boolean);
        }

        function fileMatchesAccept(file, tokens) {
            if (!tokens || tokens.length === 0) return true;
            const fileType = (file.type || '').toLowerCase();
            const fileName = (file.name || '').toLowerCase();

            return tokens.some((token) => {
                if (token.startsWith('.')) {
                    return fileName.endsWith(token);
                }
                if (token.endsWith('/*')) {
                    const prefix = token.slice(0, -1);
                    return fileType.startsWith(prefix);
                }
                return fileType === token;
            });
        }

        function validateFiles(input, files) {
            const errors = [];
            const maxSize = Number(input.dataset.maxSize || DEFAULT_MAX_SIZE);
            const tokens = getAcceptTokens(input);

            files.forEach((file) => {
                if (Number.isFinite(maxSize) && maxSize > 0 && file.size > maxSize) {
                    errors.push(`${file.name}: file is too large (max ${formatBytes(maxSize)}).`);
                }
                if (!fileMatchesAccept(file, tokens)) {
                    errors.push(`${file.name}: file type is not allowed.`);
                }
            });

            return errors;
        }

        function updateInputStatus(input, files) {
            const ui = inputState.get(input);
            if (!ui) return;

            if (!files || files.length === 0) {
                ui.summary.textContent = 'No files selected.';
                ui.error.hidden = true;
                ui.error.textContent = '';
                ui.dropzone.classList.remove('is-invalid');
                ui.dropzone.classList.remove('has-files');
                input.dataset.uploadInvalid = 'false';
                input.setCustomValidity('');
                return;
            }

            const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);
            const names = files.slice(0, 3).map((file) => file.name).join(', ');
            const suffix = files.length > 3 ? ` (+${files.length - 3} more)` : '';
            ui.summary.textContent = `${files.length} file${files.length === 1 ? '' : 's'} selected (${formatBytes(totalSize)}): ${names}${suffix}`;

            const errors = validateFiles(input, files);
            if (errors.length > 0) {
                ui.error.hidden = false;
                ui.error.textContent = errors[0];
                ui.dropzone.classList.add('is-invalid');
                ui.dropzone.classList.add('has-files');
                input.dataset.uploadInvalid = 'true';
                input.setCustomValidity(errors[0]);
            } else {
                ui.error.hidden = true;
                ui.error.textContent = '';
                ui.dropzone.classList.remove('is-invalid');
                ui.dropzone.classList.add('has-files');
                input.dataset.uploadInvalid = 'false';
                input.setCustomValidity('');
            }
        }

        function attachDropzoneBehavior(input, ui) {
            ui.dropzone.addEventListener('click', () => input.click());
            ui.dropzone.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    input.click();
                }
            });

            ['dragenter', 'dragover'].forEach((eventName) => {
                ui.dropzone.addEventListener(eventName, (event) => {
                    event.preventDefault();
                    ui.dropzone.classList.add('is-dragover');
                });
            });

            ['dragleave', 'dragend', 'drop'].forEach((eventName) => {
                ui.dropzone.addEventListener(eventName, (event) => {
                    event.preventDefault();
                    ui.dropzone.classList.remove('is-dragover');
                });
            });

            ui.dropzone.addEventListener('drop', (event) => {
                const dropped = event.dataTransfer && event.dataTransfer.files ? Array.from(event.dataTransfer.files) : [];
                if (!dropped.length) return;
                if (typeof DataTransfer === 'undefined') return;

                const transfer = new DataTransfer();
                dropped.forEach((file) => transfer.items.add(file));
                input.files = transfer.files;
                input.dispatchEvent(new Event('change', { bubbles: true }));
            });
        }

        function initUploadInput(input, index) {
            const ui = ensureInputUi(input, index);
            if (!ui) return;

            inputState.set(input, ui);
            attachDropzoneBehavior(input, ui);
            updateInputStatus(input, Array.from(input.files || []));

            input.addEventListener('change', () => {
                updateInputStatus(input, Array.from(input.files || []));
            });
        }

        function ensureFormProgress(form) {
            let progress = form.querySelector('.upload-progress');
            if (progress) return progress;

            progress = document.createElement('div');
            progress.className = 'upload-progress';
            progress.hidden = true;
            progress.innerHTML = [
                '<div class="upload-progress-track"><div class="upload-progress-bar"></div></div>',
                '<p class="upload-progress-text">Uploading: 0%</p>'
            ].join('');

            const anchor = form.querySelector('.form-actions');
            if (anchor && anchor.parentNode) {
                anchor.parentNode.insertBefore(progress, anchor);
            } else {
                form.appendChild(progress);
            }

            return progress;
        }

        function updateFormProgress(progress, percent, label) {
            const bar = progress.querySelector('.upload-progress-bar');
            const text = progress.querySelector('.upload-progress-text');
            if (bar) {
                bar.style.width = `${Math.max(0, Math.min(100, percent))}%`;
            }
            if (text) {
                text.textContent = label;
            }
        }

        function setSubmitDisabled(form, disabled) {
            form.querySelectorAll('button[type="submit"]').forEach((button) => {
                button.disabled = disabled;
                button.classList.toggle('is-loading', disabled);
            });
        }

        function initUploadForms() {
            document.querySelectorAll('form[data-upload-form="true"]').forEach((form) => {
                const progress = ensureFormProgress(form);
                let inFlight = false;

                form.addEventListener('submit', (event) => {
                    if (inFlight) {
                        event.preventDefault();
                        return;
                    }

                    const uploadInputs = Array.from(form.querySelectorAll('.js-upload-input'));
                    const hasClientValidationError = uploadInputs.some((input) => input.dataset.uploadInvalid === 'true');
                    if (hasClientValidationError) {
                        event.preventDefault();
                        uploadInputs.find((input) => input.dataset.uploadInvalid === 'true')?.focus();
                        return;
                    }

                    if (typeof XMLHttpRequest === 'undefined') {
                        return;
                    }

                    event.preventDefault();
                    const formData = new FormData(form);
                    const method = (form.method || 'POST').toUpperCase();
                    const action = form.action || window.location.href;
                    const xhr = new XMLHttpRequest();
                    xhr.open(method, action, true);
                    xhr.responseType = 'text';

                    inFlight = true;
                    setSubmitDisabled(form, true);
                    progress.hidden = false;
                    updateFormProgress(progress, 0, 'Uploading: 0%');

                    xhr.upload.addEventListener('progress', (progressEvent) => {
                        if (!progressEvent.lengthComputable) {
                            updateFormProgress(progress, 30, 'Uploading...');
                            return;
                        }
                        const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                        updateFormProgress(progress, percent, `Uploading: ${percent}%`);
                    });

                    xhr.addEventListener('load', () => {
                        inFlight = false;
                        setSubmitDisabled(form, false);

                        if (xhr.status >= 200 && xhr.status < 400) {
                            updateFormProgress(progress, 100, 'Processing response...');
                            document.open();
                            document.write(xhr.responseText);
                            document.close();
                            return;
                        }

                        progress.hidden = false;
                        updateFormProgress(progress, 100, 'Upload failed. Please try again.');
                    });

                    xhr.addEventListener('error', () => {
                        inFlight = false;
                        setSubmitDisabled(form, false);
                        progress.hidden = false;
                        updateFormProgress(progress, 100, 'Network error. Please try again.');
                    });

                    xhr.addEventListener('abort', () => {
                        inFlight = false;
                        setSubmitDisabled(form, false);
                        progress.hidden = false;
                        updateFormProgress(progress, 100, 'Upload canceled.');
                    });

                    xhr.send(formData);
                });
            });
        }

        document.querySelectorAll('.js-upload-input').forEach((input, index) => {
            initUploadInput(input, index);
        });

        initUploadForms();
    })();
    </script>
</body>
</html>
