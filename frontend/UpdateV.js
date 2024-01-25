

function UpdateV(Ver) {
    fetch("http://localhost:3001/UpdateVersion", {
    method: "POST",
    body: JSON.stringify({
      NewScriptVersion: Ver,
    }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    .then((response) => response.json())
    .then((json) => console.log(json));
  
  }

  

  
  