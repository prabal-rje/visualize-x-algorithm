# THE ANATOMY OF VIRALITY — EXPANDED APPENDIX
## Personas, Audiences, Sample Tweets & Configuration Data

---

# A. PERSONA DEFINITIONS (16 Total)

## A.1 Primary Personas (Core Visualizer Audience)

### 1. Tech Founder / CEO

```typescript
{
  id: 'tech-founder',
  name: 'Tech Founder',
  icon: '🚀',
  subtitle: 'Building the future, one pivot at a time',
  
  profile: {
    followers: { min: 5000, max: 150000 },
    following: { min: 400, max: 2000 },
    accountAge: { min: 3, max: 12 }, // years
    verified: true,
    bio: "Founder @StartupName | Ex-@BigTech | Building something new | YC W23"
  },
  
  engagementProfile: {
    technology: 0.9,
    startups: 0.95,
    business: 0.8,
    investing: 0.7,
    productManagement: 0.6,
    engineering: 0.5,
    design: 0.4,
    aiMl: 0.7,
    crypto: 0.3,
    news: 0.4,
    politics: 0.2,
    sports: 0.1,
    entertainment: 0.2
  },
  
  contentStyle: {
    usesEmojis: true,
    usesThreads: true,
    sharesLinks: true,
    postsImages: false,
    averageTweetLength: 180,
    peakPostingHours: [8, 9, 12, 18, 21], // PST
    postsPerDay: { min: 2, max: 8 }
  },
  
  recentEngagementTopics: [
    'AI product launches',
    'Fundraising announcements',
    'Startup advice threads',
    'Hiring posts',
    'Product hunt launches',
    'YC batch announcements',
    'Founder mental health',
    'Remote work debates'
  ],
  
  sampleBioVariants: [
    "Building @Company | Previously @BigCo | Obsessed with [domain]",
    "CEO @Startup | Forbes 30U30 | Angel investor | DMs open",
    "Serial entrepreneur | 2x founder | Building the future of [industry]",
    "Founder mode | Building @Product | Hiring engineers"
  ]
}
```

### 2. Software Engineer / Tech Worker

```typescript
{
  id: 'software-engineer',
  name: 'Software Engineer',
  icon: '👨‍💻',
  subtitle: 'Shipping code, breaking prod',
  
  profile: {
    followers: { min: 500, max: 50000 },
    following: { min: 200, max: 1500 },
    accountAge: { min: 2, max: 10 },
    verified: false,
    bio: "SWE @Company | Open source contributor | Rust enthusiast | opinions = my own"
  },
  
  engagementProfile: {
    programming: 0.95,
    technology: 0.9,
    openSource: 0.8,
    devTools: 0.85,
    engineering: 0.9,
    webDev: 0.7,
    systemsDesign: 0.6,
    aiMl: 0.5,
    startups: 0.4,
    techTwitter: 0.7,
    memes: 0.6,
    gaming: 0.4
  },
  
  contentStyle: {
    usesEmojis: true,
    usesThreads: true,
    sharesLinks: true,
    postsImages: true,
    averageTweetLength: 160,
    peakPostingHours: [10, 14, 22, 23],
    postsPerDay: { min: 1, max: 5 }
  },
  
  recentEngagementTopics: [
    'New framework releases',
    'Programming language debates',
    'Open source drama',
    'Tech interview prep',
    'Salary transparency',
    'Remote work tools',
    'AI coding assistants',
    'Developer experience'
  ],
  
  sampleBioVariants: [
    "Engineer @FAANG | Building stuff | OSS maintainer | Opinions are bugs",
    "Full-stack dev | TypeScript maximalist | Writing about web performance",
    "Staff engineer | Distributed systems | Ex-@Startup | Hiring!",
    "Developer advocate @DevTool | Teaching the next generation to code"
  ]
}
```

### 3. AI/ML Researcher

```typescript
{
  id: 'ai-researcher',
  name: 'AI/ML Researcher',
  icon: '🧠',
  subtitle: 'Pushing the boundaries of intelligence',
  
  profile: {
    followers: { min: 5000, max: 200000 },
    following: { min: 300, max: 1500 },
    accountAge: { min: 3, max: 12 },
    verified: true,
    bio: "Research Scientist @AILab | PhD [University] | Working on [area] | Papers: scholar.google"
  },
  
  engagementProfile: {
    artificialIntelligence: 0.95,
    machineLearning: 0.95,
    research: 0.9,
    deepLearning: 0.85,
    nlp: 0.7,
    computerVision: 0.6,
    aiSafety: 0.7,
    academia: 0.8,
    technology: 0.7,
    mathematics: 0.6
  },
  
  contentStyle: {
    usesEmojis: false,
    usesThreads: true,
    sharesLinks: true,
    postsImages: true,
    averageTweetLength: 220,
    peakPostingHours: [9, 14, 20],
    postsPerDay: { min: 1, max: 5 }
  },
  
  recentEngagementTopics: [
    'Paper releases',
    'Model benchmarks',
    'AI safety debates',
    'Conference announcements',
    'Research methodology',
    'Industry vs academia',
    'Compute costs',
    'Open source models'
  ],
  
  sampleBioVariants: [
    "Research Scientist @DeepMind | PhD Stanford | NeurIPS, ICML | Working on alignment",
    "ML Engineer → Researcher | Interpretability | Previously @OpenAI",
    "Prof @MIT | Neural networks, optimization | Lab: [link] | Advising PhD students",
    "AI Safety Researcher | Anthropic alum | Thinking about x-risk | Papers: scholar.google"
  ]
}
```

### 4. Venture Capitalist / Investor

```typescript
{
  id: 'venture-capitalist',
  name: 'VC / Investor',
  icon: '💰',
  subtitle: 'Funding the future',
  
  profile: {
    followers: { min: 10000, max: 300000 },
    following: { min: 500, max: 3000 },
    accountAge: { min: 5, max: 15 },
    verified: true,
    bio: "Partner @VCFirm | Investing in [stage] [sector] | Board: @Co1, @Co2 | DMs open"
  },
  
  engagementProfile: {
    investing: 0.95,
    startups: 0.9,
    business: 0.85,
    technology: 0.8,
    markets: 0.7,
    economics: 0.6,
    aiMl: 0.7,
    crypto: 0.4,
    founderAdvice: 0.8,
    dealFlow: 0.9
  },
  
  contentStyle: {
    usesEmojis: false,
    usesThreads: true,
    sharesLinks: true,
    postsImages: false,
    averageTweetLength: 180,
    peakPostingHours: [6, 8, 17, 20],
    postsPerDay: { min: 2, max: 6 }
  },
  
  recentEngagementTopics: [
    'Fundraising advice',
    'Market analysis',
    'Portfolio company news',
    'Startup metrics',
    'Term sheet tips',
    'Industry trends',
    'Board dynamics',
    'Exit strategies'
  ],
  
  sampleBioVariants: [
    "Partner @a]6z | Investing in AI, infra, dev tools | Board @Company1 @Company2",
    "GP @FirmName | Seed & Series A | Previously founder (acq'd) | DMs open for founders",
    "Investing in technical founders @VCFund | Ex-engineer | Writing at [substack]",
    "Early stage investor | $500M AUM | Focus: AI, enterprise, fintech | Angel list: [link]"
  ]
}
```

### 5. CS Student

```typescript
{
  id: 'cs-student',
  name: 'CS Student',
  icon: '🎓',
  subtitle: 'Learning to build the future',
  
  profile: {
    followers: { min: 100, max: 5000 },
    following: { min: 200, max: 1000 },
    accountAge: { min: 1, max: 5 },
    verified: false,
    bio: "CS @ [University] '26 | Building side projects | Looking for internships | Learning in public"
  },
  
  engagementProfile: {
    programming: 0.9,
    careerAdvice: 0.95,
    techInterviews: 0.9,
    internships: 0.95,
    learningResources: 0.9,
    sideProjects: 0.85,
    hackathons: 0.8,
    technology: 0.85,
    startups: 0.6,
    aiMl: 0.7,
    openSource: 0.6,
    techCompanies: 0.9
  },
  
  contentStyle: {
    usesEmojis: true,
    usesThreads: true,
    sharesLinks: true,
    postsImages: true,
    averageTweetLength: 150,
    peakPostingHours: [12, 18, 22, 23],
    postsPerDay: { min: 1, max: 4 }
  },
  
  recentEngagementTopics: [
    'Internship applications',
    'LeetCode grind',
    'Project showcases',
    'Interview experiences',
    'Course recommendations',
    'Hackathon wins',
    'Learning new technologies',
    'Career path questions',
    'Tech company culture',
    'Resume tips'
  ],
  
  sampleBioVariants: [
    "CS @ Stanford '26 | prev intern @Google | Building [project] | Open to opportunities",
    "Learning ML | CS @ MIT | Hackathon enthusiast | Building in public",
    "Aspiring SWE | Self-taught + CS degree | Creating tutorials | DMs open",
    "CS student by day, indie hacker by night | Shipping side projects | @University '25"
  ]
}
```

