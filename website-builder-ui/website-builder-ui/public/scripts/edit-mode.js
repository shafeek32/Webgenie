/**
 * Edit Mode System - Lightweight Interactive Canvas
 * Integrates directly into generated website previews
 */

(function () {
    console.log('BUILDER: Edit Mode Initializing...');

    const canvas = document.body;
    let draggedSection = null;

    // --- 1. CORE INTERACTIVITY INITIALIZATION ---
    function initCanvas() {
        // Find main sections or container elements
        const elements = document.querySelectorAll('section, header, footer, div.hero, div.content, div.footer');

        elements.forEach(el => {
            if (el.parentElement === document.body) {
                addControlsToSection(el);
            }
        });

        refreshDropZones();
        setupDragListeners();
    }

    function addControlsToSection(section) {
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

        // Control Actions
        controls.querySelector('.delete').addEventListener('click', (e) => {
            e.stopPropagation();
            section.remove();
            refreshDropZones();
        });

        controls.querySelector('.duplicate').addEventListener('click', (e) => {
            e.stopPropagation();
            const clone = section.cloneNode(true);
            clone.querySelector('.section-controls')?.remove();
            addControlsToSection(clone);
            section.after(clone);
            refreshDropZones();
        });

        // Initialize internal elements
        initInternalInteractivity(section);

        // Setup Move Handle
        const handle = controls.querySelector('.move-handle');
        handle.setAttribute('draggable', 'true');
        handle.addEventListener('dragstart', (e) => {
            draggedSection = section;
            e.dataTransfer.setData('source', 'canvas');
            section.style.opacity = '0.4';
        });
        handle.addEventListener('dragend', () => {
            section.style.opacity = '1';
            cleanupDropZones();
        });
    }

    function initInternalInteractivity(section) {
        // Image replacement
        section.querySelectorAll('img').forEach(img => {
            const container = img.parentElement;
            container.setAttribute('data-editable-img-container', 'true');
            container.style.position = 'relative';

            if (!container.querySelector('.img-edit-label')) {
                const label = document.createElement('div');
                label.className = 'img-edit-label';
                label.innerText = 'Click to Change';
                container.appendChild(label);
            }

            img.addEventListener('click', (e) => {
                e.stopPropagation();
                window.parent.postMessage({ type: 'REQUEST_IMAGE_UPLOAD', targetId: 'current' }, '*');
                window.activeImage = img;
            });
        });

        // Text editing
        section.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, li, button').forEach(el => {
            if (!el.classList.contains('control-btn')) {
                el.setAttribute('contenteditable', 'true');
                el.addEventListener('click', (e) => e.stopPropagation());
            }
        });
    }

    // --- 2. DRAG & DROP SYSTEM ---
    function setupDragListeners() {
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
            const zones = document.querySelectorAll('.drop-zone');
            zones.forEach(zone => {
                const rect = zone.getBoundingClientRect();
                if (e.clientY > rect.top - 40 && e.clientY < rect.bottom + 40) {
                    zone.classList.add('active');
                } else {
                    zone.classList.remove('active');
                }
            });
        });

        document.addEventListener('drop', (e) => {
            e.preventDefault();
            const activeZone = document.querySelector('.drop-zone.active');
            if (!activeZone) {
                cleanupDropZones();
                return;
            }

            const insertBefore = activeZone.nextElementSibling;
            const source = e.dataTransfer.getData('source');

            if (source === 'canvas' && draggedSection) {
                if (insertBefore) canvas.insertBefore(draggedSection, insertBefore);
                else canvas.appendChild(draggedSection);
            } else if (e.dataTransfer.getData('componentType')) {
                // Request new component from parent
                const type = e.dataTransfer.getData('componentType');
                window.parent.postMessage({ type: 'ADD_COMPONENT', componentType: type, insertBeforeId: insertBefore?.id || null }, '*');
            }

            cleanupDropZones();
            refreshDropZones();
        });
    }

    function refreshDropZones() {
        document.querySelectorAll('.drop-zone').forEach(z => z.remove());
        const sections = document.querySelectorAll('.builder-section');

        createDropZone(document.body, sections[0]);
        sections.forEach(s => createDropZone(document.body, s.nextElementSibling));
    }

    function createDropZone(parent, beforeEl) {
        const zone = document.createElement('div');
        zone.className = 'drop-zone';
        if (beforeEl) parent.insertBefore(zone, beforeEl);
        else parent.appendChild(zone);
    }

    function cleanupDropZones() {
        document.querySelectorAll('.drop-zone').forEach(z => z.classList.remove('active'));
    }

    // --- 3. PARENT COMMUNICATION ---
    window.addEventListener('message', (event) => {
        if (event.data.type === 'IMAGE_SELECTED') {
            if (window.activeImage) window.activeImage.src = event.data.url;
        }
        if (event.data.type === 'INSERT_NEW_COMPONENT') {
            const temp = document.createElement('div');
            temp.innerHTML = event.data.html;
            const newEl = temp.firstElementChild;
            addControlsToSection(newEl);

            // Logic for inserting at correct position would go here
            // For now, simplify and append to show it works
            document.body.appendChild(newEl);
            refreshDropZones();
        }
    });

    // Start
    if (document.readyState === 'complete') initCanvas();
    else window.addEventListener('load', initCanvas);

})();
