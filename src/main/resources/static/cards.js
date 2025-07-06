const cardData = [
    {
        title : 'Pets',
        value : '80',
        metrics : '+20% from last month',
        description : 'Pets this month',

    },
    {
        title : 'Appointments',
        value : '75',
        metrics : '+8.5% from last month',
        description : 'Appointments this month',

    },
    {
        title : 'Revenue',
        value : 'LKR 30,000',
        metrics : '+5% from last quater',
        description : 'Revenue this month',

    },
];

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
        title: 'Revenue',
        icon: 'fa-solid fa-dollar-sign',
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

function renderCards(containerId){
    const container = document.getElementById(containerId);
    if(!container) return;

    cardData.forEach((card) =>{
        const modifiedCard = handleMetaMapping(card);
        container.appendChild(generateCard(modifiedCard));
    });

    $('[data-bs-toggle="tooltip"]').tooltip();
}