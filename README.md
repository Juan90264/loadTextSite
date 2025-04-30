# LoadTextSite
Version: **v1.0.0** | Author: Juan90264

LoadTextSite is a JavaScript tool that loads only the visible text of any web page. Ideal for those who want to extract the main content of a website without loading images, scripts or ads.

## 🚀 What does he do?
Loads any website provided via proxy.

Parses HTML content and extracts only the visible text from the page.

Uses fallback with hidden iframe if the proxy is blocked.

Displays clean results in the browser, ready for reading or analysis.

## 📦 How does it work?

Go to https://juan90264.github.io/codes/loadTextSite.html to find the tool.

You enter a URL in the input field.

The script tries to fetch the page content via a proxy (fetch with random User-Agent).

If it fails, it tries to load the page with a hidden iframe (limited by X-Frame-Options).

The visible text is recursively extracted and displayed.

## ✨ Key Features
* Focus on main content: ignore hidden or invisible content.

* Proxy with random User-Agent: bypasses simple blocks.

* Fallback with hidden iframe: increases the chance of success.

* Supports open CORS via own proxy (https://workercors.jp90264.workers.dev).

* No external libraries other than jQuery.

## 🧪 Usage example
Enter a URL like:
https://www.example.com

And click Load Text. The main content of the page will be displayed in plain text.

## ♻️ Script Reuse
You can embed the script into any HTML page with jQuery to extract visible text from any website. Simply include the script in your application and call the function with the desired URL.

### ✅ Requirements
jQuery (version 3.x or higher)

The script in the "script.js" file (you can copy it directly from the project)

A button to start reading and fields for input and display

### 📄 Example of usage in an HTML page:

In the "loadTextSite.html" file, there is an example of use, which is the source code of the tool page mentioned at the beginning, which has a comment indicating the elements necessary to run the script correctly.

## 🛡️ Limitations
Using iframe fails on sites with X-Frame-Options: DENY/SAMEORIGIN.

Sites with content loaded via JavaScript may return little or no text.

Reliance on a working proxy to bypass CORS.

## License
Distributed under the GNU General Public License v3.0 (GPL-3.0)

