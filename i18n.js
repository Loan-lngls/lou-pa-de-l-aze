/* Lou Pa de l'Aze — lightweight FR / EN / DE translation engine.
   French is the source language. We store the original FR text on each node,
   then swap text nodes + a few attributes against the dictionary below.
   Choice is persisted in localStorage so it carries across pages. */
(function () {
  var STORAGE_KEY = 'lou_lang';

  function norm(s) {
    return (s || '')
      .replace(/[’‘ʼ]/g, "'") // unify apostrophes
      .replace(/\s+/g, ' ')                  // collapse whitespace (incl. nbsp)
      .trim();
  }

  // [ French (source) , English , German ]
  var T = [
    // ---- Navigation / shared ----
    ["Accueil", "Home", "Startseite"],
    ["Randonnées", "Hikes", "Wanderungen"],
    ["Nos ânes", "Our donkeys", "Unsere Esel"],
    ["Contact", "Contact", "Kontakt"],
    // ---- Footer ----
    ["Randonnées avec des ânes au cœur des Écrins et de la Matheysine. Accessible à toute la famille.",
      "Donkey hikes in the heart of the Écrins and the Matheysine. Suitable for the whole family.",
      "Eselwanderungen im Herzen der Écrins und der Matheysine. Für die ganze Familie geeignet."],
    ["Randonnées & tarifs", "Hikes & rates", "Wanderungen & Preise"],
    ["Contact & réservation", "Contact & booking", "Kontakt & Buchung"],
    ["Saison", "Season", "Saison"],
    ["Ouvert du", "Open from", "Geöffnet vom"],
    ["1er juin au 29 septembre", "1 June to 29 September", "1. Juni bis 29. September"],
    ["© 2026 Lou Pa de l'Aze — Association de randonnée avec des ânes",
      "© 2026 Lou Pa de l'Aze — Donkey hiking association",
      "© 2026 Lou Pa de l'Aze — Verein für Eselwanderungen"],
    // ---- Accueil ----
    ["Valbonnais · Parc National des Écrins", "Valbonnais · Écrins National Park", "Valbonnais · Nationalpark Écrins"],
    ["Randonnées avec des ânes au cœur des Écrins", "Donkey hikes in the heart of the Écrins", "Eselwanderungen im Herzen der Écrins"],
    ["Découvrir nos randonnées", "Discover our hikes", "Unsere Wanderungen entdecken"],
    ["L'association", "The association", "Der Verein"],
    ["Une autre façon de marcher en montagne", "A different way to walk in the mountains", "Eine andere Art, in den Bergen zu wandern"],
    ["Depuis 2004,", "Since 2004,", "Seit 2004 —"],
    ["vous propose de partir à la découverte des massifs des Écrins et de la Matheysine, accompagnés de nos ânes dociles et attachants.",
      "invites you to explore the Écrins and Matheysine massifs, accompanied by our gentle, endearing donkeys.",
      "lädt Sie ein, die Massive der Écrins und der Matheysine in Begleitung unserer sanften und liebenswerten Esel zu entdecken."],
    ["Une façon unique de randonner en montagne, accessible à toute la famille, où c'est l'âne qui porte les bagages.",
      "A unique way to hike in the mountains, suitable for the whole family, where the donkey carries the luggage.",
      "Eine einzigartige Art, in den Bergen zu wandern, für die ganze Familie geeignet, bei der der Esel das Gepäck trägt."],
    ["Depuis", "Since", "Seit"],
    ["En famille", "As a family", "Mit der Familie"],
    ["Parc National", "National Park", "Nationalpark"],
    ["Nous trouver", "Find us", "So finden Sie uns"],
    ["Au hameau de Péchal", "In the hamlet of Péchal", "Im Weiler Péchal"],
    ["Ouvrir dans Google Maps", "Open in Google Maps", "In Google Maps öffnen"],
    ["Adresse", "Address", "Adresse"],
    ["Saison d'ouverture", "Opening season", "Öffnungssaison"],
    ["1er juin — 29 septembre", "1 June — 29 September", "1. Juni — 29. September"],
    ["Tous les départs se font depuis notre structure, au hameau de Péchal. Aucun transport n'est assuré : vous nous rejoignez directement sur place.",
      "All departures take place from our base in the hamlet of Péchal. No transport is provided: you come and meet us directly on site.",
      "Alle Abfahrten erfolgen von unserem Standort im Weiler Péchal. Es wird kein Transport angeboten: Sie kommen direkt vor Ort zu uns."],
    ["En images", "In pictures", "In Bildern"],
    ["Sur les sentiers", "On the trails", "Auf den Wegen"],
    ["Quelques instants partagés entre montagne, forêt et grandes oreilles.",
      "A few moments shared among mountains, forest and big ears.",
      "Einige Augenblicke zwischen Bergen, Wald und großen Ohren."],
    ["Ils ont randonné avec nous", "They hiked with us", "Sie sind mit uns gewandert"],
    ["Avis de nos randonneurs", "Reviews from our hikers", "Stimmen unserer Wanderer"],
    ["Quelques mots laissés par les familles qui ont partagé le chemin avec nos ânes.",
      "A few words left by the families who shared the trail with our donkeys.",
      "Ein paar Worte von Familien, die den Weg mit unseren Eseln geteilt haben."],
    ["« Nos enfants ont adoré marcher avec les ânes. Une expérience douce, loin de tout, dans des paysages magnifiques. On reviendra l'été prochain, c'est sûr ! »",
      "« Our children loved walking with the donkeys. A gentle experience, far from everything, in magnificent landscapes. We'll be back next summer, for sure! »",
      "« Unsere Kinder liebten es, mit den Eseln zu wandern. Ein sanftes Erlebnis, fernab von allem, in herrlichen Landschaften. Nächsten Sommer kommen wir bestimmt wieder! »"],
    ["« Le tour du Taillefer avec un âne restera l'un de mes plus beaux souvenirs de montagne. Accueil chaleureux et conseils précieux de Yohann. »",
      "« The Taillefer loop with a donkey will remain one of my finest mountain memories. Warm welcome and valuable advice from Yohann. »",
      "« Die Taillefer-Runde mit einem Esel bleibt eine meiner schönsten Bergerinnerungen. Herzlicher Empfang und wertvolle Tipps von Yohann. »"],
    ["« Première rando avec un âne pour nous, et quelle réussite. Notre ânesse était adorable et d'un calme parfait. Merci pour ce moment hors du temps. »",
      "« Our first hike with a donkey, and what a success. Our jenny was adorable and perfectly calm. Thank you for this timeless moment. »",
      "« Unsere erste Wanderung mit einem Esel, und was für ein Erfolg. Unsere Eselin war bezaubernd und vollkommen ruhig. Danke für diesen zeitlosen Moment. »"],
    ["En famille · Juillet 2025", "As a family · July 2025", "Mit der Familie · Juli 2025"],
    ["Randonneur · Août 2024", "Hiker · August 2024", "Wanderer · August 2024"],
    ["Entre amies · Juin 2025", "Among friends · June 2025", "Unter Freundinnen · Juni 2025"],
    ["Avis donnés à titre d'exemple — vos vrais retours viendront prendre leur place.",
      "Sample reviews — your real feedback will take their place.",
      "Beispielhafte Bewertungen — Ihre echten Rückmeldungen treten an ihre Stelle."],
    // ---- Randonnées ----
    ["Itinéraires", "Routes", "Routen"],
    ["À la journée", "Day outings", "Tagestouren"],
    ["Demi-journée & journée", "Half-day & full-day", "Halbtags & ganztags"],
    ["Des sorties accessibles à toute la famille, le temps d'une demi-journée ou d'une journée complète, pour découvrir la marche avec un âne.",
      "Outings suitable for the whole family, for a half-day or a full day, to discover walking with a donkey.",
      "Touren für die ganze Familie, ob halbtags oder ganztags, um das Wandern mit einem Esel zu entdecken."],
    ["Grandes itinérances", "Multi-day journeys", "Mehrtägige Touren"],
    ["Treks de 2 à 7 jours ou plus", "Treks of 2 to 7 days or more", "Treks von 2 bis 7 Tagen oder mehr"],
    ["Pour partir plus loin et plus longtemps : des itinérances de 2 à 7 jours en autonomie, où l'âne bâté porte les bagages d'étape en étape.",
      "To go further and for longer: self-guided journeys of 2 to 7 days, where the pack donkey carries the luggage from stage to stage.",
      "Um weiter und länger unterwegs zu sein: eigenständige Touren von 2 bis 7 Tagen, bei denen der Packesel das Gepäck von Etappe zu Etappe trägt."],
    ["2 à 7 jours ou plus", "2 to 7 days or more", "2 bis 7 Tage oder mehr"],
    ["Sur-mesure", "Tailor-made", "Maßgeschneidert"],
    ["Adapté à votre niveau", "Tailored to your level", "An Ihr Niveau angepasst"],
    ["Trek sur-mesure", "Tailor-made trek", "Maßgeschneiderter Trek"],
    ["De 2 à 7 jours ou plus, nous construisons l'itinérance avec vous : durée, niveau, étapes en refuge ou en bivouac, au rythme qui vous convient. L'âne porte les bagages, vous n'avez plus qu'à avancer. Dites-nous vos envies, on dessine le parcours.",
      "From 2 to 7 days or more, we build the journey with you: length, level, stages in mountain huts or bivouac, at the pace that suits you. The donkey carries the luggage, you just walk. Tell us what you're after and we'll map out the route.",
      "Von 2 bis 7 Tagen oder mehr gestalten wir die Tour mit Ihnen: Dauer, Niveau, Etappen in Berghütten oder im Biwak, im Tempo, das Ihnen passt. Der Esel trägt das Gepäck, Sie gehen einfach. Sagen Sie uns Ihre Wünsche, und wir entwerfen die Route."],
    ["Nos randonnées", "Our hikes", "Unsere Wanderungen"],
    ["De la balade découverte à la grande traversée alpine, nos ânes vous accompagnent à votre rythme.",
      "From a discovery stroll to the great alpine crossing, our donkeys accompany you at your own pace.",
      "Vom Entdeckungsspaziergang bis zur großen Alpenüberquerung begleiten Sie unsere Esel in Ihrem Tempo."],
    ["Demi-journée · 3h", "Half-day · 3h", "Halbtags · 3 Std."],
    ["Facile", "Easy", "Leicht"],
    ["Tour du Lac de Valbonnais", "Lake Valbonnais loop", "Runde um den Lac de Valbonnais"],
    ["Balade idéale pour débuter avec les ânes. Une promenade accessible à tous, parfaite pour les familles avec enfants. Sentiers ombragés, passage en forêt et vue sur le plan d'eau — un moment doux et ressourçant au départ de Valbonnais.",
      "An ideal outing to start out with the donkeys. A walk accessible to all, perfect for families with children. Shaded paths, a stretch through the forest and a view over the water — a gentle, refreshing moment starting from Valbonnais.",
      "Ein idealer Ausflug für den Einstieg mit den Eseln. Ein für alle zugänglicher Spaziergang, perfekt für Familien mit Kindern. Schattige Wege, ein Abschnitt durch den Wald und Blick auf das Gewässer — ein sanfter, erholsamer Moment ab Valbonnais."],
    ["1 journée · 6-7h", "1 day · 6-7h", "1 Tag · 6-7 Std."],
    ["Modéré", "Moderate", "Mittel"],
    ["Randonnée à la journée dans les Écrins", "Full-day hike in the Écrins", "Tageswanderung in den Écrins"],
    ["Une journée complète dans les alpages et sentiers du Parc National des Écrins, au départ de Péchal. L'âne porte pique-nique et affaires, vous profitez du panorama. Itinéraire adapté selon la saison et le groupe.",
      "A full day across the alpine pastures and trails of the Écrins National Park, starting from Péchal. The donkey carries the picnic and gear while you enjoy the panorama. Route adapted to the season and the group.",
      "Ein ganzer Tag auf den Almen und Wegen des Nationalparks Écrins, ab Péchal. Der Esel trägt Picknick und Gepäck, Sie genießen das Panorama. Route je nach Saison und Gruppe angepasst."],
    ["3 à 4 jours", "3 to 4 days", "3 bis 4 Tage"],
    ["Modéré à sportif", "Moderate to demanding", "Mittel bis sportlich"],
    ["Tour du Taillefer", "Taillefer loop", "Taillefer-Runde"],
    ["Le grand tour du massif du Taillefer (2857 m), entre lacs d'altitude, cols panoramiques et hauts plateaux. Bivouac autorisé en altitude. Le trek le plus sauvage du catalogue, pour une vraie aventure avec votre âne. Vue à 360° sur Belledonne, Vercors, Chartreuse et les Écrins.",
      "The grand tour of the Taillefer massif (2,857 m), among high-altitude lakes, panoramic passes and high plateaus. Bivouac allowed at altitude. The wildest trek in the catalogue, for a true adventure with your donkey. 360° views over Belledonne, Vercors, Chartreuse and the Écrins.",
      "Die große Runde um das Taillefer-Massiv (2857 m), zwischen Höhenseen, Aussichtspässen und Hochplateaus. Biwak in der Höhe erlaubt. Der wildeste Trek im Programm, für ein echtes Abenteuer mit Ihrem Esel. 360°-Blick auf Belledonne, Vercors, Chartreuse und die Écrins."],
    ["1 journée · 5h", "1 day · 5h", "1 Tag · 5 Std."],
    ["Tour du Sénepi", "Sénepi loop", "Sénepi-Runde"],
    ["Rando délocalisée autour du Sénepi (1769 m), entre Matheysine et Trièves, au départ de La Mure. Ce massif abrite le plus grand alpage organisé de France. Du sommet, panorama exceptionnel à 360° sur l'Obiou, le Taillefer, le lac de Monteynard et les grandes Alpes.",
      "An off-site hike around the Sénepi (1,769 m), between the Matheysine and the Trièves, starting from La Mure. This massif is home to the largest organised mountain pasture in France. From the summit, an exceptional 360° panorama over the Obiou, the Taillefer, Lake Monteynard and the great Alps.",
      "Eine ausgelagerte Wanderung rund um den Sénepi (1769 m), zwischen Matheysine und Trièves, ab La Mure. Dieses Massiv beherbergt die größte organisierte Alm Frankreichs. Vom Gipfel ein außergewöhnliches 360°-Panorama auf den Obiou, den Taillefer, den Lac de Monteynard und die großen Alpen."],
    ["Nos formules", "Our packages", "Unsere Angebote"],
    ["Tarifs", "Rates", "Preise"],
    ["Demi-journée", "Half-day", "Halbtags"],
    ["1 âne par famille", "1 donkey per family", "1 Esel pro Familie"],
    ["Journée complète", "Full day", "Ganzer Tag"],
    ["Itinérance sur plusieurs jours", "Multi-day journey", "Mehrtägige Tour"],
    ["À partir du 2e jour", "From the 2nd day", "Ab dem 2. Tag"],
    ["Tarif dégressif · nous contacter", "Reduced rate · contact us", "Staffelpreis · kontaktieren Sie uns"],
    ["L'âne porte les bagages. Vous profitez du chemin. Départs flexibles selon disponibilités.",
      "The donkey carries the luggage. You enjoy the trail. Flexible departures subject to availability.",
      "Der Esel trägt das Gepäck. Sie genießen den Weg. Flexible Abfahrten je nach Verfügbarkeit."],
    ["Réserver / Nous contacter", "Book / Contact us", "Buchen / Kontakt"],
    ["Paiements acceptés", "Accepted payments", "Akzeptierte Zahlungen"],
    ["Espèces · Chèque · Chèques-Vacances", "Cash · Cheque · Holiday vouchers", "Bar · Scheck · Ferienschecks"],
    // ---- Nos ânes ----
    ["La troupe", "The herd", "Die Truppe"],
    ["L'équipe à quatre pattes", "The four-legged team", "Das vierbeinige Team"],
    ["Chaque âne a sa personnalité, son caractère, ses petits caprices. Apprenez à les connaître avant de partir ensemble.",
      "Each donkey has its own personality, character and little quirks. Get to know them before setting off together.",
      "Jeder Esel hat seine eigene Persönlichkeit, seinen Charakter, seine kleinen Macken. Lernen Sie sie kennen, bevor Sie gemeinsam aufbrechen."],
    ["Gourmand", "Greedy", "Verfressen"],
    ["Curieux", "Curious", "Neugierig"],
    ["Câlin", "Cuddly", "Verschmust"],
    ["Calme", "Calm", "Ruhig"],
    ["Douce", "Gentle", "Sanft"],
    ["Fiable", "Reliable", "Zuverlässig"],
    ["Joueur", "Playful", "Verspielt"],
    ["Têtu", "Stubborn", "Stur"],
    ["Attachant", "Endearing", "Liebenswert"],
    ["« Gaspard est le premier à pointer son museau dans votre sac à dos. Fan absolu de pommes et de carottes, il sera votre meilleur ami dès la première minute. À condition de ne rien manger devant lui. »",
      "« Gaspard is the first to poke his nose into your backpack. An absolute fan of apples and carrots, he'll be your best friend from the very first minute — as long as you don't eat anything in front of him. »",
      "« Gaspard steckt als Erster seine Nase in Ihren Rucksack. Als absoluter Fan von Äpfeln und Karotten wird er von der ersten Minute an Ihr bester Freund — vorausgesetzt, Sie essen nichts vor seinen Augen. »"],
    ["« Rosette est la sagesse incarnée. Elle avance à son rythme, jamais pressée, toujours là. Idéale pour les petits randonneurs à leur première aventure avec un âne. »",
      "« Rosette is wisdom itself. She moves at her own pace, never in a hurry, always there. Ideal for little hikers on their first adventure with a donkey. »",
      "« Rosette ist die Weisheit in Person. Sie geht in ihrem eigenen Tempo, nie in Eile, immer da. Ideal für kleine Wanderer bei ihrem ersten Abenteuer mit einem Esel. »"],
    ["« Pépito, c'est un caractère. Il sait exactement où il veut aller, et ce n'est pas toujours là où vous avez prévu. Mais impossible de lui en vouloir — son regard vaut tous les détours. »",
      "« Pépito is a real character. He knows exactly where he wants to go, and it isn't always where you'd planned. But it's impossible to hold it against him — his gaze is worth every detour. »",
      "« Pépito hat Charakter. Er weiß genau, wohin er will, und das ist nicht immer dort, wo Sie es geplant haben. Aber man kann ihm nicht böse sein — sein Blick ist jeden Umweg wert. »"],
    ["Ces fiches sont des exemples illustrant le style. Les vrais prénoms et caractères de nos ânes seront ajoutés par l'association — pour faire vraiment connaissance avec toute la troupe.",
      "These profiles are examples to illustrate the style. The real names and characters of our donkeys will be added by the association — to truly get to know the whole herd.",
      "Diese Profile sind Beispiele zur Veranschaulichung. Die echten Namen und Charaktere unserer Esel werden vom Verein ergänzt — um die ganze Truppe wirklich kennenzulernen."],
    ["Prêt à rencontrer la troupe ?", "Ready to meet the herd?", "Bereit, die Truppe kennenzulernen?"],
    ["Choisissez votre randonnée et partez à l'aventure avec votre nouveau compagnon à grandes oreilles.",
      "Choose your hike and set off on an adventure with your new big-eared companion.",
      "Wählen Sie Ihre Wanderung und brechen Sie zum Abenteuer mit Ihrem neuen großohrigen Begleiter auf."],
    ["Réserver une randonnée", "Book a hike", "Eine Wanderung buchen"],
    // ---- Contact ----
    ["Pour toute demande, devis ou réservation, contactez Yohann directement. Les départs sont flexibles et s'adaptent à vos disponibilités.",
      "For any enquiry, quote or booking, contact Yohann directly. Departures are flexible and adapt to your availability.",
      "Für jede Anfrage, jedes Angebot oder jede Buchung kontaktieren Sie Yohann direkt. Die Abfahrten sind flexibel und richten sich nach Ihrer Verfügbarkeit."],
    ["Le plus simple : appelez-nous", "The easiest way: call us", "Am einfachsten: rufen Sie uns an"],
    ["La randonnée avec les ânes n'est pas notre activité à plein temps : un mail peut nous échapper. Pour une réponse rapide et sûre, un coup de fil au",
      "Donkey hiking isn't our full-time activity: an email can slip past us. For a quick, reliable answer, a phone call to",
      "Eselwandern ist nicht unsere Vollzeittätigkeit: Eine E-Mail kann uns entgehen. Für eine schnelle und sichere Antwort ist ein Anruf unter"],
    ["est toujours préférable. Le formulaire ci-dessous reste à votre disposition pour les demandes moins urgentes.",
      "is always preferable. The form below remains available for less urgent requests.",
      "immer vorzuziehen. Das Formular unten steht Ihnen für weniger dringende Anfragen zur Verfügung."],
    ["Nom et prénom *", "Full name *", "Vor- und Nachname *"],
    ["Email *", "Email *", "E-Mail *"],
    ["Email", "Email", "E-Mail"],
    ["Téléphone", "Phone", "Telefon"],
    ["Date(s) souhaitée(s)", "Preferred date(s)", "Wunschtermin(e)"],
    ["ex. 12–14 juillet", "e.g. 12–14 July", "z. B. 12.–14. Juli"],
    ["Nombre de personnes", "Number of people", "Anzahl der Personen"],
    ["Nombre d'ânes souhaité", "Number of donkeys", "Gewünschte Anzahl Esel"],
    ["Randonnée souhaitée", "Preferred hike", "Gewünschte Wanderung"],
    ["Journée Écrins", "Écrins day", "Écrins-Tag"],
    ["Tour du Sénepi", "Sénepi loop", "Sénepi-Runde"],
    ["Autre / je ne sais pas encore", "Other / not sure yet", "Andere / weiß noch nicht"],
    ["Votre message", "Your message", "Ihre Nachricht"],
    ["Parlez-nous de votre projet, du niveau du groupe, de l'âge des enfants…",
      "Tell us about your plans, the group's level, the children's ages…",
      "Erzählen Sie uns von Ihrem Vorhaben, dem Niveau der Gruppe, dem Alter der Kinder…"],
    ["Merci de renseigner au moins votre nom et un email valide.",
      "Please provide at least your name and a valid email.",
      "Bitte geben Sie mindestens Ihren Namen und eine gültige E-Mail an."],
    ["Envoyer ma demande", "Send my request", "Anfrage senden"],
    ["Merci", "Thank you", "Danke"],
    ["Votre demande a bien été enregistrée. Yohann vous répondra dans les plus brefs délais pour préciser ensemble les dates et l'itinéraire.",
      "Your request has been received. Yohann will get back to you as soon as possible to settle the dates and itinerary together.",
      "Ihre Anfrage wurde erfolgreich registriert. Yohann wird sich so bald wie möglich bei Ihnen melden, um Termine und Route gemeinsam festzulegen."],
    ["Un besoin urgent ? Appelez directement le", "Need it urgently? Call us directly on", "Dringend? Rufen Sie direkt an unter"],
    ["Envoyer une autre demande", "Send another request", "Weitere Anfrage senden"],
    ["Responsable des réservations", "Bookings manager", "Verantwortlich für Buchungen"],
    ["Saison d'activité", "Activity season", "Aktivitätssaison"],
    ["Langues parlées", "Languages spoken", "Gesprochene Sprachen"],
    ["Français · Anglais", "French · English", "Französisch · Englisch"],
    ["Activité accessible aux personnes à mobilité réduite avec assistance. N'hésitez pas à nous en parler lors de votre prise de contact.",
      "Activity accessible to people with reduced mobility with assistance. Feel free to mention it when you get in touch.",
      "Aktivität für Menschen mit eingeschränkter Mobilität mit Unterstützung zugänglich. Sprechen Sie uns bei Ihrer Kontaktaufnahme gerne darauf an."],
    ["Accessibilité —", "Accessibility —", "Barrierefreiheit —"],
    ["Ils nous soutiennent", "They support us", "Sie unterstützen uns"],
    ["Guide pratique avant de venir", "Practical guide before you come", "Praktischer Leitfaden vor Ihrem Besuch"],
    ["Tout savoir sur la rando avec un âne · à consulter", "Everything about hiking with a donkey · take a look", "Alles über das Wandern mit einem Esel · zum Nachlesen"],
    ["Nos partenaires", "Our partners", "Unsere Partner"]
  ];

  var DICT = {};
  for (var i = 0; i < T.length; i++) {
    var key = norm(T[i][0]);
    if (!(key in DICT)) DICT[key] = { en: T[i][1], de: T[i][2] };
  }

  function translate(original, lang) {
    if (lang === 'fr') return original;
    var entry = DICT[norm(original)];
    if (!entry || !entry[lang]) return original;
    var lead = (original.match(/^\s*/) || [''])[0];
    var trail = (original.match(/\s*$/) || [''])[0];
    return lead + entry[lang] + trail;
  }

  function skippable(node) {
    var el = node.parentElement;
    while (el) {
      var tag = el.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return true;
      if (el.hasAttribute && (el.hasAttribute('data-lang-switch') || el.hasAttribute('data-no-i18n'))) return true;
      el = el.parentElement;
    }
    return false;
  }

  function textNodes() {
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (skippable(node)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var out = [], n;
    while ((n = walker.nextNode())) out.push(n);
    return out;
  }

  var ATTRS = ['placeholder', 'title'];

  function apply(lang) {
    if (!document.body) return;
    var nodes = textNodes();
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (node.__louOrig === undefined) node.__louOrig = node.nodeValue;
      var next = translate(node.__louOrig, lang);
      if (node.nodeValue !== next) node.nodeValue = next;
    }
    for (var a = 0; a < ATTRS.length; a++) {
      var attr = ATTRS[a];
      var els = document.querySelectorAll('[' + attr + ']');
      for (var j = 0; j < els.length; j++) {
        var el = els[j];
        if (el.closest('[data-lang-switch]') || el.closest('[data-no-i18n]')) continue;
        var store = '__louAttr_' + attr;
        if (el[store] === undefined) el[store] = el.getAttribute(attr);
        el.setAttribute(attr, translate(el[store], lang));
      }
    }
    document.documentElement.setAttribute('lang', lang);
    updateSwitch(lang);
  }

  function updateSwitch(lang) {
    var btns = document.querySelectorAll('[data-lang-switch] [data-lang]');
    for (var i = 0; i < btns.length; i++) {
      var btn = btns[i];
      var active = btn.getAttribute('data-lang') === lang;
      btn.style.background = active ? '#C8714B' : 'transparent';
      btn.style.color = active ? '#F7F3EC' : '#5b5142';
      btn.style.fontWeight = active ? '700' : '600';
    }
  }

  function getLang() {
    try { return localStorage.getItem(STORAGE_KEY) || 'fr'; } catch (e) { return 'fr'; }
  }

  function setLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    apply(lang);
  }

  function bindButtons() {
    var btns = document.querySelectorAll('[data-lang-switch] [data-lang]');
    for (var i = 0; i < btns.length; i++) {
      (function (btn) {
        if (btn.__louBound) return;
        btn.__louBound = true;
        btn.addEventListener('click', function () { setLang(btn.getAttribute('data-lang')); });
      })(btns[i]);
    }
  }

  var observer = null;
  function watch() {
    if (observer || !document.body || typeof MutationObserver === 'undefined') return;
    var pending = null;
    observer = new MutationObserver(function () {
      if (pending) return;
      pending = setTimeout(function () { pending = null; apply(getLang()); }, 60);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function init() {
    if (!document.body) { document.addEventListener('DOMContentLoaded', init); return; }
    bindButtons();
    apply(getLang());
    watch();
  }

  window.LouI18n = { init: init, setLang: setLang, getLang: getLang, apply: apply };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
