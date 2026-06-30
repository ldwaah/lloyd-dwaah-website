// =====================================================================
//  LLOYD DWAAH — site content & configuration
//  This single file holds the entire narrative. Edit here to evolve the
//  site over the years; the components read everything from this object.
// =====================================================================

export const meta = {
  name: "Lloyd Dwaah",
  initials: "LD",
};

// ---- Avatar / portrait source --------------------------------------------
// mode: "image" | "video" | "glb"  (see README for the GLB upgrade path)
export const avatarConfig = {
  mode: "image",
  image: "/assets/lloyd-avatar.webp",
  video: "/assets/lloyd-avatar.mp4",
  glb: "/models/lloyd-head.glb",
  tilt: 8, // degrees of mouse parallax — kept subtle and premium
};

// ---- Navigation -----------------------------------------------------------
export const nav = [
  { label: "Home", href: "#home" },
  { label: "Ethos", href: "#ethos" },
  { label: "Experience", href: "#experience" },
  { label: "Ventures", href: "#ventures" },
  { label: "Writing", href: "#writing" },
  { label: "Contact", href: "#contact" },
];

// ---- 1. HOME — Who is Lloyd Dwaah? ---------------------------------------
export const home = {
  eyebrow: "Lloyd Dwaah",
  // The defining line. Calm, ambitious, timeless.
  headline: "I build environments where people flourish.",
  sub: "Leader, builder and innovator working across education, sport, technology, coaching and writing. I create organisations, products and experiences that help people reach their potential.",
  cta: { label: "Explore the work", href: "#experience" },
  secondary: { label: "What I believe", href: "#ethos" },
};

// ---- 2. ETHOS — What does he believe? ------------------------------------
export const ethos = {
  eyebrow: "Professional Ethos",
  // Pulled apart for a cinematic, line-by-line reveal.
  statementLines: [
    "I believe great leadership",
    "creates environments where",
    "people can flourish.",
  ],
  body: "Whether through education, coaching, sport, writing or technology, my purpose is to build systems, experiences and opportunities that help people realise their potential.",
  principles: [
    {
      title: "People before structures",
      text: "Organisations are only as strong as the people within them. I lead by building cultures where people feel trusted, challenged and able to grow.",
    },
    {
      title: "Build, don't just manage",
      text: "I am drawn to creating things that last: teams, products, programmes and institutions designed to outlive any single role I hold.",
    },
    {
      title: "Craft is a form of respect",
      text: "How something is made signals how much its people matter. I hold the same standard whether shaping a curriculum, a company or a sentence.",
    },
  ],
};

