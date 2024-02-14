
const express = require("express")
const fs = require("fs");
const path = require("path")
const fileUpload = require("express-fileupload")
const app = express();

app.use(express.json());
app.use(fileUpload());

class File {
    constructor(name,size,data){
        this.name = name;
        this.size = size;
        this.data = data;
        this.id = Date.now();
    }
}

app.post("/files", function(request,response){
       let file = request.files.file;
       console.log(file);
       console.log(Date.now());
       let fileData = file.data.toString("utf-8");
       let newFile =  new File(file.name,file.size,fileData);
       fs.mkdirSync(`./Files/${newFile.id}`)
       fs.writeFileSync(`./Files/${newFile.id}/${newFile.name}`, newFile.data);
       response.json({id: newFile.id });    
})
       
app.get("/files/:fileId", function(request,response){
       let id = request.params.fileId;
       let targetPath = path.resolve(`Files/${id}`);
       if (!fs.existsSync(targetPath)) {
            return response.status(404).json({message: "The file is not avaliable"})
       }

       let fileName = fs.readdirSync(targetPath,"utf-8");
       if(fileName.length == 0){
         return response.status(404).json({message: "The file is not avaliable"})
       } else{
        return response.status(201).json({message: fileName[0]});
       }
});

app.get("/allfiles",function(request,response){
    let allIds = fs.readdirSync(path.resolve("Files"),"utf-8");
    let result  = [];
    console.log(allIds);
    for(let i = 1; i < allIds.length; ++i) {
        let targetPath = path.resolve(`Files/${allIds[i]}`);
        let fileName = fs.readdirSync(targetPath,"utf-8");
        result.push({filename : fileName[0], id: allIds[i]});
    }
    if(result.length == 0){
        return response.status(404).json({message: "Can not find the files"})
    } else {
        return response.status(201).json({message: result});
    }
});

app.delete("/files/:fileId",function(request,response){
    let fileId = request.params.fileId;
    const targetPath = path.join(__dirname,`Files/${fileId}`);
    console.log(targetPath);
    fs.rmdirSync(targetPath,{recursive:true});
    response.status(200).json('File has been deleted successfully');
});



app.listen(3001, function(){
       console.log("Server is running");
})
