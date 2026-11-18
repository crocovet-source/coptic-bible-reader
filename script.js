function renderData(verses) {
    const container = document.getElementById("contentArea");
    container.innerHTML = "";

    if (verses.length === 0) {
        container.innerHTML = "<p>No results found.</p>";
        return;
    }

    verses.forEach(v => {
        const row = document.createElement("div");

        // Check if it's a title row (either labeled 'title' OR has text in Titles with empty text columns)
        const hasBibleText = v['Greek'] || v['Coptic S'] || v['Coptic B'] || v['Ar Jesuit'] || v['Arabic SVD'] || v['English Brenton'];
        const isTitle = (String(v['Verse']).toLowerCase() === 'title') || (v['Titles'] && !hasBibleText);

        if (isTitle) {
            row.className = "verse-row title-row";
            row.innerHTML = `<div>${v['Titles'] || ''}</div>`;
        } else {
            row.className = "verse-row";
            
            // If Verse column is empty, leave blank instead of showing "undefined"
            const verseLabel = v['Verse'] ? v['Verse'] : "";
            const refText = verseLabel ? `${v['Book']} ${v['Chapter']}:${verseLabel}` : `${v['Book']} ${v['Chapter']}`;
            
            const checkbox = `<input type="checkbox" class="pdf-select" value="${refText} | Coptic B: ${v['Coptic B']} | SVD: ${v['Arabic SVD']}">`;
            const num = `<span class="verse-num">${verseLabel}</span>`;
            
            let grid = `<div class="columns-grid">`;
            if (v['Greek']) grid += `<div class="lang-box"><span>Greek</span>${v['Greek']}</div>`;
            if (v['Coptic S']) grid += `<div class="lang-box"><span>Coptic (Sahidic)</span>${v['Coptic S']}</div>`;
            if (v['Coptic B']) grid += `<div class="lang-box"><span>Coptic (Bohairic)</span>${v['Coptic B']}</div>`;
            if (v['Ar Jesuit']) grid += `<div class="lang-box"><span>Arabic (Jesuit)</span>${v['Ar Jesuit']}</div>`;
            if (v['Arabic SVD']) grid += `<div class="lang-box"><span>Arabic (SVD)</span>${v['Arabic SVD']}</div>`;
            if (v['English Brenton']) grid += `<div class="lang-box"><span>English (Brenton)</span>${v['English Brenton']}</div>`;
            grid += `</div>`;

            let imgBtn = v['Screenshot'] ? `<button onclick="openModal('${v['Screenshot']}')">View Source</button>` : "";

            row.innerHTML = checkbox + num + grid + imgBtn;
        }
        container.appendChild(row);
    });
}
