function buildNavigation(activePage) {
    const navHost = document.getElementById('app-nav-host');
    if (!navHost) return;

    const navLinks = [
        { page: 'home', href: 'index.html', label: 'Home' },
        { page: 'search', href: 'search.html', label: 'Search Events' }
    ];

    const navBar = document.createElement('div');
    navBar.className = 'nav-bar';

    const brandLink = document.createElement('a');
    brandLink.className = 'brand';
    brandLink.href = 'index.html';
    brandLink.innerHTML = '<span class="brand-icon">&#127808;</span><span>Hope &amp; Harmony Charity Events</span>';
    navBar.appendChild(brandLink);

    const linkList = document.createElement('ul');
    linkList.className = 'nav-links';

    navLinks.forEach((linkInfo) => {
        const listItem = document.createElement('li');
        const anchor = document.createElement('a');
        anchor.href = linkInfo.href;
        anchor.textContent = linkInfo.label;
        if (linkInfo.page === activePage) {
            anchor.classList.add('active');
        }
        listItem.appendChild(anchor);
        linkList.appendChild(listItem);
    });

    navBar.appendChild(linkList);
    navHost.appendChild(navBar);
}
