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

function loadVisibleTextFromSite(url) {
        $('#status').text('🔄 Procurando conteúdo... Pode levar alguns segundos...');
        $('#output').empty();

    // Verifica ou cria o iframe
    let iframe = document.getElementById('hidden-iframe');
    if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'hidden-iframe';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
    }

    // Nova tentativa: tentar buscar primeiro via fetch
    fetch("https://workercors.jp90264.workers.dev/?url=" + encodeURIComponent(url), {
        method: 'GET',
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
                          "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1",
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na resposta proxy');
        }
        return response.text();
    })
    .then(html => {
        $('#status').text('✅ Conteúdo carregado!');
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        let visibleText = '';

        function getVisibleText(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                const trimmed = node.nodeValue.trim();
                if (trimmed) {
                    visibleText += trimmed + '\n';
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const style = window.getComputedStyle(node);
                if (style && style.display !== 'none' && style.visibility !== 'hidden') {
                    for (const child of node.childNodes) {
                        getVisibleText(child);
                    }
                }
            }
        }
        getVisibleText(doc.body);

        $('#output').text(visibleText.trim());
    })
    .catch(error => {
        console.warn('⚠️ Proxy falhou, tentando iframe escondido...', error);
        $('#status').text('🔄 Proxy bloqueado, tentando iframe...');

        // Tenta carregar pelo iframe mesmo (não vai funcionar para sites bloqueados por X-Frame-Options)
        iframe.onload = function() {
            try {
                const doc = iframe.contentDocument || iframe.contentWindow.document;
                let visibleText = '';
                function getVisibleText(node) {
                    if (node.nodeType === Node.TEXT_NODE) {
                        const trimmed = node.nodeValue.trim();
                        if (trimmed) {
                            visibleText += trimmed + '\n';
                        }
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        for (const child of node.childNodes) {
                            getVisibleText(child);
                        }
                    }
                }
                getVisibleText(doc.body);

                $('#output').text(visibleText.trim());
                $('#status').text('✅ Conteúdo via iframe!');
            } catch (err) {
                console.error('❌ Erro final:', err);
                $('#status').text('❌ Não foi possível acessar o site.');
            }
        };

        iframe.src = url;
    });
}

$(document).ready(function() {
    $('#load-btn').on('click', function() {
        const url = $('#url-input').val().trim();
          if (url) {
            loadVisibleTextFromSite(url);
          } else {
            alert('Por favor, digite uma URL válida.');
          }
    });
});
