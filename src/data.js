export const profile = {
  name: "Aryaen Sharma",
  school: "Mechatronics Engineering, University of Waterloo",
  email: "aryaen.sharma21@gmail.com",
  github: "https://github.com/Aryaen-Sharma",
  githubHandle: "Aryaen-Sharma",
  linkedin: "https://linkedin.com/in/aryaen-sharma",
  linkedinHandle: "in/aryaen-sharma",
  next: {
    company: "Super.com",
    role: "Software Engineering Intern, Product (Full Stack)",
    term: "Winter 2027",
  },
};

export const software = [
  {
    slug: "issue-tracker",
    name: "Issue Tracker",
    kind: "Full-stack web app",
    year: "2025",
    size: "wide",
    blurb:
      "A full-stack issue tracker with JWT auth and role-based permissions. Admin-only rules are enforced in the API rather than the UI, and the tests call the endpoints directly to check that a regular user gets a 403 and can't get around the rule with a PATCH.",
    points: [
      "21 pytest API tests, plus Playwright E2E tests in a real browser",
      "Every query is scoped to the logged-in user, with a test for it",
      "Status changes update optimistically and roll back if the request fails",
    ],
    stack: ["FastAPI", "React", "MongoDB Atlas", "JWT", "pytest", "Playwright"],
    media: {
      type: "shots",
      main: "media/issue-dashboard.png",
      alt: "media/issue-stats.png",
      video: "media/issue-demo.mp4",
    },
    links: {
      live: "https://issue-tracker-sharm4.vercel.app",
      code: "https://github.com/Aryaen-Sharma/IssueTracker",
    },
    detail: {
      role: "Solo project",
      intro:
        "Users sign up, manage their own issues, comment on them, and view stats. Some issues are marked protected so only an admin can delete them, enforced in the API rather than just the UI.",
      gallery: [
        { src: "media/issue-dashboard.png", caption: "Dashboard with search, filters, and the protected issues flagged" },
        { src: "media/issue-detail.png", caption: "Issue detail with comments" },
        { src: "media/issue-stats.png", caption: "Stats page, built on a MongoDB aggregation pipeline" },
      ],
      sections: [
        {
          heading: "How it's built",
          points: [
            "React 19 (Vite) frontend with React Router, Axios and Recharts. FastAPI backend with Pydantic models, MongoDB Atlas through PyMongo",
            "One Axios instance attaches the JWT to every request and sends the user back to login on a 401",
            "Passwords are hashed with bcrypt. Tokens carry the user id and an is_admin claim and expire after 20 minutes",
            "Frontend and backend deploy as one Vercel project on a shared domain, so production needs no CORS setup",
          ],
        },
        {
          heading: "The permission rule",
          body: [
            "The dashboard disables the delete button for non-admins, but that's only a convenience. The check lives in the API, so calling the endpoint directly still returns a 403.",
            "The is_protected flag is also left out of the update model on purpose. Otherwise a user could PATCH their own issue to unprotect it and then delete it. There's a test for exactly that case.",
          ],
          image: { src: "media/issue-protected.png", caption: "A protected issue as a regular user sees it" },
        },
        {
          heading: "Testing",
          points: [
            "21 pytest tests cover auth, CRUD, pagination, comments, stats, data isolation between users, and the admin rule. They run against a separate test database",
            "Playwright drives a real browser through signup, creating an issue, the protected-delete rule, and the stats page. It starts and stops both servers itself",
          ],
        },
        {
          heading: "Things that went wrong",
          points: [
            "MongoDB Atlas blocks unknown IPs, and Vercel functions don't have static ones, so the cluster has to allow all IPs. I'd fix that properly before using this for anything real",
            "Recharts pushes the bundle past 500 kB. Code-splitting the stats page is the next fix",
          ],
        },
        {
          heading: "What I'd add next",
          points: ["Real user references instead of a free-text assignee field", "Refresh tokens", "Rate limiting on the login endpoint"],
        },
      ],
    },
  },
  {
    slug: "readable",
    name: "ReadAble",
    kind: "Ignition Hacks 2024 · Team",
    year: "2024",
    blurb:
      "A reading assistant built at Ignition Hacks. A webcam follows the page, the app reads it aloud and highlights each sentence, and pointing at a word pulls up its definition.",
    stack: ["Python", "Flask", "OpenCV", "EasyOCR", "MediaPipe"],
    media: {
      type: "image",
      src: "media/readable-camera.jpg",
      alt: "ReadAble camera view with MediaPipe hand tracking and sentence highlighting on a book page",
    },
    links: {
      code: "https://github.com/Aryaen-Sharma/ReadAble",
      devpost: "https://devpost.com/software/readable-97ox4i",
      demo: "https://www.youtube.com/watch?v=z2oliS4OltY",
    },
    detail: {
      role: "Team of 3 · I built the word definitions and saved-books storage on the backend, and made the demo video and Devpost page",
      intro:
        "Built for students reading in a language they're still learning. Instead of flipping to a translator every few lines, you hold the book up to a webcam and ReadAble reads along with you.",
      gallery: [
        { src: "media/readable-camera.jpg", caption: "Camera view: sentence highlighting and MediaPipe hand tracking on a printed page" },
        { src: "media/readable-books.jpg", caption: "Saved books, stored so they can be reread or shared" },
        { src: "media/readable-ocr.jpg", caption: "EasyOCR bounding boxes from the debug output" },
      ],
      sections: [
        {
          heading: "How it works",
          points: [
            "OpenCV grabs webcam frames and EasyOCR finds and extracts the text",
            "pyttsx3 turns the text into audio, and Pygame plays, pauses and resumes it",
            "The OCR bounding boxes are reused to highlight each sentence while it's being read",
            "MediaPipe tracks the reader's fingertip, the app finds the closest word, and PyMultiDictionary returns the definition",
            "Flask streams the processed frames to an HTML/SCSS/JS frontend and takes user settings back",
          ],
        },
        {
          heading: "Challenges",
          points: [
            "Speed. The first version checked the finger against every word and looked up every definition, which made each frame slow",
            "The TTS library could only work line by line, not word by word, which limited how precise the highlighting could be",
            "It was our first time connecting a Python backend to a web frontend, and merging everyone's code took a lot of the hackathon",
          ],
        },
      ],
    },
  },
  {
    slug: "snowsmart",
    name: "SnowSmart",
    kind: "HackCanada 2025 · Team",
    year: "2025",
    blurb:
      "A snow-removal planner built at HackCanada. It pulls live weather data, takes the equipment you have available, and generates a clearing schedule using the Gemini API. Runs in Docker.",
    stack: ["React", "MUI", "Gemini API", "OpenWeatherMap", "Docker"],
    media: {
      type: "image",
      src: "media/snowsmart-weather.jpg",
      alt: "SnowSmart planner with live weather for Banff, Canada and equipment inputs",
    },
    links: {
      code: "https://github.com/Aryaen-Sharma/SnowSmart",
      dorahacks: "https://dorahacks.io/build/23028",
      demo: "https://youtu.be/lKyS9E_ZGrA",
    },
    detail: {
      role: "Hackathon team project",
      intro:
        "You enter a city and the machinery you have, and SnowSmart turns the current weather into a snow-clearing plan.",
      gallery: [
        { src: "media/snowsmart-weather.jpg", caption: "Live weather fetched for Banff, Canada with equipment inputs ready to schedule" },
        { src: "media/snowsmart-form.jpg", caption: "City autocomplete and available resources form" },
      ],
      sections: [
        {
          heading: "How it works",
          points: [
            "The city field autocompletes with the Open-Meteo geocoding API",
            "OpenWeatherMap provides temperature, snow accumulation, rain and wind",
            "The weather and the equipment list go to the Gemini API, which returns a schedule and suggests which machinery to use",
            "React and Material UI on the front end, packaged with Docker Compose so it runs with one command",
          ],
        },
      ],
    },
  },
  {
    slug: "fitcheck",
    name: "FitCheck",
    kind: "Computer vision · Team",
    year: "2024–25",
    blurb:
      "A wardrobe app that suggests outfits from what you already own. Uses a fine-tuned YOLOv8 model to detect clothing via webcam, logs items into your inventory, and recommends outfits based on local weather and style preferences.",
    stack: ["Python", "Flask", "YOLOv8", "Groq", "Deepgram", "Pinterest API"],
    media: {
      type: "image",
      src: "media/fitcheck-card.jpg",
      alt: "FitCheck wardrobe view detecting a short-sleeve shirt from the webcam",
    },
    links: { code: "https://github.com/Aryaen-Sharma/FitCheck", devpost: "https://devpost.com/software/fitcheck-p7xchs" },
    detail: {
      role: "Team of 3",
      intro:
        "Built to automate wardrobe cataloging and daily outfit recommendations. You hold clothing up to the webcam to log items, and FitCheck generates outfits using local weather data and your style preferences.",
      gallery: [
        { src: "media/fitcheck-wardrobe.jpg", caption: "Adding an item: the camera detects a short-sleeve shirt" },
        { src: "media/fitcheck-home.jpg", caption: "Landing page" },
        { src: "media/fitcheck-shop.jpg", caption: "Shopping suggestions, planned as a future feature" },
      ],
      sections: [
        {
          heading: "How it works",
          points: [
            "A custom-trained YOLOv8 model detects clothing when you add new items",
            "Outfit suggestions combine your inventory, live weather from OpenWeatherMap, and your style preferences, with Groq for fast model inference",
            "Deepgram handles voice input and output, and the Pinterest API pulls visual outfit ideas",
            "Flask serves the web app. It includes a contrast toggle, font-size controls and color-blind filters",
          ],
        },
        {
          heading: "Challenges",
          points: [
            "Pulling reliable color and texture features out of ordinary user photos",
            "The first version was slow, so the model calls were moved to Groq",
            "Connecting the vision model, the recommendation logic and Flask without bottlenecks took several rounds",
          ],
        },
      ],
    },
  },
];

