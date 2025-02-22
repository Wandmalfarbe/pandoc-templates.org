const Shuffle = window.Shuffle;

const element = document.getElementById('gallery');
const shuffleInstance = new Shuffle(element, {
    filterMode: Shuffle.FilterMode.ALL,
    delimiter: ",",
    itemSelector: '.col',
    sizer: '.sizer',
    speed: 150
});

document.getElementById("sort").addEventListener('change', handleSortChange.bind(this));
document.getElementById("search").addEventListener('keyup', handleFilter);
document.querySelectorAll(".format-checkbox").forEach(element => {
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

    function sortByStars(element) {
        let stars = parseInt(element.dataset.stars);
        if (stars === undefined || isNaN(stars)) {
            stars = 0;
        }
        return stars;
    }

    function sortByTitle(element) {
        return element.dataset.title.toLowerCase();
    }

    let options;
    if (value === 'stars') {
        options = {
            reverse: true,
            by: sortByStars
        };
    } else if (value === 'last-update') {
        options = {
            reverse: true,
            by: sortByLastUpdate,
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

    shuffleInstance.filter((pandocTheme) => {
        const title = pandocTheme.dataset.title.toLowerCase().trim();
        const description = pandocTheme.dataset.description.toLowerCase().trim();
        const formats = pandocTheme.dataset.formats ? pandocTheme.dataset.formats.toLowerCase().trim() : "";
        const tags = pandocTheme.dataset.tags ? pandocTheme.dataset.tags.toLowerCase().trim() : "";

        let containsAll = (arr, target) => target.every(v => arr.includes(v));

        const hasFormats = containsAll(pandocTheme.dataset.formats.trim().split(' '), filterFormats);

        return (title.includes(searchText) || description.includes(searchText) || formats.includes(searchText) || tags.includes(searchText)) && hasFormats;
    });

    shuffleInstance.on(Shuffle.EventType.LAYOUT, (data) => {
        console.log(data.shuffle.visibleItems);
        document.getElementById("filtered-items").innerHTML = data.shuffle.visibleItems;
    });
}
