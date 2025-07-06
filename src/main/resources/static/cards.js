/* const cardData = [
    {
        title : 'Pets',
        value : '80',
        metrics : '+20% from last month',
        description : 'No of Pets Registered',

    },
    {
        title : 'Appointments',
        value : '75',
        metrics : '+8.5% from last month',
        description : 'Completed Appointments this month',

    },
    {
        title : 'Vaccinations',
        value : '20',
        metrics : '+5% from last quater',
        description : 'Total vaccinations this month',

    },
]; */

window.addEventListener('load', () => {
    fetchDashboardData();
});


async function fetchDashboardData() {
    try {
        const response = await fetch('/summary');
        const data = await response.json();

        const cardData = [
            {
                title : 'Pets',
                value : data.pets,
                metrics : '+20% from last month', // optional dummy text
                description : 'No of Pets Registered',
            },
            {
                title : 'Appointments',
                value : data.appointments,
                metrics : '+8.5% from last month',
                description : 'Completed Appointments this month',
            },
            {
                title : 'Vaccinations',
                value : data.vaccinations,
                metrics : '+5% from last quarter',
                description : 'Total vaccinations this month',
            },
        ];

        renderCardsFromData(cardData, 'dynamic-cards');
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}



const cardColorMap = [
    {
        title: 'Pets',
        icon: 'fa-solid fa-dog',
        bgColor: 'bg-info text-white',
    },
    {
        title: 'Appointments',
        icon: 'fa-solid fa-hospital',
        bgColor: 'bg-success text-white',
    },
    {
        title: 'Vaccinations',
        icon: 'fa-solid fa-syringe',
        bgColor: 'bg-warning text-white',
    },
];

function handleMetaMapping(card){
    const meta = cardColorMap.find((item) => item.title === card.title) || {
        icon: 'fa-solid fa-chart-line',
        bgColor: 'bg-secondary text-white',
    };
    return {
        ...card,
        icon: meta.icon,
        bgColor: meta.bgColor,
    };
}

function generateCard({ icon, title, value, metrics, description, bgColor}){
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-4';

    col.innerHTML = `
    <div class="card shadow -sm h-100 ${bgColor}">
      <div class="card-body">
        <div class="d-flex align-items-center mb-2">
          <i class="${icon} fa-lg me-2"></i>
          <h5 class="card-title mb-0">
            ${title}
            <i class="fa-solid fa-circle-info ms-2" data-bs-toggle="tooltip" title="${description}"></i>
          </h5>
        </div>
        <h3 class="fw-bold">${value}</h3>
        <p class="mb-0 small">${metrics}</p>
      </div>
    </div>
    `;

    return col;
}

/* function renderCards(containerId){
    const container = document.getElementById(containerId);
    if(!container) return;

    cardData.forEach((card) =>{
        const modifiedCard = handleMetaMapping(card);
        container.appendChild(generateCard(modifiedCard));
    });

    $('[data-bs-toggle="tooltip"]').tooltip();
} */

function renderCardsFromData(cardData, containerId){
    const container = document.getElementById(containerId);
    if(!container) return;

    container.innerHTML = ''; // clear existing cards

    cardData.forEach((card) => {
        const modifiedCard = handleMetaMapping(card);
        container.appendChild(generateCard(modifiedCard));
    });

    $('[data-bs-toggle="tooltip"]').tooltip();
}

