document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const content = document.getElementById('content');
    const tocList = document.getElementById('toc-list');
    const themeToggleButton = document.getElementById('theme-toggle');
    const body = document.body;

    // --- Navbar Interaction ---
    if (navbar) {
        navbar.addEventListener('mouseenter', () => {
            // Optional: Add class if you need more control than :hover
            // navbar.classList.add('navbar-expanded');
            // navbar.classList.remove('navbar-collapsed');
        });

        navbar.addEventListener('mouseleave', () => {
             // Optional: Add class if you need more control than :hover
            // navbar.classList.remove('navbar-expanded');
            // navbar.classList.add('navbar-collapsed');
        });

        // Note: The pure CSS :hover approach in style.css handles expand/collapse.
        // JavaScript listeners are here if more complex logic is needed later
        // (e.g., preventing close if a dropdown inside is open, or for mobile toggle).
    }


    // --- Dynamic Table of Contents Generation ---
    if (content && tocList) {
        const headings = content.querySelectorAll('h2[id], h3[id]'); // Select H2s and H3s with IDs
        tocList.innerHTML = ''; // Clear existing links

        headings.forEach(heading => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');

            link.href = `#${heading.id}`;
            link.textContent = heading.textContent;
             // Add indentation for H3 links
             if (heading.tagName === 'H3') {
                link.style.paddingLeft = '25px'; // Adjust indentation as needed
             }

            listItem.appendChild(link);
            tocList.appendChild(listItem);
        });
    }

    // --- ToC Active Link Highlighting ---
    const tocLinks = tocList ? tocList.querySelectorAll('a') : [];
    const headingElements = content ? Array.from(content.querySelectorAll('h2[id], h3[id]')) : [];

    const onScroll = () => {
        let currentActiveId = null;
        const scrollPosition = window.scrollY;
        // Offset to account for fixed headers or desired trigger point
        const activationOffset = 100; // Adjust as needed

         headingElements.forEach(heading => {
            if (heading.offsetTop <= scrollPosition + activationOffset) {
                currentActiveId = heading.id;
            }
        });

        tocLinks.forEach(link => {
            link.classList.remove('active');
            // Check if the link's hash matches the current active ID
            if (link.getAttribute('href') === `#${currentActiveId}`) {
                link.classList.add('active');
            }
        });

         // If scrolled to the very top, deactivate all
         if (window.scrollY === 0) {
             tocLinks.forEach(link => link.classList.remove('active'));
         }
         // If scrolled to the very bottom, activate the last link
         if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 5) { // Small buffer
             tocLinks.forEach(link => link.classList.remove('active'));
             if (tocLinks.length > 0) {
                tocLinks[tocLinks.length - 1].classList.add('active');
             }
         }
    };

    if (tocLinks.length > 0 && headingElements.length > 0) {
        window.addEventListener('scroll', onScroll);
        onScroll(); // Initial check
    }


    // --- Theme Toggling ---
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');

    // Apply saved theme or system preference on load
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
    } else if (currentTheme === 'light') {
        body.classList.remove('dark-mode');
    } else if (prefersDark.matches) {
        body.classList.add('dark-mode');
    }

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            body.classList.toggle('dark-mode');

            // Save preference to localStorage
            let theme = 'light';
            if (body.classList.contains('dark-mode')) {
                theme = 'dark';
            }
            localStorage.setItem('theme', theme);
        });
    }

});