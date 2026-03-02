/**
 * Visual Website Builder Logic
 * Pure Vanilla JS | Native Drag & Drop | Content Editable
 */

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const componentItems = document.querySelectorAll('.component-item');
    const imageUpload = document.getElementById('image-upload');
    let targetSection = null;

    // --- 1. SECTION TEMPLATES LIBRARY ---
    const templates = {
        hero: `
            <section class="builder-section hero-preview" data-type="hero">
                <div class="hero-overlay" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1000') no-repeat center/cover; padding: 100px 20px; text-align: center; color: white;">
                    <h1 contenteditable="true" style="font-size: 3rem; margin-bottom: 1rem;">Building the Future</h1>
                    <p contenteditable="true" style="font-size: 1.25rem; max-width: 600px; margin: 0 auto 2rem;">Create beautiful websites with our intuitive drag-and-drop builder. No coding required.</p>
                    <button class="editable-btn" style="padding: 1rem 2rem; background: #6366f1; color: white; border: none; border-radius: 5px; cursor: pointer;">Get Started</button>
                </div>
            </section>
        `,
        text: `
            <section class="builder-section text-preview" data-type="text" style="padding: 80px 20px; text-align: center; background: #fff;">
                <div style="max-width: 800px; margin: 0 auto;">
                    <h2 contenteditable="true" style="font-size: 2.5rem; margin-bottom: 1.5rem;">Authentic Connections</h2>
                    <p contenteditable="true" style="font-size: 1.1rem; line-height: 1.8; color: #4b5563;">Experience the power of meaningful design and strategic implementation. Our solutions are tailored to help your brand excel in the modern digital landscape.</p>
                </div>
            </section>
        `,
        image: `
            <section class="builder-section image-preview" data-type="image" style="padding: 60px 20px; display: flex; justify-content: center; background: #f9fafb;">
                <div class="image-container" style="max-width: 1000px; width: 100%; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                    <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000" alt="Editable Image" class="editable-img" style="width: 100%; display: block; cursor: pointer;">
                </div>
            </section>
        `,
        gallery: `
            <section class="builder-section gallery-preview" data-type="gallery" style="padding: 80px 20px; background: #fff;">
                <h2 contenteditable="true" style="text-align: center; margin-bottom: 3rem;">Our Work</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; max-width: 1200px; margin: 0 auto;">
                    <div style="aspect-ratio: 16/9; overflow: hidden; border-radius: 8px;"><img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600" style="width: 100%; height: 100%; object-fit: cover; cursor: pointer;" class="editable-img"></div>
                    <div style="aspect-ratio: 16/9; overflow: hidden; border-radius: 8px;"><img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600" style="width: 100%; height: 100%; object-fit: cover; cursor: pointer;" class="editable-img"></div>
                    <div style="aspect-ratio: 16/9; overflow: hidden; border-radius: 8px;"><img src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600" style="width: 100%; height: 100%; object-fit: cover; cursor: pointer;" class="editable-img"></div>
                </div>
            </section>
        `,
        cta: `
            <section class="builder-section cta-preview" data-type="cta" style="padding: 100px 20px;">
                <div style="background: #111827; color: white; padding: 60px; border-radius: 24px; text-align: center; max-width: 1000px; margin: 0 auto;">
                    <h2 contenteditable="true" style="font-size: 3rem; margin-bottom: 1.5rem;">Ready to Transform?</h2>
                    <p contenteditable="true" style="font-size: 1.25rem; margin-bottom: 2.5rem; opacity: 0.8;">Join thousands of creators building amazing things every day.</p>
                    <button class="editable-btn" style="padding: 1rem 3rem; background: #fff; color: #111827; border: none; border-radius: 50px; font-weight: 700; cursor: pointer;">Start Free Trial</button>
                </div>
            </section>
        `
    };

    // --- 2. DRAG AND DROP LOGIC (NEW & EXISTING ELEMENTS) ---
    componentItems.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('source', 'sidebar');
            e.dataTransfer.setData('type', item.dataset.type);
            item.style.opacity = '0.5';
        });

        item.addEventListener('dragend', () => {
            item.style.opacity = '1';
            cleanupDropZones();
        });
    });

    function makeSectionDraggable(section) {
        const handle = section.querySelector('.move-handle');
        if (!handle) return;

        handle.setAttribute('draggable', 'true');

        handle.addEventListener('dragstart', (e) => {
            window.draggedSection = section;
            e.dataTransfer.setData('source', 'canvas');
            section.style.opacity = '0.4';
            if (e.dataTransfer.setDragImage) {
                e.dataTransfer.setDragImage(section, 0, 0);
            }
        });

        handle.addEventListener('dragend', () => {
            section.style.opacity = '1';
            cleanupDropZones();
        });
    }

    canvas.addEventListener('dragover', (e) => {
        e.preventDefault();
        showDropZones(e.clientY);
    });

    canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        const source = e.dataTransfer.getData('source');
        const type = e.dataTransfer.getData('type');

        const activeZone = document.querySelector('.drop-zone.active');
        const insertBefore = activeZone ? activeZone.nextElementSibling : null;

        if (source === 'sidebar' && templates[type]) {
            createNewSection(type, insertBefore);
        } else if (source === 'canvas' && window.draggedSection) {
            reorderSection(window.draggedSection, insertBefore);
        }

        cleanupDropZones();
    });

    // --- 3. CANVAS CORE FUNCTIONS ---
    function createNewSection(type, insertBefore) {
        const emptyState = canvas.querySelector('.empty-state');
        if (emptyState) emptyState.remove();

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = templates[type];
        const newSection = tempDiv.firstElementChild;

        addControlsToSection(newSection);

        if (insertBefore) {
            canvas.insertBefore(newSection, insertBefore);
        } else {
            canvas.appendChild(newSection);
        }

        refreshCanvasStructure();
    }

    function reorderSection(section, insertBefore) {
        if (insertBefore === section || insertBefore === section.nextElementSibling) return;

        if (insertBefore) {
            canvas.insertBefore(section, insertBefore);
        } else {
            canvas.appendChild(section);
        }
        refreshCanvasStructure();
    }

    function addControlsToSection(section) {
        // Prevent double adding
        if (section.querySelector('.section-controls')) return;

        section.classList.add('builder-section');
        const controls = document.createElement('div');
        controls.className = 'section-controls';
        controls.innerHTML = `
            <button class="control-btn move-handle" title="Move">☩</button>
            <button class="control-btn duplicate" title="Duplicate">❐</button>
            <button class="control-btn delete" title="Delete">🗑️</button>
        `;

        section.appendChild(controls);

        controls.querySelector('.delete').addEventListener('click', (e) => {
            e.stopPropagation();
            section.remove();
            if (canvas.children.length === 0) showEmptyState();
            refreshCanvasStructure();
        });

        controls.querySelector('.duplicate').addEventListener('click', (e) => {
            e.stopPropagation();
            const clone = section.cloneNode(true);
            clone.querySelector('.section-controls')?.remove();
            addControlsToSection(clone);
            section.after(clone);
            refreshCanvasStructure();
        });

        makeSectionDraggable(section);
        initInternalInteractivity(section);
    }

    function initInternalInteractivity(section) {
        // Image replacement
        section.querySelectorAll('img').forEach(img => {
            img.classList.add('editable-img');
            if (!img.parentElement.querySelector('.img-edit-label')) {
                const label = document.createElement('div');
                label.className = 'img-edit-label';
                label.innerText = 'Click to Change Image';
                img.parentElement.style.position = 'relative';
                img.parentElement.appendChild(label);
            }

            img.addEventListener('click', (e) => {
                e.stopPropagation();
                window.activeImage = img;
                imageUpload.click();
            });
        });

        // Content editable
        section.querySelectorAll('.editable-btn, h1, h2, h3, p, span, li, a').forEach(el => {
            if (el.tagName !== 'IMG' && !el.classList.contains('section-controls') && !el.classList.contains('control-btn')) {
                el.setAttribute('contenteditable', 'true');
                el.addEventListener('click', (e) => e.stopPropagation());
            }
        });
    }

    // --- 4. INTEGRATION (IMPORT HTML) ---
    function importGeneratedHTML(html) {
        console.log('BUILDER: Importing generated HTML...');
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Extract sections or use body content
        let sections = doc.querySelectorAll('section, header, footer');
        if (sections.length === 0) {
            // Fallback: take all direct children of body
            sections = doc.body.children;
        }

        canvas.innerHTML = '';
        Array.from(sections).forEach(el => {
            // Clone to avoid reference issues
            const clone = el.cloneNode(true);
            addControlsToSection(clone);
            canvas.appendChild(clone);
        });

        if (canvas.children.length === 0) {
            showEmptyState();
        } else {
            refreshCanvasStructure();
        }
    }

    // Listen for messages from parent (React)
    window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'IMPORT_HTML') {
            importGeneratedHTML(event.data.html);
        }
    });

    // Notify parent that we're ready
    window.parent.postMessage({ type: 'BUILDER_READY' }, '*');

    // --- 5. UTILS ---
    function showDropZones(clientY) {
        document.querySelectorAll('.drop-zone').forEach(zone => {
            const rect = zone.getBoundingClientRect();
            if (clientY > rect.top - 50 && clientY < rect.bottom + 50) {
                zone.classList.add('active');
            } else {
                zone.classList.remove('active');
            }
        });
    }

    function cleanupDropZones() {
        document.querySelectorAll('.drop-zone').forEach(z => z.classList.remove('active'));
    }

    function refreshCanvasStructure() {
        document.querySelectorAll('.drop-zone').forEach(z => z.remove());
        const sections = canvas.querySelectorAll('.builder-section');
        createDropZone(canvas, sections[0]);
        sections.forEach(section => {
            createDropZone(canvas, section.nextElementSibling);
        });
    }

    function createDropZone(parent, beforeEl) {
        const zone = document.createElement('div');
        zone.className = 'drop-zone';
        if (beforeEl) parent.insertBefore(zone, beforeEl);
        else parent.appendChild(zone);
    }

    function showEmptyState() {
        canvas.innerHTML = `
            <div class="empty-state">
                <div class="empty-content">
                    <span class="large-icon">✨</span>
                    <h2>Your canvas is empty</h2>
                    <p>Drag a section from the sidebar to start building.</p>
                </div>
            </div>
        `;
    }

    // --- 6. EVENT HANDLERS ---
    imageUpload.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0] && window.activeImage) {
            const reader = new FileReader();
            reader.onload = (event) => {
                window.activeImage.src = event.target.result;
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    document.getElementById('clear-btn').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear the entire canvas?')) {
            showEmptyState();
        }
    });

    document.querySelectorAll('.view-toggles button').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.view-toggles button.active').classList.remove('active');
            btn.classList.add('active');
            canvas.className = btn.dataset.view === 'mobile' ? 'canvas mobile-view' : 'canvas desktop-view';
        });
    });

    document.getElementById('save-btn').addEventListener('click', () => {
        const cleanCanvas = canvas.cloneNode(true);
        cleanCanvas.querySelectorAll('.section-controls, .drop-zone, .img-edit-label').forEach(el => el.remove());
        cleanCanvas.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));

        const finalHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Built with BuildAI</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;line-height:1.5;color:#111827;}img{max-width:100%;height:auto;display:block;}.hero-overlay{position:relative;width:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;}@media(max-width:768px){h1{font-size:2.5rem!important;}}</style></head><body>${cleanCanvas.innerHTML}</body></html>`;

        const blob = new Blob([finalHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'website.html';
        a.click();
    });

    console.log('%c VISUAL BUILDER INITIALIZED ', 'background: #10b981; color: white; padding: 5px; font-weight: bold;');
});
