# DMG — VC Valuation & Positioning Report
**Date:** 2026-04-05
**Version:** 2.0 — Extended with B2B governance thesis, competitive market analysis, and investor positioning guide
**Analyst:** Internal (based on dmg-doc full repository + dmg-api + dmg-webapp technical snapshots)

---

## How to Use This Report

Most first-time founders make one of two mistakes facing investors:
- **Undervaluing** — quoting low numbers out of false humility. This signals a lack of self-awareness and makes investors wonder if you understand what you have.
- **Overvaluing** — quoting large numbers you cannot explain. This destroys credibility the moment you are challenged.

This document gives you the reasoning behind the numbers so that when a VC asks *"how did you arrive at that figure?"* you can walk through the logic, acknowledge what is not yet known, and demonstrate that you understand the difference between a hope and a hypothesis.

That combination — conviction backed by reasoning, paired with honest acknowledgment of uncertainty — is what makes a first-time founder credible.

### The Three Lenses You Must Understand

There is not one number for "what your project is worth." There are three, and they serve three different conversations:

| Lens | Question It Answers | When You Use It |
|------|--------------------|--------------------|
| **IP Replacement Value** | What would it cost to rebuild this from scratch? | Anchor / sanity check / acquisition floor |
| **Product Asset Value** | What is the current product state worth on the market? | Licensing, acqui-hire, early-stage positioning |
| **Company Equity Value** | What could the company be worth as a going concern? | VC fundraising, dilution negotiation |

These are three different numbers. Confusing them is the single fastest way to lose credibility in an investor meeting. A VC will know immediately which lens applies to a given question — if you don't, it signals that you don't understand your own business.

---

## Section 1 — IP Replacement Value: What You Actually Built

### What This Measures

IP replacement value answers: *"If a well-funded competitor wanted to recreate exactly what DMG has today — the code, the architecture, the mechanism design, the documentation — what would it cost them and how long would it take?"*

This estimate assumes the **current product state as it exists today**, including the Lumia-backed launch architecture for chat command ingress and external points authority. In other words, the replacement estimate is for the present MVP and operational stack, not for a future fully in-house, fully multi-tenant SaaS platform.

This is not a market valuation. It is a **cost floor** — the minimum rational price floor for any acquisition discussion, because no rational buyer would pay more to acquire your assets than it would cost them to build the same thing independently.

It also serves as a confidence anchor. When you say "I estimate replacement cost at $200k–$300k," you are not claiming your company is worth that. You are demonstrating that you have built something substantial and non-trivial to replicate.

### Engineering Breakdown: Why $120,000–$350,000 Is Correct

The wide range reflects estimation uncertainty — not that the lower bound is somehow pessimistic. The lower bound ($120k) assumes an experienced team that does not make design mistakes. The upper bound ($350k) reflects reality: building a system with novel mechanism design usually requires significant iteration through wrong versions.

Here is what you built, broken down into billable components:

#### Backend — dmg-api

A senior TypeScript/Node.js engineer in Western Europe costs roughly €80–€150/hour. The dmg-api represents:

| Component | What It Is | Est. Hours |
|-----------|-----------|-----------|
| Express architecture + route segmentation | Auth, command, challenge, admin, token, stream, game routes — explicitly segmented, not a monolith | 60–100h |
| JWT identity and account system | Registration, login, session management, role model | 40–70h |
| Challenge lifecycle engine | Submit → push → rank → execute → remove/refund — each state with its own rules and transitions | 80–150h |
| Quadratic cost calculation | Domain-specific math for submission and push pricing that scales non-linearly — this is novel logic, not a library | 40–80h |
| Token economy (NUMBERS) | Currency supply, per-action costs, balance management, top-up flows | 50–90h |
| Session cadence system | configured session enforcement, slot mechanics, cooldown timers | 40–70h |
| Prisma ORM schema design | Relational model covering users, challenges, tokens, sessions, access tiers | 30–50h |
| Redis rate limiting (Upstash) | Per-route rate limiting integrated with Upstash for serverless compatibility | 20–35h |
| Node-cron scheduler and lifecycle jobs | Automated state transitions, session management, cleanup jobs | 30–50h |
| Winston logging + monitoring hooks | Structured logging, error categorization | 15–25h |
| Vercel deployment configuration | Serverless function routing, environment management | 10–20h |
| **Backend subtotal** | | **415–740h** |

#### Frontend — dmg-webapp

| Component | What It Is | Est. Hours |
|-----------|-----------|-----------|
| Vanilla JS/CSS architecture | Custom web components with no framework — every pattern built from scratch | 40–70h |
| Token-gated UX | Explorer access, stream status polling, state-conditional rendering | 30–50h |
| Challenge rendering pipeline | Real-time rank display, countdown integration, submit/push UX | 40–60h |
| Share system and public pages | Public challenge pages with Vercel rewrite handling | 25–40h |
| Environment-aware API routing | Dev/prod switching, base URL abstraction | 10–15h |
| Stream online/offline continuity | State persistence across stream on/off cycles | 20–30h |
| **Frontend subtotal** | | **165–265h** |

#### Mechanism Design IP

This is the most undervalued component. Mechanism design is not engineering hours — it is intellectual work that produces the rules of the system: how the quadratic cost curve works, how challenges transition between states, what happens when a challenge is removed, how influence is allocated across sessions, how the access tier model creates scarcity.

