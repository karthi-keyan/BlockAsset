var express =   require("express");
var multer  =   require('multer');
var fs      =   require("fs");
var app     =   express();
var path    =   require("path");
var model   =   require("pdf-text");
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname+".pdf");
  }
});


var upload = multer({ storage : storage}).single('userdocument');

app.use(express.static(path.join(__dirname,"public")));

function remove(arr,element){
     n_arr=[];
     arr.forEach(
         function(value){
             if(value!=element){
                 n_arr.push(value);
             }
         }
     );
     return n_arr;
}
app.get('/',function(req,res){
      res.sendFile(__dirname + "/index.html");
});

app.post('/uploadedfile',function(req,res){
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
           
        let vectnames=[
                          "Date","owner_name","owner_age","o_father_name","owner_address",
                          "owner_aadhaarno","owner_mobileno","buyer_name","b_father_name",
                          "buyer_age","buyer_address","buyer_aadhaarno","buyer_mobileno",
                          "sq_feet","bearing","surroundedby","doc_no",
                          "registrar","reg_location","price"
                      ];

        let read_json="";
        var filepath=path.join(__dirname,req.file.path);
        model("C:/Users/karthi/Desktop/BlockAsset/AIpart/documents/org.pdf"
        ,function(err,data){
          
            if(err){
                res.end("Error");
            }

            else{
                
                data=data.join('').split(' ').join('').split('.').join('');
                data=data.split('_');
                data=remove(data,'');
                model(filepath,function(err_,data_){
                    
                    data_=data_.join('').split(' ').join('').split('.').join('');
                    
                    data.forEach(function(value){
                        data_=data_.replace(value,"\n")
                        
                    });
                    
                    data_=data_.split('\n');
                    data_=remove(data_,'');
                    data_=clean_data(data_);
                    let json_data="{";
                    for(let i=0;i<20;i++){
                        json_data+= vectnames[i]+"  :  "+data_[i];
                        if(i<data.length-1){json_data+=','+'\n';}
                    }
                    json_data+="}";

                    fs.writeFileSync("C:/Users/karthi/Desktop/BlockAsset/AIpart/json_data/input_json.json",JSON.stringify(json_data));
                    read_json=fs.readFileSync("C:/Users/karthi/Desktop/BlockAsset/AIpart/json_data/input_json.json");
                    read_json=JSON.parse(read_json);
                    
                    res.write("############### FILE PARSED SUCCESSFULLY ###############\n\n\n\n");
                    res.end(read_json+"\n\n\n\n########################################################"); 
              
                })
            }
        })
    });
});

app.listen(3000,function(){
    console.log("Working on port 3000");
});

function isDigit(n) {
    return Boolean([true, true, true, true, true, true, true, true, true, true][n]);
}

function clean_data(data){
    main_data=[];
    sub_data=[];
    for(var i=0;i<data.length;i++){
         if(data[i].replace("(AADHAARNO:","\n").split('\n').length==2){
         temp=data[i].replace("(AADHAARNO:","\n");
         temp=temp.split('\n')
         main_data=main_data.concat(temp);
                 }
       else{
           main_data.push(data[i]);
       }
    }
    data=main_data;
    main_data=[];
    for(var i=0;i<data.length;i++){
        if(data[i].replace("intheofficeoftheSub-Registrar,","\n").split('\n').length==2){
        temp=data[i].replace("intheofficeoftheSub-Registrar,","\n");
        temp=temp.split('\n')
        main_data=main_data.concat(temp);
                }
      else{
          main_data.push(data[i]);
      }
   }
   data=main_data;
    main_data=[];
    for(var i=0;i<data.length;i++){
        if(data[i].replace("RegistrationOffice,","\n").split('\n').length==2){
        temp=data[i].replace("RegistrationOffice,","\n");
        temp=temp.split('\n')
        main_data=main_data.concat(temp);
                }
      else{
          main_data.push(data[i]);
      }
   }
    data=main_data;
    ndata=""
    main_data=[]
    char_array=[];
    for(var i=0;i<data.length;i++){
        ndata=data[i];
        for(var j=0;j<data[i].length;j++){
             if(!isDigit(data[i][j]) && data[i][j]==data[i][j].toUpperCase()&& j!=0 && !char_array.includes(data[i][j])){
                char_array.push(data[i][j])            
                ndata=ndata.split(data[i][j]).join(' '+data[i][j]);
             }
         }
        char_array=[]
        main_data.push(ndata);
    }
    main_data[0]+=" "+main_data[1];
    main_data.splice(1,1);
    data=[]
    for(var i=0;i<main_data.length;i++){
           if(!(i==15 || i==16)){
              data.push(main_data[i]);
           }
           else if(i==15){
              data.push("Some Surrounding area data")
           }
    }
    return data;
}