const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.querySelector('.motion-toggle');
let motionPaused = reducedMotion.matches;

function setMotion() {
  document.body.classList.toggle('motion-off', motionPaused);
  motionButton.setAttribute('aria-pressed', String(motionPaused));
  motionButton.setAttribute('aria-label', motionPaused ? 'Enable decorative motion' : 'Pause decorative motion');
  motionButton.querySelector('span').textContent = motionPaused ? 'off' : 'on';
}

setMotion();
motionButton.addEventListener('click', () => {
  motionPaused = !motionPaused;
  setMotion();
});

document.documentElement.classList.add('js-motion');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.section-heading,.journey-layout').forEach((element) => {
  element.classList.add('reveal');
  observer.observe(element);
});

document.querySelector('.skip').href = '#work';
document.querySelector('.scroll-cue').href = '#work';
document.querySelector('#work .section-label span:first-child').textContent = '02 / SELECTED WORK';
document.querySelector('#work .section-label span:last-child').textContent = 'TWO PROJECTS · EXPLORE THE REPOSITORIES';
document.querySelector('#journey .section-label span:first-child').textContent = '04 / NOTES ON BECOMING';
document.querySelector('#contact .section-label span:first-child').textContent = "05 / LET'S CONNECT";

document.querySelector('#work').insertAdjacentHTML('afterend', `
  <section id="photography" class="photography section">
    <div class="section-label"><span>03 / THROUGH MY LENS</span><span>A SMALL COLLECTION, GROWING SLOWLY</span></div>
    <div class="photography-layout">
      <div class="photography-copy">
        <h2>Small moments.<br><em>Held in light.</em></h2>
        <p>Photography is where I slow down, notice the details, and keep a little piece of a moment.</p>
        <span class="draft-label">NEW FRAMES COMING SOON</span>
      </div>
      <figure class="photo-feature">
        <img src="assets/ashmita.jpeg" alt="Ashmita holding a camera" width="1080" height="1440">
        <figcaption><span>01 / A QUIET OBSERVATION</span><span>✳</span></figcaption>
      </figure>
      <div class="photography-note"><span>THE THINGS I NOTICE</span><p>Light on a wall. A familiar place. The feeling of an ordinary day.</p><b>MORE SOON ↗</b></div>
    </div>
  </section>
`);
const photographyLayout = document.querySelector('.photography-layout');
photographyLayout.classList.add('reveal');
observer.observe(photographyLayout);

const projects = [
  {
    className: 'visual-nova',
    projectType: '01 / MUSIC EXPERIENCE',
    title: 'NOVA Music',
    summary: 'A responsive music experience made around discovery, shared listening, and motion that feels alive.',
    role: 'UI / UX · Frontend',
    tools: 'HTML / CSS / JavaScript',
    repo: 'https://github.com/AshmitaNotFound/nova-music',
    visual: '<span class="preview-top">NOVA MUSIC <b>2026</b></span><span class="nova-wordmark">NOVA<small>MUSIC IN MOTION</small></span><span class="nova-orbit" aria-hidden="true"><i>♫</i><i>♪</i><i>♬</i></span><span class="preview-bottom">VIEW THE PROJECT <b>↗</b></span>'
  },
  {
    className: 'visual-bike',
    projectType: '02 / PRODUCT EXPERIENCE',
    title: 'Bike Showcase',
    summary: 'An interactive Ninja 500 product concept shaped around color, speed, and motion-led exploration.',
    role: 'Creative direction · UI design',
    tools: 'Figma / HTML / CSS / JavaScript',
    repo: 'https://github.com/AshmitaNotFound/BIKE-SHOWCASE',
    visual: '<span class="preview-top">NINJA 500 / INTERACTIVE CONCEPT <b>2026</b></span><span class="bike-title">CHOOSE.<br><i>MOVE.</i><br>EXPLORE.</span><span class="bike-note">A PRODUCT EXPERIENCE IN MOTION</span><span class="preview-bottom">VIEW THE PROJECT <b>↗</b></span>'
  }
];

const track = document.querySelector('.project-track');
track.setAttribute('aria-label', 'Featured projects, scroll horizontally');
track.innerHTML = projects.map((project) => `
  <article class="project project-featured">
    <a class="project-visual ${project.className}" href="${project.repo}" target="_blank" rel="noreferrer" aria-label="Open ${project.title} repository">
      ${project.visual}
    </a>
    <div class="project-info">
      <div>
        <span class="tiny-index">${project.projectType}</span>
        <h3>${project.title}</h3>
        <p>${project.summary}</p>
      </div>
      <a class="circle-link" href="${project.repo}" target="_blank" rel="noreferrer" aria-label="Open ${project.title} repository">↗</a>
    </div>
    <div class="project-tags">
      <span>${project.role}</span>
      <span>${project.tools}</span>
      <a href="${project.repo}" target="_blank" rel="noreferrer">View code ↗</a>
    </div>
  </article>
`).join('');