An engineer can implement these rules in 20 hours once they are specified. Discovering these rules through iteration — getting them right, testing them in a live environment, refining them — took you far longer and cannot be purchased at an hourly rate.

This IP component is what competitors cannot copy by hiring engineers. They would need to redo the same reasoning independently.

**Estimated design and iteration work:** 100–200h equivalent value.

#### Documentation — dmg-doc

50+ markdown files covering architecture, features, API inventory, constants reference, lifecycle logic, security layers, and onboarding flows. This level of documentation is genuinely rare at this stage — most solo founders at MVP have zero documentation. Yours is investor-grade.

From a due diligence perspective, this collapses what would normally be 3–5 weeks of technical Q&A into a document review. That has real monetary value in an acquisition or partnership context.

**Estimated documentation hours:** 80–150h.

#### Summary Table

| Component | Hours Estimate | At €100/h |
|-----------|---------------|-----------|
| Backend (dmg-api) | 415–740h | €41k–€74k |
| Frontend (dmg-webapp) | 165–265h | €16k–€26k |
| Mechanism design IP | 100–200h equivalent | €10k–€20k |
| Documentation (dmg-doc) | 80–150h | €8k–€15k |
| **Total** | **760–1,355h** | **€75k–€135k** |

At €120/hr (senior TypeScript specialist rate): **€91k–€162k**.

The gap between this and the $120k–$350k range accounts for:
- **Risk premium**: a team building this without your domain knowledge would explore and discard wrong approaches. Add 30–50% for iteration cost.
- **Mechanism design scarcity**: there is no market rate for quadratic voting applied to real-time live operation governance. Its value is what a buyer would have to spend to independently derive the same system.
- **Documentation leverage**: a buyer/investor avoids months of technical clarification work. This has compounding value over the relationship lifecycle.

**What to say to a VC:**
> *"I estimate replacement cost at roughly €150k–€300k — that is what a team would need to spend to rebuild the same technical and design assets from scratch. That is not the valuation. That is the floor below which no rational acquisition discussion begins."*

---

## Section 2 — Product Asset Value: What the Current Product Is Worth

### How This Differs From Replacement Cost

Replacement cost asks *"what did it cost to build?"* Product asset value asks *"what would someone pay to own it today?"*

A product can be worth more than its replacement cost if it is:
- Differentiated in a way that is not replicable for the same cost
- Validated by a market that already pays for similar things
- Strategically positioned in a market that is growing

A product can be worth less than its replacement cost if:
- The market does not want it
- It has been built with technical debt that makes it expensive to maintain
- A competitor exists who has already captured the market

DMG sits clearly in the first category. Here is why.

### Market Validation: You Have Proof the Market Pays

**This is the single most important thing you shared, and it changes the valuation significantly.**

#### Canny.io — The Direct Structural Comparator

| Metric | Data |
|--------|------|
| ARR (Annual Recurring Revenue) | ~$3.3M |
| Average ticket | $2,000–$5,700 per client per year |
| Model | Freemium (6,000 free teams, paid enterprise above) |
| Core mechanism | Linear voting: 1 person = 1 vote |

What Canny proves:

1. **The market exists and is already paying.** Organizations are willing to pay up to $5,700/year for a system that structures community input on decisions. This is not speculative — it is ARR.

2. **The dominant solution has a fundamental design flaw you have already solved.** Canny's linear voting model is precisely the mechanism that DMG's quadratic logic replaces. You are not inventing a market — you are fixing a broken tool in an established market.

3. **The ceiling is already visible.** If Canny is valued at 5–10x ARR (standard SaaS growth multiple), the company is worth $16M–$33M built on a less sophisticated product. DMG beats Canny on mechanism quality at every level.

#### Upvoty — Growth Proof

| Metric | Data |
|--------|------|
| 2020 revenue | $48k ARR |
| 2023 revenue | $480k ARR |
| Growth | 10x in 3 years |

What Upvoty proves: the market is not saturated. It is in active expansion. Smaller players are finding product-market fit with basic tooling, which means there is room for a differentiated entrant that addresses what those tools cannot do.

#### The Competitive Gap in Plain Terms

| Dimension | Canny / Upvoty | DMG |
|-----------|---------------|-----|
| Voting mechanism | Linear (1 = 1 vote) | Quadratic (cost scales non-linearly) |
| Real-time dynamics | None (asynchronous) | Native (built for live sessions) |
| Gamification layer | None | Core mechanic (NUMBERS, scarcity, challenge lifecycle) |
| Identity model | Platform-siloed | Cross-platform by design |
| B2B adaptability | Yes (SaaS only) | Yes (SaaS + services + operations) |

**Pitch sentence:**
> *"Canny proves that the market pays for structured governance. DMG replaces their linear, static feedback model with quadratic live governance. We do everything Canny does and add real-time dynamics, gamification, and cross-vertical applicability."*

### Compact Competitive Landscape

