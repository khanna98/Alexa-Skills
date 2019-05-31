// Dependencies
const Alexa = require('ask-sdk-core');
const request = require('request');
// const db = require('./db.json');
const fs = require('fs')


// API for fetching Data
const api_url = "http://www.mocky.io/v2/5cefc6d13000001b303cd307";

// LaunchRequest Handler
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Welcome! You can ask for the show information.';
    // const shows = fetchShows();
    // console.log(JSON.stringify(shows));
    // var category = handlerInput.requestEnvelope.request.intent.slot.Category.value;
    //   console.log(category);
    //   var myJson = fetchShows();
    //   let ans = '';
    //   for(var myKey in myJson){
    //     if(myKey.category === category){
    //       ans += myKey.name;
    //     }
    //   }
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Shows', speechText)
      .getResponse();
  },
};

// HelloWordlIntent Handler
const HelloWorldIntentHandler = {
    canHandle(handlerInput){
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'HelloWorldIntent';
    },
    handle(handlerInput){
        const speechText = "Hello I am Show Teller !";
        const repromptText = "Which shows do you want ?";

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(repromptText)
            .getResponse();
    }
};

//****************************************GetInfoIntent Handler**************************************************** */
//*******************************************************************************************************************/

const GetInfoIntentHandler = {
    canHandle(handlerInput){
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetInfoIntent';
    },
    handle(handlerInput){
      var category = handlerInput.requestEnvelope.request.intent.slots.category.value;
      // console.log(category);
      let rawdata = fs.readFileSync('db.json');  
      let obj = JSON.parse(rawdata);
      
      var ans = "Shows are ";
      // console.log(obj);
      for(var myKey in obj){
        // console.log(obj[myKey]);
        // console.log(category);
        if(obj[myKey].category == category){
          
          ans = ans + obj[myKey].name;
          // console.log("Cool it worked for " + myKey);
          ans += ",";
        }
      }
      const speechText = ans;

      return handlerInput.responseBuilder
        .speak(speechText)
        .getResponse();
    }

};

//*****************************************************************************************************************/

// HelpIntent Handler
const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can ask me about a show';

    return handlerInput.responseBuilder
      .speak(speechText)
    //   .reprompt(speechText)
    //   .withSimpleCard('Shows', speechText)
      .getResponse();
  },
};

// Cancel and Stop Intent Handler
const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
    //   .withSimpleCard('Shows', speechText)
      .getResponse();
  },
};

// FallbackIntent Handler
const FallbackHandler = {
  // The FallbackIntent can only be sent in those locales which support it,
  // so this handler will always be skipped in locales where it is not supported.
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      // .speak(requestAttributes.t('FALLBACK_MESSAGE'))
      // .reprompt(requestAttributes.t('FALLBACK_REPROMPT'))
      .speak("Your intent failed !")
      .reprompt("Your intent did not work !")
      .getResponse();
  },
};

// SessionEndedRequest Handler
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    if(null!=handlerInput.requestEnvelope.request.error) {
      console.log(JSON.stringify(handlerInput.requestEnvelope.request.error));
    }

    return handlerInput.responseBuilder.getResponse();
  },
};

// Error Handler
const ErrorHandler = {
  canHandle(handlerInput) {
    return 1>0;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
    //   .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

// Lambda Function
const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
    .addRequestHandlers(
        LaunchRequestHandler,
        HelloWorldIntentHandler,
        GetInfoIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandler(ErrorHandler)
    .lambda();

