const con = require("composer-client").BusinessNetworkConnection;

const upgrd = require("composer-cli").Network.Upgrade;
      
con_obj = new con();

cards=["admin@blockasset","reg@blockasset","w@blockasset"]


async function addpartcipant(data,card){

        connection = await con_obj.connect(card);

        factory = connection.getFactory();
        
        registry = await con_obj.getParticipantRegistry("org.example.blockasset.person");
            
        person = factory.newResource("org.example.blockasset","person",data.ID);

        address  = factory.newConcept("org.example.blockasset","ab_address");

        person.name=data.name;
        person.father_name=data.father_name;
        address.doorno=data.address.doorno;
        address.street_name=data.address.street_name;
        address.landmark=data.address.landmark;
        address.city=data.address.city;
        address.state=data.address.state;
        address.zipcode=data.address.zipcode;
        person.address=address;
        person.ph_no=data.ph_no;
        person.email_id=data.email_id;
        
        registry.add(person);

        console.log("particpant added.......");

} 
async function addregistrator(data,card){
 
        connection = await con_obj.connect(card);

        factory = connection.getFactory();
        
        registry = await con_obj.getParticipantRegistry("org.example.blockasset.registrator");
            
        registrator = factory.newResource("org.example.blockasset","registrator",data.ID);

        registrator.name=data.name;
        registrator.ph_no=data.ph_no;
        registrator.email_id=data.email_id;
        registrator.registor_office_id=data.registor_office_id;
        registrator.district=data.district;
        
        registry.add(registrator);

        console.log("Registrator added.......");

}

async function addproperty(data,card){

        connection = await con_obj.connect(card);

        factory = connection.getFactory();
        
        registry = await con_obj.getAssetRegistry("org.example.blockasset.property");
            
        property = factory.newResource("org.example.blockasset","property",data.ID);

        address  = factory.newConcept("org.example.blockasset","ab_address");
        
        prop_owner = factory.newRelationship("org.example.blockasset","person",data.owner);

        property.propname=data.propname;
        property.surroundedby=data.surroundedby;
        property.price=data.price;
        property.squarefoot=data.squarefoot;
        property.bearing=data.bearing;
        address.doorno=data.address.doorno;
        address.street_name=data.address.street_name;
        address.landmark=data.address.landmark;
        address.city=data.address.city;
        address.state=data.address.state;
        address.zipcode=data.address.zipcode;
        property.prop_address=address;
        property.reg_datetime=new Date();
        property.owner = prop_owner;
        property.previous_owners=[];
        
        registry.add(property);

        console.log("property added.......");



}

async function searchproperty(ID,card){

        connection = await con_obj.connect(card);

        factory = connection.getFactory();
        
        registry = await con_obj.getAssetRegistry("org.example.blockasset.property");
        
        property = await registry.get(ID);
        
        name=property.propname;
        s_by =property.surroundedby;
        prc =property.Price;
        sqft = property.squarefoot;
        brng= property.bearing;
        drno =property.prop_address.doorno;
        street=property.prop_address.street_name;
        landmark=property.prop_address.landmark;
        city = property.prop_address.city;
        state=property.prop_address.state;
        zip = property.prop_address.zipcode;
        time = property.reg_datetime;
        owner= property.owner.$identifier;
        prev_own =property.previous_owners;

        data_= {"Property Name" : name,
        "Property sourroundedby" :s_by,
        "Price" : prc,
        "Square Foot" : sqft,
        "Bearing" : brng,
        "Address" :{
        "Door No" : drno,
        "Street" : street,
        "Landmark" :landmark,
        "City" :   city,
        "State" : state,
        "Zipcode" :zip
        },
        "Date Time ": time,
        "Owner": owner,
        "Previous Owners" : prev_own
 }
        console.log(data_);
}

async function registerproperty(data,card){

        asset_id =data.asset;
        seller_id=data.seller;
        buyer_id=data.buyer;
        
        data.$class="org.example.blockasset.register";
        data.buyer="resource:org.example.blockasset.person#"+data.buyer;
        data.seller="resource:org.example.blockasset.person#"+data.seller;
        data.asset="resource:org.example.blockasset.property#"+data.asset;
        data.datetime=new Date();
        
        connection = await con_obj.connect(card);

        serializer = connection.getSerializer();

        transaction_connection = await con_obj.getTransactionRegistry("org.example.blockasset.register"); 

        registry = await con_obj.getAssetRegistry("org.example.blockasset.property");
        person = await con_obj.getParticipantRegistry("org.example.blockasset.person");
        
        try{
        
                property_val = await registry.get(asset_id);
                
        }
        catch(err){
                throw new Error("Asset not exists....");
        }

        if(property_val.owner.$identifier==seller_id){
                
                let bool = await person.exists(buyer_id);
                if(bool){
                        
                        resource = serializer.fromJSON(data);
        
                        result = await con_obj.submitTransaction(resource);

                        console.log("registered successfully....");
                
                }
                else{
                        throw new Error("Buyer not exists....");
                }

        }
        else{
                throw new Error("Fraudant seller....");
        }
        
        


}

async function upgrade(){

        let network_info ={
      
            networkName : 'blockasset',
            networkVersion : '0.0.6',
            card  : 'PeerAdmin@hlfv1'
      
        }
      
        upgrd.handler(network_info);
      
      }
      

person_data={  
        ID:'1111',
        name:"karthikeyan",
        father_name:"loganathan",
        address:
        {
            doorno:"101",
            street_name:"krishnan kovil street",
            landmark:"Near pattai kovil",
            city:"salem",
            state:"Tamil Nadu",
            zipcode:"636001"
        },   
        ph_no:342423423424,
        email_id:"karthi@gmail.com"
};      

property_data={
        ID:"0000",
        propname:"Ram vilas",
        surroundedby:"something",
        price:2500000,
        squarefoot:1200,
        bearing:"something",
        address:
        {
            doorno:"101",
            street_name:"krishnan kovil street",
            landmark:"Near pattai kovil",
            city:"salem",
            state:"Tamil Nadu",
            zipcode:"636001"
        },   
        owner :"1111"
}

registrator_data={
        ID:'1605',
        name:"Rex",
        ph_no:1234567890,
        email_id:"reg@gmail.com",
        registor_office_id:"2F4R",
        district:"salem"

}
propID="0000";

register_data={

        buyer:"2222",
        seller:"1111",
        asset:"0000",
        datetime:""

}

//addpartcipant(person_data,cards[0]);

//addregistrator(registrator_data,cards[0]);

//addproperty(property_data,cards[0]);

searchproperty(propID,cards[0]);

//registerproperty(register_data,cards[0]);

//upgrade();
