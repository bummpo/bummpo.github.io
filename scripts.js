const page = (new URLSearchParams(location.search).get("page") || "home").toLowerCase();
			
			fetch("pages/" + page + ".md")
				.then(r => {
                    if (r.ok) return r.text();
                    return fetch("pages/404.md")
                        .then(r2 => r2.text())
                        .then(md => md.replace("{page}", page.replace(/_/g, " ")));
                })
				.then(md => {
                    const codeblock = md.replace(/```[\s\S]*?```/g, "").replace(/`[^`]*`/g, "")
                    const redirect = codeblock.match(/\{redirect="([^"]+)"\}/);
                    if (redirect) {
                        location.replace("?page=" + redirect[1].toLowerCase());
                        return;
                    }
					document.getElementById("content").innerHTML = DOMPurify.sanitize(marked.parse(md));
				});
function goPage() {
    const text = document.getElementById("search").value.trim();
    if (!text) return;
    location.href = "?page=" + text.replace(/\s+/g, "_");
}

document.getElementById("go").addEventListener("click", goPage);

document.getElementById("search").addEventListener("keydown", e => {
    if (e.key === "Enter") goPage();
});