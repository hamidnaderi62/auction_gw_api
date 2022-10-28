const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const schedule = require('node-schedule');

const {invoke , evaluate} = require('./Transaction')

const app = express()

app.use(bodyParser.json())
app.use(cors())


const SERVER_USER_ID = 'appuser'
const channelName = 'auction'
const chaincodeName = 'auction'



//*********************************
//General
//*********************************


    //MultiLang Error
    const multiLangError = {
        en_1000 : 'suggestion not exist' ,
        fa_1000 : 'پیشنهاد وجود ندارد' ,

        en_1001 : 'auction not exist' ,
        fa_1001 : 'درخواست فروش با این مشخصات وجود ندارد' ,

        en_1002 : 'auction is not available' ,
        fa_1002 : 'درخواست فروشی با این مشخصات در دسترس  نمی باشد' ,

        en_1003 : 'suggestion is not valid' ,
        fa_1003 : 'پیشنهاد معتبر نمی باشد' ,

        en_1004 : 'auction owner can not register suggestion for that auction' ,
        fa_1004 : 'فروشنده امکان ثبت پیشنهاد برای درخواست خود ندارد' ,

        en_1005 : 'auction is not available' ,
        fa_1005 : 'درخواست فروشی با این مشخصات در دسترس  نمی باشد' ,

        en_1006 : 'suggested price cannot be lower than base price' ,
        fa_1006 : 'قیمت پیشنهادی نمی تواند کمتر از قیمت پایه باشد' ,

        en_1007 : 'suggestion registration date cannot be befor than auction registration date' ,
        fa_1007 : 'تاریخ ثبت پیشنهاد نمی تواند قبل از تاریخ ثبت درخواست فروش باشد' ,

        en_1008 : 'suggestion registration date cannot be after than auction available days' ,
        fa_1008 : 'تاریخ ثبت پیشنهاد نمی تواند پس از زمان انقضای درخواست باشد' ,    
    };



    //Run every Day
    const job = schedule.scheduleJob('0 0 0 * * *', function(){
        //console.log('Job');
        //acceptSuggestionAutomatically();
    });
    
    
    function generateNewID(table)
    {
        const newId = table + Date.now();
        return newId;
    }
    
    function errorEncoding(error)
    {
        
        return error.substring(error.indexOf("@@@")+ 3 , error.indexOf("$$$"));
    }
    //*********************************
    //Person
    //*********************************
    //getPerson
    app.get('/person/:id', async (req , res) =>{
    
        const personId = req.params.id;
        console.log('personId:', personId)
    
        const person =  await evaluate(
            SERVER_USER_ID,
            channelName,
            chaincodeName,
            'getPerson',
            [personId]
        )
    
        return res.status(201).send(person)
    })
    
    //*********************************
    //personLogin
    app.post('/login', async (req , res) =>{
        const username = req.body.username;
        const password = req.body.password;
    
        //SERVER_USER_ID = username;
        const person =  await evaluate(
            SERVER_USER_ID,
            channelName,
            chaincodeName,
            'personLogin',
            [username,
             password    
            ]
        )
    
        return res.status(201).send(person)
    })
    
    
    //*********************************
    //Auction
    //*********************************
    //getAuctionById
    app.get('/auction/:id', async (req , res) =>{
    
        const auctionId = req.params.id;
        console.log('auctionId:', auctionId)
    
        const auction =  await evaluate(
            SERVER_USER_ID,
            channelName,
            chaincodeName,
            'getAuction',
            [auctionId]
        )
    
        return res.status(201).send(auction)
    })
    
    //*********************************
    //getAuctionsByPerson
    app.get('/auctionsByPerson/:personId', async (req , res) =>{
    
        const personId = req.params.personId;
        console.log('personId', personId)
    
        const auctions =  await evaluate(
            SERVER_USER_ID,
            channelName,
            chaincodeName,
            'getAuctionsByPerson',
            [personId]
        )
        
        return res.status(201).send(auctions)
    })
    
    //*********************************
    //getAuctionsByStatus
    app.get('/auctionsByStatus/:auctionStatus', async (req , res) =>{
    
        const auctionStatus = req.params.auctionStatus;
        console.log('auctionStatus', auctionStatus)
        const auctions =  await evaluate(
            SERVER_USER_ID,
            channelName,
            chaincodeName,
            'getAuctionsByStatus',
            [auctionStatus]
        )
        
        return res.status(201).send(auctions)
    })
    //*********************************
    //create Auction
    app.post('/auction', async (req , res) =>{
        const auction = req.body;
        console.log(auction)
        const auctionId = generateNewID('AUC_');
        const code = auctionId;
        const regDate =  new Date().toISOString().split('T')[0];
        
        const {
            title,
            desc,
            features,
            basePrice,
            image1,
            image2,
            image3,
            availableDays,
            personID
        } = auction
    
        try{
            await invoke(
                SERVER_USER_ID,
                channelName,
                chaincodeName,
                'createAuction',
                [
                    auctionId,
                    code,
                    title,
                    desc,
                    features,
                    basePrice,
                    image1,
                    image2,
                    image3,
                    availableDays,
                    regDate,
                    personID
                ]
            )
        }catch(ex){
            console.log(ex.message)
            return res.send({
                message : ex.message
            })
        }
    
    
        console.log('create auction:' , auction)
        return res.send(auction)
    })
    
    //*********************************
    //Suggestion
    //*********************************
    //getSuggestion
    app.get('/suggestion/:suggestionId', async (req , res) =>{
    
        const suggestionId = req.params.suggestionId;
        console.log('personId', suggestionId)
    
        const suggestion =  await evaluate(
            SERVER_USER_ID,
            channelName,
            chaincodeName,
            'getSuggestion',
            [suggestionId]
        )   
        return res.status(201).send(suggestion)
    })
    
    //*********************************
    //getSuggestionsByPerson
    app.get('/suggestionsByPerson/:personId', async (req , res) =>{
    
        const personId = req.params.personId;
        console.log('personId', personId)
    
        const suggestions =  await evaluate(
            SERVER_USER_ID,
            channelName,
            chaincodeName,
            'getSuggestionsByPerson',
            [personId]
        )   
        return res.status(201).send(suggestions)
    })
    
    //*********************************
    //getSuggestionsByAuction
    app.get('/suggestionsByAuction/:auctionId', async (req , res) =>{
    
        const auctionId = req.params.auctionId;
        console.log('auctionId', auctionId)
    
        const suggestions =  await evaluate(
            SERVER_USER_ID,
            channelName,
            chaincodeName,
            'getSuggestionsByAuction',
            [auctionId]
        )   
        return res.status(201).send(suggestions)
    })
    
    //*********************************
    //create Suggestion
    app.post('/suggestion', async (req , res) =>{
        const suggestion = req.body;
        console.log(suggestion)
        const suggestionId = generateNewID('SUG_');
        const code = suggestionId;
        const regDate = new Date().toISOString().split('T')[0];
    
        const {
            lang,
            personID,
            auctionID,
            suggestedPrice
        } = suggestion
    
        try{
            await invoke(
                SERVER_USER_ID,
                channelName,
                chaincodeName,
                'createSuggestion',
                [
                    suggestionId,
                    code,
                    personID,
                    auctionID,
                    suggestedPrice,
                    regDate
                ]
            )
        }catch(ex){
            let err = multiLangError[lang + '_' + errorEncoding(ex.message)];
            console.log(err)
            return res.send({
                message : err
            })
        }
    
    
        console.log('create suggestion:' , suggestion)
        return res.status(201).send(suggestion)
    })
    
    
    
    //*********************************
    //accept Suggestion
    app.post('/acceptSuggestion', async (req , res) =>{
        const lang = req.body.lang;
        const suggestionId = req.body.suggestionId;
        console.log(suggestionId);
        
    
        try{
            await invoke(
                SERVER_USER_ID,
                channelName,
                chaincodeName,
                'acceptSuggestion',
                [
                    suggestionId
                ]
            )
        }catch(ex){
            let err = multiLangError[lang + '_' + errorEncoding(ex.message)];
            console.log(err)
            return res.send({
                message : err
            })
        }
    
    
        console.log('accept suggestion:')
        return res.status(201)
    })
    
    //*********************************
    //acceptSuggestionAutomatically
    
    async function acceptSuggestionAutomatically()
    {
        try{
            await invoke(
                SERVER_USER_ID,
                channelName,
                chaincodeName,
                'acceptSuggestionAutomatically',
                [ ]
            )
        }catch(ex){
            console.log(ex.message)
        }
    
    
        console.log('acceptSuggestionAutomatically')
    }    
        
    
    //*********************************
    //*********************************
    //*********************************

    
    app.listen(4001 , () =>{
        console.log('app is listen to port 4001')
    })
    
