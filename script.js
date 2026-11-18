const API_URL = "YOUR_WEB_APP_URL_HERE";

async function loadChapter() {
    const book = document.getElementById("bookInput").value.trim();
    const chapter = document.getElementById("chapterInput").value.trim();
    if (!book || !chapter) return alert("Please enter a book and chapter.");

    document.getElementById("contentArea").innerHTML = "<p>Loading...</p>";
    try {
        const res = await fetch(`${API_URL}?action=getChapter&book=${encodeURIComponent(book)}&chapter=${encodeURIComponent(chapter)}`);
        const data = await res.json();
        renderData(data);
    } catch (err) {
        console.error(err);
        document.getElementById("contentArea").innerHTML = "<p>Error loading data.</p>";
    }
}

async function searchBible() {
    const query = document.getElementById("searchInput").value.trim();
    if (!query) return alert("Please enter a search term.");

    document.getElementById("contentArea").innerHTML = "<p>Searching 36,000+ rows...</p>";
    try {
        const res = await fetch(`${API_URL}?action=search&query=${encodeURIComponent(query)}`);
        const data = await res.json();
        renderData(data);
    } catch (err) {
        console.error(err);
        document.getElementById("contentArea").innerHTML = "<p>Error searching data.</p>";
    }
}

function renderData(verses) {
    const container = document.getElementById("contentArea");
    container.innerHTML = "";

    if (verses.length === 0) {
        container.innerHTML = "<p>No results found.</p>";
        return;
    }

    verses.forEach(v => {
        const row = document.createElement("div");

        // Handle section titles vs regular verses
        if (v['Verse'] === 'title') {
            row.className = "verse-row title-row";
            row.innerHTML = `<div>${v['Titles'] || ''}</div>`;
        } else {
            row.className = "verse-row";
            
            const checkbox = `<input type="checkbox" class="pdf-select" value="${v['Book']} ${v['Chapter']}:${v['Verse']} | Coptic B: ${v['Coptic B']} | SVD: ${v['Arabic SVD']}">`;
            const num = `<span class="verse-num">${v['Verse']}</span>`;
            
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

function openModal(url) {
    document.getElementById("imageModal").style.display = "flex";
    document.getElementById("sourceImage").src = url;
}

function closeModal() {
    document.getElementById("imageModal").style.display = "none";
}

function printSelectedToPDF() {
    const checked = document.querySelectorAll('.pdf-select:checked');
    if (checked.length === 0) return alert("Please select at least one verse using the checkboxes.");
    
    let container = document.createElement('div');
    container.style.padding = "20px";
    container.innerHTML = "<h2>Selected Verses</h2>";
    
    checked.forEach(box => {
        let p = document.createElement('p');
        p.innerText = box.value;
        container.appendChild(p);
    });

    html2pdf().from(container).save('coptic-bible-selection.pdf');
}
