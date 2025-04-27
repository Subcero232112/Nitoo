document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Selectores Globales y Estado ---
    const body = document.body;
    const root = document.documentElement;
    const headerLogo = document.getElementById('header-logo');
    const mainContent = document.getElementById('main-content');
    const introAnimation = document.getElementById('intro-animation');

    // Estado
    let currentLang = 'es';
    let particlesActive = true;

    // --- 2. Datos Simulados ---
    const videoDataStore = {
        'peli-1': { title: "Título Película/Serie 1", videoSrc: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1", views: "1.2M", date: "2025-01-15", description: "Descripción detallada 1...", related: [ { id: 'peli-3', title: 'Título 3', imgSrc: 'https://via.placeholder.com/100x56/1a1a1a/theme?text=R3' }, { id: 'peli-4', title: 'Título 4', imgSrc: 'https://via.placeholder.com/100x56/1a1a1a/theme?text=R4' } ]},
        'peli-2': { title: "Título Película/Serie 2 (Largo)", videoSrc: "https://www.youtube.com/embed/VIDEO_ID_2?autoplay=1", views: "850K", date: "2025-02-20", description: "Descripción 2...", related: [ { id: 'peli-1', title: 'Título 1', imgSrc: 'https://via.placeholder.com/100x56/1a1a1a/theme?text=R1' } ]},
        'peli-3': { title: "Título 3", videoSrc: "https://www.youtube.com/embed/VIDEO_ID_3?autoplay=1", views: "2.5M", date: "2024-12-01", description: "Descripción 3...", related: []},
        'peli-4': { title: "Título 4", videoSrc: "https://www.youtube.com/embed/VIDEO_ID_4?autoplay=1", views: "500K", date: "2025-03-10", description: "Descripción 4...", related: []},
        'peli-5': { title: "Título 5", videoSrc: "https://www.youtube.com/embed/VIDEO_ID_5?autoplay=1", views: "990K", date: "2025-04-01", description: "Descripción 5...", related: []},
        'peli-6': { title: "Título 6", videoSrc: "https://www.youtube.com/embed/VIDEO_ID_6?autoplay=1", views: "1.8M", date: "2025-01-25", description: "Descripción 6...", related: []},
        // Añade más... usa IDs únicos
    };

    const translations = {
        es: {
            page_title: "Pornitoo - Presentado por Subcero X Evilgado",
            search_placeholder: "Buscar títulos...", search_button: "Buscar",
            genre_select: "Género", genre_action: "Acción", genre_comedy: "Comedia",
            login_tooltip: "Iniciar sesión", chat_tooltip: "Chat", settings_tooltip: "Configuración",
            popular_title: "Populares Ahora",
            chat_title: "Chat de Pornitoo", chat_welcome: "¡Hola! Bienvenido al chat. (Demo)", chat_input_placeholder: "Escribe un mensaje...",
            settings_title: "Ajustes", settings_theme_title: "Tema de Color", settings_language_title: "Idioma", settings_other_title: "Otros Ajustes",
            settings_particles: "Efecto Partículas:", settings_more_soon: "(Más ajustes próximamente...)",
            login_modal_title: "Iniciar Sesión / Registro", login_modal_text: "Funcionalidad no implementada en esta demo.",
            login_google: "Entrar con Google (Demo)", login_create_account: "Crear Cuenta (Demo)",
            back_button: "Volver", views_count: "Vistas", published_date: "Publicado:", related_videos_title: "Más Videos",
            poster_title_prefix: "Título" // Si quieres prefijo para posters generados
        },
        en: {
            page_title: "Pornitoo - Presented by Subcero X Evilgado",
            search_placeholder: "Search titles...", search_button: "Search",
            genre_select: "Genre", genre_action: "Action", genre_comedy: "Comedy",
            login_tooltip: "Login", chat_tooltip: "Chat", settings_tooltip: "Settings",
            popular_title: "Popular Now",
            chat_title: "Pornitoo Chat", chat_welcome: "Hi! Welcome to the chat. (Demo)", chat_input_placeholder: "Type a message...",
            settings_title: "Settings", settings_theme_title: "Color Theme", settings_language_title: "Language", settings_other_title: "Other Settings",
            settings_particles: "Particle Effect:", settings_more_soon: "(More settings coming soon...)",
            login_modal_title: "Login / Sign Up", login_modal_text: "Functionality not implemented in this demo.",
            login_google: "Sign in with Google (Demo)", login_create_account: "Create Account (Demo)",
            back_button: "Back", views_count: "Views", published_date: "Published:", related_videos_title: "More Videos",
            poster_title_prefix: "Title"
        }
    };

    // --- 3. Funciones Utilitarias ---
    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => document.querySelectorAll(selector);
    const saveToLocalStorage = (key, value) => { try { localStorage.setItem(key, value); } catch (e) { console.error("LocalStorage error:", e); } };
    const loadFromLocalStorage = (key, defaultValue) => { try { return localStorage.getItem(key) || defaultValue; } catch (e) { console.error("LocalStorage error:", e); return defaultValue; } };

    // --- 4. Gestor de Temas ---
    const themeManager = (() => {
        const swatches = $$('.theme-swatch');
        const themes = { /* Definido en CSS :root, pero podemos tener valores JS si es necesario */
             green: { '--primary-color': '#00ff00', '--neon-glow': '0 0 10px rgba(0, 255, 0, 0.7)' },
             red: { '--primary-color': '#ff1a1a', '--neon-glow': '0 0 12px rgba(255, 26, 26, 0.8)' },
             purple: { '--primary-color': '#9933ff', '--neon-glow': '0 0 12px rgba(153, 51, 255, 0.8)' },
             blue: { '--primary-color': '#007bff', '--neon-glow': '0 0 10px rgba(0, 123, 255, 0.7)' }
        };

        function applyTheme(themeName) {
            const theme = themes[themeName];
            if (!theme) return;

            Object.entries(theme).forEach(([variable, value]) => {
                root.style.setProperty(variable, value);
            });

            swatches.forEach(swatch => {
                swatch.classList.toggle('active', swatch.dataset.theme === themeName);
            });

            // Actualizar color de imágenes placeholder si usan 'theme'
             updatePlaceholderImageColors(theme['--primary-color'] || themes.green['--primary-color']);

            saveToLocalStorage('selectedThemePornitoo', themeName);
            console.log(`Theme applied: ${themeName}`);
        }

        function updatePlaceholderImageColors(colorHex) {
            const color = colorHex.substring(1); // Quitar #
             $$('img[src*="via.placeholder.com"]').forEach(img => {
                 if (img.src.includes('/theme?')) { // Solo actualiza si es una imagen de tema
                     // Simple reemplazo, asume formato .../color?text=...
                    img.src = img.src.replace(/\/[0-9a-fA-F]+\?text=/, `/${color}?text=`);
                 } else if(img.src.includes('/00ff00?')){ // O si usa el verde por defecto
                     img.src = img.src.replace('/00ff00?text=', `/${color}?text=`);
                 }
             });
         }


        function init() {
            swatches.forEach(swatch => {
                swatch.addEventListener('click', () => applyTheme(swatch.dataset.theme));
            });
            const savedTheme = loadFromLocalStorage('selectedThemePornitoo', 'green');
            applyTheme(savedTheme);
        }

        return { init, applyTheme };
    })();

    // --- 5. Gestor de Idioma ---
    const languageManager = (() => {
        const langButtons = $$('.language-button');

        function setLanguage(lang) {
            if (!translations[lang]) {
                console.warn(`Language ${lang} not found in translations.`);
                return;
            }
            currentLang = lang;
            document.documentElement.lang = lang; // Actualizar atributo lang del HTML

            $$('[data-translate-key]').forEach(el => {
                const key = el.dataset.translateKey;
                const translation = translations[lang][key];

                if (translation !== undefined) {
                    if (el.placeholder !== undefined) {
                        el.placeholder = translation;
                    } else if (el.title !== undefined && el.dataset.tooltip === undefined) { // No sobrescribir tooltips dinámicos
                         el.title = translation;
                    } else if (el.dataset.tooltip !== undefined){
                        el.dataset.tooltip = translation; // Para los tooltips personalizados
                    } else {
                        el.textContent = translation;
                    }
                } else {
                     console.warn(`Translation key "${key}" not found for language "${lang}".`);
                }
            });

             langButtons.forEach(button => {
                 button.classList.toggle('active', button.dataset.lang === lang);
             });

            saveToLocalStorage('selectedLangPornitoo', lang);
            console.log(`Language set to: ${lang}`);
        }

        function init() {
            langButtons.forEach(button => {
                button.addEventListener('click', () => setLanguage(button.dataset.lang));
            });
            const savedLang = loadFromLocalStorage('selectedLangPornitoo', 'es');
            setLanguage(savedLang);
        }

        return { init, setLanguage, getCurrentLang: () => currentLang };
    })();

    // --- 6. Gestor de Partículas ---
    const particleManager = (() => {
        const container = $('#particles');
        const toggle = $('#particle-toggle');
        let isActive = true;

        function createParticles(count = 50) {
            if (!container) return;
            container.innerHTML = ''; // Limpiar existentes
             const currentPrimaryColor = getComputedStyle(root).getPropertyValue('--primary-color').trim();

            for (let i = 0; i < count; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                particle.style.backgroundColor = currentPrimaryColor; // Usar color actual
                const size = Math.random() * 3 + 1;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                // Posición inicial aleatoria en X y abajo
                const xStart = Math.random() * 100;
                particle.style.left = `${xStart}vw`;
                particle.style.setProperty('--x-start', `${xStart}vw`);
                // Destino X aleatorio
                 particle.style.setProperty('--x-end', `${xStart + (Math.random() * 40 - 20)}vw`); // +/- 20vw de deriva

                const duration = Math.random() * 20 + 15; // 15 a 35 segundos
                particle.style.animationDuration = `${duration}s`;
                particle.style.animationDelay = `-${Math.random() * duration}s`; // Inicio aleatorio
                container.appendChild(particle);
            }
            container.classList.toggle('active', isActive);
        }

        function toggleParticles(forceState) {
             isActive = forceState !== undefined ? forceState : !isActive;
             if(container) container.classList.toggle('active', isActive);
             if(toggle) toggle.checked = isActive;
             saveToLocalStorage('particlesActivePornitoo', isActive);
             console.log(`Particles ${isActive ? 'enabled' : 'disabled'}`);
         }


        function init() {
             isActive = loadFromLocalStorage('particlesActivePornitoo', 'true') === 'true';
            if (toggle) {
                toggle.checked = isActive;
                toggle.addEventListener('change', () => toggleParticles(toggle.checked));
            }
             createParticles(); // Crear al inicio
             // Listener para recrear partículas si cambia el tema (opcional, puede ser costoso)
             // document.addEventListener('themeChanged', createParticles);
         }

        return { init, toggle: toggleParticles, create: createParticles };
    })();


    // --- 7. Gestor de UI (Modales, Paneles) ---
    const uiManager = (() => {
        const settingsPanel = $('#settings-panel');
        const settingsButton = $('#settings-button');
        const closeSettingsButton = $('#close-settings-button');

        const chatModal = $('#chat-modal');
        const chatButton = $('#chat-button'); // Icono en header
        const floatingChatButton = $('#floating-chat-button'); // Botón flotante
        const closeChatButton = chatModal?.querySelector('.close-chat');

        const loginModal = $('#login-modal');
        const loginButton = $('#user-login-button');
        const closeLoginButton = $('#close-login-modal');

        function togglePanel(panel) {
            panel?.classList.toggle('visible');
        }
        function toggleModal(modal) {
            modal?.classList.toggle('visible');
        }

        function init() {
            // Settings Panel
            if (settingsButton && settingsPanel && closeSettingsButton) {
                settingsButton.addEventListener('click', () => togglePanel(settingsPanel));
                closeSettingsButton.addEventListener('click', () => togglePanel(settingsPanel));
            }
            // Chat Modal
            if (chatModal && closeChatButton) {
                const openChat = () => chatModal.classList.add('active');
                 if (chatButton) chatButton.addEventListener('click', openChat);
                 if (floatingChatButton) floatingChatButton.addEventListener('click', openChat);
                closeChatButton.addEventListener('click', () => chatModal.classList.remove('active'));
            }
            // Login Modal
             if (loginModal && loginButton && closeLoginButton) {
                 loginButton.addEventListener('click', () => toggleModal(loginModal));
                 closeLoginButton.addEventListener('click', () => toggleModal(loginModal));
                 // Cerrar al hacer clic fuera
                 loginModal.addEventListener('click', (e) => { if (e.target === loginModal) toggleModal(loginModal); });
             }
        }

        return { init, toggleModal };
    })();


    // --- 8. Lógica Específica de Página ---
    const pageLogic = (() => {

        function initIndexPage() {
            console.log("Initializing Index Page");
            const posterContainer = $('#poster-container');
            if (!posterContainer) return;

             posterContainer.innerHTML = ''; // Limpiar placeholders

            // Generar posters desde los datos
            Object.entries(videoDataStore).forEach(([id, data]) => {
                if (!data || !data.title) return; // Saltar si no hay datos básicos

                 // Usar imagen relacionada si existe, si no, placeholder
                 const imgSrc = (data.related && data.related.length > 0 && data.related[0].imgSrc)
                                ? data.related[0].imgSrc.replace('100x56', '200x200') // Intentar usar imagen relacionada (ajustar tamaño)
                                : `https://via.placeholder.com/200x200/${loadFromLocalStorage('selectedThemePornitoo','green') === 'green' ? '00ff00' : 'theme'}?text=${encodeURIComponent(data.title.substring(0, 10))}`;


                const posterItem = document.createElement('a'); // Ahora son enlaces
                posterItem.href = `detail.html?id=${id}`;
                posterItem.classList.add('poster-item');
                posterItem.dataset.id = id;
                posterItem.innerHTML = `
                    <div class="poster">
                        <img src="${imgSrc}" alt="${data.title}" loading="lazy">
                    </div>
                    <h3 class="poster-title">${data.title}</h3>
                `;
                posterContainer.appendChild(posterItem);
            });

             // No se necesita listener aquí, el enlace hace el trabajo
        }

        function initDetailPage() {
            console.log("Initializing Detail Page");
            const urlParams = new URLSearchParams(window.location.search);
            const itemId = urlParams.get('id');

            const detailTitle = $('#detail-title');
            const detailViews = $('#detail-views');
            const detailDate = $('#detail-date');
            const detailDescription = $('#detail-description');
            const videoPlayerIframe = $('#video-player-iframe');
            const relatedContainer = $('#related-items-container');
            const pageTitleElement = $('#detail-page-title'); // Para el <title>

            if (!itemId) {
                console.error("No item ID found in URL");
                 if (detailTitle) detailTitle.textContent = "Error: ID no encontrado";
                 // Podrías redirigir a index.html
                 // window.location.href = 'index.html';
                return;
            }

            const data = videoDataStore[itemId];
            if (!data) {
                 console.error(`Data not found for item ID: ${itemId}`);
                 if (detailTitle) detailTitle.textContent = "Error: Contenido no encontrado";
                return;
            }

            // Poblar contenido
            if (pageTitleElement) pageTitleElement.textContent = `${data.title || 'Detalle'} - Pornitoo`;
            if (detailTitle) detailTitle.textContent = data.title || 'Sin Título';
            if (detailViews) detailViews.textContent = data.views || '---';
            if (detailDate) detailDate.textContent = data.date || '---';
            if (detailDescription) detailDescription.textContent = data.description || 'No hay descripción.';
            if (videoPlayerIframe) videoPlayerIframe.src = data.videoSrc || '';

            // Poblar relacionados
            if (relatedContainer) {
                relatedContainer.innerHTML = ''; // Limpiar placeholders
                if (data.related && data.related.length > 0) {
                    data.related.forEach(related => {
                         // Solo crea el enlace si el video relacionado existe en nuestros datos
                         if (videoDataStore[related.id]) {
                             const relatedLink = document.createElement('a');
                             relatedLink.href = `detail.html?id=${related.id}`;
                             relatedLink.classList.add('related-item');
                             relatedLink.innerHTML = `
                                <img src="${related.imgSrc || 'https://via.placeholder.com/100x56'}" alt="${related.title}" loading="lazy">
                                <div class="related-item-info">
                                    <h5>${related.title || 'Video Relacionado'}</h5>
                                </div>
                            `;
                            relatedContainer.appendChild(relatedLink);
                         }
                    });
                } else {
                    relatedContainer.innerHTML = `<p style="opacity: 0.7;" data-translate-key="no_related_videos">No hay videos relacionados.</p>`;
                     // Asegurarse de traducir este mensaje también si existe la key
                     languageManager.setLanguage(languageManager.getCurrentLang());
                }
            }
        }

        function init() {
            // Determinar qué página estamos cargando
            if ($('#poster-container')) { // Elemento único de index.html
                initIndexPage();
            } else if ($('#detail-view-content')) { // Elemento único de detail.html
                initDetailPage();
            }

             // Listener para el logo (común a ambas páginas)
             if (headerLogo) {
                 headerLogo.addEventListener('click', (e) => {
                     e.preventDefault(); // Prevenir si es un enlace
                     window.location.href = 'index.html'; // Siempre va al index
                 });
             }
        }

        return { init };
    })();


    // --- 9. Inicialización General ---
    function initializeApp() {
        console.log("Initializing App...");
        // Inicializar módulos en orden
        themeManager.init(); // Carga tema guardado primero
        languageManager.init(); // Carga idioma y traduce UI inicial
        particleManager.init(); // Configura partículas según guardado
        uiManager.init(); // Configura listeners para modales/paneles
        pageLogic.init(); // Ejecuta lógica específica de la página actual

        // Intro animation fade out logic (si aplica)
        const introDuration = loadFromLocalStorage('introPlayedOnce', 'false') === 'true' ? 0 : 5000; // 0 si ya se vio
         if (introAnimation && introDuration > 0) {
             mainContent.style.opacity = '0'; // Ocultar contenido principal al inicio
             setTimeout(() => {
                introAnimation.style.opacity = '0';
                setTimeout(() => { introAnimation.style.display = 'none'; }, 500);
                mainContent.style.opacity = '1';
                saveToLocalStorage('introPlayedOnce', 'true'); // Marcar como vista
             }, introDuration - 500);
         } else {
             if(introAnimation) introAnimation.style.display = 'none';
             mainContent.style.opacity = '1'; // Mostrar directamente si no hay intro
         }
        console.log("App Initialized.");
    }

    initializeApp();

}); // Fin DOMContentLoaded
