// =============================================
// main.js - Frontend JavaScript
// AI Career Growth Advisor
// =============================================

// ---- Loading Messages ----
// These cycle through while AI is generating the career plan
const loadingMessages = [
  "Analyzing your skills and interests...",
  "Matching you to career paths...",
  "Building your personalized roadmap...",
  "Curating resources for your goals...",
  "Almost ready — finalizing your plan!",
];

let loadingInterval = null; // Store interval so we can clear it later

// =============================================
// MAIN FORM SUBMISSION HANDLER
// =============================================
document.getElementById("careerForm").addEventListener("submit", async function (e) {
  e.preventDefault(); // Prevent default form refresh

  // Collect all form values
  const formData = {
    name: document.getElementById("name").value.trim(),
    education: document.getElementById("education").value,
    skills: document.getElementById("skills").value.trim(),
    interests: document.getElementById("interests").value.trim(),
    goals: document.getElementById("goals").value.trim(),
    experience: document.getElementById("experience").value.trim(),
  };

  // Validate required fields
  if (!formData.name || !formData.skills || !formData.interests || !formData.goals) {
    showError("Please fill in all required fields marked with *");
    return;
  }

  // Show loading, hide form
  showLoading();
  startLoadingMessages();

  try {
    // ---- Call our backend API ----
    const response = await fetch("/api/career-advice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Tell server we're sending JSON
      },
      body: JSON.stringify(formData), // Convert JS object to JSON string
    });

    const data = await response.json();

    // Check if API returned an error
    if (!response.ok || !data.success) {
      throw new Error(data.error || "Failed to generate career plan. Please try again.");
    }

    // ---- Display the results ----
    displayResults(formData.name, data.careerPlan);
  } catch (error) {
    console.error("Error:", error);
    showError(error.message);
    showForm(); // Go back to form on error
  } finally {
    stopLoadingMessages();
  }
});

