'use strict';

// Source-keyed copy keeps one DOM and preserves markup, listeners and form state.
// Only registered content is translated. Input values and URLs are never rewritten.
window.TakamolI18n = (() => {
  const catalog = window.TAKAMOL_TRANSLATIONS;
  const textSources = new WeakMap();
  const attributeSources = new WeakMap();
  const attributes = ['aria-label', 'alt', 'title', 'placeholder'];
  let language = 'ar';
  let observer;
  const t = source => catalog[source]?.[language] ?? source;
  const ignored = element => element?.closest('script, style, noscript, [data-i18n-ignore], [data-language]');

  function translateText(node) {
    if (ignored(node.parentElement)) return;
    const current = node.nodeValue;
    let record = textSources.get(node);
    if (!record || current !== record.last) record = {source:current};
    const source = record.source.trim();
    if (!catalog[source]) return;
    const value = record.source.replace(source, t(source));
    record.last = value;
    textSources.set(node,record);
    if (node.nodeValue !== value) node.nodeValue = value;
  }

  function translateAttribute(element, name) {
    const current = element.getAttribute(name);
    if (!current) return;
    const records = attributeSources.get(element) || {};
    let record = records[name];
    if (!record || current !== record.last) record = {source:current};
    if (!catalog[record.source]) return;
    record.last = t(record.source);
    records[name] = record;
    attributeSources.set(element,records);
    if (current !== record.last) element.setAttribute(name,record.last);
  }

  function translate(root = document.documentElement) {
    // Preserve implicit option values before translating their visible labels.
    root.querySelectorAll?.('option:not([value])').forEach(option => option.value = option.textContent);
    if (root.nodeType === Node.TEXT_NODE) translateText(root);
    else {
      const walker = document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) translateText(walker.currentNode);
    }
    const elements = root.querySelectorAll ? [root,...root.querySelectorAll('[aria-label],[alt],[title],[placeholder],meta[content]')] : [];
    elements.forEach(element => {
      if (ignored(element)) return;
      attributes.forEach(name => translateAttribute(element,name));
      if (element.matches?.('meta[content]')) translateAttribute(element,'content');
    });
  }

  function setLanguage(next, persist = true) {
    language = next === 'en' ? 'en' : 'ar';
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('main, dialog').forEach(element => {
      element.lang = language;
      element.dir = document.documentElement.dir;
    });
    translate();
    document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.language === language)));
    const locale = document.querySelector('meta[property="og:locale"]');
    if (locale) locale.content = language === 'ar' ? 'ar_EG' : 'en_GB';
    const map = document.getElementById('area-map');
    if (map) {
      const url = new URL(map.src);
      if (url.searchParams.get('hl') !== language) {
        url.searchParams.set('hl',language);
        map.src = url.href;
      }
    }
    if (persist) try { localStorage.setItem('takamol-language',language); } catch { /* Preference is optional when storage is blocked. */ }
    document.dispatchEvent(new CustomEvent('takamol:languagechange',{detail:{language}}));
  }

  function init() {
    document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click',()=>setLanguage(button.dataset.language)));
    let saved = 'ar';
    try { saved = localStorage.getItem('takamol-language') || 'ar'; } catch { /* Arabic remains the default. */ }
    setLanguage(saved,false);
    // Captures rendered service/doctor content, slider captions and toast updates.
    observer = new MutationObserver(() => {
      observer.disconnect();
      translate();
      observe();
    });
    const observe = () => observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:attributes});
    observe();
  }
  return {init,setLanguage,translate,t,get language(){return language;}};
})();
