let laundryHistory = JSON.parse(localStorage.getItem('laundryHistory')) || [];
let services = [
    {name:'Cuci Biasa', price:10, time:'2 Hari'},
    {name:'Cuci + Setrika', price:15, time:'2 Hari'},
    {name:'Express', price:20, time:'1 Hari'}
];

const serviceSelect = document.getElementById('service');
const filterSelect = document.getElementById('filterService');

function populateServiceSelect() {
    serviceSelect.innerHTML = '';
    services.forEach(s => serviceSelect.innerHTML += `<option value="${s.price}">${s.name} - Rp ${s.price.toLocaleString('id-ID')}/kg (${s.time})</option>`);
    filterSelect.innerHTML = '<option value="all">Semua Layanan</option>';
    services.forEach(s => filterSelect.innerHTML += `<option value="${s.name}">${s.name}</option>`);
}
populateServiceSelect();

function calculateLaundry() {
    const weight = parseFloat(document.getElementById('weight').value);
    const servicePrice = parseFloat(serviceSelect.value);
    const serviceName = services.find(s=>serviceSelect.options[serviceSelect.selectedIndex].text.includes(s.name)).name;
    if(isNaN(weight) || weight<=0){ alert('Masukkan jumlah pakaian yang valid!'); return; }

    const total = weight * servicePrice;
    const estimatedTime = services.find(s=>s.name===serviceName).time;

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `💰 Total Biaya: <strong>Rp ${total.toLocaleString('id-ID')}</strong><br>⏱ Estimasi Waktu: <strong>${estimatedTime}</strong>`;
    gsap.fromTo(resultDiv,{opacity:0,y:-10},{opacity:1,y:0,duration:0.5});

    const laundryData = {date:new Date().toLocaleString(), weight, service: serviceName, total};
    laundryHistory.unshift(laundryData);
    if(laundryHistory.length>20) laundryHistory.pop();
    localStorage.setItem('laundryHistory',JSON.stringify(laundryHistory));

    renderHistory();
    renderChart();
}

function renderHistory() {
    const historyDiv = document.getElementById('historyItems');
    const filterValue = filterSelect.value;
    historyDiv.innerHTML = '';
    laundryHistory.filter(item => filterValue==='all' || item.service===filterValue).forEach(item=>{
        const div = document.createElement('div');
        div.className='history-item';
        div.innerHTML = `<span>${item.date} - ${item.service} (${item.weight}kg)</span><span>Rp ${item.total.toLocaleString('id-ID')}</span>`;
        historyDiv.appendChild(div);
    });
}

let laundryChartInstance = null;
function renderChart() {
    const ctx = document.getElementById('laundryChart').getContext('2d');
    const labels = laundryHistory.map(item=>item.date.split(',')[0]);
    const data = laundryHistory.map(item=>item.total);

    if(laundryChartInstance) laundryChartInstance.destroy();

    laundryChartInstance = new Chart(ctx,{
        type:'bar',
        data:{
            labels:labels,
            datasets:[{
                label:'Pengeluaran Laundry (Rp)',
                data:data,
                backgroundColor:'rgba(34,197,94,0.7)',
                borderColor:'rgba(34,197,94,1)',
                borderWidth:1
            }]
        },
        options:{
            responsive:true,
            scales:{y:{beginAtZero:true}}
        }
    });
}

function addService(){
    const name = document.getElementById('newServiceName').value.trim();
    const price = parseFloat(document.getElementById('newServicePrice').value);
    const time = document.getElementById('newServiceTime').value.trim();
    if(!name || isNaN(price) || !time){ alert('Isi semua data layanan!'); return; }
    services.push({name,price,time});
    populateServiceSelect();
    document.getElementById('newServiceName').value='';
    document.getElementById('newServicePrice').value='';
    document.getElementById('newServiceTime').value='';
    alert('Layanan berhasil ditambahkan!');
}

function toggleDarkMode(){
    const body = document.getElementById('body');
    body.classList.toggle('dark');

    if(body.classList.contains('dark')){
        gsap.to(body, {duration: 1, background: 'linear-gradient(to bottom right, #1f2937, #374151)'});
    } else {
        gsap.to(body, {duration: 1, background: 'linear-gradient(to bottom right, #93c5fd, #6366f1)'});
    }
}

// Event listeners
document.getElementById('calculateBtn').addEventListener('click', calculateLaundry);
document.getElementById('addServiceBtn').addEventListener('click', addService);
document.getElementById('filterService').addEventListener('change', renderHistory);
document.getElementById('darkModeBtn').addEventListener('click', toggleDarkMode);

// Initial render
renderHistory();
renderChart();