## A.2 Media & Journalism Personas

### 6. Tech Reporter / Journalist

```typescript
{
  id: 'tech-reporter',
  name: 'Tech Reporter',
  icon: '📰',
  subtitle: 'Breaking the stories that matter',
  
  profile: {
    followers: { min: 10000, max: 500000 },
    following: { min: 1000, max: 5000 },
    accountAge: { min: 5, max: 15 },
    verified: true,
    bio: "Tech reporter @MajorPublication | Tips: email@pub.com | Signal: +1xxx"
  },
  
  engagementProfile: {
    technology: 0.95,
    news: 0.9,
    business: 0.8,
    startups: 0.7,
    bigTech: 0.9,
    privacy: 0.7,
    regulation: 0.6,
    politics: 0.5,
    aiMl: 0.8,
    crypto: 0.5,
    socialMedia: 0.7,
    layoffs: 0.8
  },
  
  contentStyle: {
    usesEmojis: false,
    usesThreads: true,
    sharesLinks: true,
    postsImages: true,
    averageTweetLength: 220,
    peakPostingHours: [6, 9, 12, 15, 18],
    postsPerDay: { min: 5, max: 20 }
  },
  
  recentEngagementTopics: [
    'Big tech earnings',
    'Layoff announcements',
    'Regulatory actions',
    'Executive departures',
    'Data breaches',
    'AI policy debates',
    'Antitrust cases',
    'Startup acquisitions'
  ],
  
  sampleBioVariants: [
    "Tech reporter @Publication | Covering Big Tech, AI, startups | DMs open for tips",
    "Writing about Silicon Valley for @Outlet | Author of [Book] | Newsletter: link",
    "Senior tech correspondent @Network | Breaking news, investigations, analysis",
    "Covering the business of technology @Magazine | Previously @OtherOutlet"
  ]
}
```

## A.3 Product & Leadership Personas

### 7. Product Manager

```typescript
{
  id: 'product-manager',
  name: 'Product Manager',
  icon: '📊',
  subtitle: 'Shipping features, managing roadmaps',
  
  profile: {
    followers: { min: 1000, max: 30000 },
    following: { min: 500, max: 2000 },
    accountAge: { min: 3, max: 8 },
    verified: false,
    bio: "PM @TechCo | Building products people love | Ex-consultant | Stanford MBA"
  },
  
  engagementProfile: {
    productManagement: 0.95,
    technology: 0.8,
    startups: 0.7,
    design: 0.7,
    userResearch: 0.8,
    analytics: 0.7,
    growth: 0.8,
    business: 0.6,
    leadership: 0.5,
    careerAdvice: 0.6
  },
  
  contentStyle: {
    usesEmojis: true,
    usesThreads: true,
    sharesLinks: true,
    postsImages: true,
    averageTweetLength: 200,
    peakPostingHours: [7, 12, 18],
    postsPerDay: { min: 1, max: 4 }
  },
  
  recentEngagementTopics: [
    'Product strategy frameworks',
    'User research methods',
    'Roadmap prioritization',
    'A/B testing results',
    'Product launches',
    'PM career advice',
    'Stakeholder management',
    'Metrics and KPIs'
  ]
}
```

### 8. Tech Executive / VP

```typescript
{
  id: 'tech-executive',
  name: 'Tech Executive',
  icon: '👔',
  subtitle: 'Leading teams, driving strategy',
  
  profile: {
    followers: { min: 5000, max: 100000 },
    following: { min: 300, max: 1500 },
    accountAge: { min: 5, max: 12 },
    verified: true,
    bio: "VP Engineering @BigTech | Building world-class teams | Leadership, scale, culture"
  },
  
  engagementProfile: {
    leadership: 0.9,
    technology: 0.8,
    management: 0.85,
    hiring: 0.8,
    engineering: 0.7,
    business: 0.7,
    culture: 0.75,
    diversity: 0.6,
    startups: 0.5,
    careerAdvice: 0.7
  },
  
  contentStyle: {
    usesEmojis: false,
    usesThreads: true,
    sharesLinks: true,
    postsImages: false,
    averageTweetLength: 200,
    peakPostingHours: [7, 12, 19],
    postsPerDay: { min: 1, max: 3 }
  },
  
  recentEngagementTopics: [
    'Engineering leadership',
    'Scaling teams',
    'Performance management',
    'Technical strategy',
    'Hiring best practices',
    'Remote team management',
    'Organizational design',
    'Executive communication'
  ]
}
```

## A.4 Creator & Builder Personas

### 9. Content Creator / Influencer

```typescript
{
  id: 'content-creator',
  name: 'Content Creator',
  icon: '🎬',
  subtitle: 'Building an audience, one post at a time',
  
  profile: {
    followers: { min: 50000, max: 2000000 },
    following: { min: 200, max: 1000 },
    accountAge: { min: 2, max: 8 },
    verified: true,
    bio: "Creating content about [niche] | 500K on YouTube | Podcast: [name] | Collab: email"
  },
  
  engagementProfile: {
    contentCreation: 0.95,
    socialMedia: 0.9,
    entertainment: 0.8,
    marketing: 0.7,
    branding: 0.75,
    technology: 0.5,
    business: 0.6,
    lifestyle: 0.6,
    trends: 0.85
  },
  
  contentStyle: {
    usesEmojis: true,
    usesThreads: true,
    sharesLinks: true,
    postsImages: true,
    averageTweetLength: 150,
    peakPostingHours: [10, 14, 19, 21],
    postsPerDay: { min: 3, max: 10 }
  },
  
  recentEngagementTopics: [
    'Algorithm changes',
    'Monetization strategies',
    'Brand deals',
    'Content repurposing',
    'Audience growth',
    'Platform updates',
    'Creator economy news',
    'Behind-the-scenes content'
  ]
}
```

### 10. Indie Hacker / Solo Founder

```typescript
{
  id: 'indie-hacker',
  name: 'Indie Hacker',
  icon: '🛠️',
  subtitle: 'Building in public, shipping fast',
  
  profile: {
    followers: { min: 1000, max: 50000 },
    following: { min: 500, max: 2000 },
    accountAge: { min: 1, max: 5 },
    verified: false,
    bio: "Building @Product in public | $XXk MRR | Prev: @BigCo | Sharing the journey"
  },
  
  engagementProfile: {
    indieHacking: 0.95,
    startups: 0.9,
    programming: 0.8,
    marketing: 0.7,
    seo: 0.6,
    noCode: 0.5,
    saas: 0.85,
    buildInPublic: 0.95,
    productivity: 0.6,
    solopreneur: 0.9
  },
  
  contentStyle: {
    usesEmojis: true,
    usesThreads: true,
    sharesLinks: true,
    postsImages: true,
    averageTweetLength: 180,
    peakPostingHours: [8, 12, 16, 21],
    postsPerDay: { min: 2, max: 6 }
  },
  
  recentEngagementTopics: [
    'Revenue milestones',
    'Build in public updates',
    'Marketing experiments',
    'Tool recommendations',
    'Productivity systems',
    'Landing page feedback',
    'Pricing strategies',
    'Customer interviews'
  ]
}
```

### 11. Designer / Creative

```typescript
{
  id: 'designer',
  name: 'Designer',
  icon: '🎨',
  subtitle: 'Crafting experiences, pixel by pixel',
  
  profile: {
    followers: { min: 2000, max: 100000 },
    following: { min: 500, max: 2000 },
    accountAge: { min: 3, max: 10 },
    verified: false,
    bio: "Product Designer @Company | Previously @Studio | Design systems, accessibility, craft"
  },
  
  engagementProfile: {
    design: 0.95,
    userExperience: 0.9,
    technology: 0.7,
    accessibility: 0.7,
    designSystems: 0.8,
    figma: 0.85,
    branding: 0.6,
    typography: 0.7,
    illustration: 0.5,
    productManagement: 0.5
  },
  
  contentStyle: {
    usesEmojis: true,
    usesThreads: true,
    sharesLinks: true,
    postsImages: true,
    averageTweetLength: 160,
    peakPostingHours: [10, 14, 20],
    postsPerDay: { min: 1, max: 4 }
  },
  
  recentEngagementTopics: [
    'Design tool updates',
    'UI/UX case studies',
    'Design system components',
    'Accessibility best practices',
    'Portfolio reviews',
    'Design critique',
    'Career advice',
    'Design process'
  ]
}
```

## A.5 Data & Security Personas

### 12. Data Scientist / Analyst