export const robotics = [
  {
    slug: "pid-sim-bot",
    name: "PID-Sim-Bot",
    kind: "ROS2 · Controls",
    year: "2025",
    size: "wide",
    blurb:
      "A differential-drive robot in ROS2 and Gazebo. Instead of using the built-in diff-drive controller, I wrote the PID velocity controller in C++ on top of a raw effort controller.",
    points: [
      "Separate PID loops for the left and right wheels on a fixed 50 Hz timer",
      "Gains are ROS2 parameters, so they can be tuned live without a rebuild",
      "kp 1.0 saturated and oscillated; kp 0.15 / ki 0.3 settles to ~1e-4 rad/s error",
    ],
    stack: ["ROS2 Humble", "C++", "Gazebo", "ros2_control"],
    media: { type: "pid" },
    links: { code: "https://github.com/Aryaen-Sharma/PID-Sim-Bot" },
    detail: {
      role: "Solo project",
      intro:
        "Most ROS2 tutorials give you a ready-made diff-drive controller, which hides the control math. I wanted to write the loop myself, so I used ros2_control's raw effort controller and had to do the PID on my own.",
      visual: "pid",
      sections: [
        {
          heading: "How it's built",
          points: [
            "A four-wheel robot in Gazebo Classic, connected through gazebo_ros2_control so each wheel takes a torque command and reports its velocity",
            "A C++ node reads /cmd_vel and /joint_states, converts the twist into left and right wheel targets with diff-drive kinematics, and publishes torques",
            "The loop runs on a 20 ms wall timer (50 Hz), separate from how often feedback arrives",
            "It publishes /pid_debug with target, current and error for each side, so the step response can be watched live",
            "kp, ki, kd, the effort limit and the wheel geometry are all ROS2 parameters",
          ],
        },
        {
          heading: "Tuning",
          body: [
            "kp = 1.0 was far too aggressive. These wheels have very little inertia, so the effort hit the 0.05 Nm clamp almost every cycle and the error kept oscillating in a 10–30% band.",
            "Adding kd made it worse, because the derivative amplified noise in the velocity feedback. What worked was dropping kp so it stays under the clamp and letting ki close the rest of the gap. With kp 0.15, ki 0.3 and kd 0, the error decays to about 1e-4 rad/s with no overshoot.",
          ],
        },
        {
          heading: "Known limitations",
          points: [
            "Turning doesn't work yet. The controller sends the right opposite torques, but the robot skids as a rigid body. Raising the effort limit 6× changed nothing, so it's a traction problem: the wheel collisions in the URDF don't define friction",
            "There's no odometry or localization. This is only the low-level velocity loop",
          ],
        },
      ],
    },
  },
  {
    slug: "sand-table",
    name: "Magic Sand Art Table",
    kind: "Embedded · Mechanical · Team",
    year: "2023–24",
    blurb:
      "A table that draws in sand. Stepper motors drive a magnet along rails under the sand bed, and the magnet drags a steel ball across the surface. An Arduino runs G-code patterns, including writing names.",
    stack: ["Arduino", "C++", "G-code", "Raspberry Pi", "Stepper motors"],
    media: { type: "sand" },
    links: {},
    detail: {
      role: "High school project with a partner (Castlebrooke SS)",
      intro:
        "The ball on top is never touched. Everything happens underneath: a magnet on a motorized rail system pulls it through the sand, so any path you can describe in G-code becomes a drawing.",
      gallery: [
        { src: "media/sand-real.jpg", caption: "Finished G-code rosette carved into the real sand bed" },
        { src: "media/sand-draw.webp", caption: "Time-lapse of the real table drawing the pattern", clip: true },
        { src: "media/sand-name.jpg", caption: "Writing a name (\"Chauhan\") in one continuous path" },
      ],
      sections: [
        {
          heading: "How it works",
          points: [
            "Stepper motors on rails move a magnet under the sand bed",
            "The magnet drags a steel ball through the sand above it",
            "An Arduino with a motor shield reads G-code and drives the steppers",
            "A Raspberry Pi runs a small network server so the table can be controlled remotely",
            "There's no pen to lift, so each word has to be drawn as one continuous path",
          ],
        },
        {
          heading: "Challenges",
          points: [
            "The motor drivers had quality and tuning problems we had to work through before the motion was reliable",
          ],
        },
        {
          heading: "The version on this site",
          body: [
            "The animation on the home page is a simulation I wrote for this site. It models the sand as a heightmap, so the ball carves a groove and pushes up ridges on either side, and it uses a single-stroke cursive font for the same reason the real table needs one.",
          ],
        },
      ],
    },
  },
  {
    slug: "vex",
    name: "VEX Robotics: Discobots",
    kind: "Teams 1104D & 1104X · 2019–2024",
    year: "5 seasons",
    blurb:
      "Five seasons of competitive VEX with Brampton Robotics, as builder, programmer, driver, and later team captain. Seven awards, including Excellence and Tournament Champions, and a trip to the 2023 World Championship.",
    stack: ["VEXcode C++", "PID", "Pneumatics", "Mechanical design"],
    media: { type: "vex" },
    links: {},
    detail: {
      role: "Builder, programmer, and driver throughout, and team captain",
      intro:
        "Every season has a new game, so every season is a new robot. Each one went through several rebuilds: we tested a subsystem, measured it, and replaced it when the numbers said it wasn't good enough.",
      seasons: true,
    },
  },
];

