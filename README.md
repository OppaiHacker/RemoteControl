//Only God Know How This Work even i Dont know :P

# RemoteControl Setup


Struktura Bazy w Mongo DB

![image](https://github.com/OppaiHacker/RemoteControl/assets/89047121/7376a72b-f007-48ed-a8d5-10891654d3f4)


## Setup
<ol>
  <li>Zainstaluj Pythona (ja mam 3.12 chyba) i paczki</li>   
  
  ```
   $ pip install requests flask flask-cors datetime 
  ```
  
  <li>Plik main.pyw Przenieść do autostartu, Lub odpal ręcznie (komputer musi być w tej samej sieci. Można robić wszystko na 1 komputerze)</li>
  <li> W pliku main.pyw zmień IP (linjika 36, zmień tylko to pierwsze) na ip które ma twój komputer wykorzystwany jako serwer dla Backendu (server.js)</li>

  <li>Zrób Bazę Danych w mongoDB</li>
  <ul>
    <li>Database Name: pzsPCs</li>
    <li>Collection Name: pcs</li>
  </ul>
  

  
  <li>odpalić Backend w konsole => (node server.js) w folderze Server</li>
  <li>odpalić Frontend w konsole => (http-server) w folderze frontend</li>
  <li>Gotowe</li>
</ol>

## Screenshots

![image](https://github.com/OppaiHacker/RemoteControl/assets/89047121/f1a9fa77-c7a8-461e-8bf9-e1ffa6ad512d)
![image](https://github.com/OppaiHacker/RemoteControl/assets/89047121/4e42c4b4-b07a-4583-9667-b5ff143702d2)
![image](https://github.com/OppaiHacker/RemoteControl/assets/89047121/e043ea07-aef8-445a-90ae-b9b24732892a)

## Problemy
* Dane się nie wyświetlają
  => wyłącz adblocka <br>
![image](https://github.com/OppaiHacker/RemoteControl/assets/89047121/988f167c-c0f7-4b6f-8f0d-16790c934e32)


