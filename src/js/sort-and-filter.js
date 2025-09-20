const Shuffle = window.Shuffle;

const element = document.getElementById('gallery');
const shuffleInstance = new Shuffle(element, {
    filterMode: Shuffle.FilterMode.ALL,
    delimiter: ",",
    itemSelector: '.col',
    sizer: '.sizer',
    speed: 150
});

document.getElementById("filter-form").addEventListener("submit", (event) => {event.preventDefault();})
document.getElementById("sort").addEventListener('change', handleSortChange.bind(this));
document.getElementById("search").addEventListener('keyup', handleFilter);
document.querySelectorAll(".format-checkbox").forEach(element => {
    element.addEventListener('change', handleFilter);
});
document.querySelectorAll(".document-type-checkbox").forEach(element => {
    element.addEventListener('change', handleFilter);
});

function handleSortChange(event) {
    const value = event.target.value;

    function sortByLastUpdate(element) {
        let lastUpdate = parseInt(element.dataset.lastUpdate);
        if (lastUpdate === undefined || isNaN(lastUpdate)) {
            lastUpdate = 0;
        }
        return lastUpdate;
    }

    function sortByCreatedAt(element) {
        let createdAt = parseInt(element.dataset.createdAt);
        if (createdAt === undefined || isNaN(createdAt)) {
            createdAt = 0;
        }
        return createdAt;
    }

    function sortByStars(element) {
        let stars = parseInt(element.dataset.stars);
        if (stars === undefined || isNaN(stars)) {
            stars = 0;
        }
        return stars;
    }

    function sortByReleases(element) {
        let releases = parseInt(element.dataset.releases);
        if (releases === undefined || isNaN(releases)) {
            releases = 0;
        }
        return releases;
    }

    function sortByTitle(element) {
        return element.querySelector(".title").innerText.toLowerCase().trim();
    }

    let options;
    if (value === 'stars') {
        options = {
            reverse: true,
            by: sortByStars,
        };
    }  else if (value === 'releases') {
        options = {
            reverse: true,
            by: sortByReleases,
        };
    } else if (value === 'last-update') {
        options = {
            reverse: true,
            by: sortByLastUpdate,
        };
    } else if (value === 'created-at') {
        options = {
            reverse: true,
            by: sortByCreatedAt,
        };
    } else if (value === 'title') {
        options = {
            by: sortByTitle,
        };
    } else {
        options = {};
    }

    shuffleInstance.sort(options);
}

function handleFilter() {
    const searchText = document.getElementById("search").value.toLowerCase();
    const filterFormats = Array.from(document.querySelectorAll(".format-checkbox"))
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.getAttribute("id"));
    const filterDocumentTypes = Array.from(document.querySelectorAll(".document-type-checkbox"))
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.getAttribute("id"));

    shuffleInstance.filter((pandocTheme) => {
        const title = pandocTheme.querySelector(".title").innerText.toLowerCase().trim();
        const author = pandocTheme.querySelector(".author").innerText.toLowerCase().trim();
        const description = pandocTheme.querySelector(".description").innerText.toLowerCase().trim();
        const formats = pandocTheme.dataset.formats ? pandocTheme.dataset.formats.toLowerCase().trim() : "";
        const documentTypes = pandocTheme.dataset.documentTypes ? pandocTheme.dataset.documentTypes.toLowerCase().trim() : "";
        const tags = pandocTheme.dataset.tags ? pandocTheme.dataset.tags.toLowerCase().trim() : "";

        let containsAll = (arr, target) => target.every(v => arr.includes(v));

        const hasFormats = containsAll(pandocTheme.dataset.formats.trim().split(' '), filterFormats);
        const hasDocumentTypes = containsAll(pandocTheme.dataset.documentTypes.trim().split(' '), filterDocumentTypes);
        const containsSearchedText = (title.includes(searchText) || author.includes(searchText) || description.includes(searchText) || formats.includes(searchText) || documentTypes.includes(searchText) || tags.includes(searchText));
        return containsSearchedText && hasFormats && hasDocumentTypes;
    });

    shuffleInstance.on(Shuffle.EventType.LAYOUT, (data) => {
        document.getElementById("filtered-items").innerHTML = data.shuffle.visibleItems;
    });
}