```typescript
{
  id: 'data-scientist',
  name: 'Data Scientist',
  icon: '📈',
  subtitle: 'Finding signal in the noise',
  
  profile: {
    followers: { min: 1000, max: 30000 },
    following: { min: 500, max: 2000 },
    accountAge: { min: 2, max: 8 },
    verified: false,
    bio: "Data Scientist @Company | Statistics, ML, visualization | Writing about data at [blog]"
  },
  
  engagementProfile: {
    dataScience: 0.95,
    statistics: 0.85,
    machineLearning: 0.8,
    visualization: 0.8,
    python: 0.85,
    analytics: 0.9,
    business: 0.6,
    technology: 0.7,
    research: 0.5
  },
  
  contentStyle: {
    usesEmojis: true,
    usesThreads: true,
    sharesLinks: true,
    postsImages: true,
    averageTweetLength: 180,
    peakPostingHours: [9, 13, 17],
    postsPerDay: { min: 1, max: 4 }
  },
  
  recentEngagementTopics: [
    'Data visualization tips',
    'Statistical methods',
    'Python libraries',
    'Career advice',
    'Interview prep',
    'Tool comparisons',
    'Analysis case studies',
    'Data ethics'
  ]
}
```

### 13. Cybersecurity Professional

```typescript
{
  id: 'cybersecurity-pro',
  name: 'Security Professional',
  icon: '🔐',
  subtitle: 'Defending the digital frontier',
  
  profile: {
    followers: { min: 2000, max: 80000 },
    following: { min: 400, max: 1500 },
    accountAge: { min: 4, max: 12 },
    verified: false,
    bio: "Security Engineer @Company | Bug bounty hunter | CTF player | Opinions != employer"
  },
  
  engagementProfile: {
    cybersecurity: 0.95,
    hacking: 0.85,
    privacy: 0.8,
    technology: 0.8,
    programming: 0.7,
    infosec: 0.9,
    bugBounty: 0.7,
    news: 0.6,
    government: 0.5
  },
  
  contentStyle: {
    usesEmojis: true,
    usesThreads: true,
    sharesLinks: true,
    postsImages: true,
    averageTweetLength: 200,
    peakPostingHours: [10, 15, 22],
    postsPerDay: { min: 2, max: 6 }
  },
  
  recentEngagementTopics: [
    'Data breaches',
    'Vulnerability disclosures',
    'Security tools',
    'Bug bounty wins',
    'Threat intelligence',
    'Privacy regulations',
    'CTF writeups',
    'Career advice'
  ]
}
```

## A.6 Business & Education Personas

### 14. Management Consultant

```typescript
{
  id: 'consultant',
  name: 'Management Consultant',
  icon: '💼',
  subtitle: 'Solving problems, building slides',
  
  profile: {
    followers: { min: 1000, max: 50000 },
    following: { min: 300, max: 1200 },
    accountAge: { min: 3, max: 10 },
    verified: false,
    bio: "Strategy Consultant @MBB | Harvard MBA | Writing about business & career | Newsletter: link"
  },
  
  engagementProfile: {
    business: 0.95,
    strategy: 0.9,
    consulting: 0.95,
    leadership: 0.8,
    careerAdvice: 0.85,
    productivity: 0.7,
    finance: 0.6,
    technology: 0.5,
    startups: 0.4
  },
  
  contentStyle: {
    usesEmojis: false,
    usesThreads: true,
    sharesLinks: true,
    postsImages: true,
    averageTweetLength: 200,
    peakPostingHours: [6, 12, 19],
    postsPerDay: { min: 1, max: 4 }
  },
  
  recentEngagementTopics: [
    'Framework explanations',
    'Case interview tips',
    'Career transitions',
    'Business analysis',
    'MBA advice',
    'Networking strategies',
    'Work-life balance',
    'Industry trends'
  ]
}
```

### 15. Marketing Professional

```typescript
{
  id: 'marketer',
  name: 'Marketing Professional',
  icon: '📣',
  subtitle: 'Growing brands, driving conversions',
  
  profile: {
    followers: { min: 2000, max: 60000 },
    following: { min: 500, max: 2000 },
    accountAge: { min: 3, max: 8 },
    verified: false,
    bio: "Head of Marketing @Brand | Ex-@Agency | Growth, brand, content | Newsletter: link"
  },
  
  engagementProfile: {
    marketing: 0.95,
    growth: 0.9,
    branding: 0.85,
    socialMedia: 0.9,
    contentMarketing: 0.85,
    seo: 0.7,
    advertising: 0.75,
    analytics: 0.7,
    startups: 0.5,
    technology: 0.5
  },
  
  contentStyle: {
    usesEmojis: true,
    usesThreads: true,
    sharesLinks: true,
    postsImages: true,
    averageTweetLength: 180,
    peakPostingHours: [8, 12, 17],
    postsPerDay: { min: 2, max: 6 }
  },
  
  recentEngagementTopics: [
    'Campaign breakdowns',
    'Marketing strategies',
    'Platform algorithm changes',
    'Tool recommendations',
    'Case studies',
    'Growth experiments',
    'Brand building',
    'Content ideas'
  ]
}
```

### 16. Educator / Course Creator

```typescript
{
  id: 'educator',
  name: 'Educator / Course Creator',
  icon: '📚',
  subtitle: 'Teaching the skills that matter',
  
  profile: {
    followers: { min: 10000, max: 200000 },
    following: { min: 300, max: 1000 },
    accountAge: { min: 3, max: 10 },
    verified: true,
    bio: "Teaching [skill] to 50K+ students | Course: [link] | Free resources: [link]"
  },
  
  engagementProfile: {
    education: 0.95,
    learning: 0.9,
    technology: 0.6,
    programming: 0.5,
    productivity: 0.7,
    careerAdvice: 0.8,
    contentCreation: 0.7,
    business: 0.5
  },
  
  contentStyle: {
    usesEmojis: true,
    usesThreads: true,
    sharesLinks: true,
    postsImages: true,
    averageTweetLength: 180,
    peakPostingHours: [9, 13, 19],
    postsPerDay: { min: 2, max: 5 }
  },
  
  recentEngagementTopics: [
    'Learning tips',
    'Course launches',
    'Student success stories',
    'Educational content',
    'Skill breakdowns',
    'Resource recommendations',
    'Teaching methods',
    'Industry insights'
  ]
}
```

---

# B. AUDIENCE SEGMENT DEFINITIONS (25 Total)

```typescript
export interface AudienceSegment {
  id: string;
  name: string;
  icon: string;
  description: string;
  
  // What topics this audience engages with
  interests: Record<string, number>; // 0-1 engagement probability
  
  // Engagement behavior
  engagementStyle: {
    likeRate: number;      // Base probability of liking
    replyRate: number;     // Base probability of replying
    repostRate: number;    // Base probability of reposting
    clickRate: number;     // Base probability of clicking links
    dwellTime: number;     // Average seconds spent reading
  };
  
  // Demographics (for display)
  demographics: {
    ageRange: string;
    location: string;
    deviceUsage: string;
  };
}

export const AUDIENCE_SEGMENTS: AudienceSegment[] = [
```

## B.1 Tech Industry Audiences

### 1. Silicon Valley Insiders

```typescript
{
  id: 'sv-insiders',
  name: 'Silicon Valley Insiders',
  icon: '🌉',
  description: 'VCs, founders, and tech executives in the Bay Area ecosystem',
  
  interests: {
    startups: 0.95,
    investing: 0.9,
    technology: 0.85,
    aiMl: 0.8,
    bigTech: 0.85,
    fundraising: 0.9,
    productLaunches: 0.8,
    techPolicy: 0.6,
    crypto: 0.4,
    layoffs: 0.7
  },
  
  engagementStyle: {
    likeRate: 0.08,
    replyRate: 0.03,
    repostRate: 0.02,
    clickRate: 0.15,
    dwellTime: 4.5
  },
  
  demographics: {
    ageRange: '28-50',
    location: 'SF Bay Area, primarily',
    deviceUsage: '70% mobile, 30% desktop'
  }
}
```

### 2. Software Engineers

```typescript
{
  id: 'software-engineers',
  name: 'Software Engineers',
  icon: '⌨️',
  description: 'Developers, SREs, and engineering managers at all levels',
  
  interests: {
    programming: 0.95,
    devTools: 0.9,
    openSource: 0.8,
    systemsDesign: 0.75,
    webDev: 0.7,
    careerAdvice: 0.65,
    techInterviews: 0.6,
    salaryTransparency: 0.7,
    remoteWork: 0.65,
    aiCoding: 0.75
  },
  
  engagementStyle: {
    likeRate: 0.1,
    replyRate: 0.04,
    repostRate: 0.015,
    clickRate: 0.2,
    dwellTime: 5.0
  },
  
  demographics: {
    ageRange: '22-45',
    location: 'Global, tech hubs',
    deviceUsage: '50% mobile, 50% desktop'
  }
}
```