export const vexSeasons = [
  {
    id: "tower-takeover",
    years: "2019–20",
    game: "Tower Takeover",
    team: "1104D",
    level: "Middle school",
    role: "Main builder, programmer, and driver",
    summary:
      "My first VRC season. I'd been building robots since I was 7, but never out of metal. Most of the team was new too, so we kept the design simple and learned by trial and error.",
    robot: [
      "Two-wheel H-drive on 4\" omni wheels, chain-linked with 18-tooth sprockets",
      "A tray stacker raised through a compound gear reduction, so one motor had enough torque to tilt a full stack",
      "Roller intakes wrapped in tank tread for grip on the cubes, with rubber bands taking load off the lift motor",
      "Our first time using CAD, for the drive base",
    ],
    challenges: [
      "The intake wouldn't angle in far enough to grab cubes until we replaced the pillow blocks at the pivot with C-channel",
      "We couldn't fit two stacks in the scoring zone, so we narrowed the drive by five holes",
      "Sizing the tray took several tries: too big and stacks fell over, too small and cubes didn't fit",
    ],
    results: [
      "St. Catharines qualifier: 43rd, 2–5. Our first event",
      "Brampton qualifier: 13th, 5–1, **Judges Award**, round of 16",
    ],
    photos: [
      { src: "media/vex/tt-compact.jpg", caption: "Fully compacted, with the tray and intakes folded in" },
      { src: "media/vex/tt-side.jpg", caption: "Side view: the tray, the compound gear reduction and our 1104D plate" },
      { src: "media/vex/tt-stack.jpg", caption: "Seven cubes on the tray, ready to tilt" },
      { src: "media/vex/tt-score.jpg", caption: "Tray tilted up to place a stack" },
      { src: "media/vex/tt-judges.jpg", caption: "The Judges Award from our second event" },
      { src: "media/vex/tt-cad.jpg", caption: "Our first CAD model: the drive base" },
    ],
  },
  {
    id: "change-up",
    years: "2020–21",
    game: "Change Up",
    team: "1104D",
    level: "High school",
    role: "Builder, programmer, and driver",
    summary:
      "The COVID season. Tournaments moved online, so most of the year was remote and pre-recorded skills runs.",
    results: [
      "Remote skills events in Brampton and Toronto",
      "Best combined skills score: 170 (117 driver + 53 programming), 4th at that event",
    ],
    photos: [
      { src: "media/vex/cu-robot.jpg", caption: "The Change Up robot, with the ball conveyor running up the back" },
      { src: "media/vex/cu-robot-front.jpg", caption: "Front view: intake rollers and the scoring hopper" },
    ],
  },
  {
    id: "tipping-point",
    years: "2021–22",
    game: "Tipping Point",
    team: "1104D",
    level: "High school",
    role: "Builder, programmer, and driver",
    summary: "In-person competition came back late in the season, and we made Provincials.",
    results: [
      "Ontario Provincials, Ottawa: 7th in division, 7–3",
      "190 in driver skills",
      "Won the round of 16 157–48, lost in the quarter-finals",
    ],
    photos: [
      { src: "media/vex/tp-field.jpg", caption: "On the field at an Ontario event" },
      { src: "media/vex/tp-robot.jpg", caption: "Building the scoring arm and intake" },
    ],
  },
  {
    id: "spin-up",
    years: "2022–23",
    game: "Spin Up",
    team: "1104X",
    level: "High school",
    role: "Builder, programmer, and driver",
    highlight: "World Championship",
    summary:
      "Our best season for results. We won a tournament, picked up three more awards, and qualified for the World Championship in Dallas.",
    results: [
      "Mississauga, Dec 2022: **Tournament Semifinalists** and **Judges Award**",
      "Brampton Robotics qualifier, Jan 2023: **Innovate Award**",
      "Brampton Robotics qualifier, Feb 2023: **Tournament Champions**, won the final 153–0, 2nd in skills",
      "Ontario Provincials: 9th, 6–1, out in the quarter-finals",
      "**2023 VEX World Championship**, Dallas: Math division, 5–5, round of 16",
    ],
    photos: [
      { src: "media/vex/su-1104x.jpg", caption: "1104X, the flywheel robot we took to Worlds" },
      { src: "media/vex/su-intake.webp", fullSrc: "media/vex/su-intake-portrait.webp", caption: "Driving over a line of discs and pulling them in", clip: true },
      { src: "media/vex/su-rear.jpg", caption: "Back view, with the endgame string launcher coiled on top" },
      { src: "media/vex/su-event.jpg", caption: "At the Brampton qualifier in February, the one we won" },
      { src: "media/vex/su-comp.jpg", caption: "Working on the flywheel and gearing between matches" },
      { src: "media/vex/su-chassis.jpg", caption: "Top-down view of the disc indexer with a disc loaded" },
    ],
  },
  {
    id: "over-under",
    years: "2023–24",
    game: "Over Under",
    team: "1104D",
    level: "High school",
    role: "Team captain, primary driver, builder, programmer",
    highlight: "Excellence Award",
    summary:
      "My last season and the one with the most iteration. The notebook logs five rounds of improvements, and almost every change was backed by a timed test.",
    robot: [
      "Drive went from 4 motors to 6, then to 600 rpm cartridges geared 48:36 (450 rpm). Full-field time dropped from 1.9 s to 1.53 s",
      "Delivery went from a bulky catapult (50.9 s to launch 44 triballs) to a compact catapult (30.5 s), then to a lighter slapper (24.8 s) to save weight for a hang",
      "The intake was rebuilt three times, from 23 to 32 triballs a minute, and the last version stopped jamming",
      "Pneumatic wings, then a pneumatic side arm that both descores the corner and hangs. Later a 3-piston C-tier hang",
      "Autonomous used PID turning and driving on an inertial sensor, with a limit switch to tell when the catapult was ready",
    ],
    challenges: [
      "At the first event the pneumatics ran out of air mid-match after a skills run, and the wings wouldn't deploy. After that we carried a pump everywhere",
      "Taller opponents blocked our catapult, so we raised it even though that meant giving up driving under the goal",
      "The rubber-band ball carriage under the intake was bending the drivetrain, so we replaced it with C-channel",
    ],
    results: [
      "Sudbury, Jan 2024: **Excellence Award** and **Robot Skills Champion** (1st in skills, 294), 3rd in qualifying, tournament finalists",
      "Monroe, Michigan: scored 102 in programming skills at our first event",
      "LAUNCH Signature Event, Cleveland: 30th, 6–3",
      "Ontario Provincials: 322 combined skills, out in the round of 16",
    ],
    photos: [
      { src: "media/vex/ou-hero.jpg", caption: "1104D at Ontario Provincials: flex-wheel intake, pneumatic tank, and wedge skirts" },
      { src: "media/vex/ou-launch.jpg", caption: "At the elevation bar during the LAUNCH Signature Event in Cleveland" },
      { src: "media/vex/ou-awards.jpg", caption: "Excellence Award and Robot Skills Champion trophies next to 1104D, Sudbury 2024" },
      { src: "media/vex/ou-run.webp", fullSrc: "media/vex/ou-run-portrait.webp", caption: "Full-field practice run: intaking across the field and popping both pneumatic wings to score", clip: true },
      { src: "media/vex/ou-push.webp", caption: "Rapid-firing triballs across the field during match-load testing", clip: true },
      { src: "media/vex/ou-teams.jpg", caption: "In the pits alongside our sister team, 1104X" },
      { src: "media/vex/ou-front.jpg", caption: "6-motor 450 rpm drivetrain and C-channel belly pan from underneath" },
      { src: "media/vex/ou-catapult-sketch.jpg", caption: "Catapult sketch from the engineering notebook" },
      { src: "media/vex/ou-pid-code.jpg", caption: "Turning PID from our autonomous code" },
    ],
  },
];

