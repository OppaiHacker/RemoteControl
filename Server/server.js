const express = require('express');
const app = express();
const port = 3001;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

app.use(express.json());

app.use(cors({
    origin: '*',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 200,
    allowedHeaders: 'Content-Type,Authorization',
}));


mongoose.connect('mongodb://localhost:27017/pzsPCs', {
    useUnifiedTopology: true,
});

app.options('/UpdateVersion', cors());

const Record = mongoose.model('PCs', {
    IP: String,
    HostName: String,
    LastOnline: String,
    ScriptVersion: Number,
});

const VRecord = mongoose.model('VersionControl', {
    NewScriptVersion: Number,
});


app.post('/UpdateVersion', async (req, res) => {
    const { NewScriptVersion } = req.body;

    try {
        let existingRecord = await VRecord.findOne({ NewScriptVersion });

        if (existingRecord) {
            // Aktualizuj istniejący rekord
            existingRecord.NewScriptVersion = NewScriptVersion;
            await existingRecord.save();

            console.log(`
            #############
                ${existingRecord.NewScriptVersion} Updated To ${NewScriptVersion}
            #############
            `);

        } else {
            // Twórz nowy rekord
            const newRecord = new VRecord({ NewScriptVersion });
            await newRecord.save();

            console.log(`
            #############
                ${NewScriptVersion} -- ${NewScriptVersion}
            #############
            `);
        }

        // Usuń poprzedni rekord
        await VRecord.deleteMany({ NewScriptVersion: { $ne: NewScriptVersion } });

        console.log('Operacja zakończona pomyślnie.');
        return res.json({ message: 'Operacja zakończona pomyślnie.' });
    } catch (error) {
        console.error('Błąd podczas przetwarzania danych:', error);
        return res.status(500).json({ error: 'Wystąpił błąd podczas przetwarzania danych. Ver' });
    }
});



app.post('/ip', async (req, res) => {
    const { IP, HostName, LastOnline, ScriptVersion } = req.body;
  
    try {
        const existingHost = await Record.findOne({ HostName });

        if (existingHost) {
            // Jeśli HostName istnieje, sprawdź, czy IP jest taki sam
            if (existingHost.IP !== IP) {
                // Jeśli IP się różni, zaktualizuj IP i LastOnline
                existingHost.IP = IP;
                existingHost.LastOnline = LastOnline;
                existingHost.ScriptVersion = ScriptVersion
                await existingHost.save();
                console.log('Zaktualizowano rekord:', existingHost);
                res.json({ message: 'Dane Zaktualizowane pomyślnie. (LastOnline, IP)' });
            } else {
                // Jeśli IP jest takie samo, zaktualizuj LastOnline
                existingHost.LastOnline = LastOnline;
                existingHost.ScriptVersion = ScriptVersion
                await existingHost.save();
                console.log('Zaktualizowano LastOnline dla istniejącego rekordu:', existingHost);
                res.json({ message: 'Dane odebrane i zapisane pomyślnie. (LastOnline)' });
            }
        } else {
            // Jeśli HostName nie istnieje, utwórz nowy rekord
            const record = new Record({
                IP,
                HostName,
                LastOnline: LastOnline,
                ScriptVersion: ScriptVersion,
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

app.get('/getversion', async (req, res) => {
    try {
      const vrecords = await VRecord.find({});

  
      res.json(vrecords);
    } catch (error) {
      console.error('Błąd podczas pobierania wersji', error);
      res.status(500).json({ error: 'Wystąpił błąd podczas pobierania wersji.' });
    }
});



app.listen(port, () => {
    console.log(`Serwer nasłuchuje na porcie ${port}`);
});