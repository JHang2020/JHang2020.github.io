const resourceTitle = document.querySelector('#resource-title');
if (resourceTitle) {
  const names = {paper:'Paper',code:'Code',models:'Model checkpoints'};
  const resource = new URLSearchParams(location.search).get('resource');
  const label = names[resource] || 'Resources';
  resourceTitle.textContent = `${label} — coming soon`;
  document.title = `${label} — Coming soon | Iris`;
}

const resultTabs = [...document.querySelectorAll('[role="tab"]')];
function selectResultTab(tab) {
  resultTabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected',String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  });
}
resultTabs.forEach((tab,index) => {
  tab.addEventListener('click',() => selectResultTab(tab));
  tab.addEventListener('keydown',event => {
    let next;
    if (event.key === 'ArrowRight') next = (index+1)%resultTabs.length;
    if (event.key === 'ArrowLeft') next = (index-1+resultTabs.length)%resultTabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = resultTabs.length-1;
    if (next === undefined) return;
    event.preventDefault();
    selectResultTab(resultTabs[next]);
    resultTabs[next].focus();
  });
});

const copyButton = document.querySelector('#copy-citation');
const copyStatus = document.querySelector('#copy-status');
copyButton?.addEventListener('click', async () => {
  const citation = document.querySelector('#bibtex').textContent;
  try {
    if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(citation);
    copyButton.textContent = 'Copied!';
    copyStatus.textContent = 'Citation copied to clipboard.';
    setTimeout(() => { copyButton.textContent = 'Copy citation'; }, 2200);
  } catch {
    const range = document.createRange();
    range.selectNodeContents(document.querySelector('#bibtex'));
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    copyStatus.textContent = 'Citation selected. Press Ctrl+C or ⌘C to copy, or download the BibTeX file below.';
  }
});

const dialog = document.querySelector('#figure-dialog');
const dialogImage = document.querySelector('#dialog-image');
const dialogTitle = document.querySelector('#dialog-title');
document.querySelectorAll('[data-figure]').forEach(button => {
  button.addEventListener('click', () => {
    dialogImage.src = button.dataset.figure;
    dialogImage.alt = button.querySelector('img').alt;
    dialogTitle.textContent = button.dataset.title;
    dialog.showModal();
    document.body.classList.add('dialog-open');
  });
});
document.querySelector('#close-figure')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('close', () => document.body.classList.remove('dialog-open'));
dialog?.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
