
window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    //  Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});

document.addEventListener("DOMContentLoaded", function() {
    fetch('/announcement/showall')
        .then(response => response.json())
        .then(data => {
            let container = document.getElementById('announcements-container');

            data.forEach(announcement => {
                // Create card element
                let card = document.createElement('div');
                card.className = 'card';
                card.style.width = '25rem';

                // Create image element
                let img = document.createElement('img');
                img.className = 'card-img-top';
                img.src = announcement.image; 
                img.alt = 'Card image cap';

                // Create card body
                let cardBody = document.createElement('div');
                cardBody.className = 'card-body';

                // Create description element
                let paragraph = document.createElement('p');
                paragraph.className = 'card-text';
                paragraph.textContent = announcement.description;

                // Append elements
                cardBody.appendChild(paragraph);
                card.appendChild(img);
                card.appendChild(cardBody);
                container.appendChild(card);
            });
        })
        .catch(error => console.error('Error fetching announcements:', error));
});