export const vexAwards = [
  "Excellence Award",
  "Tournament Champions",
  "Robot Skills Champion",
  "Innovate Award",
  "Tournament Semifinalists",
  "Judges Award ×2",
];

export const experience = [
  {
    id: "super",
    company: "Super.com",
    role: "Software Engineering Intern, Product (Full Stack)",
    period: "Jan – Apr 2027",
    place: "Remote",
    upcoming: true,
    summary: "Full-stack product work, starting January 2027.",
  },
  {
    id: "enginess",
    company: "Enginess",
    role: "Software Developer (Co-op)",
    period: "May – Aug 2026",
    place: "Toronto, ON",
    summary: "Built the end-to-end test suite for CarJiffy, a consumer car-buying platform.",
    points: [
      "Wrote CarJiffy's frontend E2E suite from scratch: **150 Playwright tests** across **42 modules**, covering the consumer site and its admin portal",
      "Covered the full purchase flow: trade-in, credit application, agreements, scheduling, add-ons and payment",
      "Wrote it in TypeScript with multi-user auth state, shared fixtures, teardown, and assertions against the MSSQL data layer. It runs against both QA and production",
      "The app uses passwordless OTP login, so I automated it in tests by reading the one-time codes straight from the database",
      "Built a Claude skill with MCP tooling that generates narrated client demo and training videos",
    ],
    stack: ["Playwright", "TypeScript", "React", "MSSQL", "Claude", "MCP"],
  },
  {
    id: "bell-2",
    company: "Bell Canada",
    role: "Software Developer (Co-op)",
    period: "Sep – Dec 2025",
    place: "Mississauga, ON",
    summary: "Built a callback and appointment-booking flow for customer service agents in ServiceNow.",
    points: [
      "Built a \"Book Appointment\" flow inside the agent workspace with UI Builder, custom modals and the Appointment Calendar component, showing live availability and suggesting the next open slot. Cut scheduling steps by about **43%**",
      "Connected the Omnichannel Callback API and Appointment Booking API over internal REST, so one flow creates the callback, books the appointment, and keeps both records linked",
      "Fixed REST payload and timezone issues by normalizing bookable slots to UTC across regions, cutting timezone display bugs by about **61%**",
      "Set up Advanced Work Assignment channels, queues and skill-based routing for callback work",
      "Wrote the business rules and scheduled jobs that retry, expire and close abandoned callbacks",
      "Did a gap analysis of ServiceNow's built-in callback features and documented what they couldn't do for two-way scheduling",
    ],
    stack: ["ServiceNow", "UI Builder", "JavaScript", "REST"],
  },
  {
    id: "bell-1",
    company: "Bell Canada",
    role: "Software Developer (Co-op)",
    period: "Jan – Apr 2025",
    place: "Mississauga, ON",
    summary: "Test automation and telemetry validation on two internal services.",
    points: [
      "Learned Robot Framework on the job and wrote **50+ automated API tests** across two services",
      "Validated telemetry ingestion from Azure Event Hub into Azure Data Explorer with Python",
      "Designed a new ADX table in KQL, making the team's queries about **24%** faster",
      "Automated page-load checks with Puppeteer and built a proof of concept for automated PDF generation",
      "Reproduced and documented defects for the dev team",
    ],
    stack: ["Robot Framework", "Python", "Azure Data Explorer", "KQL", "Puppeteer"],
  },
  {
    id: "cgi",
    company: "CGI",
    role: "Store Support (Summer job)",
    period: "Jul – Aug 2024",
    place: "Mississauga, ON",
    note: "Before university",
    summary: "IT support for CGI's Bell store team.",
    points: [
      "Imaged client systems, kept the main inventory database up to date, and processed device returns",
      "Helped the team deploy about 300 back-office machines to Bell stores over a 10-week rollout",
    ],
  },
];

