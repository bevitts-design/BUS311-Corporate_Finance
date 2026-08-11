const capstoneSnapshot = document.querySelector('[data-capstone-milestones]');

function updateCapstoneMilestone() {
  if (!capstoneSnapshot) return;
  try {
    const milestones = JSON.parse(capstoneSnapshot.dataset.capstoneMilestones || '[]');
    if (!milestones.length) return;
    const now = Date.now();
    const milestone = milestones.find((item) => Date.parse(item.due) >= now) || milestones[milestones.length - 1];
    const title = capstoneSnapshot.querySelector('[data-capstone-milestone-title]');
    const date = capstoneSnapshot.querySelector('[data-capstone-milestone-date]');
    if (title) title.textContent = milestone.title;
    if (date) {
      date.textContent = `Due ${milestone.dateLabel}`;
      date.setAttribute('datetime', milestone.due);
    }
  } catch {
    // Keep the source-rendered first milestone if structured data is unavailable.
  }
}

updateCapstoneMilestone();
