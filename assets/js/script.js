'use strict';

// Clinic content is drawn from the owner's supplied profile and Facebook text.
// Booking is a WhatsApp request, never a confirmed appointment or a diagnosis.
const services = [
  {id:'physio',title:'العلاج الطبيعي للأطفال',category:'movement',icon:'move',color:'#0963d7',bg:'#edf4ff',short:'خطوة بخطوة نحو حركة أكثر استقلالًا.',description:'رعاية متخصصة للحركة والتأهيل، تبدأ بفهم احتياجات طفلك من خلال التقييم. يناقش الأخصائي معك أهداف البرنامج المناسب وطرق متابعة التقدّم.',tags:['التأهيل الحركي','التوازن','متابعة التطوّر']},
  {id:'speech',title:'التخاطب والتواصل',category:'communication',icon:'chat',color:'#029c98',bg:'#eaf8f4',short:'مساحة للتعبير والتواصل بثقة.',description:'جلسات للتخاطب وتنمية التواصل، بحسب تقييم الطفل واحتياجاته. اسأل فريقنا عن خطوات التقييم والبرنامج المناسب لمهارات اللغة والكلام.',tags:['اللغة والكلام','التواصل','إرشاد الأسرة']},
  {id:'sensory',title:'التكامل الحسي',category:'skills',icon:'puzzle',color:'#8970bb',bg:'#f3effb',short:'اكتشاف الحواس من خلال أنشطة هادفة.',description:'أنشطة حسية تفاعلية ضمن برامج المركز، تتيح للطفل الاستكشاف والمشاركة. يحدد التقييم المتخصص ملاءمة البرنامج وطبيعة الأنشطة لكل طفل.',tags:['أنشطة تفاعلية','الاستكشاف','المهارات الحسية']},
  {id:'water',title:'العلاج المائي',category:'movement',icon:'wave',color:'#168dba',bg:'#eaf7fc',short:'تجربة تأهيل حركي في بيئة مائية.',description:'جلسات للتأهيل الحركي في بيئة مائية. تواصل مع الفريق لمعرفة تفاصيل الجلسات، ومتطلبات المشاركة، ومدى ملاءمة الخدمة لطفلك بعد التقييم.',tags:['تأهيل في الماء','تقييم الملاءمة','متابعة متخصصة']},
  {id:'learning',title:'تنمية المهارات وصعوبات التعلّم',category:'skills',icon:'book',color:'#bd913e',bg:'#fff7e5',short:'نتعلّم باللعب، ونكتشف قدرات جديدة.',description:'تقييم صعوبات التعلّم وجلسات تفاعلية لتنمية المهارات الإدراكية والوعي الصوتي. يستخدم المركز أنشطة وألعابًا تعليمية بحسب احتياجات الطفل.',tags:['تقييم صعوبات التعلّم','الوعي الصوتي','المهارات الإدراكية']},
  {id:'feeding',title:'جلسات المضغ والبلع',category:'communication',icon:'smile',color:'#c37d6f',bg:'#fdf1ed',short:'اهتمام متخصص بمهارات المضغ والبلع.',description:'جلسات متخصصة للمضغ والبلع تبدأ بفهم احتياجات الطفل. يناقش الفريق مع الأسرة التقييم المطلوب والخطوات المناسبة للحالة.',tags:['تقييم متخصص','المضغ والبلع','تواصل مع الأسرة']}
];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const icon = name => `<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
let activeService = null;
let dialogOpener = null;
let toastTimer;
let preferredDoctor = null;

function renderServices() {
  $('#service-grid').innerHTML = services.map(service => `<article class="service-card" id="service-${service.id}" style="--card-color:${service.color};--card-bg:${service.bg}"><button class="service-photo-button" data-service="${service.id}" aria-label="تفاصيل ${service.title}"><img src="assets/images/${service.title}.webp" alt="${service.title}" width="800" height="533" loading="lazy" decoding="async"></button><div class="service-card-body"><svg class="doodle service-motif" aria-hidden="true" focusable="false"><use href="#d-${service.id==='learning'?'blocks':service.id}"/></svg><span class="service-card-icon">${icon(service.icon)}</span><h3>${service.title}</h3><p>${service.short}</p><button class="text-button" data-service="${service.id}">اعرف أكثر عن الخدمة ${icon('arrow')}</button></div></article>`).join('');
}

// Replace pending profiles when the clinic provides approved names and details.
const doctors = [
  {id:'mina',name:'د. مينا رضا',role:'مدرس واستشاري العلاج الطبيعي للأطفال وجراحاتها',image:'assets/images/د. مينا رضا.jpeg',qualifications:['دكتوراه العلاج الطبيعي — جامعة القاهرة، مصر','ماجستير العلوم العصبية والتصوير العصبي — جامعة بوردو، فرنسا']},
  {id:'member-2',name:'د. أحمد سامح',sample:true,role:'أخصائي العلاج الطبيعي والتأهيل الحركي للأطفال',qualifications:['بكالوريوس العلاج الطبيعي — مؤهل تجريبي للتصميم','اهتمامات نموذجية: التوازن والتناسق الحركي وتنمية المهارات الحركية']},
  {id:'member-3',name:'د. سارة عادل',sample:true,role:'أخصائية التخاطب وتنمية مهارات التواصل',qualifications:['تخصص التخاطب وتنمية اللغة — بيانات تجريبية للتصميم','اهتمامات نموذجية: التواصل واللغة والوعي الصوتي لدى الأطفال']}
];
let activeDoctor = null;
function renderDoctors() {
  $('#team-grid').innerHTML = doctors.map((doctor,index) => `<article class="doctor-card${doctor.pending?' pending-profile':''}">${doctor.image?`<img class="doctor-photo" src="${doctor.image}" alt="${doctor.name}" width="747" height="946" loading="lazy">`:`<div class="doctor-placeholder" aria-hidden="true">${icon('heart')}<span>فريق تكامل</span></div>`}<div class="doctor-card-body">${doctor.sample?`<span class="sample-label">ملف تجريبي</span>`:``}<span class="eyebrow">${doctor.sample?'نموذج لعضو الفريق':'العلاج الطبيعي للأطفال'}</span><h3>${doctor.name}</h3><p>${doctor.pending?'سيُضاف الاسم والتخصص والمؤهلات قريبًا.':doctor.role}</p><button class="btn btn-outline" data-doctor="${doctor.id}" aria-label="${'الملف الكامل — '+doctor.name}">${doctor.pending?'حالة الملف':'الملف الكامل'} ${icon('arrow')}</button></div></article>`).join('');
}
function showDoctor(id) {
  activeDoctor = doctors.find(doctor => doctor.id === id);
  if (!activeDoctor) return;
  $('#doctor-detail').innerHTML = activeDoctor.pending
    ? `<div class="detail-icon">${icon('heart')}</div><span class="eyebrow">فريق تكامل</span><h2 id="doctor-dialog-title">تفاصيل هذا العضو قريبًا</h2><p class="muted">سيُضاف الاسم والتخصص والمؤهلات إلى هذا الملف. يمكنك التواصل مع المركز للتعرّف على الأخصائي المناسب لطفلك.</p>`
    : `${activeDoctor.image?`<img class="doctor-dialog-photo" src="${activeDoctor.image}" alt="${activeDoctor.name}" width="747" height="946">`:``}${activeDoctor.sample?`<p class="sample-label">ملف تجريبي: الاسم والتخصص والمؤهلات أمثلة للتصميم وليست بيانات عضو حقيقي بالمركز.</p>`:``}<span class="eyebrow">تعرف على طبيبك</span><h2 id="doctor-dialog-title">${activeDoctor.name}</h2><p class="doctor-role">${activeDoctor.role}</p><h3 class="qualifications-heading">المؤهلات العلمية</h3><ul class="credentials">${activeDoctor.qualifications.map(item=>`<li>${icon('check')}<span>${item}</span></li>`).join('')}</ul>`;
  $('#book-doctor').textContent = activeDoctor.sample ? 'اطلب موعدًا بالمركز' : 'اطلب موعدًا مع د. مينا رضا';
  showDialog($('#doctor-dialog'));
}

function showDialog(dialog, opener = document.activeElement) {
  if (!opener?.closest('dialog')) dialogOpener = opener;
  $$('dialog[open]').forEach(open => open.close());
  dialog.showModal();
  document.body.style.overflow = 'hidden';
}

function closeDialog(dialog) {
  dialog.close();
}

function resetBookingReview() {
  $('#booking-form').hidden = false;
  $('#booking-review').hidden = true;
  $('#progress-one').classList.add('current');
  $('#progress-two').classList.remove('current');
}

function openBooking(serviceTitle, doctorName = null) {
  preferredDoctor = doctorName;
  const opener = document.activeElement;
  resetBookingReview();
  $('#booking-service').value = serviceTitle || 'تقييم أولي / أحتاج مساعدة في الاختيار';
  showDialog($('#booking-dialog'), opener);
}

function showService(id) {
  activeService = services.find(service => service.id === id);
  if (!activeService) return;
  $('#service-detail').innerHTML = `<div class="detail-icon" style="background:${activeService.bg};color:${activeService.color}">${icon(activeService.icon)}</div><span class="eyebrow">رعاية تناسب احتياجات طفلك</span><h2 id="service-dialog-title">${activeService.title}</h2><p>${activeService.description}</p><div class="detail-tags">${activeService.tags.map(tag => `<span>${tag}</span>`).join('')}</div><p class="detail-note">يحدد الأخصائي ملاءمة الخدمة بعد التقييم. تواصل مع المركز لمعرفة التفاصيل والمواعيد المتاحة.</p>`;
  showDialog($('#service-dialog'));
}

function notify(message) {
  clearTimeout(toastTimer);
  $('#toast').textContent = message;
  $('#toast').classList.add('show');
  toastTimer = setTimeout(() => $('#toast').classList.remove('show'),4000);
}

document.addEventListener('click', event => {
  const booking = event.target.closest('[data-book]');
  if (booking) openBooking();
  const doctor = event.target.closest('[data-doctor]');
  if (doctor) showDoctor(doctor.dataset.doctor);
  const service = event.target.closest('[data-service]');
  if (service) showService(service.dataset.service);
  const close = event.target.closest('.close-dialog');
  if (close) closeDialog(close.closest('dialog'));
  const guide = event.target.closest('[data-guide]');
  if (guide) {
    closeDialog($('#guide-dialog'));
    const match = services.find(service => service.category === guide.dataset.guide);
    const card = $('#service-' + match.id);
    card.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});
    card.classList.add('service-highlight');
    setTimeout(() => card.classList.remove('service-highlight'),3000);
  }
});


$$('dialog').forEach(dialog => {
  dialog.addEventListener('click',event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog(dialog);
  });
  dialog.addEventListener('close', () => {
    if (!$('dialog[open]')) {
      document.body.style.overflow = '';
      if (dialogOpener?.isConnected && !dialogOpener.closest('dialog')) dialogOpener.focus({preventScroll:true});
    }
  });
});

$('#open-guide').addEventListener('click',() => showDialog($('#guide-dialog')));
$('#book-doctor').addEventListener('click',() => openBooking(undefined,activeDoctor?.sample ? null : activeDoctor?.name));
$('#book-service').addEventListener('click',() => openBooking(activeService?.title));
$('#review-back').addEventListener('click',() => {resetBookingReview();$('#parent-name').focus();});

function localDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
}
$('#preferred-date').min = localDate();
$('#parent-name').addEventListener('input', () => $('#parent-name').setCustomValidity(''));
$('#preferred-date').addEventListener('input', () => $('#preferred-date').setCustomValidity(''));

$('#booking-form').addEventListener('submit',event => {
  event.preventDefault();
  const nameInput = $('#parent-name');
  const dateInput = $('#preferred-date');
  nameInput.setCustomValidity(nameInput.value.trim() ? '' : 'من فضلك اكتب اسم ولي الأمر.');
  dateInput.min = localDate();
  dateInput.setCustomValidity(dateInput.value && dateInput.value < localDate() ? 'اختر اليوم أو يومًا قادمًا.' : '');
  if (!event.target.reportValidity()) return;
  const name = nameInput.value.trim();
  const service = $('#booking-service').value;
  const date = dateInput.value ? new Intl.DateTimeFormat('ar-EG',{dateStyle:'full'}).format(new Date(`${dateInput.value}T12:00:00`)) : 'بالتنسيق مع المركز';
  const period = $('#preferred-period').value;
  const summary = $('#review-summary');
  summary.replaceChildren();
  [['ولي الأمر',name],['الخدمة',service],...(preferredDoctor ? [['الطبيب المطلوب',preferredDoctor]] : []),['اليوم المفضّل',date],['الفترة',period]].forEach(([label,value]) => {
    const row = document.createElement('div');row.className = 'review-row';
    const key = document.createElement('span');key.textContent = label;
    const text = document.createElement('strong');text.textContent = value;
    row.append(key,text);summary.append(row);
  });
  const message = `مرحبًا مركز تكامل، أرغب في طلب موعد.\nاسم ولي الأمر: ${name}\nالخدمة: ${service}${preferredDoctor ? '\nالطبيب المطلوب: ' + preferredDoctor : ''}\nاليوم المفضّل: ${date}\nالفترة المفضّلة: ${period}\nأرجو إبلاغي بالمواعيد المتاحة والتكلفة وتأكيد الموعد. شكرًا لكم.`;
  $('#whatsapp-send').href = `https://wa.me/201068681114?text=${encodeURIComponent(message)}`;
  $('#booking-form').hidden = true;
  $('#booking-review').hidden = false;
  $('#progress-one').classList.remove('current');
  $('#progress-two').classList.add('current');
  $('#whatsapp-send').focus();
});

