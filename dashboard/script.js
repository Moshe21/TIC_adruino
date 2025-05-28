async function cargarDatos() {
    const response = await fetch('http://localhost:3000/api/datos');
    const datos = await response.json();

    const labels = datos.map(d => new Date(d.timestamp).toLocaleTimeString());
    const temperaturas = datos.map(d => d.temperatura);
    const humedades = datos.map(d => d.humedad);

    const tempCtx = document.getElementById('tempChart').getContext('2d');
    const humCtx = document.getElementById('humChart').getContext('2d');

    new Chart(tempCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperatura (°C)',
                data: temperaturas,
                borderColor: 'red',
                fill: false
            }]
        }
    });

    new Chart(humCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Humedad (%)',
                data: humedades,
                borderColor: 'blue',
                fill: false
            }]
        }
    });
}

cargarDatos();
