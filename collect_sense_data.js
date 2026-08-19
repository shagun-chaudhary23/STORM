import fs from 'fs';

async function fetchUSGS() {
    console.log('Fetching USGS Earthquakes...');
    const url = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2026-08-03&endtime=2026-08-17&minmagnitude=2.5&minlatitude=6&maxlatitude=37&minlongitude=68&maxlongitude=97';
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error('Error fetching USGS:', err.message);
        return { error: err.message };
    }
}

async function fetchWeather() {
    console.log('Fetching Open-Meteo Weather for 8 cities...');
    const cities = [
        { name: 'Delhi', lat: 28.6139, lon: 77.2090 },
        { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
        { name: 'Kolkata', lat: 22.5726, lon: 88.3639 },
        { name: 'Chennai', lat: 13.0827, lon: 80.2707 },
        { name: 'Bengaluru', lat: 12.9716, lon: 77.5946 },
        { name: 'Hyderabad', lat: 17.3850, lon: 78.4867 },
        { name: 'Ahmedabad', lat: 23.0225, lon: 72.5714 },
        { name: 'Pune', lat: 18.5204, lon: 73.8567 }
    ];
    
    const results = {};
    for (const city of cities) {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,precipitation,weather_code,wind_speed_10m&daily=precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=Asia%2FKolkata&forecast_days=3`;
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            results[city.name] = await res.json();
        } catch (err) {
            console.error(`Error fetching weather for ${city.name}:`, err.message);
            results[city.name] = { error: err.message };
        }
    }
    return results;
}

async function fetchOQAPI() {
    console.log('Fetching HeiGIT OQAPI (data quality)...');
    const url = 'https://oqapi.ohsome.org/api/v1/indicators/mapping-saturation?bboxes=76.9,12.8,77.7,13.1&topics=building-count&format=json';
    try {
        const res = await fetch(url);
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`HTTP ${res.status}: ${text.substring(0, 50).replace(/\n/g, '')}...`);
        }
        return await res.json();
    } catch (err) {
        console.error('Error fetching OQAPI (Endpoint might be outdated):', err.message);
        return { error: err.message };
    }
}

async function fetchORS() {
    console.log('Fetching HeiGIT ORS (isochrones)...');
    const key = process.env.ORS_API_KEY;
    if (!key) {
        console.log('No ORS_API_KEY found, skipping ORS.');
        return null;
    }
    
    const url = 'https://api.openrouteservice.org/v2/isochrones/driving-car';
    const body = {
        locations: [[77.2090, 28.6139]], // Delhi
        range: [300]
    };
    
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': key,
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(body)
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`HTTP ${res.status}: ${text}`);
        }
        return await res.json();
    } catch (err) {
        console.error('Error fetching ORS:', err.message);
        return { error: err.message };
    }
}

async function main() {
    const data = {};
    
    data.earthquakes = await fetchUSGS();
    data.weather = await fetchWeather();
    data.oqapi = await fetchOQAPI();
    data.ors = await fetchORS();
    
    const dateStr = '2026-08-17';
    const filename = `sense_data_${dateStr}.json`;
    
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    console.log(`\nData collection complete! Saved to ${filename}`);
}

main();
