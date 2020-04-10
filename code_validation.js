const fs = require('fs');
const path = require("path");
const customer = JSON.parse(fs.readFileSync(path.join(__dirname, './JSON/customer.json'), 'utf-8'));
const selectedOfferCode = JSON.parse(fs.readFileSync(path.join(__dirname, './JSON/offer_code.json'), 'utf-8'));
const transaction_detail = JSON.parse(fs.readFileSync(path.join(__dirname, './JSON/transaction_detail.json'), 'utf-8'));

function is_code_applicable(customer, selectedOfferCode, transaction_detail) {
    try
    {
        let falsecase = {
            "requestId": 1,
            "CodeType": selectedOfferCode.codeType,
            "ValidFor": selectedOfferCode.validFor,
            "CodeName": selectedOfferCode.codeName,
            "Applicable": "N",
            "msg": ``
        }
        // console.log("CHANNEL EXITS ",checkOfferCodeChannel(selectedOfferCode.termsFilter.channel , transaction_detail.channel));
        
        if (!(checkOfferCodeChannel(selectedOfferCode.termsFilter.channel , transaction_detail.channel)))
        {
            let msg = `Channel ${transaction_detail.channel} is Not Applicable for ${selectedOfferCode.codeName},  Aviailable Channels ${selectedOfferCode.termsFilter.channel}`
            falsecase.msg = msg
            return falsecase
        
        }
        if (!(checkOfferCodetransTypeCode(selectedOfferCode.termsFilter.transTypeCode, transaction_detail.transTypeCode)))
        {
            let msg = `Transaction Type ${transaction_detail.transTypeCode} is Not Applicable for ${selectedOfferCode.codeName} and Available transaction types are ${selectedOfferCode.termsFilter.transTypeCode}`
            falsecase.msg = msg
            return falsecase
        }
        let arr1 = customer.customerCategory
        let arr2 = selectedOfferCode.termsFilter.customerCategory
        const intersection = arr1.filter(element => checkOfferCodeCustomerCategory(arr2 , element));
        if (!(intersection.length > 0))
        {
            falsecase.msg = `Customer Category ${customer.customerCategory} is Not Applicable for ${selectedOfferCode.codeName} and  Available Customer Categories ${selectedOfferCode.termsFilter.customerCategory}`
            return falsecase
        }
        let objdata = selectedOfferCode.termsFilter.currency
        let results = objdata.map(a => a.currCode)
        if (!(checkOfferCodecurrency(results,transaction_detail.currency)))
        {
            falsecase.msg = `Currency ${transaction_detail.currency} is Not Applicable for ${selectedOfferCode.codeName} Available currencies are ${objdata.map(a => a.currCode)}`
            return falsecase
        }
        if (!((selectedOfferCode.minMaxAmountType == 'LCY') && (parseInt(selectedOfferCode.minimumINRAmount) < parseInt(transaction_detail.lcyAmount)) && (parseInt(transaction_detail.lcyAmount) < parseInt(selectedOfferCode.maximumINRAmount))))
        {
            falsecase.msg = `LCY Amount ${transaction_detail.lcyAmount} is Not With in Range ${selectedOfferCode.codeName}, Range is from ${selectedOfferCode.minimumINRAmount} to ${selectedOfferCode.maximumINRAmount}`
            return falsecase
        }
        if (!((selectedOfferCode.minMaxAmountType == 'LCY') && (parseInt(selectedOfferCode.minimumINRAmount) < parseInt(transaction_detail.lcyAmount)) && (parseInt(transaction_detail.lcyAmount) < parseInt(selectedOfferCode.maximumINRAmount))))
        {
            falsecase.msg = `FCY Amount ${transaction_detail.lcyAmount} is Not With in Range ${selectedOfferCode.codeName}, Range is from ${selectedOfferCode.minimumINRAmount} to ${selectedOfferCode.maximumINRAmount}`
            return falsecase
        }
        let date = new Date(transaction_detail.transDate)
        let startdate = new Date(selectedOfferCode.startDateTime)
        let enddate = new Date(selectedOfferCode.endDateTime)
        if (!((startdate < date) && (date < enddate)))
        {
            falsecase.msg = `Transaction Date ${transaction_detail.transDate} is Not With in Range ${selectedOfferCode.codeName}, Range is From ${selectedOfferCode.startDateTime} to ${selectedOfferCode.endDateTime}`
            return falsecase
        }
        else
        {
            let applicable = "Y"
            falsecase.Applicable = applicable
            return falsecase
        }
    } catch (err)
    {
        return { "status": "unsuccess", "msg": err.message, "applicable": "N" };
    }
}

function checkOfferCodeChannel(selectedOfferCodeChannel , transaction_detail){

    for(let i =0; i<selectedOfferCodeChannel.length;i++){
        if(selectedOfferCodeChannel[i] === transaction_detail){
            return true;
        }        
    }
    return false;
}
function  checkOfferCodetransTypeCode(selectedOfferCodetransTypeCode, transaction_detail){
    for(let i =0; i<selectedOfferCodetransTypeCode.length;i++){
        if(selectedOfferCodetransTypeCode[i] === transaction_detail){
            return true;
        }        
    }
    return false;
}
function  checkOfferCodeCustomerCategory(selectedOfferCodeCustomerCategory, selectedOfferCode){
    for(let i =0; i<=selectedOfferCodeCustomerCategory.length;i++){
        if(selectedOfferCodeCustomerCategory[i] === selectedOfferCode){
            return true;
        }        
    }
    
    return false;
}
function checkOfferCodecurrency(selectedOfferCodecurrency , transaction_detail){

    for(let i =0; i<selectedOfferCodecurrency.length;i++){
        if(selectedOfferCodecurrency[i] === transaction_detail){
            return true;
        }        
    }
    return false;
}
console.log(is_code_applicable(customer, selectedOfferCode, transaction_detail));
module.exports = is_code_applicable;
