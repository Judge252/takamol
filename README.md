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