// ---- 3. EXPERIENCE — What has shaped him? --------------------------------
// The six disciplines, presented as an interactive narrative.
export const experience = {
  eyebrow: "Core Experience",
  heading: "Six disciplines. One philosophy.",
  intro:
    "My work has never followed a single track. Each discipline sharpens a different instinct, and together they shape how I lead and build.",
  disciplines: [
    {
      id: "leadership",
      no: "01",
      title: "Leadership & Strategy",
      summary: "Building organisations and the cultures that carry them.",
      detail:
        "Leading organisations, managing multidisciplinary teams, and shaping operational strategy and organisational development. I build cultures where people are trusted to do their best work, where high standards and humanity coexist.",
      chipsLabel: "Focus",
      tags: ["Organisational development", "Operational strategy", "Team leadership", "Culture building"],
    },
    {
      id: "education",
      no: "02",
      title: "Education",
      summary: "Designing learning for those the system often leaves behind.",
      detail:
        "Alternative Provision leadership, behaviour strategy, safeguarding, curriculum development, inclusion and school improvement. I build educational environments that hold high expectations and deep care in the same hand, and treat innovation as a duty rather than a luxury.",
      chipsLabel: "Focus",
      tags: ["Alternative Provision", "Behaviour strategy", "Safeguarding", "Curriculum", "Inclusion", "School improvement"],
    },
    {
      id: "coaching",
      no: "03",
      title: "Coaching & Mentoring",
      summary: "Developing people through structured coaching and mentoring.",
      detail:
        "Developing staff, leaders and young people through structured coaching, mentoring and personal development. I help people see further than they thought they could and build the habits to get there.",
      chipsLabel: "Qualifications",
      tags: ["Level 5 Coaching & Mentoring", "Working towards QTS", "Working towards Level 3 Safeguarding"],
    },
    {
      id: "sport",
      no: "04",
      title: "Sport & Community Development",
      summary: "Using sport to develop leadership, discipline and growth.",
      detail:
        "Managing sports facilities, leading sports academies and developing youth sport programmes and community initiatives. I use sport as a vehicle to develop leadership, discipline and personal growth, turning talent and energy into character and opportunity.",
      chipsLabel: "Focus",
      tags: ["Sports academies", "Youth programmes", "Facilities management", "Community initiatives"],
    },
    {
      id: "technology",
      no: "05",
      title: "Emerging Technologies",
      summary: "Building and scaling products across AI, Web3 and DeFi.",
      detail:
        "Innovation has been a defining thread throughout my career. Since 2020 I have worked across Web3, blockchain, decentralised finance and artificial intelligence, contributing to multiple blockchain projects including established multi-million-dollar DeFi protocols.",
      note:
        "My work has included building international communities, leading distributed teams, supporting product launches, coordinating operations and helping digital products grow from early concepts into sustainable ecosystems. These experiences strengthened my ability to lead globally distributed teams, operate in fast-moving environments and build products that scale.",
      chipsLabel: "Experience",
      tags: [
        "Artificial Intelligence",
        "Web3",
        "Blockchain",
        "Decentralised Finance (DeFi)",
        "Product Strategy",
        "Digital Platforms",
        "Product Operations",
        "Community Leadership",
        "Team Leadership",
        "Brand Development",
        "Content Strategy",
        "Partnership Development",
      ],
    },
    {
      id: "writing",
      no: "06",
      title: "Writing & Personal Development",
      summary: "Where leadership, resilience and purpose meet.",
      detail:
        "Writing is where leadership, resilience and purpose meet. As a law graduate and author, I explore identity, character, resilience and human potential, distilling what I learn from leading, coaching and building into ideas others can use.",
      chipsLabel: "Themes",
      tags: ["Author", "Law graduate", "Leadership", "Resilience", "Identity"],
    },
  ],
};

// ---- 4. VENTURES — What is he building? ----------------------------------
export const ventures = {
  eyebrow: "Ventures",
  heading: "What I'm building.",
  intro:
    "A growing body of organisations, products and initiatives, each one an attempt to help more people reach their potential at greater scale.",
  items: [
    {
      logo: "/assets/evolveone-logo.svg",
      logoFit: "contain",
      title: "EvolveOne.ai",
      field: "AI · Technology",
      status: "Building",
      description:
        "Building intelligent AI products, educational technology and digital platforms that improve learning, productivity and human potential.",
    },
    {
      logo: "/assets/redefiningms-logo.png",
      logoFit: "cover",
      title: "RedefiningMS.co.uk",
      field: "Health · Community",
      status: "Building",
      description:
        "A platform dedicated to documenting life with Multiple Sclerosis while providing education, awareness, support and practical resources for others living with neurological conditions.",
    },
  ],
  // Visible placeholder so the section clearly invites future growth.
  future: {
    label: "On the horizon",
    text: "Advisory work · Keynote speaking · New ventures · Further AI products and businesses.",
  },
};

