// Slideshow controller: changeSlide, goToSlide and auto-advance
(function(){
  const slideshow = document.querySelector('.slideshow');
  if (!slideshow) return;

  const slides = Array.from(slideshow.querySelectorAll('.slide'));
  const dots = Array.from(slideshow.querySelectorAll('.dot'));
  const prevBtn = slideshow.querySelector('.slide-prev');
  const nextBtn = slideshow.querySelector('.slide-next');
  if (!slides.length) return;

  let current = slides.findIndex(s => s.classList.contains('active'));
  if (current === -1) current = 0;

  const INTERVAL = 5000; // ms
  let timer = null;
  let isPaused = false;

  function showSlide(index) {
    index = (index + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    current = index;
  }

  function nextSlide() { showSlide(current + 1); }
  function prevSlide() { showSlide(current - 1); }

  // Expose global helpers used by inline HTML
  window.changeSlide = function(delta){
    if (delta > 0) nextSlide();
    else prevSlide();
    resetTimer();
  };

  window.goToSlide = function(index){
    showSlide(parseInt(index, 10) || 0);
    resetTimer();
  };

  function startTimer(){
    if (timer) return;
    timer = setInterval(() => {
      if (!isPaused && document.visibilityState === 'visible') nextSlide();
    }, INTERVAL);
  }

  function stopTimer(){
    if (!timer) return;
    clearInterval(timer);
    timer = null;
  }

  function resetTimer(){
    stopTimer();
    startTimer();
  }

  // Pause on hover/focus inside slideshow
  slideshow.addEventListener('mouseenter', () => { isPaused = true; });
  slideshow.addEventListener('mouseleave', () => { isPaused = false; });
  slideshow.addEventListener('focusin', () => { isPaused = true; });
  slideshow.addEventListener('focusout', () => { isPaused = false; });

  // Prev/Next buttons hooks (in case inline handlers not present)
  if (prevBtn) prevBtn.addEventListener('click', () => { changeSlide(-1); });
  if (nextBtn) nextBtn.addEventListener('click', () => { changeSlide(1); });

  // Dots click handlers
  dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));

  // Visibility handling: pause when tab not visible
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') stopTimer();
    else startTimer();
  });

  // Kick off
  showSlide(current);
  startTimer();
})();

/* Scroll helpers: scroll to a given id or to the next section after the current scroll position */
function scrollToSection(id) {
  try {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (e) { /* ignore */ }
}

function scrollToNextSection() {
  // Find all top-level sections in document order
  const sections = Array.from(document.querySelectorAll('main > section, section')).filter(s => s.offsetHeight > 0);
  if (!sections.length) return;

  const scrollY = window.scrollY || window.pageYOffset;
  // Find the first section whose top is greater than current scroll position + 10px
  for (let i = 0; i < sections.length; i++) {
    const secTop = sections[i].getBoundingClientRect().top + scrollY;
    if (secTop > scrollY + 10) {
      sections[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
  }

  // Fallback: scroll to bottom
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

/* Innovation image display: show the corresponding image when an innovation card is clicked */
function showInnovationImage(type) {
  // Hide all innovation images
  const allImages = document.querySelectorAll('.innovation-image');
  allImages.forEach(img => {
    img.style.display = 'none';
  });

  // Show the selected innovation image
  const selectedImage = document.getElementById(`innovation-${type}`);
  if (selectedImage) {
    selectedImage.style.display = 'block';
  }
}

// Mobile burger menu: toggle open/close
(function () {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (!mobileMenuBtn || !mobileMenu) return;

  mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });

  // Optional: schließen, wenn man auf einen Menüpunkt klickt
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenuBtn.classList.remove('active');
      mobileMenu.classList.remove('active');
    });
  });
})();

