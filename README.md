# مركز تكامل — Website guide

## Current layout
The Arabic HTML/CSS/JS homepage now has separate scrolling sections: hero, services, team, location, booking invitation, FAQs, and footer. No section-switching tabs or service filters hide content.

## Photos
The hero uses assets/images/hero.jpeg, the supplied clinic reception photo. The six services use the supplied Arabic-named images, delivered as optimized WebP copies. All original JPGs are preserved. Dr. Mina uses assets/images/د. مينا رضا.jpeg. No generated hero artwork is referenced.

## Typography
Main reading text is 16–19 px, with stronger 600–800 heading and control weights. Fonts remain Alexandria and Noto Sans Arabic. White #FFFFFF, blue #0963D7, turquoise #029C98, ink #182D44, and darker secondary text #526476 form the palette.

## Team editing
The doctors array in assets/js/script.js contains three cards. Dr. Mina Reda uses the owner's supplied photo and qualifications. Ahmed Sameh and Sara Adel are explicitly labelled fictional sample profiles requested for layout purposes. Replace their names, roles, qualifications, and images with approved real profiles before publication, then remove sample:true. Sample-profile booking deliberately makes a general clinic request without sending a fictional doctor's name.

Each doctor card opens a details modal. Booking from Dr. Mina's modal adds his name to the WhatsApp request and review.

## Booking
The site builds a WhatsApp message to 201068681114. Visitors send the message themselves, and the clinic confirms the appointment. No appointments are automatically reserved and no form data is persisted. No test messages were sent. Telephone: 01000865703. The address section includes the owner's exact directions URL plus a labelled area map.

## Run / publish
Open index.html directly in a browser, or serve this folder with any static server. There are no packages to install and no build step. Upload index.html and assets to a static host to publish. External Google Fonts, Maps and WhatsApp require internet access. The development preview is http://127.0.0.1:4173/.

## Verification
Checked the photos, visible section order, navigation targets, all six service popups and booking selections, all three doctor popups, Dr. Mina's portrait, real versus sample doctor booking messages, guide behavior, JavaScript syntax and reading sizes. Responsive page overflow was checked at 320, 390, 768 and 1440 px. No JavaScript page errors reported. External message sending and real appointment confirmation were not performed.

## Mobile compact layout update
At widths up to 760 px the six services use two columns and three rows, smaller image panels and compact card spacing. The team becomes a native horizontal scroll-snap carousel with a partial next-card preview, previous/next buttons, progress dots and keyboard support. Desktop grids are retained. Carousel navigation, native horizontal scrolling, profile popups, and 320/390 px overflow were verified; desktop layout was checked at 1440 px.
"# takamol" 

## Dark redesign — September 21
The active theme is assets/css/theme.css, loaded after the existing responsive layout stylesheet. It adopts the supplied clinic site's midnight #0c0f1a, gold #d4a843 / #f0c96a and teal #18bba7 styling, framed split hero, gradient cards and circular team portraits. Child-oriented accents include soft corners, play/discovery/progress chips and colored service motifs. The clinic hero has three manually selectable slides. The title star is removed.

The mobile services remain two columns and three rows. Team cards retain native swipe navigation, arrows and dots, plus profile popups. The feedback cards quote the owner's supplied Facebook text; they are comments, not verified numerical ratings. No numerical scores or treatment outcomes were invented. Two team profiles remain labelled fictional samples pending real details.

Logo icons are included as favicon.ico, PNG icons and Apple touch icon. Static Open Graph and Twitter preview tags point to the supplied clinic hero image. A PUBLIC URL is still needed to finalize absolute preview URLs: run `node scripts/set-public-url.cjs https://your-domain.com/` before publishing. localhost cannot be fetched by social platforms.

The redesign checks covered hero slide switching, all six service detail and booking paths, the doctor popup and doctor-specific WhatsApp request, team carousel navigation, photo loading, responsive grids, no page overflow and JavaScript page errors. No messages were sent and no deployment was performed.

## Pediatric visual enhancement
This is a decorative extension of the approved dark theme, organized under CHILD-FRIENDLY VISUAL SYSTEM in theme.css. The original CSS and all visitor-facing copy are preserved. The only service-renderer addition is an aria-hidden SVG motif; service data and all behavior remain unchanged.

The system adds a restrained pastel accent palette, sparse desktop background doodles, a small hero kite/cloud/toy-block detail, subtly folded sticker chips, activity-specific service motifs (footsteps, speech bubbles, puzzle, bubbles, blocks, spoon), a dotted care journey, faint portrait outlines and one peek-a-boo bear at the CTA edge. All added SVGs are aria-hidden, non-focusable and pointer-inert. Background doodles are hidden on smaller screens. Motion stops for prefers-reduced-motion. No libraries or image assets were added.

Verification: source comparison confirmed unchanged page copy, service/doctor data, behavior and base stylesheet. Layout checks passed at 320, 360, 390, 430, 768, 1024 and 1440 px, including no page overflow or decoration/text collisions. Hero switching, six service dialogs and booking selections, three doctor dialogs, required-name validation, booking review/edit, doctor preference in WhatsApp, guide, FAQ and team navigation passed. Reduced-motion emulation produced no running doodle animations. Existing text contrast was checked against the raised dark surface. No messages were sent.

## Parent information and UI update
- Six service illustrations and five scannable detail sections per service; the existing data-driven renderer and booking flow are retained.
- Larger 28px mobile navigation icons and 48px+ targets, shared button tokens, more Arabic heading leading, and stronger caption contrast without dimming the full photo.
- Added packages.html, privacy.html, terms.html and three article-*.html pages. Articles cite ASHA, APTA/ChoosePT and UNICEF. Eight parent FAQs are included.
- Packages are illustrative: the clinic must provide approved prices, session counts and durations. No online-session availability, payment method or refund terms are invented.
- Full Arabic/English support now covers all seven pages and dynamic content. See the bilingual implementation notes below.
- Static pages share the existing booking dialog and script. Common header/footer markup is repeated in HTML; update all seven pages when changing shared navigation.
- Run node scripts/set-public-url.cjs https://your-domain.com/ after the public URL is known. The helper now sets unique canonical/OG URLs for every root HTML page. Public social preview crawling is not verified on localhost.
- Verification covered seven widths (320, 360, 390, 430, 768, 1024, 1440), local navigation, all page booking reviews, package selection, language switching and persistence, hero/service/doctor dialogs, and mobile team controls. No WhatsApp messages were sent.


## Full Arabic / English support
- assets/js/translations.js contains 398 source-keyed {ar, en} entries for visible copy, accessible labels and SEO metadata. Update the paired entries when changing source copy.
- assets/js/i18n.js translates text nodes and supported attributes without replacing markup or event handlers. A MutationObserver handles new dialog, slider and notification content. It never translates input values, user names, URLs or service identifiers.
- Arabic is the default. The header switch updates document/main/dialog language and direction, persists takamol-language in localStorage, and restores it after refresh. The existing Arabic logo artwork and clinic photos are unchanged.
- Booking summaries, validation, dates, WhatsApp messages and copied addresses use the selected language. Switching during an open review preserves form values and regenerates the localized summary.
- Tests passed on all seven pages at 320, 360, 390, 430, 768, 1024 and 1440 pixels. Checks covered untranslated text/attributes, service and doctor dialogs, all slider captions, form preservation, localized booking messages, Arabic restoration and refresh persistence.
- SEO title/description/keywords and Open Graph/Twitter copy switch dynamically. Static HTML remains Arabic for no-JavaScript access and social crawlers; no separate English URL or server-rendered English page is generated.