const projectCount = document.querySelector('#project-count');
const totalProjects = projects.length;
function updateProjectCount() {
  const firstCard = track.querySelector('.project');
  if (!firstCard) return;
  const gap = Number.parseFloat(getComputedStyle(track).gap) || 0;
  const step = firstCard.getBoundingClientRect().width + gap;
  const current = Math.min(totalProjects, Math.max(1, Math.round(track.scrollLeft / step) + 1));
  projectCount.textContent = `${String(current).padStart(2, '0')} — ${String(totalProjects).padStart(2, '0')}`;
}
function moveProject(direction) {
  const firstCard = track.querySelector('.project');
  if (!firstCard) return;
  const gap = Number.parseFloat(getComputedStyle(track).gap) || 0;
  const step = firstCard.getBoundingClientRect().width + gap;
  const current = Math.min(totalProjects - 1, Math.max(0, Math.round(track.scrollLeft / step)));
  const next = (current + direction + totalProjects) % totalProjects;
  track.scrollTo({ left: next * step, behavior: motionPaused ? 'instant' : 'smooth' });
}
document.querySelector('#prev').addEventListener('click', () => moveProject(-1));
document.querySelector('#next').addEventListener('click', () => moveProject(1));
track.addEventListener('keydown', (event) => {
  if (event.target !== track) return;
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault();
    moveProject(event.key === 'ArrowRight' ? 1 : -1);
  }
});
track.addEventListener('scroll', updateProjectCount, { passive: true });
updateProjectCount();

const portrait = document.querySelector('.portrait');
portrait.addEventListener('pointermove', (event) => {
  if (motionPaused || event.pointerType === 'touch') return;
  const rect = portrait.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  portrait.style.setProperty('--portrait-x', `${-y * 8}deg`);
  portrait.style.setProperty('--portrait-y', `${x * 10}deg`);
});
portrait.addEventListener('pointerleave', () => {
  portrait.style.setProperty('--portrait-x', '0deg');
  portrait.style.setProperty('--portrait-y', '0deg');
});

const scene = document.querySelector('.monogram-scene');
document.querySelector('.hero').addEventListener('pointermove', (event) => {
  if (motionPaused || innerWidth < 701 || event.pointerType === 'touch') return;
  const x = (event.clientX / innerWidth - 0.5) * 12;
  const y = Math.max(-8, Math.min(8, (event.clientY / innerHeight - 0.5) * 10));
  scene.style.translate = `${x}px ${y}px`;
}, { passive: true });
document.querySelector('.hero').addEventListener('pointerleave', () => { scene.style.translate = '0 0'; });
document.querySelector('#year').textContent = new Date().getFullYear();

const railEntries = [
  ['home', 'Introduction', '01'],
  ['work', 'Projects', '02'],
  ['photography', 'Photography', '03'],
  ['journey', 'Journey', '04'],
  ['contact', 'Contact', '05']
];
const sectionRail = document.querySelector('.section-rail');
sectionRail.innerHTML = railEntries.map(([id, label, number], index) => `
  <a class="section-rail__link${index === 0 ? ' is-active' : ''}" href="#${id}" aria-label="${number} ${label}"${index === 0 ? ' aria-current="true"' : ''}>
    <span class="section-rail__label">${label}</span><span class="section-rail__number">${number}</span>
  </a>
`).join('');
const sectionRailLinks = [...sectionRail.querySelectorAll('.section-rail__link')];
const pageSections = sectionRailLinks.map((link) => document.querySelector(link.hash));
let railUpdateQueued = false;
function updateSectionRail() {
  const readingLine = scrollY + innerHeight * 0.45;
  let activeSection = pageSections[0];
  for (const section of pageSections) if (section.offsetTop <= readingLine) activeSection = section;
  sectionRailLinks.forEach((link) => {
    const active = link.hash === `#${activeSection.id}`;
    link.classList.toggle('is-active', active);
    link.toggleAttribute('aria-current', active);
  });
  sectionRail.classList.toggle('is-on-dark', activeSection.id === 'contact');
  railUpdateQueued = false;
}
addEventListener('scroll', () => {
  if (!railUpdateQueued) {
    railUpdateQueued = true;
    requestAnimationFrame(updateSectionRail);
  }
}, { passive: true });
addEventListener('resize', () => { updateSectionRail(); updateProjectCount(); });
updateSectionRail();
