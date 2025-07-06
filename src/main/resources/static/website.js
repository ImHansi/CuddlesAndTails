
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

            let row = document.createElement('div');
            row.className ='row';

            data.forEach(announcement => {
                let col = document.createElement('div');
                col.className = 'col-12 col-sm-6 col-md-3 mb-4';
                // Create card element
                let card = document.createElement('div');
                card.className = 'card h-100';
                // card.style.width = '25rem';

                // Create image element
                if (announcement.base64image) {
                    let img = document.createElement('img');
                    img.className = 'card-img-top';
                    img.src = announcement.base64image;
                    img.alt = 'Card image cap';
                    card.appendChild(img);
                }
               

                // Create card body
                let cardBody = document.createElement('div');
                cardBody.className = 'card-body';

                let title = document.createElement('h3')
                title.className = 'card-title';
                title.textContent = announcement.title;

                // Create description element
                let paragraph = document.createElement('p');
                paragraph.className = 'card-text';
                paragraph.textContent = announcement.description;

                // Append elements
                cardBody.appendChild(title);
                cardBody.appendChild(paragraph);
                
                card.appendChild(cardBody);
                col.appendChild(card);
                row.appendChild(col);
            });

            container.appendChild(row);
        })
        .catch(error => console.error('Error fetching announcements:', error));
});