// ---- 5. WRITING ----------------------------------------------------------
export const writing = {
  eyebrow: "Writing",
  heading: "Books & Anthologies",
  intro:
    "Writing is how I make sense of things. These five collections bring together music and storytelling to explore identity, character, language and the human experience — including A Way With Words.",
  books: [
    {
      slug: "gold-shades",
      title: "Gold Shades",
      kind: "Anthology",
      status: "",
      description:
        "A collection of songs and anthologies exploring relationships, identity and the human experience.",
      sections: [
        {
          title: "What it is",
          body: "Gold Shades brings together music and narrative to explore how we relate to one another — the tenderness, tension and truth of everyday connection.",
        },
        {
          title: "Themes",
          body: "Identity, belonging, love and loss run through the collection. Each piece stands alone, but together they form a portrait of the human experience.",
        },
        {
          title: "Why it matters",
          body: "The anthology is written for readers who want honesty without spectacle — stories that feel lived-in rather than performed.",
        },
      ],
    },
    {
      slug: "gold-shades-the-perfect-gentleman",
      title: "Gold Shades: The Perfect Gentleman",
      kind: "Series",
      status: "Available now",
      amazon: "https://www.amazon.co.uk/Gold-Shades-Lloyd-Kingsley-Dwaah/dp/1786932067",
      trailer: "https://www.youtube.com/watch?v=b6FGqqo5ZfU",
      description:
        "A series of songs and anthologies exploring modern masculinity, leadership, integrity and character.",
      sections: [
        {
          title: "The question",
          body: "What does it mean to be a gentleman today — not as costume, but as conduct? This series examines leadership, integrity and the pressure men carry in public and private life.",
        },
        {
          title: "Form",
          body: "Written as a linked series of songs and short narratives, each entry tests a different facet of character: responsibility, restraint, courage and care.",
        },
        {
          title: "Audience",
          body: "For young men finding their footing, and for anyone mentoring them — coaches, teachers, fathers and leaders who want substance over swagger.",
        },
      ],
    },
    {
      slug: "gold-shades-a-true-lady",
      title: "Gold Shades: A True Lady",
      kind: "Anthology",
      status: "Available now",
      amazon: "https://www.amazon.co.uk/Gold-Shades-Lloyd-Kingsley-Dwaah/dp/1788784553",
      trailer: "https://www.youtube.com/watch?v=uHYb95rzkew",
      description:
        "An anthology centred around the stories of nine women, celebrating resilience, identity, strength and individual journeys.",
      sections: [
        {
          title: "Nine voices",
          body: "Each woman in the collection has her own story, her own rhythm and her own definition of strength. The anthology refuses a single template of womanhood.",
        },
        {
          title: "Structure",
          body: "Every profile is designed to stand as its own chapter — a square portrait of character, followed by the context, conflict and resolve that shaped it.",
        },
        {
          title: "Intent",
          body: "To celebrate resilience without romanticising struggle — honouring identity, ambition and the quiet decisions that define a life.",
        },
      ],
    },
    {
      slug: "a-way-with-words",
      title: "A Way With Words",
      kind: "Anthology",
      status: "",
      description:
        "A collection exploring voice, rhetoric and the power of language — how words shape identity, persuade, heal and hold people to account.",
      sections: [
        {
          title: "About the work",
          body: "A Way With Words sits alongside the Gold Shades anthologies as a study of language itself — how we speak, how we are heard, and what changes when someone finds their voice.",
        },
        {
          title: "Scope",
          body: "From classroom debate to public leadership, from lyric writing to everyday conversation, the collection traces how rhetoric and storytelling change outcomes.",
        },
        {
          title: "Connection",
          body: "Written from the same philosophy as my education work: that literacy of the heart and the tongue is as important as any formal qualification.",
        },
      ],
    },
    {
      slug: "when-my-body-says-no",
      title: "When My Body Says No",
      kind: "Memoir",
      status: "In progress",
      description:
        "A personal exploration of living with Multiple Sclerosis, resilience, purpose and discovering strength through adversity.",
      sections: [
        {
          title: "The premise",
          body: "A memoir of living with Multiple Sclerosis — not as tragedy, but as truth. The title comes from the moment the body refuses what the mind still wants to do.",
        },
        {
          title: "What it covers",
          body: "Diagnosis, adaptation, purpose and the slow work of rebuilding a life when the old map no longer fits the terrain.",
        },
        {
          title: "Why write it",
          body: "To give language to an experience many people live in silence — and to connect that personal story to the wider work of RedefiningMS and community support.",
        },
      ],
    },
  ],
  note: "New work will appear here as it is published.",
};

export function getBookBySlug(slug) {
  return writing.books.find((book) => book.slug === slug);
}

// ---- 6. HORIZON — Where is he going? -------------------------------------
export const horizon = {
  eyebrow: "Where I'm going",
  statement:
    "To build organisations, products and experiences across education, sport and technology that help people reach their potential at ever greater scale.",
  sub: "A body of work designed to outlast any single role, and to grow for decades.",
};

// ---- 7. CONTACT ----------------------------------------------------------
export const contact = {
  eyebrow: "Contact",
  heading: "Let's build something that matters.",
  text: "For advisory work, speaking, collaboration or a conversation about education, leadership or technology, I'd be glad to hear from you.",
  email: "lloydtkdwaah@gmail.com",
  socials: [
    { label: "Email", href: "mailto:lloydtkdwaah@gmail.com" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "X", href: "https://x.com/" },
  ],
};
