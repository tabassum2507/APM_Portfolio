const menuButton = document.querySelector(".menu-button");
const siteNav = document.querySelector(".site-nav");
const toast = document.querySelector(".toast");
const filterButtons = document.querySelectorAll("[data-filter]");
const caseCards = document.querySelectorAll("[data-category]");
const revealItems = document.querySelectorAll(".reveal");
const scoreInputs = document.querySelectorAll("[data-score-input]");
const ideaTabs = document.querySelectorAll("[data-idea]");
const priorityScore = document.querySelector("[data-priority-score]");
const priorityMessage = document.querySelector("[data-priority-message]");
const priorityMeter = document.querySelector("[data-priority-meter]");
const roadmapCards = document.querySelectorAll("[data-roadmap-card]");
const aiGenerateButton = document.querySelector("[data-ai-generate]");
const aiProblem = document.querySelector("[data-ai-problem]");
const aiCapability = document.querySelector("[data-ai-capability]");
const aiValue = document.querySelector("[data-ai-value]");
const aiMetric = document.querySelector("[data-ai-metric]");
const aiConsoleLines = document.querySelectorAll(".console-line");

menuButton?.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

siteNav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    siteNav.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  }
});

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.getAttribute("data-copy") || "";

    try {
      await navigator.clipboard.writeText(value);
      toast?.classList.add("visible");
      window.setTimeout(() => toast?.classList.remove("visible"), 1800);
    } catch {
      window.location.href = `mailto:${value}`;
    }
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.getAttribute("data-filter");

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    caseCards.forEach((card) => {
      const matches = filter === "all" || card.getAttribute("data-category") === filter;
      card.classList.toggle("hidden", !matches);
    });
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const messages = [
  {
    min: 15,
    text: "Top priority: this is a strong bet for a focused sprint and quick launch plan."
  },
  {
    min: 9,
    text: "Strong candidate: validate with a small experiment, then roll out if the metric moves."
  },
  {
    min: 5,
    text: "Promising, but needs tighter evidence or a smaller version before it earns roadmap space."
  },
  {
    min: 0,
    text: "Backlog for now: reduce effort, sharpen the user problem, or collect more confidence."
  }
];

function updatePriorityStudio() {
  if (!scoreInputs.length || !priorityScore || !priorityMessage || !priorityMeter) {
    return;
  }

  const values = Object.fromEntries(
    Array.from(scoreInputs).map((input) => {
      const key = input.getAttribute("data-score-input");
      const value = Number(input.value);
      const output = document.querySelector(`[data-score-output="${key}"]`);
      if (output) {
        output.value = value;
        output.textContent = value;
      }
      return [key, value];
    })
  );

  const score = ((values.impact * values.confidence) / Math.max(values.effort, 1)).toFixed(1);
  const scoreNumber = Number(score);
  priorityScore.textContent = score;
  priorityMessage.textContent = messages.find((message) => scoreNumber >= message.min).text;
  priorityMeter.style.width = `${Math.min(100, Math.round(scoreNumber * 5))}%`;
}

scoreInputs.forEach((input) => {
  input.addEventListener("input", updatePriorityStudio);
});

ideaTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    ideaTabs.forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");

    scoreInputs.forEach((input) => {
      const key = input.getAttribute("data-score-input");
      const value = tab.getAttribute(`data-${key}`);
      if (value) {
        input.value = value;
      }
    });

    roadmapCards.forEach((card) => {
      card.classList.toggle(
        "current",
        card.getAttribute("data-roadmap-card") === tab.getAttribute("data-idea")
      );
    });

    updatePriorityStudio();
  });
});

updatePriorityStudio();

const aiIdeas = [
  {
    problem: "Users struggle to understand long support conversations.",
    capability: "Summarization plus sentiment detection",
    value: "Faster context, clearer next action, less manual reading.",
    metric: "Time to resolution"
  },
  {
    problem: "Teams miss patterns hidden across scattered customer feedback.",
    capability: "Topic clustering and insight extraction",
    value: "Product teams can spot recurring pain points before roadmap planning.",
    metric: "Insight-to-roadmap conversion"
  },
  {
    problem: "New users feel lost when a product has too many setup choices.",
    capability: "Personalized onboarding recommendations",
    value: "Users get the right first actions based on goal, role, and context.",
    metric: "Activation rate"
  },
  {
    problem: "Operations teams repeat low-risk decisions every day.",
    capability: "Workflow automation with human approval",
    value: "Routine work is faster while sensitive decisions stay reviewed.",
    metric: "Manual handling time"
  }
];

let aiIdeaIndex = 0;

function renderAiIdea(index) {
  const idea = aiIdeas[index % aiIdeas.length];
  if (!aiProblem || !aiCapability || !aiValue || !aiMetric) {
    return;
  }

  aiProblem.textContent = idea.problem;
  aiCapability.textContent = idea.capability;
  aiValue.textContent = idea.value;
  aiMetric.textContent = idea.metric;

  aiConsoleLines.forEach((line, lineIndex) => {
    line.classList.toggle("active", lineIndex === index % aiConsoleLines.length);
  });
}

aiGenerateButton?.addEventListener("click", () => {
  aiIdeaIndex += 1;
  renderAiIdea(aiIdeaIndex);
});
