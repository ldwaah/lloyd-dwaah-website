// =====================================================================
//  LLOYD DWAAH — site content & configuration
// =====================================================================

export const meta = {
  name: "Lloyd Dwaah",
  initials: "LD",
  since: "Since 2020",
};

export const avatarConfig = {
  mode: "image",
  image: "/assets/lloyd-avatar.webp",
  video: "/assets/lloyd-avatar.mp4",
  glb: "/models/lloyd-head.glb",
  tilt: 8,
};

// ---- Navigation -----------------------------------------------------------
export const linkedInUrl = "https://www.linkedin.com/in/lloyd-dwaah-026531268";

/** Full-screen overlay menu */
export const menuNav = [
  { label: "Experience", href: "/experience" },
  { label: "Ventures", href: "/ventures" },
  { label: "Publications", href: "/publications" },
  { label: "Ethos", href: "/#principles" },
];

export const nav = [...menuNav];

// ---- 1. HOME --------------------------------------------------------------
export const home = {
  eyebrow: "Lloyd Dwaah",
  since: "Since 2020",
  nameReveal: "My name is Lloyd",
  ethosStatement:
    "I believe that great leadership creates environments where people can flourish.",
  cta: { label: "Explore my work", href: "/ventures" },
  secondary: { label: "What I believe", href: "#principles" },
};

export const highlights = {
  eyebrow: "At a glance",
  heading: "A portfolio built across disciplines, ventures and publications.",
  items: [
    {
      value: "6",
      label: "Core disciplines",
      detail: "Leadership, education, coaching, sports, technology and writing",
    },
    {
      value: "3",
      label: "Published books",
      detail: "Gold Shades, The Perfect Gentleman and A True Lady",
    },
    {
      value: "3",
      label: "Upcoming works",
      detail: "A Way With Words, When My Body Says No and future publications",
    },
    {
      value: "2",
      label: "Live ventures",
      detail: "EvolveOne.ai and RedefiningMS.co.uk",
    },
    {
      value: "Since 2020",
      label: "Web3 & AI",
      detail: "DeFi protocols, product operations and emerging technology",
    },
  ],
};

