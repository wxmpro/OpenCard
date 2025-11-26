export const generateId = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  return `${year}${month}${day}${hour}${minute}`;
};

export const downloadMarkdown = (card: { title: string; content: string; tags: string[]; id: string }) => {
  const frontmatter = `---
id: ${card.id}
title: ${card.title}
tags: [${card.tags.join(', ')}]
date: ${new Date().toISOString()}
---

`;
  const blob = new Blob([frontmatter + card.content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${card.title || 'card'}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const printCard = (card: { title: string; content: string; tags: string[], id: string }) => {
  const printArea = document.getElementById('card-print-area');
  if (printArea) {
    printArea.style.display = 'block';
    printArea.innerHTML = `
      <div style="font-family: serif; max-width: 800px; margin: 0 auto;">
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 1rem;">${card.title}</h1>
        <div style="margin-bottom: 2rem; line-height: 1.6; white-space: pre-wrap;">${card.content}</div>
        <div style="font-size: 12px; color: #666;">
          ID: ${card.id} <br/>
          Tags: ${card.tags.map(t => `#${t}`).join(' ')}
        </div>
      </div>
    `;
    window.print();
    printArea.style.display = 'none';
    printArea.innerHTML = '';
  }
};