### 3. Startup Founders

```typescript
{
  id: 'startup-founders',
  name: 'Startup Founders',
  icon: '🚀',
  description: 'Early-stage founders building companies',
  
  interests: {
    startups: 0.95,
    fundraising: 0.9,
    productDevelopment: 0.85,
    growth: 0.85,
    hiring: 0.8,
    founderMentalHealth: 0.7,
    marketing: 0.7,
    sales: 0.65,
    legal: 0.5,
    cofounderDynamics: 0.6
  },
  
  engagementStyle: {
    likeRate: 0.12,
    replyRate: 0.05,
    repostRate: 0.03,
    clickRate: 0.18,
    dwellTime: 4.0
  },
  
  demographics: {
    ageRange: '25-40',
    location: 'Tech hubs globally',
    deviceUsage: '65% mobile, 35% desktop'
  }
}
```

### 4. Tech Recruiters

```typescript
{
  id: 'tech-recruiters',
  name: 'Tech Recruiters',
  icon: '🎯',
  description: 'In-house and agency recruiters hiring for tech roles',
  
  interests: {
    hiring: 0.95,
    careerAdvice: 0.85,
    salaryBenchmarks: 0.9,
    interviewTips: 0.8,
    techTrends: 0.7,
    diversity: 0.75,
    employerBranding: 0.8,
    layoffs: 0.85,
    remoteWork: 0.7
  },
  
  engagementStyle: {
    likeRate: 0.15,
    replyRate: 0.06,
    repostRate: 0.04,
    clickRate: 0.25,
    dwellTime: 3.5
  },
  
  demographics: {
    ageRange: '25-45',
    location: 'Tech hubs',
    deviceUsage: '60% mobile, 40% desktop'
  }
}
```

### 5. Product Managers

```typescript
{
  id: 'product-managers',
  name: 'Product Managers',
  icon: '📋',
  description: 'PMs from associate to CPO level',
  
  interests: {
    productManagement: 0.95,
    userResearch: 0.85,
    roadmapping: 0.8,
    metrics: 0.85,
    design: 0.7,
    engineering: 0.65,
    strategy: 0.75,
    careerAdvice: 0.7,
    caseStudies: 0.8
  },
  
  engagementStyle: {
    likeRate: 0.11,
    replyRate: 0.04,
    repostRate: 0.025,
    clickRate: 0.2,
    dwellTime: 4.5
  },
  
  demographics: {
    ageRange: '26-42',
    location: 'Tech hubs globally',
    deviceUsage: '55% mobile, 45% desktop'
  }
}
```

## B.2 Creator & Media Audiences

### 6. Content Creators

```typescript
{
  id: 'content-creators',
  name: 'Content Creators',
  icon: '🎥',
  description: 'YouTubers, podcasters, newsletter writers, and social media creators',
  
  interests: {
    contentCreation: 0.95,
    platformAlgorithms: 0.9,
    monetization: 0.85,
    audienceGrowth: 0.9,
    brandDeals: 0.75,
    toolsAndGear: 0.7,
    trends: 0.85,
    creatorEconomy: 0.9
  },
  
  engagementStyle: {
    likeRate: 0.18,
    replyRate: 0.08,
    repostRate: 0.05,
    clickRate: 0.22,
    dwellTime: 3.0
  },
  
  demographics: {
    ageRange: '18-35',
    location: 'Global',
    deviceUsage: '80% mobile, 20% desktop'
  }
}
```

### 7. Journalists & Writers

```typescript
{
  id: 'journalists',
  name: 'Journalists & Writers',
  icon: '✍️',
  description: 'Reporters, columnists, and freelance writers covering various beats',
  
  interests: {
    news: 0.95,
    media: 0.9,
    politics: 0.7,
    technology: 0.6,
    investigations: 0.75,
    mediaIndustry: 0.85,
    writingCraft: 0.8,
    journalism: 0.95
  },
  
  engagementStyle: {
    likeRate: 0.08,
    replyRate: 0.05,
    repostRate: 0.04,
    clickRate: 0.3,
    dwellTime: 5.5
  },
  
  demographics: {
    ageRange: '25-55',
    location: 'Major metro areas',
    deviceUsage: '45% mobile, 55% desktop'
  }
}
```

### 8. Marketing Professionals

```typescript
{
  id: 'marketers',
  name: 'Marketing Professionals',
  icon: '📈',
  description: 'Digital marketers, brand managers, and growth hackers',
  
  interests: {
    marketing: 0.95,
    growth: 0.9,
    socialMedia: 0.9,
    analytics: 0.8,
    branding: 0.85,
    advertising: 0.8,
    contentMarketing: 0.85,
    seo: 0.7,
    caseStudies: 0.8
  },
  
  engagementStyle: {
    likeRate: 0.14,
    replyRate: 0.05,
    repostRate: 0.04,
    clickRate: 0.25,
    dwellTime: 3.5
  },
  
  demographics: {
    ageRange: '24-40',
    location: 'Global, urban',
    deviceUsage: '60% mobile, 40% desktop'
  }
}
```

## B.3 Investor & Finance Audiences

### 9. Venture Capitalists

```typescript
{
  id: 'venture-capitalists',
  name: 'Venture Capitalists',
  icon: '💵',
  description: 'Partners and associates at VC firms',
  
  interests: {
    investing: 0.95,
    startups: 0.95,
    dealFlow: 0.9,
    marketTrends: 0.85,
    founderStories: 0.8,
    exitNews: 0.85,
    portfolioCompanies: 0.9,
    emergingTech: 0.8
  },
  
  engagementStyle: {
    likeRate: 0.06,
    replyRate: 0.02,
    repostRate: 0.015,
    clickRate: 0.2,
    dwellTime: 4.0
  },
  
  demographics: {
    ageRange: '28-55',
    location: 'SF, NYC, Boston, LA',
    deviceUsage: '55% mobile, 45% desktop'
  }
}
```

### 10. Angel Investors

```typescript
{
  id: 'angel-investors',
  name: 'Angel Investors',
  icon: '😇',
  description: 'Individual investors making early-stage bets',
  
  interests: {
    investing: 0.9,
    startups: 0.9,
    foundersToWatch: 0.85,
    dealFlow: 0.8,
    angelSyndicates: 0.75,
    dueDiligence: 0.7,
    portfolioUpdates: 0.8
  },
  
  engagementStyle: {
    likeRate: 0.1,
    replyRate: 0.04,
    repostRate: 0.02,
    clickRate: 0.18,
    dwellTime: 4.5
  },
  
  demographics: {
    ageRange: '35-60',
    location: 'Tech hubs, global',
    deviceUsage: '50% mobile, 50% desktop'
  }
}
```

### 11. Retail Investors

```typescript
{
  id: 'retail-investors',
  name: 'Retail Investors',
  icon: '📊',
  description: 'Individual investors interested in public markets and crypto',
  
  interests: {
    stockMarket: 0.9,
    crypto: 0.6,
    investingAdvice: 0.85,
    earnings: 0.8,
    techStocks: 0.75,
    personalFinance: 0.8,
    marketNews: 0.85
  },
  
  engagementStyle: {
    likeRate: 0.12,
    replyRate: 0.06,
    repostRate: 0.03,
    clickRate: 0.22,
    dwellTime: 3.5
  },
  
  demographics: {
    ageRange: '22-55',
    location: 'Global',
    deviceUsage: '75% mobile, 25% desktop'
  }
}
```

## B.4 Design & Creative Audiences

### 12. UI/UX Designers

```typescript
{
  id: 'ux-designers',
  name: 'UI/UX Designers',
  icon: '🎨',
  description: 'Product designers, UX researchers, and design leads',
  
  interests: {
    design: 0.95,
    userExperience: 0.9,
    figma: 0.85,
    designSystems: 0.8,
    accessibility: 0.75,
    prototyping: 0.8,
    designCritique: 0.7,
    careerAdvice: 0.65
  },
  
  engagementStyle: {
    likeRate: 0.15,
    replyRate: 0.05,
    repostRate: 0.03,
    clickRate: 0.2,
    dwellTime: 4.0
  },
  
  demographics: {
    ageRange: '23-40',
    location: 'Tech hubs globally',
    deviceUsage: '40% mobile, 60% desktop'
  }
}
```

### 13. Graphic Designers & Artists

