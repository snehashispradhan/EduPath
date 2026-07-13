(function () {
  const tabs = document.getElementById('ranking-tabs');
  const meta = document.getElementById('ranking-meta');
  const table = document.getElementById('ranking-table');
  if (!tabs || !meta || !table) return;

  const emptyText = '-';
  let streams = [];
  let activeIndex = 0;

  const cell = (value) => {
    const td = document.createElement('td');
    td.textContent = value || emptyText;
    return td;
  };

  const renderTable = (stream) => {
    table.innerHTML = '';

    const caption = document.createElement('caption');
    caption.textContent = stream.title;
    table.appendChild(caption);

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Rank', 'College', 'City', 'Fees', 'Placement', 'Avg / High', 'Ranking info', 'Source'].forEach((label) => {
      const th = document.createElement('th');
      th.scope = 'col';
      th.textContent = label;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    stream.rows.forEach((row) => {
      const tr = document.createElement('tr');
      tr.appendChild(cell(row.rank));
      tr.appendChild(cell(row.college));
      tr.appendChild(cell(row.city));
      tr.appendChild(cell(row.fees));
      tr.appendChild(cell(row.placement));
      tr.appendChild(cell(row.avgHigh));
      tr.appendChild(cell(row.rankingInfo));

      const sourceCell = document.createElement('td');
      const source = document.createElement('a');
      source.href = row.sourceUrl;
      source.target = '_blank';
      source.rel = 'noopener noreferrer';
      source.textContent = 'View';
      sourceCell.appendChild(source);
      tr.appendChild(sourceCell);

      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
  };

  const setActive = (index, shouldFocus) => {
    activeIndex = index;
    const stream = streams[activeIndex];
    tabs.querySelectorAll('button').forEach((button, buttonIndex) => {
      const selected = buttonIndex === activeIndex;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
      if (selected && shouldFocus) button.focus();
    });
    meta.innerHTML = `<strong>${stream.title}</strong><span>${stream.summary}</span>`;
    renderTable(stream);
  };

  const renderTabs = () => {
    tabs.innerHTML = '';
    streams.forEach((stream, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.id = `ranking-tab-${stream.id}`;
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-controls', 'ranking-table');
      button.textContent = stream.label;
      button.addEventListener('click', () => setActive(index, false));
      button.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        if (event.key === 'Home') return setActive(0, true);
        if (event.key === 'End') return setActive(streams.length - 1, true);
        const direction = event.key === 'ArrowRight' ? 1 : -1;
        const next = (index + direction + streams.length) % streams.length;
        setActive(next, true);
      });
      tabs.appendChild(button);
    });
  };

  fetch('data/odisha-college-rankings.json')
    .then((response) => {
      if (!response.ok) throw new Error('Unable to load ranking data');
      return response.json();
    })
    .then((data) => {
      streams = Array.isArray(data.streams) ? data.streams : [];
      if (!streams.length) throw new Error('No ranking streams found');
      renderTabs();
      setActive(0, false);
    })
    .catch(() => {
      meta.textContent = 'College ranking data is temporarily unavailable. Please contact EduPath India for the latest shortlist.';
    });
})();