$('#copy-address').addEventListener('click',async () => {
  const address = 'مركز تكامل – دمنهور، شارع عبد السلام الشاذلي، أول الكوبري العلوي، بجوار أتيليه روزي وأعلى صيدلية المحافظة.';
  try {
    if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(address);
    else {
      const textarea = document.createElement('textarea');textarea.value = address;textarea.style.position='fixed';textarea.style.opacity='0';document.body.append(textarea);textarea.select();
      const copied = document.execCommand('copy');textarea.remove();if (!copied) throw new Error('Copy unavailable');
    }
    notify('تم نسخ العنوان. مستنيينك في تكامل!');
  } catch {notify('تعذّر النسخ تلقائيًا. يمكنك تحديد العنوان ونسخه.');}
});

services.forEach(service => {
  const option = document.createElement('option');option.value = service.title;option.textContent = service.title;$('#booking-service').append(option);
});
$('#year').textContent = new Date().getFullYear();
renderServices();

renderDoctors();

// Native horizontal scrolling supports touch, trackpads and focused controls.
const teamTrack = $('#team-grid');
const phoneCarousel = window.matchMedia('(max-width: 760px)');
const teamCards = $$('.doctor-card', teamTrack);
let teamIndex = 0;
$('#team-carousel-dots').innerHTML = doctors.map((doctor,index) => `<button type="button" data-team-index="${index}" aria-label="عرض ${doctor.name}" aria-controls="team-grid" aria-current="${index===0}"></button>`).join('');
function syncTeamCarousel() {
  if (!phoneCarousel.matches) return;
  const trackLeft = teamTrack.getBoundingClientRect().left;
  teamIndex = teamCards.reduce((closest,card,index) => Math.abs(card.getBoundingClientRect().left-trackLeft)<Math.abs(teamCards[closest].getBoundingClientRect().left-trackLeft) ? index : closest,0);
  // The last card may stop at the end of the scrollable area, short of the edge.
  if (teamTrack.scrollLeft + teamTrack.clientWidth >= teamTrack.scrollWidth - 2) teamIndex = teamCards.length - 1;
  $$('[data-team-index]').forEach((dot,index) => dot.setAttribute('aria-current',String(index===teamIndex)));
  $('#team-prev').disabled = teamIndex === 0;
  $('#team-next').disabled = teamIndex === teamCards.length - 1;
}
function moveTeam(index) {
  if (!phoneCarousel.matches) return;
  const card = teamCards[Math.max(0,Math.min(teamCards.length-1,index))];
  const left = teamTrack.scrollLeft + card.getBoundingClientRect().left - teamTrack.getBoundingClientRect().left;
  teamTrack.scrollTo({left,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
}
$('#team-prev').addEventListener('click',()=>moveTeam(teamIndex-1));
$('#team-next').addEventListener('click',()=>moveTeam(teamIndex+1));
$('#team-carousel-dots').addEventListener('click',event=>{const dot=event.target.closest('[data-team-index]');if(dot)moveTeam(Number(dot.dataset.teamIndex));});
teamTrack.addEventListener('scroll',syncTeamCarousel,{passive:true});
teamTrack.addEventListener('keydown',event=>{
  if (!phoneCarousel.matches || event.target!==teamTrack) return;
  if (['ArrowRight','ArrowLeft','Home','End'].includes(event.key)) {
    event.preventDefault();
    moveTeam(event.key==='Home'?0:event.key==='End'?teamCards.length-1:teamIndex+(event.key==='ArrowRight'?1:-1));
  }
});
function configureTeamCarousel(){teamTrack.tabIndex=phoneCarousel.matches?0:-1;syncTeamCarousel();}
phoneCarousel.addEventListener('change',configureTeamCarousel);
window.addEventListener('resize',syncTeamCarousel,{passive:true});
configureTeamCarousel();

// Manual hero slideshow: no automatic motion or unexpected image changes.
const heroCaptions=[['أهلًا بك في مركز تكامل','مساحة للرعاية، وبداية لخطوة جديدة.'],['كل حركة، خطوة لقدّام','العلاج الطبيعي وتأهيل الأطفال'],['قدرات صغيرة، وأحلام كبيرة','تنمية المهارات والتعلّم من خلال اللعب']];
$$('[data-hero-dot]').forEach(dot=>dot.addEventListener('click',()=>{const index=Number(dot.dataset.heroDot);$$('[data-hero-slide]').forEach((slide,i)=>slide.hidden=i!==index);$$('[data-hero-dot]').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));$('#hero-caption-title').textContent=heroCaptions[index][0];$('#hero-caption-text').textContent=heroCaptions[index][1];}));
