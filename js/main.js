// DOEH BUHS — Shared JavaScript
// Navigation, hamburger menu, shared utilities

// Mobile menu toggle
function toggleMenu(){
  document.getElementById('hamburger').classList.toggle('open');
  document.getElementById('mobile-menu').classList.toggle('open');
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(e){
  const menu = document.getElementById('mobile-menu');
  const hamburger = document.getElementById('hamburger');
  if(menu && hamburger){
    if(!menu.contains(e.target) && !hamburger.contains(e.target)){
      menu.classList.remove('open');
      hamburger.classList.remove('open');
    }
  }
});

// Set active nav link based on current page
document.addEventListener('DOMContentLoaded', function(){
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nb, .mnb').forEach(link => {
    const href = link.getAttribute('href');
    if(href === current){
      link.classList.add('active');
    }
  });
});
