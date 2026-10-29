/* One public, manually verified source for all referee pages. No portal credentials. */
(() => {
  'use strict';
  const host = document.querySelector('[data-application-status]');
  if (!host) return;
  const keys = ['documents', 'reference_requests', 'statements', 'portal_ready', 'submitted', 'references_submitted'];
  const states = {
    complete: { label: 'Complete', symbol: '✓' },
    pending: { label: 'Incomplete', symbol: '−' },
    in_progress: { label: 'In progress', symbol: '·' },
    unknown: { label: 'Not yet verified', symbol: '?' }
  };
  const programIds = [...host.querySelectorAll('tbody tr')].map(row => row.dataset.program);
  const detail = host.querySelector('.as-detail');
  const updateLabel = host.querySelector('.as-updated');
  let lastPayload = '';
  let selectedCell = null;
  let data = null;

  function formatDate(value) {
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(value));
  }
  function validDate(value) {
    return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
      Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
  }
  function validate(candidate) {
    if (candidate?.version !== 1 || !Array.isArray(candidate.programs) || candidate.programs.length !== programIds.length ||
        !(candidate.updated === null || validDate(candidate.updated))) throw new Error('Invalid status data');
    const ids = candidate.programs.map(p => p.id);
    if (new Set(ids).size !== programIds.length || programIds.some(id => !ids.includes(id))) throw new Error('Invalid program list');
    candidate.programs.forEach(program => keys.forEach(key => {
      const item = program.milestones?.[key];
      if (!item || !Object.hasOwn(states, item.status) || !(item.checked === null || validDate(item.checked)) ||
          typeof item.note !== 'string' || (item.status !== 'unknown' && !item.checked)) throw new Error('Invalid milestone');
    }));
    return candidate;
  }
  function showDetail(button) {
    selectedCell?.setAttribute('aria-pressed', 'false');
    selectedCell = button;
    button.setAttribute('aria-pressed', 'true');
    const row = button.closest('tr');
    const program = data?.programs.find(p => p.id === row.dataset.program);
    const milestone = program?.milestones[button.dataset.stage];
    const heading = host.querySelector(`#as-stage-${button.dataset.stage}`).textContent.replace(/^\s*\d+\s*/, '').trim();
    const title = document.createElement('strong');
    title.textContent = `${row.querySelector('.as-institution').textContent} · ${row.querySelector('.as-program').textContent}`;
    const description = document.createElement('p');
    description.textContent = `${heading}: ${states[milestone?.status || 'unknown'].label}. ${milestone?.note || 'Awaiting a verified status update.'}${milestone?.checked ? ` Checked ${formatDate(milestone.checked)}.` : ''}`;
    detail.replaceChildren(title, description);
  }
  host.addEventListener('click', event => {
    const button = event.target.closest('.as-cell');
    if (button && host.contains(button)) showDetail(button);
  });
  async function refresh() {
    try {
      const response = await fetch(host.dataset.source, { cache: 'no-store', signal: AbortSignal.timeout(10000) });
      if (!response.ok) throw new Error('Status source unavailable');
      const payload = await response.text();
      const candidate = validate(JSON.parse(payload));
      updateLabel.textContent = candidate.updated ? `Updated ${formatDate(candidate.updated)}` : 'Update date unavailable';
      host.querySelector('.as-sync').textContent = '';
      if (payload === lastPayload) return;
      data = candidate;
      candidate.programs.forEach(program => {
        const row = host.querySelector(`[data-program="${program.id}"]`);
        keys.forEach(key => {
          const milestone = program.milestones[key];
          const button = row.querySelector(`[data-stage="${key}"]`);
          const state = states[milestone.status];
          button.dataset.status = milestone.status;
          button.querySelector('.as-bulb').textContent = state.symbol;
          const label = `${row.querySelector('.as-institution').textContent}, ${row.querySelector('.as-program').textContent}: ${button.dataset.label}: ${state.label}`;
          button.setAttribute('aria-label', label);
          button.title = `${state.label}${milestone.checked ? ` · Checked ${formatDate(milestone.checked)}` : ''}. ${milestone.note}`;
        });
      });
      lastPayload = payload;
      if (selectedCell) showDetail(selectedCell);
    } catch (error) {
      host.querySelector('.as-sync').textContent = data
        ? 'Refresh unavailable. Showing the last loaded status; retrying every 60 seconds.'
        : 'Status updates unavailable. Milestones remain unverified; retrying every 60 seconds.';
    }
  }
  refresh();
  window.setInterval(() => { if (!document.hidden) refresh(); }, 60000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
})();
