const express=require("express");
const app=express();
const fs=require("fs");
const multer=require("multer");
const {createWorker,createScheduler} =require("tesseract.js")
const worker=createWorker({});

// const scheduler = createScheduler();
// const worker1 = createWorker();
// const worker2 = createWorker();

const storage=multer.diskStorage({
    destination:(req,res,cb)=>{
        cb(null,"./uploads");
    },
    filename:(req,res,cb)=>{
        cb(null,res.originalname) ;
    }
});

const upload =multer({storage}).single('avatar');
app.set('view engine','ejs');

app.get('/',(req,res)=>{
    res.render('index.ejs');
})
app.post('/upload',upload,(req,res)=>{
    fs.readFile(`./uploads/${req.file.originalname}`,(err,data_)=>{

        // worker.load()
        // .then(()=>{
        //     return worker.loadLanguage("eng");
        // })
        // .then(()=>{
        //     return worker.initialize("eng");
        // })
        // .then(()=>{
        //     return worker.recognize(data)
        // })
        // .then(data=>{
        //     console.log(data);
        // })
        // .then(()=>{
        //     worker.terminate();
        // })
        // .catch(e=>{
        //     console.log(e);
        // })
        if(err){
            console.log('there is an error');
        }

        (async () => {
            await worker.load();
            await worker.loadLanguage('eng');
            await worker.initialize('eng');
            const { data: { text } } = await worker.recognize(data_);
            console.log(text);
            const { data } = await worker.getPDF();
            console.log(data.text);
            fs.writeFileSync(`${req.file.originalname}.pdf`, Buffer.from(data));
            // console.log('Generate PDF: tesseract-ocr-result.pdf');
            await worker.terminate();
            const file=`${__dirname}/${req.file.originalname}.pdf`;
            // res.redirect('/download');
            res.download(file);
          })();

        // (async () => {
        //     await worker1.load();
        //     await worker2.load();
        //     await worker1.loadLanguage('eng');
        //     await worker2.loadLanguage('eng');
        //     await worker1.initialize('eng');
        //     await worker2.initialize('eng');
        //     scheduler.addWorker(worker1);
        //     scheduler.addWorker(worker2);
        //     /** Add 10 recognition jobs */
        //     const results = await Promise.all(Array(10).fill(0).map(() => (
        //       scheduler.addJob('recognize', data)
        //     )))
        //     console.log(results.data.text);
        //     await scheduler.terminate(); // It also terminates all workers.
        //   })();
    })
})
// app.get('/download',(req,res)=>{
//     const file=`${__dirname}/${req.file.originalname}`;
//     res.download(file);
// })
app.listen(3000,()=>{
    console.log(`listening on port 3000`);
});