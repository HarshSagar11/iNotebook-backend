const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult} = require('express-validator')
const Note = require('../models/Notes')
const router = express.Router();

router.get('/fetchallnotes',fetchuser,async(req,res)=>{
    const notes = await Note.find({user : req.user.id})
    res.json(notes);
})

router.post('/addNote',
    fetchuser,
    [
        body('title').isLength({min:3}).withMessage('Name length must be greater than 3.'),
        body('description').isLength({min:3}).withMessage('Name length must be greater than 3.'),
    ],
    async(req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ "errors": errors.array()});
        }
        try{
            const {title,description,tag}=req.body;
            const note = new Note({title,description,tag,user : req.user.id});
            const savedNote = await note.save();
            res.json(savedNote);
        }
        catch(error){
            //returning internal server error if any unexpected things happend
            console.error(error.message);
            res.status(500).json({error:"Internal server Error"})
        }

})

router.put('/updatenote/:id',fetchuser, async(req,res)=>{
    try{
        const {title, description, tag} = req.body;
        const newNote = {}
        if(title){newNote.title = title};
        if(description){newNote.description = description};
        if(tag){newNote.tag = tag};
    
        let note = await Note.findById(req.params.id);
        if(!note){return res.status(404),send('Not found')};
    
        if(note.user.toString() != req.user.id){
            return res.status(401).send('Not allowed');
        }
    
        note = await Note.findByIdAndUpdate(req.params.id,{$set : newNote}, {new : true});
        res.json({note});
    }
    catch(error){
        //returning internal server error if any unexpected things happend
        console.error(error.message);
        res.status(500).json({error:"Internal server Error"})
    }
})

router.delete('/deletenote/:id',fetchuser, async(req,res)=>{
    try{
        let note = await Note.findById(req.params.id);
        if(!note){return res.status(404),send('Not found')};
    
        if(note.user.toString() != req.user.id){
            return res.status(401).send('Not allowed');
        }
    
        note = await Note.findByIdAndDelete(req.params.id);
        res.json({note});
    }
    catch(error){
        //returning internal server error if any unexpected things happend
        console.error(error.message);
        res.status(500).json({error:"Internal server Error"})
    }
})

module.exports = router;