// =============================================
// DISPLAY RESULTS FUNCTION
// Renders all the career plan data into the HTML
// =============================================
function displayResults(name, plan) {
  // ---- Results Header ----
  document.getElementById("resultTitle").textContent = `${name}'s Career Growth Plan`;
  document.getElementById("resultSummary").textContent = plan.summary;

  // ---- Career Paths ----
  const careerGrid = document.getElementById("careerPathsGrid");
  careerGrid.innerHTML = ""; // Clear previous content

  // Loop through each career path and create a card
  (plan.careerPaths || []).forEach((path) => {
    const matchClass = `match-${path.match.toLowerCase()}`;
    const companies = path.topCompanies
      .map((c) => `<span class="company-tag">${c}</span>`)
      .join("");

    // Create HTML for each career path card
    const card = `
      <div class="career-path-item">
        <div class="path-title">${path.title}</div>
        <span class="path-match ${matchClass}">${path.match} Match</span>
        <div class="path-description">${path.description}</div>
        <div class="path-salary">💰 ${path.avgSalary}</div>
        <div class="path-companies">${companies}</div>
      </div>
    `;
    careerGrid.innerHTML += card;
  });

  // ---- Skills to Learn ----
  const skillsList = document.getElementById("skillsList");
  skillsList.innerHTML = "";

  (plan.skillsToLearn || []).forEach((skill) => {
    const priorityClass = `priority-${skill.priority.toLowerCase()}`;

    const item = `
      <div class="skill-item ${priorityClass}">
        <div class="skill-priority-dot"></div>
        <div>
          <div class="skill-name">${skill.skill}</div>
          <div class="skill-reason">${skill.reason}</div>
          <div class="skill-resource">${skill.freeResource}</div>
        </div>
        <span class="skill-badge">${skill.priority}</span>
      </div>
    `;
    skillsList.innerHTML += item;
  });

  // ---- Roadmap Timeline ----
  const timeline = document.getElementById("roadmapTimeline");
  timeline.innerHTML = "";

  // Define stage labels and their data keys
  const stages = [
    { key: "beginner", label: "BEGINNER" },
    { key: "intermediate", label: "INTERMEDIATE" },
    { key: "advanced", label: "ADVANCED" },
  ];

  stages.forEach((stage) => {
    const data = (plan.roadmap || {})[stage.key];
    if (!data) return; // Skip if data missing

    // Create list items for each goal
    const goalsList = (data.goals || [])
      .map((g) => `<li>${g}</li>`)
      .join("");

    const stageHtml = `
      <div class="roadmap-stage">
        <div class="stage-level">${stage.label}</div>
        <div class="stage-duration">⏱ ${data.duration}</div>
        <ul class="stage-goals">${goalsList}</ul>
        <div class="stage-project">${data.project}</div>
      </div>
    `;
    timeline.innerHTML += stageHtml;
  });

  // ---- Internship Tips ----
  const tipsList = document.getElementById("tipsList");
  tipsList.innerHTML = "";

  (plan.internshipTips || []).forEach((tip) => {
    tipsList.innerHTML += `<li>${tip}</li>`;
  });

  // ---- Motivational Quote ----
  document.getElementById("quoteText").textContent = plan.motivationalQuote;

  // ---- Show results, hide loading ----
  hideLoading();
  document.getElementById("resultsSection").style.display = "block";

  // Scroll smoothly to results
  document.getElementById("resultsSection").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

// =============================================
// PDF DOWNLOAD FUNCTION
// Uses jsPDF library to create a downloadable PDF
// =============================================
document.getElementById("downloadPdfBtn").addEventListener("click", function () {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Get the person's name for the filename
  const name = document.getElementById("resultTitle").textContent.replace("'s Career Growth Plan", "");
  const summary = document.getElementById("resultSummary").textContent;

  // ---- PDF Styling ----
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20; // Track vertical position

  // Helper function to add text with word wrap
  function addText(text, x, yPos, options = {}) {
    const { fontSize = 11, color = [200, 200, 220], bold = false, maxWidth = contentWidth } = options;
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);
    if (bold) doc.setFont("helvetica", "bold");
    else doc.setFont("helvetica", "normal");

    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, yPos);
    return lines.length * (fontSize * 0.4 + 2); // Return height used
  }

  // Helper to check if we need a new page
  function checkNewPage(spaceNeeded = 20) {
    if (y + spaceNeeded > 270) {
      doc.addPage();
      y = 20;
    }
  }

  // ---- Header ----
  doc.setFillColor(10, 10, 20);
  doc.rect(0, 0, pageWidth, 45, "F");
  doc.setFontSize(22);
  doc.setTextColor(245, 166, 35);
  doc.setFont("helvetica", "bold");
  doc.text("AI Career Growth Plan", margin, 22);
  doc.setFontSize(11);
  doc.setTextColor(150, 150, 180);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated for: ${name}  |  Date: ${new Date().toLocaleDateString()}`, margin, 34);
  y = 58;

  // ---- Summary ----
  doc.setFontSize(14);
  doc.setTextColor(245, 166, 35);
  doc.setFont("helvetica", "bold");
  doc.text("Summary", margin, y);
  y += 8;
  const summaryHeight = addText(summary, margin, y, { color: [180, 180, 200] });
  y += summaryHeight + 12;

  // ---- Career Paths ----
  checkNewPage(30);
  doc.setFontSize(14);
  doc.setTextColor(245, 166, 35);
  doc.setFont("helvetica", "bold");
  doc.text("Recommended Career Paths", margin, y);
  y += 8;

  // Read career path items from the DOM
  const pathItems = document.querySelectorAll(".career-path-item");
  pathItems.forEach((item, index) => {
    checkNewPage(40);
    const title = item.querySelector(".path-title")?.textContent || "";
    const match = item.querySelector(".path-match")?.textContent || "";
    const desc = item.querySelector(".path-description")?.textContent || "";
    const salary = item.querySelector(".path-salary")?.textContent || "";

    doc.setFontSize(11);
    doc.setTextColor(220, 220, 240);
    doc.setFont("helvetica", "bold");
    doc.text(`${index + 1}. ${title} (${match})`, margin, y);
    y += 6;
    const dh = addText(desc, margin + 5, y, { color: [160, 160, 185] });
    y += dh + 2;
    addText(salary, margin + 5, y, { color: [100, 200, 120], fontSize: 10 });
    y += 10;
  });

  // ---- Skills to Learn ----
  checkNewPage(30);
  y += 4;
  doc.setFontSize(14);
  doc.setTextColor(245, 166, 35);
  doc.setFont("helvetica", "bold");
  doc.text("Skills to Learn", margin, y);
  y += 8;

  const skillItems = document.querySelectorAll(".skill-item");
  skillItems.forEach((item) => {
    checkNewPage(25);
    const skillName = item.querySelector(".skill-name")?.textContent || "";
    const reason = item.querySelector(".skill-reason")?.textContent || "";
    const resource = item.querySelector(".skill-resource")?.textContent || "";

    doc.setFontSize(11);
    doc.setTextColor(220, 220, 240);
    doc.setFont("helvetica", "bold");
    doc.text(`• ${skillName}`, margin, y);
    y += 6;
    const rh = addText(reason, margin + 5, y, { color: [160, 160, 185], fontSize: 10 });
    y += rh + 2;
    addText(resource, margin + 5, y, { color: [245, 166, 35], fontSize: 9 });
    y += 10;
  });

  // ---- Roadmap ----
  checkNewPage(30);
  y += 4;
  doc.setFontSize(14);
  doc.setTextColor(245, 166, 35);
  doc.setFont("helvetica", "bold");
  doc.text("Learning Roadmap", margin, y);
  y += 8;

  const roadmapStages = document.querySelectorAll(".roadmap-stage");
  roadmapStages.forEach((stage) => {
    checkNewPage(40);
    const level = stage.querySelector(".stage-level")?.textContent || "";
    const duration = stage.querySelector(".stage-duration")?.textContent || "";
    const goals = [...stage.querySelectorAll(".stage-goals li")].map((li) => li.textContent);
    const project = stage.querySelector(".stage-project")?.textContent || "";

    doc.setFontSize(12);
    doc.setTextColor(245, 166, 35);
    doc.setFont("helvetica", "bold");
    doc.text(`${level} — ${duration}`, margin, y);
    y += 7;

    goals.forEach((goal) => {
      checkNewPage(10);
      const gh = addText(`▸ ${goal}`, margin + 5, y, { color: [160, 160, 185], fontSize: 10 });
      y += gh + 3;
    });

    checkNewPage(12);
    const ph = addText(`Project: ${project}`, margin + 5, y, { color: [245, 166, 35], fontSize: 10 });
    y += ph + 10;
  });

  // ---- Tips ----
  checkNewPage(30);
  doc.setFontSize(14);
  doc.setTextColor(245, 166, 35);
  doc.setFont("helvetica", "bold");
  doc.text("Internship & Job Tips", margin, y);
  y += 8;

  const tips = document.querySelectorAll(".tips-list li");
  tips.forEach((tip) => {
    checkNewPage(15);
    const th = addText(`• ${tip.textContent}`, margin, y, { color: [160, 160, 185], fontSize: 10 });
    y += th + 5;
  });

  // ---- Quote ----
  checkNewPage(25);
  y += 6;
  const quote = document.getElementById("quoteText")?.textContent || "";
  doc.setFontSize(11);
  doc.setTextColor(245, 166, 35);
  doc.setFont("helvetica", "italic");
  const qh = addText(`"${quote}"`, margin, y, { color: [200, 180, 140], fontSize: 10, maxWidth: contentWidth });
  y += qh + 15;

  // ---- Footer ----
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 100);
    doc.text(`AI Career Growth Advisor  |  Page ${i} of ${pageCount}`, margin, 287);
  }

  // Save the PDF with the person's name
  doc.save(`${name.replace(/\s+/g, "_")}_Career_Plan.pdf`);
});

// =============================================
// "START OVER" BUTTON
// =============================================
document.getElementById("newPlanBtn").addEventListener("click", function () {
  // Hide results, show form
  document.getElementById("resultsSection").style.display = "none";
  showForm();

  // Scroll back to top
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// =============================================
// HELPER FUNCTIONS
// =============================================

// Show the loading spinner
function showLoading() {
  document.getElementById("formSection").style.display = "none";
  document.getElementById("loadingSection").style.display = "block";
  document.getElementById("resultsSection").style.display = "none";
}

// Hide the loading spinner
function hideLoading() {
  document.getElementById("loadingSection").style.display = "none";
}

// Show the form again
function showForm() {
  document.getElementById("formSection").style.display = "block";
  document.getElementById("loadingSection").style.display = "none";
}

// Cycle through loading messages to keep it lively
function startLoadingMessages() {
  let index = 0;
  const msgEl = document.getElementById("loadingMessage");
  msgEl.textContent = loadingMessages[0];

  loadingInterval = setInterval(() => {
    index = (index + 1) % loadingMessages.length;
    msgEl.textContent = loadingMessages[index];
  }, 2500);
}

// Stop the loading message cycling
function stopLoadingMessages() {
  if (loadingInterval) {
    clearInterval(loadingInterval);
    loadingInterval = null;
  }
}

// Show error toast notification
function showError(message) {
  const toast = document.getElementById("errorToast");
  document.getElementById("errorMessage").textContent = message;
  toast.style.display = "flex";

  // Auto-hide after 6 seconds
  setTimeout(() => {
    toast.style.display = "none";
  }, 6000);
}

// Hide error toast (called by the × button)
function hideError() {
  document.getElementById("errorToast").style.display = "none";
}
