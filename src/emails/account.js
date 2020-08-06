var SibApiV3Sdk = require('sib-api-v3-sdk');
 
var defaultClient = SibApiV3Sdk.ApiClient.instance;
 
// Configure API key authorization: api-key
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.sendInBlue;
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//apiKey.apiKeyPrefix['api-key'] = "Token"
 
// Configure API key authorization: partner-key
var partnerKey = defaultClient.authentications['partner-key'];
partnerKey.apiKey = process.env.sendInBlue;
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//partnerKey.apiKeyPrefix['partner-key'] = "Token"
 
var api = new SibApiV3Sdk.AccountApi()
api.getAccount().then(function(data) {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});


var apiInstance = new SibApiV3Sdk.SMTPApi();
var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
sendSmtpEmail.to = [{email: "omjain2606@gmail.com",name: "Om Jain"}];
sendSmtpEmail.sender = {email : "omjain639@gmail.com"};
sendSmtpEmail.htmlContent = "This is first content";

apiInstance.sendTransacEmail(sendSmtpEmail).then(data => {
  console.log(data);
})
.catch(e => {
  console.log(e);
})