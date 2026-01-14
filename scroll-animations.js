// Scroll animations using IntersectionObserver
(function(){
  const selectors = [
    'h1',
    'h2',
    'h3',
    '.section-title',
    '.section-description',
    '.hero-title',
    '.hero-subtitle',
    '.section-label',
    '.text-content p',
    '.slide-info',
    '.innovation-card',
    '.model-card',
    '.lifestyle-card',
    '.image-wrapper',
    '.image-block',
    '.brand-story p',
    '.cta-container',
    '.final-cta-content',
    '.footer-brand p',
    '.quote-block blockquote'
  ];

  const elements = Array.from(document.querySelectorAll(selectors.join(',')));
  if(!elements.length) return;

  // Add base reveal class and choose direction by simple heuristics
  elements.forEach(el => {
    if (el.classList.contains('reveal')) return;
    el.classList.add('reveal');

    // heuristics for direction
    if (el.closest('.image-block') || el.matches('.image-wrapper, .image-wrapper img')) {
      el.classList.add('slide-in-right');
    } else if (el.matches('.section-title, h1, h2, h3, .slide-info, .cta-container, .final-cta-content')) {
      el.classList.add('slide-in-up');
    } else {
      el.classList.add('slide-in-up');
    }
  });

  const obsOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.12
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // if you want one-time reveal, unobserve after visible
        io.unobserve(entry.target);
      }
    });
  }, obsOptions);

  elements.forEach(el => io.observe(el));
})();