export const highlights = [
  {
    href: "#/projects/software/issue-tracker",
    kind: "Software project",
    title: "Issue Tracker",
    text: "Full-stack app with role-based permissions enforced in the API, covered by pytest and Playwright tests.",
    image: "media/issue-dashboard.png",
  },
  {
    href: "#/projects/robotics/pid-sim-bot",
    kind: "Robotics project",
    title: "PID-Sim-Bot",
    text: "A ROS2 robot in Gazebo with my own C++ PID wheel controller instead of the stock diff-drive plugin.",
    visual: "pid",
  },
  {
    href: "#/experience/enginess",
    kind: "Co-op at Enginess",
    title: "150-test E2E suite",
    text: "Playwright coverage for 42 modules of a car-buying platform, run against QA and production.",
    visual: "tests",
  },
];

export const skills = [
  { group: "Languages", items: ["Python", "C++", "TypeScript", "JavaScript", "SQL", "KQL"] },
  { group: "Web & testing", items: ["React", "Node", "FastAPI", "Playwright", "pytest", "Robot Framework"] },
  { group: "Robotics", items: ["ROS 2", "Gazebo", "Arduino", "Raspberry Pi", "OpenCV", "SOLIDWORKS"] },
  { group: "Infra", items: ["Git", "Docker", "GitHub Actions", "GitLab CI", "Azure", "MongoDB", "MSSQL"] },
];
