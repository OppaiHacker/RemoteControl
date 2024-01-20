fetch('http://localhost:3001/getips')
      .then(response => response.json())
      .then(data => {
        // Sprawdź, czy tablica nie jest pusta
        if (Array.isArray(data) && data.length > 0) {
          // Znajdź kontener HTML, gdzie będziemy umieszczać dane
          const dataContainer = document.getElementById('data-container');

          // Iteruj po każdym rekordzie w tablicy
          data.forEach(record => {
            // Utwórz elementy HTML dla IP, HostName i LastOnline
            const recordElement = document.createElement('div');
            recordElement.innerHTML = `
              <div class="target_info" onclick="openConsoleAt('${record.IP}', '${record.HostName}', '${record.LastOnline}')">
                <p>IP: ${record.IP}</p>
                <p>HostName: ${record.HostName}</p>
                <p>LastOnline: ${record.LastOnline}</p>
              </div>
              
            `;

            // Dodaj stworzony element do kontenera
            dataContainer.appendChild(recordElement);
          });
        } else {
          console.error('Brak danych lub błąd w formacie odpowiedzi.');
        }
      })
      .catch(error => console.error('Fetch error:', error));