```typescript
{
  id: 'graphic-designers',
  name: 'Graphic Designers & Artists',
  icon: '🖼️',
  description: 'Visual designers, illustrators, and digital artists',
  
  interests: {
    graphicDesign: 0.95,
    illustration: 0.85,
    typography: 0.8,
    branding: 0.8,
    artDirection: 0.75,
    toolsAndSoftware: 0.8,
    freelancing: 0.7,
    portfolioAdvice: 0.7
  },
  
  engagementStyle: {
    likeRate: 0.2,
    replyRate: 0.04,
    repostRate: 0.05,
    clickRate: 0.15,
    dwellTime: 3.5
  },
  
  demographics: {
    ageRange: '20-40',
    location: 'Global, creative hubs',
    deviceUsage: '50% mobile, 50% desktop'
  }
}
```

## B.5 Academic & Research Audiences

### 14. AI/ML Researchers

```typescript
{
  id: 'ai-researchers',
  name: 'AI/ML Researchers',
  icon: '🔬',
  description: 'PhD students, postdocs, and research scientists in AI',
  
  interests: {
    artificialIntelligence: 0.95,
    machineLearning: 0.95,
    papers: 0.9,
    deepLearning: 0.85,
    aiSafety: 0.7,
    nlp: 0.75,
    computeResources: 0.7,
    academiaVsIndustry: 0.65
  },
  
  engagementStyle: {
    likeRate: 0.08,
    replyRate: 0.04,
    repostRate: 0.025,
    clickRate: 0.3,
    dwellTime: 6.0
  },
  
  demographics: {
    ageRange: '24-45',
    location: 'University towns, tech hubs',
    deviceUsage: '30% mobile, 70% desktop'
  }
}
```

### 15. CS Students

```typescript
{
  id: 'cs-students',
  name: 'Computer Science Students',
  icon: '🎓',
  description: 'Undergrad and graduate students studying CS',
  
  interests: {
    programming: 0.9,
    careerAdvice: 0.9,
    techInterviews: 0.85,
    internships: 0.85,
    learningResources: 0.8,
    sideProjects: 0.75,
    hackathons: 0.7,
    techCompanies: 0.8
  },
  
  engagementStyle: {
    likeRate: 0.15,
    replyRate: 0.06,
    repostRate: 0.04,
    clickRate: 0.25,
    dwellTime: 4.0
  },
  
  demographics: {
    ageRange: '18-26',
    location: 'University towns globally',
    deviceUsage: '70% mobile, 30% desktop'
  }
}
```

## B.6 Industry-Specific Audiences

### 16. Fintech Professionals

```typescript
{
  id: 'fintech-professionals',
  name: 'Fintech Professionals',
  icon: '🏦',
  description: 'People working at the intersection of finance and technology',
  
  interests: {
    fintech: 0.95,
    payments: 0.85,
    banking: 0.8,
    crypto: 0.6,
    regulation: 0.75,
    neobanks: 0.8,
    personalFinance: 0.7
  },
  
  engagementStyle: {
    likeRate: 0.1,
    replyRate: 0.04,
    repostRate: 0.025,
    clickRate: 0.2,
    dwellTime: 4.5
  },
  
  demographics: {
    ageRange: '26-45',
    location: 'Financial centers',
    deviceUsage: '55% mobile, 45% desktop'
  }
}
```

### 17. Healthcare Tech

```typescript
{
  id: 'healthcare-tech',
  name: 'Healthcare Tech',
  icon: '🏥',
  description: 'People working in digital health and health tech',
  
  interests: {
    healthTech: 0.95,
    digitalHealth: 0.9,
    medicalAI: 0.8,
    regulation: 0.75,
    telemedicine: 0.8,
    healthStartups: 0.85,
    privacyCompliance: 0.7
  },
  
  engagementStyle: {
    likeRate: 0.09,
    replyRate: 0.03,
    repostRate: 0.02,
    clickRate: 0.22,
    dwellTime: 5.0
  },
  
  demographics: {
    ageRange: '28-50',
    location: 'Major cities',
    deviceUsage: '50% mobile, 50% desktop'
  }
}
```

### 18. E-commerce & DTC

```typescript
{
  id: 'ecommerce-dtc',
  name: 'E-commerce & DTC',
  icon: '🛒',
  description: 'Shopify merchants, DTC brand builders, and e-commerce operators',
  
  interests: {
    ecommerce: 0.95,
    shopify: 0.85,
    dtcBrands: 0.9,
    marketing: 0.85,
    supplyChain: 0.7,
    customerAcquisition: 0.85,
    brandBuilding: 0.8
  },
  
  engagementStyle: {
    likeRate: 0.13,
    replyRate: 0.05,
    repostRate: 0.035,
    clickRate: 0.2,
    dwellTime: 3.5
  },
  
  demographics: {
    ageRange: '24-45',
    location: 'Global',
    deviceUsage: '65% mobile, 35% desktop'
  }
}
```

## B.7 Community & Niche Audiences

### 19. Indie Hackers

```typescript
{
  id: 'indie-hackers',
  name: 'Indie Hackers',
  icon: '🛠️',
  description: 'Solo founders and small teams building bootstrapped products',
  
  interests: {
    indieHacking: 0.95,
    buildInPublic: 0.9,
    saas: 0.85,
    revenue: 0.85,
    productHunt: 0.75,
    marketing: 0.8,
    soloFounders: 0.85,
    microSaas: 0.8
  },
  
  engagementStyle: {
    likeRate: 0.18,
    replyRate: 0.08,
    repostRate: 0.05,
    clickRate: 0.22,
    dwellTime: 4.0
  },
  
  demographics: {
    ageRange: '25-40',
    location: 'Global, remote-first',
    deviceUsage: '55% mobile, 45% desktop'
  }
}
```

### 20. DevOps & SREs

```typescript
{
  id: 'devops-sres',
  name: 'DevOps & SREs',
  icon: '⚙️',
  description: 'Site reliability engineers, platform engineers, and DevOps practitioners',
  
  interests: {
    devops: 0.95,
    kubernetes: 0.85,
    cloudInfrastructure: 0.9,
    monitoring: 0.8,
    incidents: 0.75,
    automation: 0.85,
    security: 0.7,
    tooling: 0.85
  },
  
  engagementStyle: {
    likeRate: 0.1,
    replyRate: 0.04,
    repostRate: 0.02,
    clickRate: 0.2,
    dwellTime: 4.5
  },
  
  demographics: {
    ageRange: '25-45',
    location: 'Tech hubs globally',
    deviceUsage: '40% mobile, 60% desktop'
  }
}
```

### 21. Web3 & Crypto

```typescript
{
  id: 'web3-crypto',
  name: 'Web3 & Crypto',
  icon: '🔗',
  description: 'Blockchain developers, crypto traders, and Web3 builders',
  
  interests: {
    crypto: 0.95,
    blockchain: 0.9,
    defi: 0.8,
    nfts: 0.7,
    ethereum: 0.85,
    web3: 0.9,
    tradingAnalysis: 0.75,
    regulation: 0.6
  },
  
  engagementStyle: {
    likeRate: 0.15,
    replyRate: 0.07,
    repostRate: 0.05,
    clickRate: 0.2,
    dwellTime: 3.0
  },
  
  demographics: {
    ageRange: '20-40',
    location: 'Global',
    deviceUsage: '75% mobile, 25% desktop'
  }
}
```

### 22. No-Code / Low-Code

```typescript
{
  id: 'nocode-lowcode',
  name: 'No-Code / Low-Code',
  icon: '🧩',
  description: 'Builders using tools like Bubble, Webflow, and Zapier',
  
  interests: {
    noCode: 0.95,
    automation: 0.85,
    webflow: 0.75,
    bubble: 0.7,
    zapier: 0.8,
    productBuilding: 0.8,
    templates: 0.7,
    tutorials: 0.8
  },
  
  engagementStyle: {
    likeRate: 0.16,
    replyRate: 0.06,
    repostRate: 0.04,
    clickRate: 0.25,
    dwellTime: 4.0
  },
  
  demographics: {
    ageRange: '22-45',
    location: 'Global',
    deviceUsage: '60% mobile, 40% desktop'
  }
}
```

## B.8 Geographic & General Audiences

### 23. Tech Twitter (General)

```typescript
{
  id: 'tech-twitter-general',
  name: 'Tech Twitter (General)',
  icon: '🐦',
  description: 'The broad tech-interested audience on Twitter/X',
  
  interests: {
    technology: 0.85,
    startups: 0.7,
    news: 0.7,
    gadgets: 0.6,
    apps: 0.65,
    bigTech: 0.75,
    productLaunches: 0.7,
    viralContent: 0.6
  },
  
  engagementStyle: {
    likeRate: 0.1,
    replyRate: 0.03,
    repostRate: 0.02,
    clickRate: 0.15,
    dwellTime: 3.0
  },
  
  demographics: {
    ageRange: '18-55',
    location: 'Global',
    deviceUsage: '70% mobile, 30% desktop'
  }
}
```

### 24. International Tech (Non-US)