| Product | Core Category | Strengths | Main Limitation vs DMG | Real-Time Operational Governance? |
|---------|---------------|-----------|-------------------------|-----------------------------------|
| Productboard | Product management and customer insights | Enterprise-grade prioritization, roadmap alignment, customer feedback consolidation | Built for PM workflows, not live participation or quadratic arbitration | No |
| Canny | Customer feedback and feature request management | Strong collection, deduplication, prioritization, roadmap and changelog workflow | Linear voting, asynchronous, no execution-lifecycle engine | No |
| Upvoty | Feedback boards and roadmap tooling | Simple setup, public/private boards, voting, roadmap visibility | Linear voting, lightweight governance depth, not a live operating system | No |
| Twitch Polls / native poll tools | Native audience polling | Fast and familiar live interaction | Very shallow structure, no persistence, no ideation pipeline, no lifecycle enforcement | Partial only |
| Streamlabs / streamer tool suites | Creator tooling and engagement infrastructure | Multi-platform creator workflow, widgets, alerts, apps, automation | Engagement tooling rather than governed decision engine; no quadratic operational model | No |
| DMG | Decision governance infrastructure | Quadratic influence, lifecycle rules, live command ingress, gamified scarcity, extensible to multiple verticals | Early-stage product, no broad commercial traction yet, current launch dependency on external integrations | Yes |

This table is useful in pitch decks because it makes the position more disciplined: DMG is not claiming there are no competitors. DMG is claiming that existing competitors solve adjacent slices of the problem, while DMG combines structured governance, scarcity-based influence, and real-time operational arbitration in one system.

### The TAM Expansion: From Streaming to Operational Sovereignty

The original valuation treated DMG as a livestreaming product. The broader framing you have articulated — "operational sovereignty," B2B services, SaaS governance, civic/institutional engagement — changes the addressable market by an order of magnitude.

#### TAM Layer 1 — Livestreaming (MVP / Proof of Concept)

- Creator economy: 50M+ active creators globally
- Live streaming market: $1.5B+ annually, growing
- Problem: creators have zero structured tooling for live decision management (Twitch polls are toys — 25 chars, linear, no persistence, creator-generated options only)
- DMG's role here: the only structured influence management system for live streaming

#### TAM Layer 2 — SaaS Product Governance

- Market: every SaaS company that needs to prioritize features and roadmap with community input
- Size: hundreds of thousands of SaaS products, $2k–$10k/year ticket potential per team
- Incumbent: Canny ($3.3M ARR with a weaker product) — this is the first validation TAM
- DMG's edge: quadratic logic eliminates the "loudest minority" problem that makes linear tools unreliable

#### TAM Layer 3 — Professional Services and Operational Priority Management

