document.addEventListener('DOMContentLoaded', () => {
  /* Background video: start from the first frame, play once, never loop */
  const video = document.getElementById('heroVideo');
  if (video) {
    video.loop = false;
    video.currentTime = 0;
    const p = video.play();
    if (p && typeof p.catch === 'function') {
      p.catch(err => console.warn('Autoplay was prevented by the browser:', err));
    }
    video.addEventListener('ended', () => {
      console.log('Hero video reached its last frame.');
    });
  }

  /* Mobile menu */
  const toggle = document.querySelector('.mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (toggle && menu) {
    const setOpen = open => {
      menu.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      toggle.querySelector('i').className = open ? 'ph ph-x' : 'ph ph-list';
    };
    toggle.addEventListener('click', () => setOpen(menu.hidden));
    menu.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { setOpen(false); toggle.focus(); } });
    window.addEventListener('resize', () => { if (window.innerWidth > 1024) setOpen(false); });
  }
});