```typescript
{
  id: 'international-tech',
  name: 'International Tech',
  icon: '🌍',
  description: 'Tech professionals in Europe, Asia, and other regions',
  
  interests: {
    technology: 0.85,
    localStartups: 0.8,
    globalTech: 0.75,
    remoteWork: 0.8,
    visaIssues: 0.6,
    internationalExpansion: 0.65,
    localEcosystem: 0.8
  },
  
  engagementStyle: {
    likeRate: 0.12,
    replyRate: 0.04,
    repostRate: 0.025,
    clickRate: 0.18,
    dwellTime: 4.0
  },
  
  demographics: {
    ageRange: '22-45',
    location: 'Europe, Asia, LATAM',
    deviceUsage: '65% mobile, 35% desktop'
  }
}
```

### 25. Aspiring Tech Workers

```typescript
{
  id: 'aspiring-tech',
  name: 'Aspiring Tech Workers',
  icon: '🌱',
  description: 'Career changers and those breaking into tech',
  
  interests: {
    careerAdvice: 0.95,
    bootcamps: 0.8,
    learningResources: 0.9,
    portfolioBuilding: 0.85,
    networking: 0.8,
    jobSearch: 0.9,
    skillDevelopment: 0.85,
    successStories: 0.75
  },
  
  engagementStyle: {
    likeRate: 0.2,
    replyRate: 0.08,
    repostRate: 0.05,
    clickRate: 0.3,
    dwellTime: 5.0
  },
  
  demographics: {
    ageRange: '22-40',
    location: 'Global',
    deviceUsage: '70% mobile, 30% desktop'
  }
}
```

---

# C. SAMPLE TWEETS BY CATEGORY (50+ Presets)

## C.1 Product Launches & Announcements

```typescript
const PRODUCT_LAUNCH_TWEETS = [
  {
    id: 'launch-1',
    text: "Just shipped a new feature! 🚀 Really proud of the team.",
    persona: ['tech-founder', 'software-engineer', 'product-manager'],
    category: 'product-launch',
    expectedEngagement: 'high'
  },
  {
    id: 'launch-2', 
    text: "After 6 months of building in public, we're finally live on Product Hunt today. Would love your support 🙏",
    persona: ['indie-hacker', 'tech-founder'],
    category: 'product-launch',
    expectedEngagement: 'high'
  },
  {
    id: 'launch-3',
    text: "v2.0 is here. Complete rewrite. 50% faster. 3 new integrations. Free for existing users. Thread 🧵",
    persona: ['tech-founder', 'indie-hacker', 'product-manager'],
    category: 'product-launch',
    expectedEngagement: 'high'
  },
  {
    id: 'launch-4',
    text: "We're launching our API today. Docs at [link]. Can't wait to see what you build.",
    persona: ['tech-founder', 'software-engineer'],
    category: 'product-launch',
    expectedEngagement: 'medium'
  },
  {
    id: 'launch-5',
    text: "Soft launching to our waitlist today. 500 spots. Reply with your email if you want in.",
    persona: ['indie-hacker', 'tech-founder'],
    category: 'product-launch',
    expectedEngagement: 'high'
  }
];
```

## C.2 Career & Hiring

```typescript
const CAREER_TWEETS = [
  {
    id: 'career-1',
    text: "We're hiring engineers! Remote-first, competitive comp, great team. DM me or apply at [link]",
    persona: ['tech-founder', 'tech-executive'],
    category: 'hiring',
    expectedEngagement: 'medium'
  },
  {
    id: 'career-2',
    text: "Hot take: Most startup advice is survivorship bias disguised as wisdom.",
    persona: ['tech-founder', 'venture-capitalist'],
    category: 'hot-take',
    expectedEngagement: 'high'
  },
  {
    id: 'career-3',
    text: "After 3 years of building, we're finally profitable. Here's what I learned... 🧵",
    persona: ['tech-founder', 'indie-hacker'],
    category: 'milestone',
    expectedEngagement: 'very-high'
  },
  {
    id: 'career-4',
    text: "I've reviewed 500+ PM resumes this year. Here's the #1 mistake I see:",
    persona: ['product-manager', 'tech-executive'],
    category: 'career-advice',
    expectedEngagement: 'high'
  },
  {
    id: 'career-5',
    text: "Unpopular opinion: TC isn't everything. I took a 30% pay cut and I'm happier than ever.",
    persona: ['software-engineer', 'product-manager'],
    category: 'career-advice',
    expectedEngagement: 'high'
  },
  {
    id: 'career-6',
    text: "Laid off today. 4 years at the company. Didn't see it coming. Open to opportunities.",
    persona: ['software-engineer', 'product-manager', 'designer'],
    category: 'job-search',
    expectedEngagement: 'very-high'
  }
];
```

## C.3 Technical Deep Dives

```typescript
const TECHNICAL_TWEETS = [
  {
    id: 'tech-1',
    text: "TIL you can do this in TypeScript and it blew my mind: [code snippet]",
    persona: ['software-engineer'],
    category: 'technical',
    expectedEngagement: 'medium'
  },
  {
    id: 'tech-2',
    text: "We migrated 2TB of data to a new database with zero downtime. Here's exactly how we did it:",
    persona: ['software-engineer', 'tech-executive'],
    category: 'technical',
    expectedEngagement: 'high'
  },
  {
    id: 'tech-3',
    text: "React Server Components finally clicked for me. Let me explain it like you're 5:",
    persona: ['software-engineer', 'educator'],
    category: 'technical',
    expectedEngagement: 'high'
  },
  {
    id: 'tech-4',
    text: "Our P99 latency went from 2s to 50ms. The fix? One line of code. Thread 🧵",
    persona: ['software-engineer'],
    category: 'technical',
    expectedEngagement: 'very-high'
  },
  {
    id: 'tech-5',
    text: "I spent 3 weeks benchmarking every database option. Here's what I found:",
    persona: ['software-engineer', 'data-scientist'],
    category: 'technical',
    expectedEngagement: 'high'
  }
];
```

## C.4 AI & ML Content

```typescript
const AI_ML_TWEETS = [
  {
    id: 'ai-1',
    text: "New paper just dropped that could change everything we know about attention mechanisms. Let me break it down:",
    persona: ['ai-researcher'],
    category: 'ai-research',
    expectedEngagement: 'high'
  },
  {
    id: 'ai-2',
    text: "GPT-5 speculation is fun but here's what actually matters for AI progress:",
    persona: ['ai-researcher', 'tech-reporter'],
    category: 'ai-analysis',
    expectedEngagement: 'high'
  },
  {
    id: 'ai-3',
    text: "We integrated AI into our product. Revenue went up 40%. Here's exactly what we built:",
    persona: ['tech-founder', 'product-manager'],
    category: 'ai-application',
    expectedEngagement: 'very-high'
  },
  {
    id: 'ai-4',
    text: "Hot take: 90% of \"AI startups\" are just API wrappers. The 10% that aren't are worth watching.",
    persona: ['venture-capitalist', 'tech-reporter'],
    category: 'ai-analysis',
    expectedEngagement: 'high'
  },
  {
    id: 'ai-5',
    text: "I trained a model on 10 years of my journal entries. Here's what it learned about me:",
    persona: ['software-engineer', 'content-creator'],
    category: 'ai-experiment',
    expectedEngagement: 'very-high'
  }
];
```

## C.5 Startup & Business

```typescript
const STARTUP_TWEETS = [
  {
    id: 'startup-1',
    text: "Raised our seed round! $3M led by [VC]. Grateful and terrified in equal measure.",
    persona: ['tech-founder'],
    category: 'fundraising',
    expectedEngagement: 'high'
  },
  {
    id: 'startup-2',
    text: "We hit $1M ARR today. Bootstrapped. No VC. Just me and 2 engineers. AMA.",
    persona: ['indie-hacker', 'tech-founder'],
    category: 'milestone',
    expectedEngagement: 'very-high'
  },
  {
    id: 'startup-3',
    text: "Shutting down the company. 3 years, $2M raised, 15 employees. What went wrong:",
    persona: ['tech-founder'],
    category: 'postmortem',
    expectedEngagement: 'very-high'
  },
  {
    id: 'startup-4',
    text: "The best advice I got from my investor: \"Your job is to not run out of money. Everything else is secondary.\"",
    persona: ['tech-founder'],
    category: 'advice',
    expectedEngagement: 'high'
  },
  {
    id: 'startup-5',
    text: "Controversial: Most startups fail because of founder conflict, not market or product issues.",
    persona: ['venture-capitalist', 'tech-founder'],
    category: 'hot-take',
    expectedEngagement: 'high'
  }
];
```

## C.6 Design & Product

