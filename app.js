/**
 * Hotel Advantage Inn, Prayagraj - Core UI & CRO Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll tracking
  const header = document.querySelector('header.sticky-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Drawer Navigation
  const mobileToggler = document.querySelector('.mobile-toggler');
  const closeBtn = document.querySelector('.close-btn');
  const mobileDrawer = document.querySelector('.mobile-drawer');

  // Dynamically inject beautiful brand crest & subtitle into drawer for mobile users
  if (mobileDrawer && !mobileDrawer.querySelector('.drawer-logo')) {
    const logoHtml = `
      <div class="drawer-logo">
        <div class="logo-icon-wrapper">
          <img src="logo_crest.webp" alt="Advantage Inn Logo">
        </div>
        <div class="logo-title">Advantage Inn</div>
        <div class="logo-subtitle">Civil Lines, Prayagraj</div>
      </div>
    `;
    mobileDrawer.insertAdjacentHTML('afterbegin', logoHtml);
  }

  // Dynamically inject highly-aesthetic Mobile App Install Banner in drawer for mobile users
  if (mobileDrawer && !mobileDrawer.querySelector('#pwa-install-container')) {
    const installHtml = `
      <div class="drawer-install-wrapper" style="margin-top: 1rem; padding: 0 1rem; display: none; text-align: center;" id="pwa-install-container">
        <button class="drawer-install-btn" style="width:100%; border-radius:30px; min-height:38px; font-size:0.7rem; font-weight:700; background:var(--color-gold); color:#0c0a09; display:inline-flex; align-items:center; justify-content:center; gap:0.4rem; border:none; text-transform:uppercase; cursor:pointer; box-shadow: 0 4px 12px rgba(181,147,73,0.2); transition:all 0.2s ease; letter-spacing:0.05em; font-family:var(--font-sans);">
          <i class="fa-solid fa-cloud-arrow-down"></i> Install Mobile App
        </button>
      </div>
    `;
    // Find the link list or append it to the bottom
    const linksList = mobileDrawer.querySelector('.mobile-drawer-links') || mobileDrawer.querySelector('ul');
    if (linksList) {
      linksList.insertAdjacentHTML('afterend', installHtml);
    } else {
      mobileDrawer.insertAdjacentHTML('beforeend', installHtml);
    }
  }

  // Dynamically inject highly-aesthetic Desktop App Install Item in desktop nav-menu for PWA support (Tablets, Laptops, Desktops!)
  const navMenu = document.querySelector('.nav-menu');
  if (navMenu && !navMenu.querySelector('#desktop-install-item')) {
    const installItemHtml = `
      <li id="desktop-install-item" style="display: none; align-items: center; justify-content: center;">
        <a href="#" class="nav-link desktop-install-btn" style="color: var(--color-gold) !important; font-weight: 600; display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.5rem 0.8rem; font-family: var(--font-sans); font-size: 0.8rem;">
          <i class="fa-solid fa-cloud-arrow-down" style="color: var(--color-gold);"></i> Install App
        </a>
      </li>
    `;
    // Find the last list item (Book Direct) and insert before it
    const bookDirectBtn = navMenu.querySelector('.btn-primary')?.closest('li');
    if (bookDirectBtn) {
      bookDirectBtn.insertAdjacentHTML('beforebegin', installItemHtml);
    } else {
      navMenu.insertAdjacentHTML('beforeend', installItemHtml);
    }
  }

  // Hook up native browser install prompt logic
  let deferredPrompt;
  const pwaInstallContainer = document.getElementById('pwa-install-container');
  const installBtn = pwaInstallContainer ? pwaInstallContainer.querySelector('.drawer-install-btn') : null;
  const desktopInstallItem = document.getElementById('desktop-install-item');
  const desktopInstallBtn = desktopInstallItem ? desktopInstallItem.querySelector('.desktop-install-btn') : null;

  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the default mini-infobar from appearing on mobile Chrome
    e.preventDefault();
    // Stash the event so it can be triggered on user action
    deferredPrompt = e;
    
    // Show mobile PWA install button in drawer
    if (pwaInstallContainer) {
      pwaInstallContainer.style.display = 'block';
    }
    // Show desktop PWA install nav item in top navigation header (Tablets, Laptops, Desktops!)
    if (desktopInstallItem) {
      desktopInstallItem.style.display = 'inline-flex';
    }
  });

  // Mobile trigger
  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`Mobile PWA installation prompt response: ${outcome}`);
      deferredPrompt = null;
      if (pwaInstallContainer) pwaInstallContainer.style.display = 'none';
      if (desktopInstallItem) desktopInstallItem.style.display = 'none';
    });
  }

  // Desktop/Tablet trigger
  if (desktopInstallBtn) {
    desktopInstallBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`Desktop PWA installation prompt response: ${outcome}`);
      deferredPrompt = null;
      if (desktopInstallItem) desktopInstallItem.style.display = 'none';
      if (pwaInstallContainer) pwaInstallContainer.style.display = 'none';
    });
  }

  window.addEventListener('appinstalled', () => {
    console.log('Hotel Advantage Inn PWA App installed successfully!');
    if (pwaInstallContainer) pwaInstallContainer.style.display = 'none';
    if (desktopInstallItem) desktopInstallItem.style.display = 'none';
  });

  // Register PWA Service Worker for standard web app capability
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('Service Worker registered scope:', reg.scope))
        .catch(err => console.log('Service Worker registration error:', err));
    });
  }

  if (mobileToggler && mobileDrawer) {
    mobileToggler.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
    });
  }

  if (closeBtn && mobileDrawer) {
    closeBtn.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
    });
  }

  // Close drawer on menu click
  const drawerLinks = document.querySelectorAll('.mobile-drawer a');
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
    });
  });

  // 3. Dynamic Price Sync Trigger & Subpage Prefill
  const roomSelector = document.getElementById('quick-room');
  let defaultRoom = 'premium';
  
  // Read and apply pre-fill from room detail pages
  const prefill = sessionStorage.getItem('prefillRoom');
  if (prefill && ['standard', 'premium', 'family'].includes(prefill)) {
    defaultRoom = prefill;
    if (roomSelector) {
      roomSelector.value = prefill;
    }
    // Also prefill modal if present
    const modalRoomType = document.getElementById('modal-room-type');
    if (modalRoomType) {
      modalRoomType.value = prefill;
    }
    sessionStorage.removeItem('prefillRoom'); // Clear after use
  }

  if (roomSelector) {
    roomSelector.addEventListener('change', (e) => {
      if (window.otaSync) {
        window.otaSync.syncParityUI(e.target.value);
      }
    });
  }

  // Initial Sync
  if (window.otaSync) {
    window.otaSync.syncParityUI(defaultRoom);
  }

  // 4. CRO Scarcity Ticker Notifications
  const scarcityAlerts = [
    { text: "Only 2 Executive Rooms remaining in Civil Lines for this weekend!", icon: "👑" },
    { text: "High Demand: 24 guests searched for 'Hotel near Prayagraj Junction' in the last hour.", icon: "⚡" },
    { text: "Smart Choice! Direct bookings unlock early check-in, welcome refreshments, and priority suites.", icon: "✨" },
    { text: "Chef Special: Golden Leaf in-house restaurant is hosting a Mughal-Awadhi food gala tonight!", icon: "🍽️" },
    { text: "Sangam Guide: Direct bookings lock in verified guides for Triveni Sangam tour scheduling.", icon: "📍" }
  ];

  const scarcityToast = document.querySelector('.scarcity-toast');
  const scarcityText = document.getElementById('scarcity-text');

  function showScarcityToast() {
    if (!scarcityToast || !scarcityText) return;
    
    // Select random alert
    const alert = scarcityAlerts[Math.floor(Math.random() * scarcityAlerts.length)];
    scarcityText.innerHTML = `<span class="scarcity-icon">${alert.icon}</span> ${alert.text}`;
    
    // Show toast
    scarcityToast.classList.add('show');

    // Hide toast after 6 seconds
    setTimeout(() => {
      scarcityToast.classList.remove('show');
    }, 6000);
  }

  // Loop notifications every 20 seconds (Disabled by request)
  // setTimeout(showScarcityToast, 3000);
  // setInterval(showScarcityToast, 22000);

  // 5. Sticky CTA Scroll trigger
  const stickyCta = document.querySelector('.sticky-cta-bar');
  window.addEventListener('scroll', () => {
    if (stickyCta) {
      if (window.scrollY > 600) {
        stickyCta.classList.add('show');
      } else {
        stickyCta.classList.remove('show');
      }
    }
  });

  // 6. Booking Modal Interactions (2-Click Path)
  const bookingOverlay = document.querySelector('.booking-overlay');
  const modalClose = document.querySelector('.modal-close');
  const quickBookBtn = document.getElementById('quick-book-btn');
  
  // Modal Fields
  const modalRoomType = document.getElementById('modal-room-type');
  const modalCheckIn = document.getElementById('modal-checkin');
  const modalCheckOut = document.getElementById('modal-checkout');
  const modalGuests = document.getElementById('modal-guests');

  // Set default dates in form inputs
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(dayAfter.getDate() + 2);

  const checkinInput = document.getElementById('quick-checkin');
  const checkoutInput = document.getElementById('quick-checkout');
  if (checkinInput && !checkinInput.value) checkinInput.value = formatDate(tomorrow);
  if (checkoutInput && !checkoutInput.value) checkoutInput.value = formatDate(dayAfter);

  // Trigger Booking Modal from Quick Bar (Click 1)
  if (quickBookBtn) {
    quickBookBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const qRoom = document.getElementById('quick-room').value;
      const qIn = document.getElementById('quick-checkin').value;
      const qOut = document.getElementById('quick-checkout').value;
      const qGuests = document.getElementById('quick-guests').value;

      // Populate Modal Fields
      if (modalRoomType) modalRoomType.value = qRoom;
      if (modalCheckIn) modalCheckIn.value = qIn;
      if (modalCheckOut) modalCheckOut.value = qOut;
      if (modalGuests) modalGuests.value = qGuests;

      openBookingModal();
    });
  }

  // Trigger Booking Modal from Room Cards directly
  const roomBookBtns = document.querySelectorAll('.room-card-book');
  roomBookBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const selectedType = btn.getAttribute('data-room-type');
      if (modalRoomType) modalRoomType.value = selectedType;
      
      if (modalCheckIn && !modalCheckIn.value) modalCheckIn.value = formatDate(tomorrow);
      if (modalCheckOut && !modalCheckOut.value) modalCheckOut.value = formatDate(dayAfter);
      if (modalGuests && !modalGuests.value) modalGuests.value = "2";

      openBookingModal();
    });
  });

  // Trigger Booking Modal from Sticky CTA
  const stickyBookBtn = document.getElementById('sticky-book-btn');
  if (stickyBookBtn) {
    stickyBookBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openBookingModal();
    });
  }

  // Trigger Booking Modal from Mobile Sticky Nav
  const mobileNavBookBtn = document.getElementById('mobile-nav-book-btn');
  if (mobileNavBookBtn) {
    mobileNavBookBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openBookingModal();
    });
  }

  function openBookingModal() {
    if (bookingOverlay) {
      bookingOverlay.classList.add('open');
      document.body.style.overflow = 'hidden'; // Lock background scroll
    }
  }

  function closeBookingModal() {
    if (bookingOverlay) {
      bookingOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeBookingModal);
  }

  if (bookingOverlay) {
    bookingOverlay.addEventListener('click', (e) => {
      if (e.target === bookingOverlay) {
        closeBookingModal();
      }
    });
  }

  // Helper: Format Date as YYYY-MM-DD
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // 7. Form Submission (Click 2 - Click "Confirm Reservation")
  const bookingForm = document.getElementById('booking-form');
  const successScreen = document.querySelector('.success-screen');

  if (bookingForm && successScreen) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('book-name').value;
      const email = document.getElementById('book-email').value;
      const phone = document.getElementById('book-phone').value;
      
      if (!name || !email || !phone) {
        alert("Please complete all required fields to secure your direct rate savings.");
        return;
      }

      const roomSelected = modalRoomType.value;
      const checkInVal = modalCheckIn.value;
      const checkOutVal = modalCheckOut.value;
      const guestsVal = modalGuests.value;
      const confId = "AI-" + Math.floor(100000 + Math.random() * 900000);

      // Create a highly professional, pre-filled email draft
      const emailSubject = `Room Reservation Inquiry: ${roomSelected.toUpperCase()} Sanctuary - ${name}`;
      const emailBody = `Namaste Hotel Advantage Inn Reservations Team,\n\nI would like to submit a direct room reservation inquiry from the official website. Below are my travel details:\n\n` +
        `-----------------------------------------\n` +
        `- Guest Full Name: ${name}\n` +
        `- Contact Phone: ${phone}\n` +
        `- Email Address: ${email}\n` +
        `- Selected Room Category: ${roomSelected.toUpperCase()} Sanctuary Suite\n` +
        `- Check-In Date: ${checkInVal}\n` +
        `- Check-Out Date: ${checkOutVal}\n` +
        `- Total Guests: ${guestsVal} Guest(s)\n` +
        `- Inquiry Reference Code: ${confId}\n` +
        `-----------------------------------------\n\n` +
        `Please verify room availability for these dates and contact me directly on phone or WhatsApp to finalize my booking.\n\n` +
        `Warm regards,\n${name}`;

      // Open user's email draft
      const mailtoLink = `mailto:hoteladvantageinn@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      window.location.href = mailtoLink;

      // Show success / pending screen
      bookingForm.style.display = 'none';
      successScreen.style.display = 'block';
      
      document.getElementById('conf-code').innerText = confId;
    });
  }

  // 8. INTERACTIVE ROOM SHOWCASE SLIDER
  let currentRoomIndex = 0;
  const roomTrack = document.getElementById('room-slider-track');
  const roomSlides = document.querySelectorAll('.room-slide');
  const prevRoomBtn = document.getElementById('slider-prev-btn');
  const nextRoomBtn = document.getElementById('slider-next-btn');

  function updateRoomSlider() {
    if (!roomTrack || roomSlides.length === 0) return;
    roomTrack.style.transform = `translateX(-${currentRoomIndex * 100}%)`;
    
    // Sync selector in quick booking form
    const activeSlide = roomSlides[currentRoomIndex];
    const roomBtn = activeSlide.querySelector('.room-card-book');
    if (roomBtn) {
      const roomType = roomBtn.getAttribute('data-room-type');
      const qRoom = document.getElementById('quick-room');
      if (qRoom) qRoom.value = roomType;
    }
  }

  if (prevRoomBtn && nextRoomBtn && roomTrack) {
    prevRoomBtn.addEventListener('click', () => {
      currentRoomIndex = (currentRoomIndex - 1 + roomSlides.length) % roomSlides.length;
      updateRoomSlider();
    });
    nextRoomBtn.addEventListener('click', () => {
      currentRoomIndex = (currentRoomIndex + 1) % roomSlides.length;
      updateRoomSlider();
    });
  }

  // 9. VIRTUAL TOUR PANORAMIC CONTROLLER
  const tourTabs = document.querySelectorAll('.tour-tab');
  const tourBg = document.getElementById('tour-panorama');
  const panLeftBtn = document.getElementById('pan-left-btn');
  const panRightBtn = document.getElementById('pan-right-btn');
  
  const tourImages = {
    lobby: './corridor_lobby.webp',
    dining: './restaurant_internal.webp',
    elevator: './elevator_front.webp',
    facade: './hotel_front.webp'
  };

  tourTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tourTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const viewType = tab.getAttribute('data-view');
      
      if (tourBg && tourImages[viewType]) {
        tourBg.style.backgroundImage = `url('${tourImages[viewType]}')`;
        tourBg.classList.remove('pan-left');
        tourBg.classList.remove('pan-right');
      }
    });
  });

  if (panLeftBtn && panRightBtn && tourBg) {
    panLeftBtn.addEventListener('click', () => {
      tourBg.classList.add('pan-right');
      tourBg.classList.remove('pan-left');
    });
    panRightBtn.addEventListener('click', () => {
      tourBg.classList.add('pan-left');
      tourBg.classList.remove('pan-right');
    });
  }

  // 10. FAQ ACCORDION TOGGLE MECHANICS
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question') || item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-answer') || item.querySelector('.faq-a');
    
    if (question && answer) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('faq-open');
        
        faqItems.forEach(i => {
          i.classList.remove('faq-open');
          const ans = i.querySelector('.faq-answer') || i.querySelector('.faq-a');
          if (ans) {
            ans.style.maxHeight = null;
          }
        });
        
        if (!isOpen) {
          item.classList.add('faq-open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  // 11. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  const revealElements = document.querySelectorAll('.reveal-fade-up');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }

  // 12. 360° MOCK OVERLAY POPUP
  const overlay360 = document.createElement('div');
  overlay360.className = 'booking-overlay';
  overlay360.id = 'overlay-360';
  overlay360.innerHTML = `
    <div class="booking-modal" style="max-width: 750px; height: 500px; padding:0; overflow:hidden; position:relative;">
      <div class="modal-header" style="position:absolute; top:0; left:0; width:100%; z-index:10; background: linear-gradient(180deg, rgba(15, 42, 36, 0.9) 0%, transparent 100%); border:none; padding:1.5rem 2rem;">
        <h3 id="title-360" style="color:white; font-family: var(--font-display);">Sanctuary Room 360° View</h3>
        <button class="modal-close" id="close-360" style="color:white;"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="tour-panorama-bg" id="panorama-360" style="width:250%; height:100%; background-position:center; background-size:cover; transition: transform 25s ease-in-out;"></div>
      <div style="position:absolute; bottom:1.5rem; left:50%; transform:translateX(-50%); z-index:10; display:flex; gap:1rem;">
        <button class="btn btn-outline" id="pan-360-left" style="background:rgba(15, 42, 36, 0.85); width: 45px; height: 45px; border-radius:50%; padding:0; color:white;"><i class="fa-solid fa-arrow-left"></i></button>
        <button class="btn btn-outline" id="pan-360-right" style="background:rgba(15, 42, 36, 0.85); width: 45px; height: 45px; border-radius:50%; padding:0; color:white;"><i class="fa-solid fa-arrow-right"></i></button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay360);

  const btn360s = document.querySelectorAll('.btn-360-view');
  const pano360 = document.getElementById('panorama-360');
  const title360 = document.getElementById('title-360');
  
  const room360Images = {
    standard: 'https://r1imghtlak.mmtcdn.com/a536cb99-c1e3-4158-aec0-711d7d0533c3.jpg?&output-quality=75',
    premium: 'https://r1imghtlak.mmtcdn.com/79bdcf8e-e8a2-4f54-b056-1f9865c0c850.jpg?&output-quality=75',
    family: 'https://r1imghtlak.mmtcdn.com/a2a75722-c509-443c-88b7-76a61484410e.jpg?&output-quality=75'
  };

  btn360s.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const rType = btn.getAttribute('data-room');
      const roomNames = {
        standard: 'Deluxe Room',
        premium: 'Executive Room',
        family: 'Super Deluxe Room'
      };
      const displayName = roomNames[rType] || (rType.charAt(0).toUpperCase() + rType.slice(1));
      title360.innerText = `${displayName} 360° Panorama`;
      
      if (pano360 && room360Images[rType]) {
        pano360.style.backgroundImage = `url('${room360Images[rType]}')`;
        pano360.classList.remove('pan-left');
        pano360.classList.remove('pan-right');
      }
      
      overlay360.classList.add('open');
      document.body.style.overflow = 'hidden';
      
      // Auto pan simulation
      setTimeout(() => {
        if (pano360 && overlay360.classList.contains('open')) {
          pano360.classList.add('pan-left');
        }
      }, 500);
    });
  });

  const close360 = document.getElementById('close-360');
  if (close360) {
    close360.addEventListener('click', () => {
      overlay360.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  const pan360L = document.getElementById('pan-360-left');
  const pan360R = document.getElementById('pan-360-right');
  if (pan360L && pan360R && pano360) {
    pan360L.addEventListener('click', () => {
      pano360.classList.add('pan-right');
      pano360.classList.remove('pan-left');
    });
    pan360R.addEventListener('click', () => {
      pano360.classList.add('pan-left');
      pano360.classList.remove('pan-right');
    });
  }

  // 13. BANQUET FORM SUBMIT
  const banquetForm = document.getElementById('banquet-form');
  if (banquetForm) {
    banquetForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('banquet-name').value;
      const phone = document.getElementById('banquet-phone').value;
      const type = document.getElementById('banquet-event-type').value;
      
      console.log("[Banquet Inquiry Submission]:", { name, phone, type });
      alert(`Thank you, ${name}! Your inquiry for a grand ${type} banquet has been received. Our event coordinator will connect with you within 2 hours.`);
      banquetForm.reset();
    });
  }

  // 14. 24/7 AI CONCIERGE CHATBOT LOGIC
  const aiTrigger = document.getElementById('ai-trigger');
  const aiChat = document.getElementById('ai-chat');
  const aiClose = document.getElementById('ai-close');
  const chatBody = document.getElementById('chat-body');
  const chatInput = document.getElementById('chat-input');
  const chatSend = document.getElementById('chat-send');
  const quickReplies = document.querySelectorAll('.quick-reply-chip');

  function toggleAIChat() {
    if (aiChat) {
      aiChat.classList.toggle('open');
      if (aiChat.classList.contains('open')) {
        chatBody.scrollTop = chatBody.scrollHeight;
      }
    }
  }

  if (aiTrigger) aiTrigger.addEventListener('click', toggleAIChat);
  if (aiClose) aiClose.addEventListener('click', toggleAIChat);

  // Bot Response Dictionary
  const botResponses = {
    sangam: "Triveni Sangam is located 7.5 KM (approx. 18 minutes drive) from Hotel Advantage Inn. We assist with guided boat trips, VIP ritual arrangements, and direct taxi bookings at our front desk.",
    dining: "Our Golden Leaf Restaurant is a 100% Pure Vegetarian Sanctuary in Civil Lines, Prayagraj. Enjoy gourmet North Indian, Awadhi, and Chinese courses, including our Veg Deluxe Thali (₹300) and Veg Classic Thali (₹350). We are open 24/7 for in-room dining!",
    wedding: "Our premium 'Advanta Banquet Hall' hosts up to 300+ guests with complete modern facilities, custom vegetarian buffet menus, and private parking. Perfect for corporate seminars, ring ceremonies, and elegant wedding receptions.",
    rooms: "We offer 3 elegantly designed smart luxury room tiers: Deluxe Room (ideal for business travel), Executive Room (luxurious comfort), and Super Deluxe Room (spacious layout). All rooms feature orthopaedic mattresses, high-speed fiber Wi-Fi, air conditioning, and geyser bathrooms.",
    amenities: "Our property features excellent boutique facilities, including high-speed fiber Wi-Fi, a modern passenger lift (elevator), secured private parking, 24/7 security cameras, power backup, and 24/7 in-room dining.",
    contact: "You can reach our reservation helpdesk directly at +91 72679 07111. You can also chat with us on WhatsApp using the same number for instant room or banquet availability updates!",
    location: "Hotel Advantage Inn is situated at 1-A, Loyal Road (Patrika Marg), Behind BSNL Office, Civil Lines, Prayagraj. We are located near Prayagraj Railway Junction and major landmarks like High Court and Swaraj Bhawan.",
    default: "Thank you for reaching out! Mapped to our premium concierge desk, I can assist with local guide services, direct booking privileges, banquet events, and Golden Leaf table reservations. How can I help?"
  };

  function getBotReply(msg) {
    const query = msg.toLowerCase();
    if (query.includes('sangam') || query.includes('distance') || query.includes('sight') || query.includes('attract')) {
      return botResponses.sangam;
    } else if (query.includes('dining') || query.includes('eat') || query.includes('restaurant') || query.includes('food') || query.includes('thali') || query.includes('leaf') || query.includes('veg')) {
      return botResponses.dining;
    } else if (query.includes('wedding') || query.includes('banquet') || query.includes('event') || query.includes('hall') || query.includes('capacity') || query.includes('conference') || query.includes('advanta')) {
      return botResponses.wedding;
    } else if (query.includes('room') || query.includes('avail') || query.includes('price') || query.includes('rate') || query.includes('cost') || query.includes('stay') || query.includes('suite')) {
      return botResponses.rooms;
    } else if (query.includes('amenity') || query.includes('wifi') || query.includes('wi-fi') || query.includes('lift') || query.includes('elevator') || query.includes('park')) {
      return botResponses.amenities;
    } else if (query.includes('contact') || query.includes('phone') || query.includes('whatsapp') || query.includes('number') || query.includes('call')) {
      return botResponses.contact;
    } else if (query.includes('address') || query.includes('location') || query.includes('junction') || query.includes('station') || query.includes('where') || query.includes('coordinates')) {
      return botResponses.location;
    } else {
      return botResponses.default;
    }
  }

  function addMessage(text, sender) {
    if (!chatBody) return;
    const msgNode = document.createElement('div');
    msgNode.className = `chat-msg ${sender}`;
    msgNode.innerText = text;
    chatBody.appendChild(msgNode);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function handleUserSend() {
    if (!chatInput) return;
    const text = chatInput.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    chatInput.value = '';

    // Show typing indicator
    const typingNode = document.createElement('div');
    typingNode.className = 'chat-msg bot typing-bubble';
    typingNode.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
    chatBody.appendChild(typingNode);
    chatBody.scrollTop = chatBody.scrollHeight;

    setTimeout(() => {
      typingNode.remove();
      const reply = getBotReply(text);
      addMessage(reply, 'bot');
    }, 1200);
  }

  if (chatSend && chatInput) {
    chatSend.addEventListener('click', handleUserSend);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleUserSend();
    });
  }

  quickReplies.forEach(chip => {
    chip.addEventListener('click', () => {
      const query = chip.getAttribute('data-query');
      addMessage(chip.innerText, 'user');
      
      // Show typing indicator
      const typingNode = document.createElement('div');
      typingNode.className = 'chat-msg bot typing-bubble';
      typingNode.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
      chatBody.appendChild(typingNode);
      chatBody.scrollTop = chatBody.scrollHeight;

      setTimeout(() => {
        typingNode.remove();
        const reply = getBotReply(query);
        addMessage(reply, 'bot');
      }, 1200);
    });
  });

  // 15. INTERACTIVE ROOM CATEGORY INNER IMAGES SLIDER
  const innerSliders = document.querySelectorAll('.room-inner-slider');
  innerSliders.forEach(slider => {
    const track = slider.querySelector('.inner-slider-track');
    const images = slider.querySelectorAll('.inner-slider-track img');
    const prevBtn = slider.querySelector('.inner-nav-btn.prev');
    const nextBtn = slider.querySelector('.inner-nav-btn.next');
    const dots = slider.querySelectorAll('.inner-dot');
    
    let currentIndex = 0;
    const maxIndex = images.length - 1;
    
    function updateInnerSlider() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }
    
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = currentIndex > 0 ? currentIndex - 1 : maxIndex;
        updateInnerSlider();
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = currentIndex < maxIndex ? currentIndex + 1 : 0;
        updateInnerSlider();
      });
    }
    
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = idx;
        updateInnerSlider();
      });
    });
  });

  // 16. EXIT INTENT POPUP (CRO FEATURE)
  let exitIntentShown = false;
  // Exit intent popup event listener (Disabled by request)
  /*
  document.addEventListener('mouseleave', (e) => {
    if (e.clientY < 0 && !exitIntentShown) {
      exitIntentShown = true;
      showExitIntentModal();
    }
  });
  */

  function showExitIntentModal() {
    const exitOverlay = document.createElement('div');
    exitOverlay.className = 'booking-overlay open';
    exitOverlay.id = 'exit-intent-overlay';
    exitOverlay.innerHTML = `
      <div class="booking-modal" style="text-align: center; border-color: var(--color-gold);">
        <div class="modal-header" style="border:none; margin-bottom: 1rem;">
          <h3 style="font-family: var(--font-display); width:100%; text-align:center; color: var(--bg-dark-green);">Wait! Don't Miss Out</h3>
          <button class="modal-close" id="close-exit" style="position:absolute; top: 1.5rem; right: 1.5rem;"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <i class="fa-solid fa-gift" style="font-size: 3rem; color: var(--color-gold); margin-bottom: 1rem;"></i>
        <h4 style="font-size: 1.3rem; margin-bottom: 1rem;">Exclusive Direct Savings Awaits</h4>
        <p style="font-size: 0.9rem; line-height:1.6; margin-bottom: 1.5rem; color: var(--text-muted);">
          Complete your booking directly with us today and secure an **extra 10% off** your stay, plus free delicious breakfast.
        </p>
        <div style="background: var(--bg-secondary); border: 1px dashed var(--color-gold); padding: 0.8rem; border-radius: 4px; font-family: var(--font-btn); font-weight: 700; font-size: 1.1rem; letter-spacing: 0.1em; color: var(--bg-dark-green); margin-bottom: 1.5rem;">
          DIRECT10
        </div>
        <button class="btn btn-primary" id="exit-redeem-btn" style="width: 100%;">Claim 10% Saving Now</button>
      </div>
    `;
    document.body.appendChild(exitOverlay);

    const closeExit = document.getElementById('close-exit');
    if (closeExit) {
      closeExit.addEventListener('click', () => {
        exitOverlay.remove();
      });
    }

    const redeemBtn = document.getElementById('exit-redeem-btn');
    if (redeemBtn) {
      redeemBtn.addEventListener('click', () => {
        exitOverlay.remove();
        const promoInput = document.getElementById('quick-promo');
        if (promoInput) {
          promoInput.value = 'DIRECT10';
        }
        window.scrollTo({
          top: document.getElementById('suites').offsetTop - 100,
          behavior: 'smooth'
        });
      });
    }
  }

  // 17. LUXURY CHOP SLIDESHOW CONTROLLER
  const slideshow = document.getElementById('hero-slideshow');
  if (slideshow) {
    const slides = slideshow.querySelectorAll('.hero-slide');
    const dots = slideshow.querySelectorAll('.nav-dot');
    const prevBtn = slideshow.querySelector('.arrow-prev');
    const nextBtn = slideshow.querySelector('.arrow-next');
    
    let currentSlideIndex = 0;
    const totalSlides = slides.length;
    let slideInterval = null;
    const transitionDuration = 3000; // 3 seconds transition interval
    
    function showSlide(index) {
      if (index < 0) {
        index = totalSlides - 1;
      } else if (index >= totalSlides) {
        index = 0;
      }
      
      // Deactivate current slide
      slides[currentSlideIndex].classList.remove('active');
      dots[currentSlideIndex].classList.remove('active');
      
      // Update index
      currentSlideIndex = index;
      
      // Activate new slide
      slides[currentSlideIndex].classList.add('active');
      dots[currentSlideIndex].classList.add('active');
    }
    
    function nextSlide() {
      showSlide(currentSlideIndex + 1);
    }
    
    function prevSlide() {
      showSlide(currentSlideIndex - 1);
    }
    
    function startAutoRotation() {
      stopAutoRotation();
      slideInterval = setInterval(nextSlide, transitionDuration);
    }
    
    function stopAutoRotation() {
      if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
      }
    }
    
    // Bind controls
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        prevSlide();
        startAutoRotation(); // reset timer
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        nextSlide();
        startAutoRotation(); // reset timer
      });
    }
    
    dots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        const index = parseInt(dot.getAttribute('data-index'), 10);
        if (!isNaN(index)) {
          showSlide(index);
          startAutoRotation(); // reset timer
        }
      });
    });
    
    // 3. Swipe Gestures for Main Hero Slideshow
    let heroTouchStartX = 0;
    let heroTouchEndX = 0;
    
    slideshow.addEventListener('touchstart', (e) => {
      heroTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    slideshow.addEventListener('touchend', (e) => {
      heroTouchEndX = e.changedTouches[0].screenX;
      const swipeDistance = heroTouchStartX - heroTouchEndX;
      const threshold = 50;
      
      if (swipeDistance > threshold) {
        nextSlide();
        startAutoRotation();
      } else if (swipeDistance < -threshold) {
        prevSlide();
        startAutoRotation();
      }
    }, { passive: true });
    
    // Initialize auto rotation
    startAutoRotation();
  }

  // --- TOUCH SWIPE EVENT ENGINE FOR MOBILE VIEWPORTS ---
  
  // 1. Swipe Gestures for Main Room Slider Showcase
  let roomTouchStartX = 0;
  let roomTouchEndX = 0;
  
  if (roomTrack) {
    roomTrack.addEventListener('touchstart', (e) => {
      roomTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    roomTrack.addEventListener('touchend', (e) => {
      roomTouchEndX = e.changedTouches[0].screenX;
      handleRoomSwipe();
    }, { passive: true });
  }
  
  function handleRoomSwipe() {
    const threshold = 50; // Minimum swipe distance in px
    if (roomTouchStartX - roomTouchEndX > threshold) {
      // Swipe Left -> Show Next Room
      currentRoomIndex = (currentRoomIndex + 1) % roomSlides.length;
      updateRoomSlider();
    } else if (roomTouchEndX - roomTouchStartX > threshold) {
      // Swipe Right -> Show Previous Room
      currentRoomIndex = (currentRoomIndex - 1 + roomSlides.length) % roomSlides.length;
      updateRoomSlider();
    }
  }

  // 2. Swipe Gestures for Room Category Inner Image Slideshows
  if (innerSliders) {
    innerSliders.forEach(slider => {
      const track = slider.querySelector('.inner-slider-track');
      const images = slider.querySelectorAll('.inner-slider-track img');
      const dots = slider.querySelectorAll('.inner-dot');
      
      let currentIndex = 0;
      const maxIndex = images.length - 1;
      
      let innerTouchStartX = 0;
      let innerTouchEndX = 0;
      
      slider.addEventListener('touchstart', (e) => {
        innerTouchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      
      slider.addEventListener('touchend', (e) => {
        innerTouchEndX = e.changedTouches[0].screenX;
        const swipeDistance = innerTouchStartX - innerTouchEndX;
        const threshold = 40;
        
        if (swipeDistance > threshold) {
          // Swipe Left -> Next Image
          currentIndex = currentIndex < maxIndex ? currentIndex + 1 : 0;
          updateInnerSlider();
        } else if (swipeDistance < -threshold) {
          // Swipe Right -> Previous Image
          currentIndex = currentIndex > 0 ? currentIndex - 1 : maxIndex;
          updateInnerSlider();
        }
      }, { passive: true });
      
      function updateInnerSlider() {
        if (track) track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, idx) => {
          if (idx === currentIndex) dot.classList.add('active');
          else dot.classList.remove('active');
        });
      }
    });
  }
  // --- CONCEPT READ MORE SYSTEM ---
  const readMoreBtn = document.getElementById('btn-read-more-about');
  const conceptDesc = document.getElementById('about-concept-desc');
  if (readMoreBtn && conceptDesc) {
    readMoreBtn.addEventListener('click', () => {
      conceptDesc.classList.toggle('expanded');
      if (conceptDesc.classList.contains('expanded')) {
        readMoreBtn.innerHTML = 'Read Less <i class="fa-solid fa-chevron-up"></i>';
      } else {
        readMoreBtn.innerHTML = 'Read More <i class="fa-solid fa-chevron-down"></i>';
        conceptDesc.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});

