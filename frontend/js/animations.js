/**
 * animations.js - Native Animation Engine
 *
 * Uses Web Animations API (WAAPI) + Intersection Observer API
 * No external dependencies - fully offline compatible
 *
 * Features:
 * 1. Fade-in on page load (.js-animate-fade)
 * 2. Scroll reveal effects (.js-animate-scroll with initial opacity-0)
 * 3. Smooth modal transitions (animateModal utility)
 */

(function() {
  'use strict';

  // ============================================
  // 1. Fade-in on Page Load (WAAPI)
  // ============================================
  function initFadeIn() {
    document.querySelectorAll('.js-animate-fade').forEach(function(el) {
      // Ensure element starts at the correct visual state
      el.animate([
        { opacity: 0, transform: 'translateY(10px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], {
        duration: 400,
        easing: 'ease-out',
        fill: 'forwards'
      });
    });
  }

  // ============================================
  // 2. Scroll Reveal Effects (Intersection Observer + WAAPI)
  // ============================================
  function initScrollReveal() {
    var scrollElements = document.querySelectorAll('.js-animate-scroll');
    if (scrollElements.length === 0) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          el.animate([
            { opacity: 0, transform: 'translateY(20px)' },
            { opacity: 1, transform: 'translateY(0)' }
          ], {
            duration: 500,
            easing: 'ease-out',
            fill: 'forwards'
          });
          // CRITICAL PERFORMANCE GUARDRAIL: only trigger once
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.1 });

    scrollElements.forEach(function(el) {
      observer.observe(el);
    });
  }

  // ============================================
  // 3. Smooth Modal Transitions (WAAPI)
  // ============================================
  // Global utility function for opening/closing modals with animation
  window.animateModal = function(modalElement, show) {
    if (!modalElement) return;

    // Find the inner panel - look for .modal-panel class, or use the first child div
    var panel = modalElement.querySelector('.modal-panel');
    if (!panel) {
      // Fallback: try first child element
      var children = modalElement.children;
      for (var i = 0; i < children.length; i++) {
        if (children[i].tagName === 'DIV') {
          panel = children[i];
          break;
        }
      }
    }

    if (!panel) {
      // Absolute fallback: toggle hidden directly
      if (show) {
        modalElement.classList.remove('hidden');
      } else {
        modalElement.classList.add('hidden');
      }
      return;
    }

    if (show) {
      // Opening: Remove hidden, then animate panel in
      modalElement.classList.remove('hidden');
      panel.animate([
        { opacity: 0, transform: 'scale(0.95)' },
        { opacity: 1, transform: 'scale(1)' }
      ], {
        duration: 200,
        easing: 'ease-out',
        fill: 'forwards'
      });
    } else {
      // Closing: Animate out, then re-apply hidden via onfinish callback
      var anim = panel.animate([
        { opacity: 1, transform: 'scale(1)' },
        { opacity: 0, transform: 'scale(0.95)' }
      ], {
        duration: 200,
        easing: 'ease-out',
        fill: 'forwards'
      });
      anim.onfinish = function() {
        modalElement.classList.add('hidden');
      };
    }
  };

  // ============================================
  // Initialization on DOM Ready
  // ============================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initFadeIn();
      initScrollReveal();
    });
  } else {
    initFadeIn();
    initScrollReveal();
  }
})();