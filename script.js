document.addEventListener('DOMContentLoaded', () => {
    // Utility: Escape HTML to prevent XSS
    function escapeHTML(str) {
        if (!str) return "";
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Reveal animations on scroll
    const sections = document.querySelectorAll('.fade-in-section');

    const revealSection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    };

    const sectionObserver = new IntersectionObserver(revealSection, {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.background = 'var(--bg-glass)';
                navLinks.style.padding = '2rem';
                navLinks.style.backdropFilter = 'blur(10px)';
                navLinks.style.borderBottom = '1px solid var(--border-glass)';
            }
        });
    }

    // Header scroll background modification
    const header = document.querySelector('.glass-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(5, 5, 8, 0.85)';
            header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
        } else {
            header.style.background = 'rgba(10, 10, 15, 0.7)';
            header.style.boxShadow = 'none';
        }
    });

    // Top announcement bar dismiss
    const topBar = document.getElementById('topBar');
    const closeTopBar = document.getElementById('closeTopBar');
    const mainHeader = document.getElementById('mainHeader');

    if (closeTopBar && topBar && mainHeader) {
        closeTopBar.addEventListener('click', () => {
            topBar.classList.add('hidden');
            mainHeader.style.top = '0';
        });
    }

    // Modals functionality
    const authModal = document.getElementById('auth-modal');
    const paymentModal = document.getElementById('payment-modal');
    const authBtn = document.getElementById('authBtn');
    const closeAuthBtn = document.getElementById('closeAuth');
    const closePaymentBtn = document.getElementById('closePayment');
    const purchaseBtns = document.querySelectorAll('.purchase-btn');
    
    // Auth logic
    let isLoggedIn = false;
    let userRole = 'client';
    let selectedProduct = '';
    let selectedAmount = 0;

    // Check login state on load securely
    const userBadge = document.getElementById('userBadge');
    const userAvatar = document.getElementById('userAvatar');
    const userNameEl = document.getElementById('userName');
    const authBtn2 = document.getElementById('authBtn2');
    const dashboardNavItem = document.getElementById('dashboard-nav-item');
    const dashboardBtn = document.getElementById('dashboardBtn');

    function showUserBadge(name, role) {
        if (authBtn) authBtn.style.display = 'none';
        if (dashboardNavItem) dashboardNavItem.style.display = 'block';
        if (userBadge) {
            userBadge.style.display = 'flex';
            const initial = (name || 'U').charAt(0).toUpperCase();
            if (userAvatar) userAvatar.textContent = initial;
            if (userNameEl) userNameEl.textContent = name || 'User';
        }
        userRole = role || 'client';
    }

    function showLoginBtn() {
        if (authBtn) authBtn.style.display = '';
        if (dashboardNavItem) dashboardNavItem.style.display = 'none';
        if (userBadge) userBadge.style.display = 'none';
        showSection('home');
    }

    if (authBtn2) {
        authBtn2.addEventListener('click', (e) => {
            e.preventDefault();
            fetch('api/auth.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'action=logout'
            }).then(r => r.json()).then(data => {
                isLoggedIn = false;
                showLoginBtn();
                alert(data.message);
            });
        });
    }

    fetch('api/auth.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'action=check'
    })
    .then(res => res.json())
    .then(data => {
        if (data.success && data.logged_in) {
            isLoggedIn = true;
            showUserBadge(data.name, data.role);
        }
    })
    .catch(err => console.error("Database connection missing:", err));

    if (authBtn) {
        authBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (isLoggedIn) {
                fetch('api/auth.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: 'action=logout'
                }).then(res => res.json()).then(data => {
                    isLoggedIn = false;
                    showLoginBtn();
                    alert(data.message);
                });
            } else {
                authModal.classList.add('show');
            }
        });
    }

    if (closeAuthBtn) {
        closeAuthBtn.addEventListener('click', () => {
            authModal.classList.remove('show');
        });
    }

    const authForm = document.getElementById('authForm');
    const toggleAuthMode = document.getElementById('toggleAuthMode');
    const authTitle = document.getElementById('authTitle');
    const authSubtitle = document.getElementById('authSubtitle');
    const authAction = document.getElementById('authAction');
    const nameGroup = document.getElementById('nameGroup');
    const nameInput = document.getElementById('auth-name');
    const authSubmitBtn = document.getElementById('authSubmitBtn');

    if (toggleAuthMode) {
        toggleAuthMode.addEventListener('click', (e) => {
            e.preventDefault();
            if (authAction.value === 'login') {
                authAction.value = 'register';
                authTitle.textContent = 'Create Account';
                authSubtitle.textContent = 'Join us today to get started.';
                nameGroup.style.display = 'block';
                nameInput.required = true;
                authSubmitBtn.textContent = 'Sign Up';
                toggleAuthMode.textContent = 'Already have an account? Log In';
            } else {
                authAction.value = 'login';
                authTitle.textContent = 'Welcome Back';
                authSubtitle.textContent = 'Log in to safely access your dashboard.';
                nameGroup.style.display = 'none';
                nameInput.required = false;
                authSubmitBtn.textContent = 'Log In';
                toggleAuthMode.textContent = "Don't have an account? Sign Up";
            }
        });
    }

    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(authForm);
            fetch('api/auth.php', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    isLoggedIn = true;
                    showUserBadge(data.user || document.getElementById('username').value.split('@')[0], data.role);
                    authModal.classList.remove('show');
                    alert(data.message);
                    authForm.reset();
                    if (authAction.value === 'register') {
                        toggleAuthMode.click();
                    }
                } else {
                    alert(data.message);
                }
            })
            .catch(err => {
                alert("Error connecting to database. Is MySQL running on XAMPP?");
                console.error(err);
            });
        });
    }

    // Dashboard Router & Data Loading
    const allMainSections = document.querySelectorAll('main > section:not(.dashboard-section)');
    const clientDashboard = document.getElementById('client-dashboard');
    const adminDashboard = document.getElementById('admin-dashboard');

    function showSection(sectionId) {
        if (sectionId === 'home') {
            allMainSections.forEach(s => s.style.display = 'block');
            if (clientDashboard) clientDashboard.style.display = 'none';
            if (adminDashboard) adminDashboard.style.display = 'none';
        } else if (sectionId === 'dashboard') {
            allMainSections.forEach(s => s.style.display = 'none');
            if (userRole === 'admin') {
                if (adminDashboard) adminDashboard.style.display = 'block';
                if (clientDashboard) clientDashboard.style.display = 'none';
                loadAdminDashboard();
            } else {
                if (clientDashboard) clientDashboard.style.display = 'block';
                if (adminDashboard) adminDashboard.style.display = 'none';
                loadClientDashboard();
            }
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (dashboardBtn) {
        dashboardBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('dashboard');
        });
    }

    // Back to home if clicking logo
    const logoLink = document.querySelector('.logo a');
    if (logoLink) {
        logoLink.addEventListener('click', (e) => {
            if (clientDashboard.style.display === 'block' || adminDashboard.style.display === 'block') {
                e.preventDefault();
                showSection('home');
            }
        });
    }

    function loadClientDashboard() {
        const ordersList = document.getElementById('orders-list');
        const ticketsList = document.getElementById('tickets-list');

        fetch('api/get_orders.php')
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    if (data.orders.length === 0) {
                        ordersList.innerHTML = '<p class="loading-text">You haven\'t placed any orders yet.</p>';
                    } else {
                        let html = `<table class="dashboard-table">
                            <thead><tr><th>ID</th><th>Product</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                            <tbody>`;
                        data.orders.forEach(o => {
                            html += `<tr>
                                <td>#${o.id}</td>
                                <td>${escapeHTML(o.product)}</td>
                                <td>₹${parseFloat(o.amount).toFixed(0)}</td>
                                <td><span class="status-badge ${escapeHTML(o.status)}">${escapeHTML(o.status)}</span></td>
                                <td>${new Date(o.created_at).toLocaleDateString()}</td>
                            </tr>`;
                        });
                        html += `</tbody></table>`;
                        ordersList.innerHTML = html;
                    }
                }
            });

        fetch('api/get_tickets.php')
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    if (data.tickets.length === 0) {
                        ticketsList.innerHTML = '<p class="loading-text">No active support tickets.</p>';
                    } else {
                        let html = '';
                        data.tickets.forEach(t => {
                            html += `<div class="ticket-item">
                                <h4>${escapeHTML(t.subject)} <span class="status-badge ${escapeHTML(t.status)}" style="float:right;">${escapeHTML(t.status)}</span></h4>
                                <p>${escapeHTML(t.message)}</p>
                                <small>${new Date(t.created_at).toLocaleString()}</small>
                            </div>`;
                        });
                        ticketsList.innerHTML = html;
                    }
                }
            });
    }

    function loadAdminDashboard() {
        fetch('api/admin_stats.php')
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('stat-revenue').textContent = `₹${parseFloat(data.stats.total_revenue).toLocaleString('en-IN')}`;
                    document.getElementById('stat-orders').textContent = data.stats.total_orders;
                    document.getElementById('stat-users').textContent = data.stats.total_users;
                }
            });

        fetch('api/admin_orders.php')
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    const list = document.getElementById('admin-orders-list');
                    let html = `<table class="dashboard-table">
                        <thead><tr><th>ID</th><th>Customer</th><th>Product</th><th>Status</th><th>Action</th></tr></thead>
                        <tbody>`;
                    data.orders.forEach(o => {
                        html += `<tr>
                            <td>#${o.id}</td>
                            <td><strong>${escapeHTML(o.customer_name)}</strong><br><small>${escapeHTML(o.customer_email)}</small></td>
                            <td>${escapeHTML(o.product)} (₹${parseFloat(o.amount).toFixed(0)})</td>
                            <td><span class="status-badge ${escapeHTML(o.status)}">${escapeHTML(o.status)}</span></td>
                            <td>
                                <select onchange="updateOrderStatus(${o.id}, this.value)" class="glass-card" style="padding: 0.2rem; font-size: 0.8rem;">
                                    <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>Pending</option>
                                    <option value="in-progress" ${o.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                                    <option value="completed" ${o.status === 'completed' ? 'selected' : ''}>Completed</option>
                                    <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                                </select>
                            </td>
                        </tr>`;
                    });
                    html += `</tbody></table>`;
                    list.innerHTML = html;
                }
            });
    }

    window.updateOrderStatus = function(orderId, newStatus) {
        const formData = new FormData();
        formData.append('order_id', orderId);
        formData.append('status', newStatus);

        fetch('api/update_order.php', {
            method: 'POST',
            body: formData
        }).then(r => r.json()).then(data => {
            if (data.success) {
                alert(data.message);
                loadAdminDashboard();
            } else {
                alert(data.message);
            }
        });
    }

    // Payment logic
    purchaseBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!isLoggedIn) {
                alert('Please log in or create an account before purchasing.');
                authModal.classList.add('show');
                return;
            }
            
            const productCard = btn.closest('.product-info');
            if (productCard) {
                selectedProduct = productCard.querySelector('h3').textContent;
                const priceStr = productCard.querySelector('.price').textContent;
                selectedAmount = parseFloat(priceStr.replace(/[₹$]/, ''));
            }

            paymentModal.classList.add('show');
        });
    });

    if (closePaymentBtn) {
        closePaymentBtn.addEventListener('click', () => {
            paymentModal.classList.remove('show');
        });
    }

    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData();
            formData.append('product', selectedProduct);
            formData.append('amount', selectedAmount);
            
            fetch('api/checkout.php', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                paymentModal.classList.remove('show');
                alert(data.message);
                if (data.success) paymentForm.reset();
            })
            .catch(err => {
                alert("Transaction failed. Could not reach server.");
                console.error(err);
            });
        });
    }

    const ticketModal = document.getElementById('ticket-modal');
    const closeTicketBtn = document.getElementById('closeTicket');
    const ticketForm = document.getElementById('ticketForm');
    
    // Using event delegation for createTicketBtn since it might be re-rendered or accessed late
    document.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'createTicketBtn') {
            e.preventDefault();
            ticketModal.classList.add('show');
        }
    });

    if (closeTicketBtn) {
        closeTicketBtn.addEventListener('click', () => {
            ticketModal.classList.remove('show');
        });
    }

    if (ticketForm) {
        ticketForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(ticketForm);
            fetch('api/create_ticket.php', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                alert(data.message);
                if (data.success) {
                    ticketModal.classList.remove('show');
                    ticketForm.reset();
                    loadClientDashboard(); // Refresh tickets list
                }
            });
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.classList.remove('show');
        }
        if (e.target === paymentModal) {
            paymentModal.classList.remove('show');
        }
        if (e.target === ticketModal) {
            ticketModal.classList.remove('show');
        }
    });

    // Theme Toggle Logic
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const htmlElement = document.documentElement;

    // Check for saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }
    // AI Chat Assistant Logic
    const chatBtn = document.getElementById('ai-chat-btn');
    const chatWindow = document.getElementById('ai-chat-window');
    const closeChat = document.getElementById('closeChat');
    const chatInput = document.getElementById('chat-input');
    const sendChat = document.getElementById('send-chat');
    const chatMessages = document.getElementById('chat-messages');

    if (chatBtn) {
        chatBtn.addEventListener('click', () => {
            chatWindow.classList.toggle('show');
        });
    }

    if (closeChat) {
        closeChat.addEventListener('click', () => {
            chatWindow.classList.remove('show');
        });
    }

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `msg ${sender}`;
        msgDiv.textContent = text;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function botResponse(userText) {
        const input = userText.toLowerCase();
        let response = "I'm not sure I understand. Could you rephrase that? You can ask about our 'products', 'prices', or how to 'contact' us.";

        if (input.includes('hello') || input.includes('hi')) {
            response = "Hello! I'm the JAYVEER AI. How can I assist you with your digital needs today?";
        } else if (input.includes('product') || input.includes('service')) {
            response = "We offer several premium digital products: \n1. Custom Home Pages ($499)\n2. Ad Banner Packages ($149)\n3. HTML5 Mini-Games ($899)\n4. AI Chatbot Integration ($299) - NEW!\nWhich one would you like to know more about?";
        } else if (input.includes('ai chatbot') || input.includes('chatbot integration') || input.includes('ai integration')) {
            response = "Our 'AI Chatbot Integration' ($299) is a game-changer! We'll build and train a custom AI assistant like me for your own website to handle 24/7 customer support and boost your conversions.";
        } else if (input.includes('home page') || input.includes('website')) {
            response = "Our Custom Home Page service includes: \n- Modern Responsive Design\n- SEO-ready structure\n- Fast loading times\n- Glassmorphism effect included!\nIt's perfect for startups or professional portfolios for just $499.";
        } else if (input.includes('banner')) {
            response = "Our Ad Banner Package (₹149) gives you a set of professional banners for social media and web ads. They are designed to convert visitors into customers!";
        } else if (input.includes('game')) {
            response = "The HTML5 Mini-Game service ($899) is our premium offering. We build addictive, high-quality interactive games that run in any browser. Great for brand marketing and user engagement!";
        } else if (input.includes('price') || input.includes('cost')) {
            response = "Our pricing is transparent: Banners start at ₹149, Websites at ₹499, and Games at ₹899. We also offer custom quotes for specialized needs!";
        } else if (input.includes('buy') || input.includes('order') || input.includes('purchase')) {
            response = "Ready to start? Simply click the 'Purchase' button on any product card in our Products section, and we'll get working right away!";
        } else if (input.includes('contact') || input.includes('help')) {
            response = "You can reach us via the contact form at the bottom of the page, or by creating a support ticket in your Dashboard.";
        } else if (input.includes('who are you') || input.includes('jayveer')) {
            response = "We are JAYVEER Digital, a premium agency dedicated to crafting top-tier digital experiences.";
        }

        // Simulate typing delay
        const typingMsg = document.createElement('div');
        typingMsg.className = 'msg bot typing';
        typingMsg.textContent = '...';
        chatMessages.appendChild(typingMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        setTimeout(() => {
            chatMessages.removeChild(typingMsg);
            addMessage(response, 'bot');
        }, 1000);
    }

    if (sendChat) {
        const handleSend = () => {
            const text = chatInput.value.trim();
            if (text) {
                addMessage(text, 'user');
                chatInput.value = '';
                botResponse(text);
            }
        };

        sendChat.addEventListener('click', handleSend);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    }
});
