let version = undefined

function Panic(target) {
  fetch(`http://${target}:2137/Panic`, {
    body: JSON.stringify({
      Panic: "true",
    }),
    method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    .then((response) => response.json())
    .then((json) => console.log(json))
    .catch(error => console.error('Fetch error:', error));
}

fetch('http://localhost:3001/getversion')
.then(response => response.json())
.then(data => {
  // Sprawdź, czy tablica nie jest pusta
  if (Array.isArray(data) && data.length > 0) {
    data.forEach(record => {
     version = record.NewScriptVersion
    })
  } else {
    console.error('Brak danych lub błąd w formacie odpowiedzi.');
  }
})
.catch(error => console.error('Fetch error:', error));

let Vmessage = ''

function PanicButton() {
  fetch('http://localhost:3001/getips')
      .then(response => response.json())
      .then(data => {
        
        // Sprawdź, czy tablica nie jest pusta
        if (Array.isArray(data) && data.length > 0) {
          data.forEach(record => {
            Panic(record.IP)
            // console.log(record.IP);
          })
        } else {
          console.error('Brak danych lub błąd w formacie odpowiedzi.');
        }
      })
      .catch(error => console.error('Fetch error:', error));
}

fetch('http://localhost:3001/getips')
      .then(response => response.json())
      .then(data => {
        
        // Sprawdź, czy tablica nie jest pusta
        if (Array.isArray(data) && data.length > 0) {
          // Znajdź kontener HTML, gdzie będziemy umieszczać dane
          const dataContainer = document.getElementById('data-container');

          // zapierdalaj po każdym rekordzie w tablicy
          data.forEach(record => {
            // elementy HTML
            if (version > record.ScriptVersion) {
              Vmessage = `(Latest Version is ${version}. Please Update)`
            }
            const recordElement = document.createElement('div');

            if (version > record.ScriptVersion) {
            
              recordElement.innerHTML = `
                <div class="target_info" onclick="openConsoleAt('${record.IP}', '${record.HostName}', '${record.LastOnline}', '${record.ScriptVersion}')">
                  <p>IP: ${record.IP}</p>
                  <p>HostName: ${record.HostName}</p>
                  <p>LastOnline: ${record.LastOnline}</p>
                  <p style='color: crimson;'>ScriptVersion: ${record.ScriptVersion + ' ' + Vmessage}</p>
                </div>
                
              `
              ;
            } else {
              
              recordElement.innerHTML = `
              <div class="target_info" onclick="openConsoleAt('${record.IP}', '${record.HostName}', '${record.LastOnline}', '${record.ScriptVersion}')">
                <p>IP: ${record.IP}</p>
                <p>HostName: ${record.HostName}</p>
                <p>LastOnline: ${record.LastOnline}</p>
                <p>ScriptVersion: ${record.ScriptVersion + ' ' + Vmessage}</p>
              </div>
              
            `
            ;
            }
            
            

            // Dodaj stworzony element do kontenera
            dataContainer.appendChild(recordElement);
          });
        } else {
          console.error('Brak danych lub błąd w formacie odpowiedzi.');
        }
      })
      .catch(error => console.error('Fetch error:', error));