// ---- 2. ETHOS -------------------------------------------------------------
export const ethos = {
  eyebrow: "Ethos",
  statementLines: [
    "I believe great leadership",
    "creates environments where",
    "people can flourish.",
  ],
  body: "Whether through education, coaching, sports, writing or technology, my purpose is to build systems, experiences and opportunities that help people realise their potential.",
  beliefs: [
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
  principlesHeading: "Core principles",
  principlesIntro: "That shape how I lead and build",
  principles: [
    {
      id: "leadership",
      no: "01",
      title: "Leadership & Strategy",
      summary: "Building organisations and the cultures that carry them.",
      detail:
        "Leading organisations, managing multidisciplinary teams, and shaping operational strategy and organisational development.",
      tags: ["Organisational development", "Operational strategy", "Team leadership", "Culture building"],
    },
    {
      id: "education",
      no: "02",
      title: "Education",
      summary: "Designing learning for those the system often leaves behind.",
      detail:
        "Alternative Provision leadership, behaviour strategy, safeguarding, curriculum development, inclusion and school improvement.",
      tags: ["Alternative Provision", "Behaviour strategy", "Safeguarding", "Curriculum", "Inclusion"],
    },
    {
      id: "coaching",
      no: "03",
      title: "Coaching & Mentoring",
      summary: "Developing people through structured coaching and mentoring.",
      detail:
        "Developing staff, leaders and young people through structured coaching, mentoring and personal development.",
      tags: ["Level 5 Coaching & Mentoring", "Working towards QTS", "Safeguarding"],
    },
    {
      id: "sport",
      no: "04",
      title: "Sports & Community Development",
      summary: "Using sports to develop leadership, discipline and growth.",
      detail:
        "Managing sports facilities, leading sports academies and developing youth sports programmes and community initiatives.",
      tags: ["Sports academies", "Youth programmes", "Community initiatives"],
    },
    {
      id: "technology",
      no: "05",
      title: "Emerging Technologies",
      summary: "Building and scaling products across AI, Web3 and DeFi.",
      detail:
        "Since 2020, working across Web3, blockchain, decentralised finance and artificial intelligence, including multi-million-dollar DeFi protocols.",
      tags: ["Artificial Intelligence", "Web3", "Blockchain", "DeFi", "Product Operations"],
    },
    {
      id: "writing",
      no: "06",
      title: "Writing & Personal Development",
      summary: "Where leadership, resilience and purpose meet.",
      detail:
        "As a law graduate and author, exploring identity, character, resilience and human potential through published work.",
      tags: ["Author", "Law graduate", "Leadership", "Resilience", "Identity"],
    },
  ],
};

// ---- 3. EXPERIENCE --------------------------------------------------------
export const experience = {
  eyebrow: "Experience",
  heading: "A journey across education, sports and technology.",
  intro:
    "From law and publishing to sports academies, decentralised finance and alternative provision leadership. Work shaped by building environments where people flourish.",
  spotlight: {
    eyebrow: "Coaching & Mentoring",
    title: "Teaching and developing people",
    summary:
      "Developing staff, leaders and young people through structured coaching, mentoring and personal development.",
    image: "/assets/experience/coaching-hero.webp",
    alt: "Lloyd Dwaah coaching and mentoring young people and leaders",
  },
  timeline: [
    {
      id: "ap-head",
      year: "Present",
      title: "Alternative Provision Leadership",
      role: "Head of Centre",
      summary:
        "Leading an alternative provision centre, shaping culture, curriculum and outcomes for young people who need a different path.",
      detail:
        "Education leadership sits at the centre of my work today: high expectations, deep care, and environments built so every young person has room to grow.",
    },
    {
      id: "web3-defi",
      year: "2020 - Present",
      title: "Web3, DeFi & Emerging Technology",
      role: "EvolveOne.ai · AI · LLMs · Websites",
      summary:
        "Founded EvolveOne.ai, originally as a digital marketing company; now focused on AI, LLMs and websites.",
      detail:
        "Alongside earlier work in DeFi protocols and distributed product teams, EvolveOne.ai now builds AI products, LLM-powered tools and websites for businesses and education.",
    },
    {
      id: "sport-youth",
      year: "2018 onwards",
      title: "Sports, Coaching & Youth Development",
      role: "Sports Centre · Private Academy",
      summary:
        "Managed a sports centre, coaching and mentoring young people, running a private academy and an online tuition programme to support their learning.",
      detail:
        "Partnerships with Herbalife Nutrition and RehabBorough supported young people's health and performance. Built pathways into post-16 education rooted in sports, discipline and personal growth.",
    },
    {
      id: "law-books",
      year: "2018",
      title: "Law & Published Author",
      role: "University · Writing",
      summary:
        "Completed a Law degree in 2018. Published several books during and around this period, exploring identity, character and human potential.",
      detail:
        "A law graduate and author whose writing distils lessons from leadership, resilience and lived experience into ideas others can carry.",
    },
  ],
  holisticCv: {
    label: "My Holistic CV",
    heading: "My Holistic CV",
    intro:
      "A fuller view of roles, ventures and commitments across education, sports, technology and community. Dates verified from LinkedIn where listed.",
    source: "https://www.linkedin.com/in/lloyd-dwaah-026531268",
    entries: [
      {
        id: "author-macaulay",
        sortStart: "2017-05",
        startDate: "May 2017",
        endDate: "Present",
        title: "Author",
        organisation: "Austin Macaulay",
        note: "Gold Shades: The Perfect Gentleman and Gold Shades: A True Lady.",
      },
      {
        id: "lyps",
        sortStart: "2017-05",
        startDate: "May 2017",
        endDate: "Present",
        title: "Director of Operations",
        organisation: "London Youth Premier Showcase",
        href: "https://www.londonyouthpremiershowcase.com",
        instagram: "https://www.instagram.com/lypshowcase/?hl=en",
      },
      {
        id: "crystal-palace",
        sortStart: "2017-09",
        startDate: "September 2017",
        endDate: "March 2025",
        title: "Talent Scout",
        organisation: "Crystal Palace Football Club",
      },
      {
        id: "bridgestone",
        sortStart: "2018-08",
        startDate: "August 2018",
        endDate: "December 2024",
        title: "Operations Manager",
        organisation: "Bridgestone Sports Facilities",
      },
      {
        id: "private-academy",
        sortStart: "2018-09",
        startDate: "September 2018",
        endDate: "July 2024",
        title: "Managing Director",
        organisation: "Independent Football Academy",
        instagram: "https://www.instagram.com/independent_football_academy?utm_source=qr",
      },
      {
        id: "esg-director",
        sortStart: "2020-01",
        startDate: "January 2020",
        endDate: "Present",
        title: "Director",
        organisation: "Evolution Sports Group",
        href: "https://www.evolution-sportsgroup.com",
      },
      {
        id: "evolution-education",
        sortStart: "2020-01",
        startDate: "January 2020",
        endDate: "Present",
        title: "Director",
        organisation: "Evolution Education",
        href: "https://www.evolution-education.com",
      },
      {
        id: "evolveone",
        sortStart: "2020-01",
        startDate: "January 2020",
        endDate: "Present",
        title: "Founder",
        organisation: "EvolveOne.ai",
        href: "https://evolveone.ai",
        note: "Originally founded as a digital marketing company; now focused on AI, LLMs and websites.",
      },
      {
        id: "besf",
        sortStart: "2022-02",
        startDate: "February 2022",
        endDate: "Present",
        title: "Charity Leadership",
        organisation: "Beyond Education Sports Foundation",
        href: "https://beyondesf.com",
        note: "Charitable arm of Evolution Sports Group; registered February 2022.",
      },
    ],
  },
};

// ---- 4. VENTURES ----------------------------------------------------------
export const ventures = {
  eyebrow: "Portfolio",
  heading: "Ventures",
  intro: "What I'm Building Now",
  tagline:
    "A growing body of organisations, products and initiatives, each one an attempt to help more people reach their potential at greater scale.",
  items: [
    {
      logo: "/assets/evolveone-logo.svg",
      logoFit: "contain",
      title: "EvolveOne.ai",
      field: "AI · Technology",
      status: "Live",
      role: "Founder",
      impact: "AI products, LLM tools and websites for business and education",
      href: "https://evolveone.ai",
      description:
        "Originally founded as a digital marketing company; now focused on AI, LLMs and websites.",
    },
    {
      logo: "/assets/redefiningms-logo.png",
      logoFit: "cover",
      title: "RedefiningMS.co.uk",
      field: "Health · Community",
      status: "Live",
      role: "Founder",
      impact: "Education, awareness and practical support for people living with MS",
      href: "https://redefiningms.co.uk",
      description:
        "A platform dedicated to documenting life with Multiple Sclerosis while providing education, awareness, support and practical resources.",
    },
  ],
  future: {
    label: "On the horizon",
    text: "Advisory work · Keynote speaking · New ventures · Further AI products and businesses.",
  },
};

// ---- 5. PUBLICATIONS ------------------------------------------------------
export const publications = {
  eyebrow: "Publications",
  heading: "Books & anthologies",
  intro:
    "Writing is how I make sense of things. These collections bring together music and storytelling to explore identity, character, language and the human experience.",
  portrait: {
    src: "/assets/publications/author-hero.webp",
    alt: "Lloyd Dwaah writing at his desk",
    caption: "Author & publisher",
  },
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
          body: "Gold Shades brings together music and narrative to explore how we relate to one another.",
        },
        {
          title: "Themes",
          body: "Identity, belonging, love and loss run through the collection.",
        },
        {
          title: "Why it matters",
          body: "Stories that feel lived-in rather than performed.",
        },
      ],
    },
    {
      slug: "gold-shades-the-perfect-gentleman",
      title: "Gold Shades: The Perfect Gentleman",
      kind: "Anthology",
      status: "Available now",
      amazon: "https://www.amazon.co.uk/Gold-Shades-Lloyd-Kingsley-Dwaah/dp/1786932067",
      trailer: "https://www.youtube.com/watch?v=b6FGqqo5ZfU",
      description:
        "An anthology exploring modern masculinity, leadership, integrity and character.",
      sections: [
        { title: "The question", body: "What does it mean to be a gentleman today, not as costume, but as conduct?" },
        { title: "Form", body: "A linked series of songs and short narratives testing character." },
        { title: "Audience", body: "For young men finding their footing and those mentoring them." },
      ],
    },
    {
      slug: "gold-shades-a-true-lady",
      title: "Gold Shades: A True Lady",
      kind: "Novel",
      status: "Available now",
      amazon: "https://www.amazon.co.uk/Gold-Shades-Lloyd-Kingsley-Dwaah/dp/1788784553",
      trailer: "https://www.youtube.com/watch?v=uHYb95rzkew",
      description:
        "A novel centred around nine women, celebrating resilience, identity and individual journeys.",
      sections: [
        { title: "Nine voices", body: "Each woman has her own story and definition of strength." },
        { title: "Structure", body: "Every profile stands as its own chapter." },
        { title: "Intent", body: "Celebrating resilience without romanticising struggle." },
      ],
    },
    {
      slug: "a-way-with-words",
      title: "A Way With Words",
      kind: "Anthology",
      status: "Available now",
      amazon: "https://www.amazon.co.uk/way-words-Lloyd-T-Dwaah/dp/1985038226",
      description:
        "A collection exploring voice, rhetoric and the power of language.",
      sections: [
        { title: "About the work", body: "A study of language: how we speak, how we are heard." },
        { title: "Scope", body: "From classroom debate to public leadership and lyric writing." },
        { title: "Connection", body: "Literacy of the heart and the tongue." },
      ],
    },
    {
      slug: "when-my-body-says-no",
      title: "When My Body Says No",
      kind: "Novel",
      status: "Not Available",
      description:
        "A novel exploring living with Multiple Sclerosis, resilience and purpose.",
      sections: [
        { title: "The premise", body: "A novel of living with MS, not as tragedy, but as truth." },
        { title: "What it covers", body: "Diagnosis, adaptation and rebuilding a life." },
        { title: "Why write it", body: "Giving language to an experience many live in silence." },
      ],
    },
  ],
  note: "New work will appear here as it is published.",
};

/** Four books shown on the publications page, in display order. */
export const featuredBookSlugs = [
  "gold-shades-the-perfect-gentleman",
  "gold-shades-a-true-lady",
  "a-way-with-words",
  "when-my-body-says-no",
];

// Back-compat alias for book routes
export const writing = publications;

export function getBookBySlug(slug) {
  return publications.books.find((book) => book.slug === slug);
}

// ---- 6. CONTACT -----------------------------------------------------------
export const contact = {
  eyebrow: "Contact",
  heading: "Let's build something that matters.",
  text: "For advisory work, speaking, collaboration or a conversation about education, leadership or technology, I'd be glad to hear from you.",
  email: "lloydtkdwaah@gmail.com",
  linkedin: linkedInUrl,
  socials: [
    { label: "Email", href: "mailto:lloydtkdwaah@gmail.com" },
    { label: "LinkedIn", href: linkedInUrl },
    { label: "X", href: "https://x.com/" },
  ],
};
