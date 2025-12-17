/*
 * Project: LoadTextSite.js
 * Author: Juan90264
 * Copyright (C) 2025 Juan90264
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 * 
 *
 * Repository: https://github.com/Juan90264/loadTextSite
 */

function getVisibleTextFromHTML(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        let visibleText = '';
    
        function getVisibleText(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                const trimmed = node.nodeValue.trim();
                if (trimmed) visibleText += trimmed + '\n';
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const style = window.getComputedStyle(node);
                if (style?.display !== 'none' && style?.visibility !== 'hidden') {
                    for (const child of node.childNodes) getVisibleText(child);
                }
            }
        }
    
        getVisibleText(doc.body);
        return visibleText.trim();
}

function loadTextFromScraperAPI(url, container) {
        container.text('🔄 Scraping externo...');
    
        fetch(
          "https://scrapingrender.onrender.com/scrape?site=" +
          encodeURIComponent(url)
        )
        .then(res => {
            if (!res.ok) throw new Error("Scraper falhou");
            return res.json();
        })
        .then(data => {
            if (!data.texto) throw new Error("Texto vazio");
            container.html(
              `<b>${url}</b><br><pre>${data.texto}</pre>`
            );
        })
        .catch(err => {
            container.html(
              `<b>${url}</b><br>❌ Erro scraper: ${err.message}`
            );
        });
}
    
function loadVisibleTextFromSite(url, container) {
        container.text('🔄 Carregando...');
    
        fetch("https://worker-cors.vercel.app/api/worker?url=" + encodeURIComponent(url), {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
                              "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                "Accept": "text/html",
                "Cache-Control": "no-cache"
            }
        })
        .then(res => {
            if (!res.ok) throw new Error('Proxy falhou');
            return res.text();
        })
        .then(html => {
            const text = getVisibleTextFromHTML(html);
            container.html(`<b>${url}</b><br><pre>${text}</pre>`);
        })
        .catch(err => {
            container.html(`<b>${url}</b><br>❌ Erro ao carregar: ${err.message}`);
        });
}
    
$(document).ready(function() {
        $('#load-btn').on('click', function() {
            const raw = $('#url-input').val().trim();
            const urls = raw.split(/\n+/).filter(Boolean).slice(0, 5); // até 5
    
            if (urls.length === 0) {
                alert('Por favor, digite pelo menos uma URL.');
                return;
            }
    
            $('#output').empty();
            urls.forEach(url => {
                const siteBox = $('<div class="site-box">🔄 Procurando... </div>');
                $('#output').append(siteBox);

                const mode = $('input[name="mode"]:checked').val();

                if (mode === "scraper") {
                    loadTextFromScraperAPI(url, siteBox);
                } else {
                    loadVisibleTextFromSite(url, siteBox);
                }
            });
        });
});