```typescript
const DESIGN_TWEETS = [
  {
    id: 'design-1',
    text: "Just redesigned our onboarding. Conversion went up 60%. Here's the before/after:",
    persona: ['designer', 'product-manager'],
    category: 'case-study',
    expectedEngagement: 'high'
  },
  {
    id: 'design-2',
    text: "Figma tip that saves me hours every week: [tip]",
    persona: ['designer'],
    category: 'tip',
    expectedEngagement: 'medium'
  },
  {
    id: 'design-3',
    text: "Unpopular opinion: Dark mode is overrated and often hurts readability.",
    persona: ['designer', 'product-manager'],
    category: 'hot-take',
    expectedEngagement: 'high'
  },
  {
    id: 'design-4',
    text: "Our design system now has 847 components. Here's how we organize it:",
    persona: ['designer'],
    category: 'deep-dive',
    expectedEngagement: 'medium'
  },
  {
    id: 'design-5',
    text: "I redesigned Google's homepage for fun. Roast me. [image]",
    persona: ['designer', 'content-creator'],
    category: 'creative',
    expectedEngagement: 'high'
  }
];
```

## C.7 Industry News & Commentary

```typescript
const NEWS_TWEETS = [
  {
    id: 'news-1',
    text: "BREAKING: [Company] just announced [big news]. My take on what this means:",
    persona: ['tech-reporter', 'venture-capitalist'],
    category: 'breaking-news',
    expectedEngagement: 'high'
  },
  {
    id: 'news-2',
    text: "The [Company] layoffs are more significant than people realize. Here's why:",
    persona: ['tech-reporter', 'tech-executive'],
    category: 'analysis',
    expectedEngagement: 'high'
  },
  {
    id: 'news-3',
    text: "Read the entire 50-page FTC complaint against [Company]. The key parts everyone is missing:",
    persona: ['tech-reporter'],
    category: 'analysis',
    expectedEngagement: 'high'
  },
  {
    id: 'news-4',
    text: "Spoke to 5 people inside [Company] about what's really happening. Off-record, but here's what I can share:",
    persona: ['tech-reporter'],
    category: 'insider',
    expectedEngagement: 'very-high'
  },
  {
    id: 'news-5',
    text: "Everyone is talking about [topic] but missing the bigger story:",
    persona: ['tech-reporter', 'venture-capitalist'],
    category: 'analysis',
    expectedEngagement: 'high'
  }
];
```

## C.8 Personal & Vulnerable

```typescript
const PERSONAL_TWEETS = [
  {
    id: 'personal-1',
    text: "Burned out. Taking 2 weeks off. Will be offline. Take care of yourselves.",
    persona: ['any'],
    category: 'personal',
    expectedEngagement: 'high'
  },
  {
    id: 'personal-2',
    text: "My imposter syndrome has never been worse. 10 years in tech and I still feel like I don't belong.",
    persona: ['any'],
    category: 'vulnerable',
    expectedEngagement: 'very-high'
  },
  {
    id: 'personal-3',
    text: "Two years ago I almost quit tech entirely. Best decision I ever made was staying. Here's what changed:",
    persona: ['any'],
    category: 'personal-story',
    expectedEngagement: 'high'
  },
  {
    id: 'personal-4',
    text: "I've been doing this for 15 years. The secret? I still have no idea what I'm doing. Neither does anyone else.",
    persona: ['tech-executive', 'tech-founder'],
    category: 'vulnerable',
    expectedEngagement: 'high'
  },
  {
    id: 'personal-5',
    text: "gm",
    persona: ['any'],
    category: 'minimal',
    expectedEngagement: 'low',
    note: 'Tests minimal content'
  }
];
```

## C.9 Educational & Tutorial

```typescript
const EDUCATIONAL_TWEETS = [
  {
    id: 'edu-1',
    text: "I learned more about system design from one 10-minute video than 4 years of college. Link in thread:",
    persona: ['educator', 'software-engineer'],
    category: 'resource',
    expectedEngagement: 'high'
  },
  {
    id: 'edu-2',
    text: "If you're learning to code in 2024, here's the exact path I'd recommend:",
    persona: ['educator', 'software-engineer'],
    category: 'advice',
    expectedEngagement: 'high'
  },
  {
    id: 'edu-3',
    text: "Just finished my free course on [topic]. 10 hours of content. No signup required. Link:",
    persona: ['educator', 'content-creator'],
    category: 'resource',
    expectedEngagement: 'high'
  },
  {
    id: 'edu-4',
    text: "The mental model that 10x'd my productivity as an engineer:",
    persona: ['software-engineer', 'educator'],
    category: 'advice',
    expectedEngagement: 'high'
  },
  {
    id: 'edu-5',
    text: "Explaining [complex topic] using only diagrams. No jargon. Thread:",
    persona: ['educator', 'ai-researcher'],
    category: 'educational',
    expectedEngagement: 'very-high'
  }
];
```

## C.10 Engagement Bait & Controversial (For Testing)

```typescript
const ENGAGEMENT_BAIT_TWEETS = [
  {
    id: 'bait-1',
    text: "Ratio",
    persona: ['any'],
    category: 'minimal',
    expectedEngagement: 'variable',
    note: 'Single word tweet test'
  },
  {
    id: 'bait-2',
    text: "Tabs vs spaces. Go.",
    persona: ['software-engineer'],
    category: 'debate-starter',
    expectedEngagement: 'high'
  },
  {
    id: 'bait-3',
    text: "The best programming language is _____",
    persona: ['software-engineer'],
    category: 'fill-in-blank',
    expectedEngagement: 'very-high'
  },
  {
    id: 'bait-4',
    text: "What's your most controversial tech opinion? I'll go first: [opinion]",
    persona: ['any'],
    category: 'question',
    expectedEngagement: 'very-high'
  },
  {
    id: 'bait-5',
    text: "This will probably get me unfollowed but [controversial opinion]",
    persona: ['any'],
    category: 'controversial',
    expectedEngagement: 'high'
  }
];
```

---

# D. SCORING WEIGHT CONFIGURATION

```typescript
export const ACTION_WEIGHTS = {
  // === POSITIVE ACTIONS (boost score) ===
  FAVORITE_WEIGHT: 1.0,
  REPLY_WEIGHT: 0.3,
  RETWEET_WEIGHT: 0.5,
  QUOTE_WEIGHT: 0.8,
  CLICK_WEIGHT: 0.1,
  PROFILE_CLICK_WEIGHT: 0.15,
  VQV_WEIGHT: 0.2,         // Video quality view
  SHARE_WEIGHT: 1.5,
  SHARE_VIA_DM_WEIGHT: 2.0,
  SHARE_VIA_COPY_LINK_WEIGHT: 1.0,
  DWELL_WEIGHT: 0.2,
  FOLLOW_AUTHOR_WEIGHT: 2.0,
  PHOTO_EXPAND_WEIGHT: 0.1,
  
  // === NEGATIVE ACTIONS (reduce score) ===
  NOT_INTERESTED_WEIGHT: -1.5,
  BLOCK_AUTHOR_WEIGHT: -3.0,
  MUTE_AUTHOR_WEIGHT: -2.0,
  REPORT_WEIGHT: -5.0,
  
  // === COMPUTED VALUES ===
  get POSITIVE_WEIGHTS_SUM() {
    return this.FAVORITE_WEIGHT + this.REPLY_WEIGHT + this.RETWEET_WEIGHT +
           this.QUOTE_WEIGHT + this.CLICK_WEIGHT + this.PROFILE_CLICK_WEIGHT +
           this.VQV_WEIGHT + this.SHARE_WEIGHT + this.SHARE_VIA_DM_WEIGHT +
           this.SHARE_VIA_COPY_LINK_WEIGHT + this.DWELL_WEIGHT + 
           this.FOLLOW_AUTHOR_WEIGHT + this.PHOTO_EXPAND_WEIGHT;
  },
  
  get NEGATIVE_WEIGHTS_SUM() {
    return Math.abs(this.NOT_INTERESTED_WEIGHT) + Math.abs(this.BLOCK_AUTHOR_WEIGHT) +
           Math.abs(this.MUTE_AUTHOR_WEIGHT) + Math.abs(this.REPORT_WEIGHT);
  },
  
  NEGATIVE_SCORES_OFFSET: 0.2,
  
  // === DIVERSITY PARAMETERS ===
  AUTHOR_DIVERSITY_DECAY: 0.7,
  AUTHOR_DIVERSITY_FLOOR: 0.3,
  
  // === OUT-OF-NETWORK ===
  OON_WEIGHT_FACTOR: 0.85
};
```

---

# E. GITHUB CODE LINKS REFERENCE

