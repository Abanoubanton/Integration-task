const PublicKey = '0oa70WuefiddqLjqlTlp';
const PrivateKey = 'm2vQxqNixqrEDcQ2heVr';

var phoneNumber = $('phone-number').val()
var code = $('code').val()

var customerAccountNumber = "1";
var msisdn = phoneNumber;
var operatorCode = code;
var subscriptionPlanId = "1224";
var initialPaymentproductId = "SS001";
var initialPaymentDate =  "2020-01-01";
var executeInitialPaymentNow = false;
var recurringPaymentproductId = "SS001";
var productCatalogName = "IntegrationIV";
var executeRecurringPaymentNow = false;
var contractStartDate = "2020-01-01";
var contractEndDate  =  "2020-02-01";
var autoRenewContract = true;
var Language = 1;
var sendVerificationSMS = true;
var allowMultipleFreeStartPeriods = true;
var headerEnrichmentReferenceCode = "yes";
var smsId = "12223";

function getSignature(){
  var message = customerAccountNumber + msisdn + operatorCode + subscriptionPlanId +
          initialPaymentproductId + initialPaymentDate + executeInitialPaymentNow.toString().toLowerCase() +
          recurringPaymentproductId + productCatalogName +
          executeRecurringPaymentNow.toString().toLowerCase() + contractStartDate + contractEndDate +
          autoRenewContract.toString().toLowerCase()+
          (Language.HasValue ? (Language.toString()) : "") +
          (sendVerificationSMS.HasValue ? sendVerificationSMS.Value.toString().toLowerCase() : "")+
          (allowMultipleFreeStartPeriods.HasValue ? allowMultipleFreeStartPeriods.Value.toString().toLowerCase() : "") +
          headerEnrichmentReferenceCode + smsId;

  signature = PublicKey + ":" + CryptoJS.HmacSHA256(message, PrivateKey);
  return signature
}

var sig = getSignature();
var contactID;

// Add event handler
$('#submit-button').on("click", function() {    
  console.log(getSignature())
  $.ajax({
          url: 'http://live.TPAY.me/api/TPAYSubscription.svc/Json/AddSubscriptionContractRequest',
          type: "POST",
          headers: { 'Access-Control-Allow-Origin': '*' },
          crossDomain: true,
          dataType: 'jsonp',
          data : {
            "signature": sig,
            "customerAccountNumber": customerAccountNumber,
            "msisdn" : msisdn,
            "operatorCode": operatorCode,
            "subscriptionPlanId": subscriptionPlanId,
            "initialPaymentproductId": initialPaymentproductId,
            "initialPaymentDate" : initialPaymentproductId,
            "executeInitialPaymentNow": recurringPaymentproductId,
            "recurringPaymentproductId": recurringPaymentproductId,
            "productCatalogName": productCatalogName,
            "executeRecurringPaymentNow": executeRecurringPaymentNow,
            "contractStartDate": contractStartDate,
            "contractEndDate" :  contractEndDate,
            "autoRenewContract": autoRenewContract,
            "Language": Language,
            "headerEnrichmentReferenceCode": headerEnrichmentReferenceCode
          },
          success: function(data)  {
              contactID = data.subscriptionContractId;

              // redirect to the index2.html 
              
          },
          error: function(error)  {
            console.log("Error")
            console.log(error);
          }

      });

      location.href = "index2.html";

});

var pinCode = $('pincode').val()

var message = contactID + pinCode;
var msisdn = phoneNumber;


//calculate digest using hashing algorithm
function CalculateDigest(publicKey,privateKey,message)
	{
		var digest = publicKey + ":" + CryptoJS.HmacSHA256(message, privateKey);
		return digest;
  }
var theDigest = CalculateDigest("0oa70WuefiddqLjqlTlp", "m2vQxqNixqrEDcQ2heVr", message);


// Add event handler
$('#submit-btn').on("click", function() {    

  $.ajax({
          url: ' http://live.TPAY.me/api/TPAYSubscription.svc/Json/VerifySubscriptionContract',
          type: "POST",
          crossDomain: true,
          dataType: 'jsonp',
          data : {
            "signature": theDigest,
            "subscriptionContractId": contractId,
            "pinCode" : pinCode,

          },
          success: function(msg)  {
              console.log(msg);
          },
          error: function(error)  {
            console.log("Error")
            console.log(error);
          }

      });

});