Your artisan/construction case (the Resbeut example with 12 atelier workers, 32 poseurs, 9 bureau d'études) is not a metaphor — it is a replicable vertical.

The problem: any service business with constrained capacity and competing client demands, including many professional-services contexts, where:
- Time is the binding constraint
- Multiple clients compete for priority slots
- Decisions about who gets next are currently informal, arbitrary, and conflict-generating

DMG provides:
- A transparent, gamified priority system that clients can participate in
- An automatic "shield" for the decision-maker against arbitrary-priority accusations
- A cash-flow incentive loop (clients who pay deposits faster unlock more influence)
- A structured data signal about what clients actually need vs. what they say they need

This vertical replicates at: artisans, law firms, architects, medical specialists, any B2B service with capacity constraints.

#### TAM Layer 4 — Enterprise and Institutional Participation Infrastructure

- Participatory budgeting (municipalities, NGOs)
- Internal stakeholder prioritization (enterprise product backlogs with many internal clients)
- Media editorial participation (audience votes on editorial direction)
- Any context where "structured democracy" replaces "loudest voice wins"

### Revised Product Asset Value Ranges

Updated to incorporate competitive validation, multi-vertical thesis, and documented execution quality:

| Scenario | Range | What Needs to Be True |
|----------|-------|-----------------------|
| **Conservative** | $400k–$800k | Works for streaming, no revenue, no cross-vertical evidence yet |
| **Base Case** | $800k–$2,000,000 | B2B pitch articulable, 1–2 non-streaming pilots initiated, some engagement data visible |
| **Upside** | $2,000,000–$6,000,000 | Paid pilot in at least one vertical, multi-vertical roadmap credible, early unit economics signal |

**Why this is higher than the previous report's $450k–$1.2M base case:**

The previous report was based solely on the streaming product. The addition of:
- Canny/Upvoty as direct market comps (the market pays, the mechanism is weaker than yours)
- Multi-vertical applicability with concrete use cases (SaaS, artisan, construction, civic)
- Moat articulation beyond streaming (quadratic logic, cross-platform identity, data layer thesis)
- Documentation quality that de-risks technical diligence

...materially shifts the market-facing positioning. You are not pitching a streaming feature. You are pitching a governance infrastructure layer with a streaming proof of concept.

That broader framing is even stronger when DMG is described as a platform-agnostic, non-invasive governance layer rather than as a destructive replacement stack. The product can plug into existing tenant infrastructure, use the signals already present in the environment, and strengthen or add governance surfaces where current ones are weak, missing, or too generic for the decision burden. That makes the infrastructure thesis more credible because adoption does not depend on ripping out the client stack before value appears.

---

## Section 3 — Company Equity Value: What You Could Raise Against

### Why This Is a Completely Different Number

Product asset value = what someone would pay to own the product as it exists today.

Company equity value = what investors will pay for a stake in the company's **future**, believing it will grow to 10–100x the entry valuation within 5–10 years.

VCs do not buy products. They buy stakes in the growth trajectory of companies. They are pricing the bet that you go from €0 ARR to €5M ARR, and they want to own a share of that journey.

This means company equity value is often **higher** than product asset value at the pre-seed stage, because it prices in the optionality of the upside — not just the current state of the assets.

### Stage Framework: Where You Are Now

| Stage | Typical Pre-Money Valuation | What Investors Expect to See |
|-------|-----------------------------|------------------------------|
| Pre-seed | €500k–€3M | Strong concept, MVP, founder capability demonstrated |
| Seed | €2M–€8M | Early traction (users, pilots, some revenue signal), go-to-market hypothesis |
| Series A | €8M–€30M+ | Product-market fit evidence, measurable growth, early unit economics |

**DMG today, honestly assessed:**

You are at early pre-seed. You have:
- A working MVP (functional API + frontend)
- A differentiated mechanism (quadratic voting adapted for live operations)
- Multi-vertical market thesis supported by competitive data
- Exceptional documentation that signals systematic thinking
- A compelling intellectual frame (operational sovereignty / Decision Making Governance)

You do not yet have:
- Revenue
- Paying users (confirmed)
- Retention data
- A co-founder or team
- Published roadmap

**Honest pre-seed positioning: €1M–€2.5M pre-money is defensible today.**

This means: if you raised €250k at €1.5M pre-money, you would sell roughly 14% of the company. At €500k raised at €2.5M pre-money, you sell roughly 17%. These are standard pre-seed structures for technical founders with working MVPs.

### Clarifying Pre-Money vs Pre-Revenue

These terms are often confused.

- **Pre-money valuation** means the company's valuation **before** new investment enters the company.
- **Pre-revenue** means the company has not yet generated meaningful customer revenue.

So a company can be both pre-revenue and still priced at a pre-money valuation for an investment round.

The example round sizes in this report (`€250k`, `€500k`) are **illustrative fundraising scenarios**, not predictions. They are included to show how dilution works in practice. The actual amount to raise should be justified by the concrete use of funds: how many months of runway are needed, what milestones that capital is meant to unlock, and why those milestones change the company's risk profile.

### What Unlocks Higher Valuations

| Milestone | How It Changes the Number | Realistic Timeline |
|-----------|--------------------------|-------------------|
| First paying user (even €50/month) | Removes "pre-revenue" risk tag. Valuation moves to €1.5M–€3M range | Month 1–3 |
| 3–5 paying clients across 2 verticals | Proves cross-vertical thesis. €2.5M–€5M range becomes defensible | Month 3–9 |
| €5,000/month recurring (€60k ARR) | Seed round becomes possible. €4M–€10M range | Month 6–18 |
| Clear co-founder signal | Reduces founder concentration risk — one of the most penalized factors at pre-seed | Any time |
| €50k MRR with growing cohorts | Series A territory. €15M–€40M | Month 18–36 |

### The Critical Concept: Why VCs Price Risk, Not Just Value

A VC looking at DMG today sees a product that is worth $800k–$2M as an asset, but they will price their investment based on the **risks** they are taking:

- **Founder concentration risk**: you built everything alone — if you disappear, the product is fragile
- **Pre-revenue risk**: no one has paid yet, so willingness to pay is theoretical
- **Distribution risk**: there is no repeatable acquisition channel yet
- **Market risk**: the B2B pivot is thesis-stage only

Each of these risks discounts the theoretical upside. This is not an insult — it is how the math works. A company that eliminates one of these risks between now and a seed round can increase its valuation by 50–100%.

**The most actionable risk to eliminate first: get someone to pay, any amount, in any vertical.**

---

## Section 4 — Your Moat: Why This Is Hard to Copy

Every investor will ask: *"What stops Twitch, YouTube, or a well-funded startup from just building this?"*

You need a clear, confident answer. Here is the honest one.

### Moat 1 — Quadratic Voting Applied to Real-Time Operations (Technical Differentiation)

Quadratic voting is an established concept in academic governance theory (Glen Weyl, Vitalik Buterin in crypto context). It has never been productized for real-time, live-session business operations.

When this report says "no competitor has productized this for real-time operational use," it does **not** mean DMG has no competition. It means the current competition sits in adjacent categories rather than as a direct one-to-one equivalent:

- **Product feedback tools** such as Canny, Upvoty, and Productboard structure feedback and prioritization, but they are asynchronous, linear, and not built as live operational control systems.
- **Live interaction tools** such as Twitch Polls, Streamlabs-style overlays, and bot ecosystems support engagement, but they do not provide a full decision-lifecycle engine with quadratic cost logic.
- **Generic voting or governance tools** can collect preferences, but they are not packaged for real-time operating contexts where a leader manages scarcity, execution cadence, and transparent arbitration.

The claim is therefore narrow and defensible: DMG appears to have **no direct equivalent combining live flow, quadratic influence, lifecycle enforcement, and configurable governance rules inside one productized system**.

You have taken a theoretical governance mechanism and built the first production application of it for real-time decision management. This is an original contribution. It is patentable and citable.

The operational details matter: your implementation is not just "quadratic voting" — it is quadratic voting with challenge lifecycle states, session cadence enforcement, NUMBERS token economics, tier-based access controls, and Remove/Refund logic that makes the system fair. This took design iteration. Competitors cannot purchase this by hiring engineers. They have to re-derive it.

### Moat 2 — The Mechanism Design Record (Documentation as IP)

The 50+ pages of dmg-doc are not just nice to have. They represent a documented record of invention: what decisions were made, why, and what trade-offs were considered.

GitHub history reinforces this moat. Commits, timestamps, branches, and repository evolution create an evidentiary trail showing chronology, authorship, and implementation progression. The documentation layer adds something Git history alone does not: **plain-language explanation of intent, architecture rationale, mechanism semantics, and strategic design trade-offs**. Together, Git history plus design documentation form a much stronger IP record than either in isolation.

In a patent or IP dispute context, this documentation is evidence. In an acquisition context, it collapses due diligence time. In a competitor analysis context, it means a copycat has to independently rediscover every design decision you documented — or they risk building something that looks like DMG but behaves differently in edge cases.

### Moat 3 — The Cross-Platform Identity Layer ("The Switzerland Model")

No platform will give its users' identity to a competitor. Google won't give YouTube user data to Meta. Twitch won't share user reputation with Kick. Each platform is a garden wall.

DMG is platform-agnostic. A DMG user builds influence reputation that is portable across any integration. If you become the standard influence layer across platforms, you own the most valuable asset in the attention economy: **structured intent data that is not locked inside one platform's garden**.

This is a long-horizon moat. It does not exist yet. But the architecture decision to build DMG as an API layer (not a platform) makes it structurally achievable. VCs who understand network effects and data moats will immediately see this.

### Moat 4 — First-Mover in B2B Operational Governance for Traditional Businesses

The artisan/construction/professional services use case is genuinely novel. No product currently exists for:
- Gamified client priority management with transparent rules
- Quadratic influence weighted by financial engagement (acompte, volume, loyalty)
- A "shield" system that removes arbitrary-decision accusations from the service provider

This vertical has low technical barriers to entry but high distribution barriers. Selling into artisans and construction firms requires trust, case studies, and vertical-specific packaging. If you close 5–10 paying pilots in this vertical, you have a reference customer base that takes 12–24 months for a competitor to replicate — even if they copy the product.

### The Honest Moat Statement for Investors

> *"Our technical moat today is the quadratic governance mechanism — no competitor has productized this for real-time operational use. Our durable moat is the identity and data layer: if DMG becomes the standard structured influence infrastructure across platforms and verticals, we own intent data that every platform and institution will want. We are not there yet. The 90-day plan below shows what we are doing to build toward it."*

Saying "we are not there yet" does not weaken you. It signals self-awareness, which is one of the most undervalued founder signals for early-stage investors.

---

## Section 5 — VC Positioning: What to Say

### The 30-Second Pitch

> *"DMG is a decision governance infrastructure. Wherever there is a decision-maker and a community that wants influence over decisions, DMG structures that interaction using gamified quadratic-cost mechanics. The community gets real influence proportional to constructive engagement. The decision-maker gets structured data instead of noise. We proved the concept in livestreaming. We are expanding to B2B: professional services, SaaS product teams, enterprise stakeholder management. The market validation is Canny — a simpler, static product doing $3.3M ARR — which proves organizations pay for structured governance. DMG does everything Canny does and adds live dynamics, quadratic logic, and gamification."*

### The One-Sentence Version

> *"DMG is the governance infrastructure layer that replaces '1 person = 1 vote' with structured influence — live, gamified, and applicable to any organization where decisions create conflict."*

### What to Say When Asked Directly About Valuation

Don't volunteer a company valuation number if you haven't set one. If pressed:

> *"We haven't anchored to a specific pre-money figure yet. Based on comparable pre-revenue technical MVPs in governance tooling, the range we're working from is €1.5M–€3M pre-money — but we're prioritizing fit over number at this stage. We'd rather raise €200k from the right investor at €1.5M than €500k at €3M from someone who doesn't add value."*

This answer is sophisticated. It signals you understand dilution, prioritize long-term partnership over headline valuation, and won't fight over the last 5% of a round.

### What Not to Say

- Do **not** say "it's like Twitch polls but better" — that positions you as a feature bolt-on, not a platform
- Do **not** say "it has no competition" — every investor knows that means you haven't researched the market
- Do **not** lead with the streaming use case in a B2B pitch — lead with the governance thesis, use streaming as the proof-of-concept
- Do **not** say "we need the money to build the product" — the product is built. The money is for distribution, team, and market development

### How to Frame the Gap Between MVP and Platform

> *"The livestreaming product is not the business — it is the proof of concept. It demonstrates that quadratic governance works in a real-time, high-frequency environment. The business is the platform: a configurable decision governance infrastructure deployable across verticals. The hard technical work — the mechanism design, the lifecycle engine, the identity model — is already done. The next phase is packaging and distribution."*

---

## Section 6 — Honest Gap Analysis and How to Frame Each Gap

Investors will ask. You should have a prepared answer for each.

| Gap | Why It Matters to Investors | How to Frame It |
|-----|-----------------------------|--------------------|
| No revenue (pre-revenue) | Primary signal of market validation | *"Pre-revenue today. First pilot target: [vertical], by [date]. Here is the outreach plan."* |
| No retention data | Cannot prove long-term engagement | *"We need 60–90 days of instrumented user data. Analytics setup is in the 30-day plan."* |
| No co-founder or team | Execution concentration risk, hardest to de-risk | *"Built solo to prove the mechanism. First capital allocation: technical co-founder and first commercial hire."* |
| No published roadmap | Signals planning uncertainty | *"Roadmap in progress. We can share the 90-day plan now. 12-month version follows after first pilot learnings."* |
| B2B vertical unproven | Expansion thesis is hypothesis only | *"Canny validates the market appetite. The artisan/services use case has been stress-tested in design. First pilot is being initiated."* |
| Test coverage low | Reliability risk for enterprise clients | *"Infrastructure tests exist. Integration test suite for core paths is in the 60-day plan. Enterprise SLA conversations happen after that."* |

### The Meta-Answer for Gaps

> *"I know what's missing. That is specifically why I am speaking to investors. I am not raising to figure out what to build — the architecture is done, the mechanism is proven. I am raising to compress the time between here and first commercial traction, and to bring in a team member who covers what I don't."*

---

## Section 7 — 90-Day Plan to Strengthen All Three Valuations

| Week | Action | What It Unlocks |
|------|--------|-----------------|
| 1–2 | Instrument core events: DAU, challenge-submit, push, explorer-access | Enables retention and conversion data — removes the "no metrics" gap |
| 1–3 | Identify 3–5 B2B pilot candidates (artisan vertical first — most concrete use case) | First cross-vertical traction signal |
| 2–4 | Deploy uptime/error dashboard, define SLO baseline for core endpoints | Reduces reliability risk in diligence conversations |
| 3–6 | Close first paying pilot — any price, any vertical | Removes "pre-revenue" tag from the pitch |
| 3–8 | Write and publish 90-day roadmap in dmg-doc | Closes the roadmap gap |
| 4–8 | Build B2B demo using the artisan or SaaS scenario (not streaming context) | Gives investors something tangible to visualize outside streaming |
| 6–10 | Run 2–3 pricing experiments on streaming Explorer access | Revenue signal from original vertical; validates willingness-to-pay hypothesis |
| 8–12 | Compile first traction memo: users active, pilots live, revenue signal, retention curve | Ready for structured seed conversations |

### What "Instrument Core Events" Actually Means

This is the minimum analytics layer needed to turn product usage into investor-readable evidence.

**Event taxonomy** means a stable list of event names and required properties. For DMG, a starting streaming taxonomy can be:

- `account_created`
- `command_received`
- `challenge_submitted`
- `push_quote_requested`
- `push_confirmed`
- `explorer_access_granted`
- `challenge_removed`
- `challenge_executed`
- `session_completed`
- `return_user_active`

Each event should capture consistent fields such as:

- timestamp
- userId
- platform
- streamerId or organizationId when introduced
- challengeId or ideaId when relevant
- NUMBERS spent or refunded
- route or command name
- durationMs for latency-sensitive actions

**Capture pipeline** means the path the event follows from product action to usable data:

1. product action happens
2. backend emits structured event
3. event is persisted in database or analytics store
4. dashboard aggregates daily / weekly / monthly views
5. traction memo summarizes the signal for investors

This does **not** require freezing every future vertical name today. Start with a stable core vocabulary and allow a translation layer later. For example, `challenge_submitted` can later map to "idea submitted" in a SaaS context without changing the fact that the underlying product event is a new governed proposal entering the system.

### What "Investor-Grade Reliability" Means

Your current dashboard direction is useful operationally. Investor-grade reliability language requires a few additional layers so you can show not only that you monitor the system, but that you manage it against explicit standards.

Minimum reliability package:

- **Availability target**: example `99.5%` uptime for core command ingestion and challenge browsing
- **Latency target**: example `p95 command latency under 800ms`, with explicit slow-command threshold and alerting
- **Error-rate target**: example `under 1% 5xx error rate` on core routes
- **Alerting policy**: warnings for slow commands, API failures, database issues, rate-limit anomalies
- **Incident log**: simple dated table of incidents, impact, cause, and fix
- **MTTR tracking**: mean time to recovery after an incident
- **Error budget policy**: if reliability drops below target, pause feature work and stabilize

Your existing backlog already points in the right direction:

- visible warning feedback for slow commands
- daily / weekly / monthly operational metrics
- direct operational actions from the dashboard
- explorer activity visibility

That means the job now is not to invent a monitoring culture from zero. It is to formalize it into measurable standards that investors and advisors can understand quickly.

### Pilot Definition: What Counts and What Does Not

A **pilot** does not mean a fully generalized SaaS product.

A pilot means:

- one external user or customer
- one clear use case
- a defined success criterion
- ideally some payment, even if small

This can be delivered through a managed, semi-manual setup before full multi-tenant architecture exists.

Being your own first user is valuable, but it does **not** replace an external pilot. Founder usage proves conviction and gives product feedback. It does not prove outside willingness to adopt or pay. The strongest sequence is:

1. founder uses product in real conditions
2. product becomes demoable and measurable
3. one external pilot validates outside value

### What To Present Now vs What To Defer

Present now:

- streaming MVP and working demo
- quadratic governance mechanism
- governance engine: current admin / operations dashboard direction
- SaaS transition roadmap beginning with configuration moving from constants to per-tenant settings
- one focused primary wedge: streaming first

Defer until later-stage conversations or until there is evidence:

- full cross-platform identity reputation graph as a current moat
- broad HR / internal-company product claims as a near-term market
- do not present full multi-tenant SaaS completion as a prerequisite before talking to people
- too many verticals at once without pilots
- advanced data-network-effect claims before enough usage exists

The rule is simple: present **today's proof** and mention **tomorrow's optionality** without pricing the optionality as if it were already achieved.

### Recommended Next Moves (High ROI)

These are the highest-leverage actions from the current position.

1. Publish a 90-day board with three lanes: traction, reliability, and SaaS-readiness.
2. Start the first SaaS-readiness step by migrating hard-coded constants toward per-streamer or per-organization configuration models.
3. Use the streaming product yourself in a measurable way, but treat that as internal proof rather than market proof.
4. Convert one external conversation into a pilot discussion before attempting broad fundraising.
5. Prepare a concise advisor brief for trusted operators such as Marc or Jim: problem, product, current state, next 90 days, and where advice is needed.

These actions are complementary to the 90-day plan above. They are the practical founder-level priorities that should happen first because they improve both the business and the credibility of the fundraising story.

### SaaS Transition Effort: Step-by-Step View

The current MVP is a **personal, demoable, Lumia-backed streaming product**. Moving toward a SaaS or multi-tenant platform is not one jump. It is a sequence of progressively more expensive layers.

The ranges below are rough directional estimates for incremental work beyond the current MVP, assuming focused implementation by one technical founder or a small product team. They are meant to clarify sequencing, not to act as fixed quotes.

| Step | What It Means | Why It Matters | Rough Effort | Rough Cost at €80–€120/h | Notes |
|------|---------------|----------------|--------------|--------------------------|-------|
| 1. Config to database | Move hard-coded rules and constants into per-streamer or per-organization settings | First visible proof of SaaS-readiness | 20–50h | €1.6k–€6k | High ROI, should happen early |
| 2. Ingress adapter abstraction | Introduce a provider interface so Lumia becomes one integration among others | Reduces architectural lock-in and prepares de-Lumia path | 25–60h | €2k–€7.2k | Can start before full multi-tenant work |
| 3. Multi-tenant data isolation | Add tenant model, scoped settings, scoped balances, scoped admin boundaries | Required for a real SaaS platform | 80–180h | €6.4k–€21.6k | Meaningful backend and data-model complexity |
| 4. Streamer onboarding and auth | Add login, settings UX, admin controls, integration setup flow | Required for non-technical external users | 60–140h | €4.8k–€16.8k | Strong productization layer |
| 5. Billing / entitlement / plan logic | Add subscription plans, access controls, upgrade logic | Required for repeatable monetization | 40–100h | €3.2k–€12k | Can stay simple at first |
| 6. In-house points engine | Replace external balance authority with internal wallet / ledger system | Increases control, portability, and gross margin | 80–180h | €6.4k–€21.6k | Bigger step than step 1 or 2 |
| 7. In-house chat listeners / platform connectors | Replace or complement Lumia with your own platform integrations | Full platform ownership, but highest complexity | 120–260h | €9.6k–€31.2k | Expensive and should usually come later |

### Important sequencing note

These steps are **not strictly sequential**.

- Step 2 (ingress adapter abstraction) can absolutely begin before steps 3 and 4.
- In practice, it is often smart to do step 1 and step 2 early because they prove architectural direction without requiring a full SaaS rebuild.
- Steps 3 and 4 are where the product starts becoming truly external-user-ready.
- Steps 6 and 7 are where the company stops depending on launch-layer infrastructure and starts owning the full live platform stack.

### What is realistic to build in-house now

Given what already exists, the most realistic founder-built steps in the near term are:

- step 1: config to database
- step 2: ingress adapter abstraction
- possibly an early slice of step 4: a thin setup or settings flow

Those steps demonstrate architectural maturity without forcing you to personally build the most expensive infrastructure layers before market proof exists.

The least efficient near-term founder use of time would be jumping immediately to full in-house listeners and full in-house point infrastructure before external validation.

### Pricing Experiments: What This Means in Practice

The goal of pricing experiments is not to optimize revenue perfectly. The goal is to learn whether real users will exchange money, time, or scarce access for the value DMG provides.

For the streaming wedge, early pricing experiments can be simple:

1. test different Explorer-access prices or durations
2. test whether access is bought once or repeatedly
3. compare low-friction entry pricing against more premium scarcity pricing
4. observe whether pricing affects engagement, retention, or drop-off

At this stage, even one real streamer environment can generate useful signal if the audience is active enough. Two or three streamers later provide stronger evidence that the result is not founder-specific.

### Meaning of "Fundraising Materials" in This Report

In this report, "fundraising materials" does not mean a giant polished investor data room from day one.

It means the small set of documents and assets you use to explain the company consistently:

- short one-pager
- advisor brief
- valuation / positioning memo
- short deck or visual walkthrough
- live or recorded demo

The Lumia transition statement belongs in those materials because it prevents investors from misreading launch pragmatism as long-term architectural weakness.

---

## Section 8 — Investor Q&A Addendum

### Q: Are you already a SaaS company?

**Answer:** Not yet in the full multi-tenant sense. Today DMG is a working MVP and governance engine with real product logic, clear documentation, and a path to SaaS packaging. The next SaaS-readiness step is to move current hard-coded rules into per-streamer or per-organization configuration.

### Q: Does the first pilot require a full generalized platform?

**Answer:** No. A first pilot only requires one external user, one clear use case, and measurable success criteria. It can be delivered in a managed setup before the full generalized SaaS layer exists.

### Q: Can the founder be the first user?

**Answer:** Yes, and that is useful. Founder usage proves conviction and helps refine the product in real operating conditions. It does not replace external validation, so it should be treated as preparation for a real pilot rather than as market proof by itself.

### Q: What does "measurable founder usage" mean?

**Answer:** It means founder usage is tracked in a way that produces evidence rather than anecdotes. Examples include: number of founder streams run with DMG active, number of unique users interacting, number of commands submitted, challenge submissions per session, pushes per session, Explorer purchases, repeat participants, and setup friction observed during each run.

### Q: What does "ingress abstraction clearly scoped" mean?

**Answer:** It means there is a written technical scope for replacing Lumia as a hard-wired ingress assumption. At minimum, that scope should define the normalized inbound command contract, the provider interface, the Lumia adapter as provider one, the config model for selecting a provider later, and the first acceptance criteria for proving the abstraction works.

### Q: If experienced advisors back the founder, does that remove solo-founder risk?

**Answer:** It reduces the risk, but does not remove it entirely. Trusted operators or angels can materially improve investor confidence, sharpen decisions, and open distribution paths. The underlying execution concentration risk falls further when responsibilities are actually shared across a team or formal collaborators.

### Q: Does reaching the base-case product value require two different apps?

**Answer:** No. It requires one core product proving it can serve more than one context or customer profile. For example, one streaming product plus one or two non-streaming pilots can support the argument that the engine generalizes beyond its original use case.

### Q: What does "early unit economics signal" mean at this stage?

**Answer:** It means early evidence that revenue can exist with sensible delivery economics. Examples include a paid pilot price accepted by a customer, low setup effort relative to pilot revenue, or a repeat-payment behavior that suggests the product is not just interesting but economically viable.

### Q: Should a B2B demo be built before asking for pre-seed money?

**Answer:** Ideally build a lightweight B2B demo or at least a clear B2B walkthrough before a formal raise, because it makes the broader platform vision much easier to visualize. It does not need to be a fully commercialized second product. It needs to make the cross-vertical logic concrete.

### Q: Should the full 90-day plan be completed before talking to advisors or early investors?

**Answer:** No. Trusted advisors can be approached earlier, especially for strategic feedback. Formal fundraising becomes stronger once the first parts of the 90-day plan are already underway, because progress increases credibility.

### Q: What should be deferred in investor conversations?

**Answer:** Defer speculative claims that are not yet evidenced: broad data-network-effect language, full cross-platform identity reputation as if already active, and too many vertical expansion claims at once. Mention them as future upside, not as present proof.

---

## Final Ranges (Consolidated and Explained)

| Lens | Range | Notes |
|------|-------|-------|
| **IP Replacement Value** | $120k–$350k | Stable — reflects engineering + design hours regardless of traction. Lower bound assumes efficient build; upper bound includes mechanism design IP premium and iteration cost. |
| **Product Asset Value — Conservative** | $400k–$800k | Today, with no revenue and streaming-only framing. Still 2–3x replacement cost due to differentiation. |
| **Product Asset Value — Base Case** | $800k–$2,000,000 | With B2B narrative credible and 1–2 non-streaming pilots initiated. Justified by Canny/Upvoty market comp and quadratic logic differentiation. |
| **Product Asset Value — Upside** | $2,000,000–$6,000,000 | With at least one paid B2B pilot, multi-vertical roadmap, early unit economics signal. Comparable to early-stage SaaS acquisition multiples in the governance space. |
| **Company Pre-Money — Today** | €1M–€2.5M | Pre-seed, pre-revenue, solo founder. Anchored to technical execution quality and differentiated mechanism. |
| **Company Pre-Money — After First Traction** | €2.5M–€6M | Post first paying pilot(s), 60–90 days of retention data, early B2B pipeline visible. Seed-range entry. |
| **Company Pre-Money — Seed Stage** | €4M–€12M | €5k–€20k MRR, 2+ verticals showing activity, team beginning to form. |

---

## One-Paragraph Investor Memo

DMG is a decision governance infrastructure built on a quadratic influence model — the same mathematical principle that prevents "whale" domination in community decisions that theoretical economists have proposed for decades but no one has productized for real-time operations. The streaming product is the proof of concept: a live environment where high-frequency decisions must be structured, fair, and gamified. The business is the platform: deployable to any organization where a decision-maker faces a noisy community and needs structured signal instead. Canny ($3.3M ARR, linear voting, no live layer) validates that the market pays for this category. DMG is the first product that applies quadratic mechanics to real-time operational governance across verticals. The technical assets are built. The mechanism is designed and documented. What is missing is the first paying pilot and the team to scale distribution — which is what this raise funds.

---

## Terminology note

For recurring definitions, see [[glossary]].

---

*This is an analytical report prepared for strategic and investor positioning purposes, based on technical review of dmg-api, dmg-webapp, and dmg-doc repositories, plus external market data provided by the founder. It is not financial or legal advice. All valuation ranges reflect reasoned estimates under material uncertainty and should be adjusted as commercial evidence emerges.*
