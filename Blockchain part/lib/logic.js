
/**
 * Handle a transaction that returns a string.
 * @param {org.example.blockasset.register} reg The transaction.
 * @transaction
 */


async function Register(reg){
    
    let AssetRegistry=await getAssetRegistry('org.example.blockasset.property');
    let ParticipantRegistry=await getParticipantRegistry('org.example.blockasset.person');
    const factory = getFactory();
    const concept = factory.newConcept('org.example.blockasset', 'asset_timestamps');
    if(reg.asset.owner==reg.seller ){
      let buyer_id=reg.buyer.adhaarno
    	let bool = await ParticipantRegistry.exists(buyer_id);
      console.log(bool+reg.buyer.adhaarno);
    	if(bool){
    		concept.owner = reg.seller;
    		concept.datetime = reg.datetime;
    		reg.asset.previous_owners.push(concept);
    		reg.asset.owner=reg.buyer;
    		await AssetRegistry.update(reg.asset);
        }
        
    }

}

/**
 * Sample transaction processor function.
 * @param {org.example.blockasset.search} srch @transaction The sample transaction instance.
 */

async function Search(srch){
   
    

}
