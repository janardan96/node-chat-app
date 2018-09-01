var expect=require("expect");
var {generateMessage}=require("./message");

describe("generateMessage",()=>{
it("should generate a correct message object",()=>{

    var from="Janardan";
    var text="Some Message from test";
    var message=generateMessage(from,text);

    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({from,text});
});
});