```typescript
export const CODE_LINKS = {
  baseUrl: 'https://github.com/xai-org/x-algorithm/blob/main',
  
  chapters: {
    '01': {
      title: 'Query Hydration',
      files: [
        'home-mixer/query_hydrators/user_action_seq_query_hydrator.rs',
        'home-mixer/query_hydrators/user_features_query_hydrator.rs'
      ]
    },
    '02': {
      title: 'Candidate Sourcing',
      files: [
        'home-mixer/sources/thunder_source.rs',
        'home-mixer/sources/phoenix_source.rs',
        'thunder/posts/post_store.rs',
        'phoenix/recsys_retrieval_model.py'
      ]
    },
    '03': {
      title: 'Filtering',
      files: [
        'home-mixer/filters/drop_duplicates_filter.rs',
        'home-mixer/filters/age_filter.rs',
        'home-mixer/filters/self_tweet_filter.rs',
        'home-mixer/filters/author_socialgraph_filter.rs',
        'home-mixer/filters/muted_keyword_filter.rs',
        'home-mixer/filters/vf_filter.rs',
        'home-mixer/filters/previously_seen_posts_filter.rs',
        'home-mixer/filters/previously_served_posts_filter.rs',
        'home-mixer/filters/retweet_deduplication_filter.rs'
      ]
    },
    '04': {
      title: 'Scoring',
      files: [
        'home-mixer/scorers/phoenix_scorer.rs',
        'home-mixer/scorers/weighted_scorer.rs',
        'home-mixer/scorers/author_diversity_scorer.rs',
        'home-mixer/scorers/oon_scorer.rs',
        'phoenix/recsys_model.py',
        'phoenix/grok.py'
      ]
    },
    '05': {
      title: 'Selection',
      files: [
        'home-mixer/selectors/top_k_score_selector.rs',
        'candidate-pipeline/selector.rs'
      ]
    },
    '06': {
      title: 'Delivery',
      files: [
        'home-mixer/server.rs',
        'home-mixer/main.rs'
      ]
    }
  },
  
  getFileUrl(path: string): string {
    return `${this.baseUrl}/${path}`;
  },
  
  getLineUrl(path: string, lineStart: number, lineEnd?: number): string {
    const base = this.getFileUrl(path);
    if (lineEnd && lineEnd !== lineStart) {
      return `${base}#L${lineStart}-L${lineEnd}`;
    }
    return `${base}#L${lineStart}`;
  }
};
```

---

# F. CREATOR ATTRIBUTION DATA

```typescript
export const ATTRIBUTION = {
  creator: {
    githubUsername: 'prabal-rje',
    twitterHandle: '@prabal_',
    displayName: 'Prabal',
    projectRepo: 'github.com/prabal-rje/x-algorithm-visualizer'
  },
  
  project: {
    name: 'The Anatomy of Virality',
    tagline: 'See how the X algorithm actually works—with real math.',
    version: '1.0.0'
  },
  
  marqueeText: {
    default: '⭐ Star this project on GitHub → github.com/prabal-rje/x-algorithm-visualizer | Follow @prabal_ for more ⭐',
    short: '⭐ github.com/prabal-rje/x-algorithm-visualizer | @prabal_ ⭐'
  },
  
  links: {
    github: 'https://github.com/prabal-rje/x-algorithm-visualizer',
    twitter: 'https://twitter.com/prabal_',
    sourceRepo: 'https://github.com/xai-org/x-algorithm'
  }
};
```

---

# G. DESIGN DECISION ANSWERS

## G.1 Fake Tweet Generation

**Recommendation**: Pre-generated with category matching

```typescript
// Generate fake tweets based on persona's engagement profile
function generateCompetingTweets(
  persona: Persona,
  count: number = 500
): FakeTweet[] {
  const tweets: FakeTweet[] = [];
  
  // Distribution based on persona's interests
  const categories = Object.entries(persona.engagementProfile)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  for (const [category, weight] of categories) {
    const categoryCount = Math.floor(count * weight / totalWeight);
    tweets.push(...sampleFromCategory(category, categoryCount));
  }
  
  // Add some random noise (content they don't typically see)
  const noiseCount = Math.floor(count * 0.1);
  tweets.push(...sampleRandom(noiseCount));
  
  return shuffle(tweets);
}
```

## G.2 Offensive Content Handling

**Recommendation**: Process and show filtering with educational context

```typescript
// When offensive content is detected
if (safetyScore > SAFETY_THRESHOLD) {
  return {
    filtered: true,
    reason: 'content-safety',
    visualizationNote: 'This content would be flagged by the VFFilter for review.',
    educationalContext: 'The algorithm uses ML classifiers to detect potentially harmful content. This isn\'t censorship—it\'s the same safety system that keeps spam and abuse off your feed.',
    showScores: true // Still show the math, but with [FILTERED] status
  };
}
```

## G.3 Weight Transparency

**Recommendation**: Show plausible weights with "estimated" label

```
┌──────────────────────────────────────────────────────────────────────┐
│  ACTION WEIGHTS (estimated based on public documentation)           │
│  Note: Actual weights are proprietary. These are reasonable         │
│  estimates based on observed behavior and X's public statements.    │
├──────────────────────────────────────────────────────────────────────┤
│  ❤️  LIKE        ×1.0   (baseline)                                  │
│  🔁 REPOST      ×0.5   (less common, but valuable)                 │
│  💬 REPLY       ×0.3   (encourages conversation)                   │
│  🔗 SHARE       ×1.5   (strong signal of value)                    │
│  ...                                                                 │
│                                                                      │
│  [ℹ️] Why estimates? X hasn't published exact weights.              │
│       These are calibrated to produce realistic behavior.            │
└──────────────────────────────────────────────────────────────────────┘
```

## G.4 Embedding Visualization (384D → 2D)

**Recommendation**: Abstract "semantic grid" with hover details

```
384-DIMENSIONAL EMBEDDING VISUALIZATION
══════════════════════════════════════════════════════════════════════

Instead of showing all 384 dimensions, we:

1. HEATMAP GRID (16×24 = 384 cells)
   ┌────────────────────────────────────┐
   │▓▓▓░▓▓░░▓▓▓▓░░▓▓▓▓▓░░▓▓▓░          │
   │░░▓▓▓░░▓▓░░▓▓▓▓░▓▓▓░░░▓▓▓          │
   │▓▓░░░▓▓▓▓░▓▓░░░▓▓▓░░▓▓▓▓▓          │
   │...                                 │
   └────────────────────────────────────┘
   
   Brightness = magnitude
   Green = positive, Red = negative

2. TOP ACTIVATED DIMENSIONS (hover/expand)
   ┌─────────────────────────────────────┐
   │ Dimension 47:  +0.891 (tech/startup)│
   │ Dimension 183: +0.823 (enthusiasm)  │
   │ Dimension 92:  -0.712 (negative)    │
   └─────────────────────────────────────┘
   
   Note: Dimension labels are semantic approximations

3. SEMANTIC SIMILARITY BARS
   ┌─────────────────────────────────────┐
   │ Tech content:     ████████████ 87% │
   │ Positive tone:    █████████░░░ 72% │
   │ Professional:     ████████░░░░ 65% │
   │ Controversial:    ██░░░░░░░░░░ 15% │
   └─────────────────────────────────────┘
```

## G.5 Mobile Experience

**Recommendation**: Simplified chapter view with full engagement simulation

```
MOBILE: Minimum Viable Experience
═══════════════════════════════════════════

1. Simplified input (same persona/tweet selection)
2. Chapter summaries only (no function-level detail)
3. Key visualizations:
   - Filter countdown (500 → 47)
   - Score reveal for user's tweet
   - Final engagement simulation
4. Skip detailed animations
5. No generative audio (too battery-intensive)
6. Timeline at bottom, tap chapters to jump
7. Code links available but collapsed by default

Target: 3-minute experience on mobile vs 6 on desktop
```

## G.6 Loading State Design

**Recommendation**: Themed "BIOS check" sequence

```
MODEL LOADING STATE
═══════════════════════════════════════════════════════════════════════

Don't hide it—make it part of the experience:

┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  X-ALGORITHM VISUALIZER v1.0                                       │
│  (c) 2026 @prabal_                                                 │
│                                                                     │
│  SYSTEM INITIALIZATION                                             │
│  ═══════════════════════════════════════════════════════════════   │
│                                                                     │
│  > Establishing neural link...                    [ OK ]           │
│  > Loading semantic processor (22.4 MB)...                         │
│    ████████████████████░░░░░░░░░░░░░░░░  47%                       │
│    Downloading: all-MiniLM-L6-v2                                   │
│                                                                     │
│  > Calibrating embedding matrices...              [PENDING]        │
│  > Initializing filter cascade...                 [PENDING]        │
│  > Connecting to scoring transformers...          [PENDING]        │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  ESTIMATED TIME: ~10 seconds                                       │
│  (First load only - cached for future visits)                      │
│                                                                     │
│  [TIP] This visualizer uses real ML models to compute real scores. │
│        The download is worth it. Trust us.                         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

*End of Appendix*
