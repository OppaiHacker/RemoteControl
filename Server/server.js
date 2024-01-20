const express = require('express');
const app = express();
const port = 3001;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

app.use(express.json());

app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
}));



mongoose.connect('mongodb://localhost:27017/pzsPCs', {
    useUnifiedTopology: true,
});


const Record = mongoose.model('PCs', {
    IP: String,
    HostName: String,
    LastOnline: String,
});

app.post('/ip', async (req, res) => {
    const { IP, HostName, LastOnline } = req.body;
  
    try {
        const existingHost = await Record.findOne({ HostName });

        if (existingHost) {
            // Jeśli HostName istnieje, sprawdź, czy IP jest taki sam
            if (existingHost.IP !== IP) {
                // Jeśli IP się różni, zaktualizuj IP i LastOnline
                existingHost.IP = IP;
                existingHost.LastOnline = LastOnline;
                await existingHost.save();
                console.log('Zaktualizowano rekord:', existingHost);
                res.json({ message: 'Dane Zaktualizowane pomyślnie. (LastOnline, IP)' });
            } else {
                // Jeśli IP jest takie samo, zaktualizuj LastOnline
                existingHost.LastOnline = LastOnline;
                await existingHost.save();
                console.log('Zaktualizowano LastOnline dla istniejącego rekordu:', existingHost);
                res.json({ message: 'Dane odebrane i zapisane pomyślnie. (LastOnline)' });
            }
        } else {
            // Jeśli HostName nie istnieje, utwórz nowy rekord
            const record = new Record({
                IP,
                HostName,
                LastOnline: LastOnline
            });
            await record.save();
            console.log('Dane zapisane pomyślnie:', record);
            res.json({ message: 'Dane odebrane i zapisane pomyślnie.' });
        }
    } catch (error) {
        console.error('Błąd podczas przetwarzania danych:', error);
        res.status(500).json({ error: 'Wystąpił błąd podczas przetwarzania danych.' });
    }
});

app.get('/getips', async (req, res) => {
    try {
      const records = await Record.find({});
  
      res.json(records);
    } catch (error) {
      console.error('Błąd podczas pobierania rekordów:', error);
      res.status(500).json({ error: 'Wystąpił błąd podczas pobierania rekordów.' });
    }
  });

app.listen(port, () => {
    console.log(`Serwer nasłuchuje na porcie ${port}`);
});