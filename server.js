 require('dotenv').config()

const cors = require('cors');
const { generateObject } = require("ai");
const { createOpenAI } = require("@ai-sdk/openai");
const { z } = require("zod");

/**
 * EXPRESS FOR ROUTING
 */
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)


app.use(cors({
  origin: '*'
}));

const port = process.env.PORT || 4500;


const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false,limit: '50mb',parameterLimit: 100000 }))
// parse application/json
app.use(bodyParser.json())



// // Serve the static files from the 'build' folder
// app.use(express.static(path.join(__dirname, 'code')));

app.get('/' , (req,resp) => {
  try{
        resp.json({msg : "Farm krishi"}
       );
    //   resp.sendFile(path.join(__dirname, 'code', 'index.html'));
  }catch(err){
   resp.send(err);
  }

});


// Initialize OpenAI
const openai = createOpenAI({
    apiKey: "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",
});

// API Endpoint
app.post("/generate-action", async (req, res) => {
    console.log("req.body",req.body);
    try {
        const userInput = req.body.text;
        console.log("userInput",userInput);
        if (!userInput) {
            return res.status(400).json({ error: "Text field is required in the request body." });
        }

        const result = await generateObject({
            model: openai("gpt-4o-mini-2024-07-18"),
           // schemaName: "move to screen",
            schema: z.object({
                action: z.object({
                    type: z.enum(["AddProduct", "EditProduct", "MyOrders", "search" , "chatbot"]),
                  //  target: z.string().describe("target to move to which screen on the basis of provied user input."),
                    text: z.string(),
                }),
            }),
            messages: [
                {
                    role: "system",
                    content: "You are an asistant, User will provide a text to you and you will tell on which screen user should naviagate and if user is searching then just give me name of vegetable or fruit name in english which user is searching in text",
                },
                {
                    role: "user",
                    content: userInput,
                },
            ],
        });

        res.status(200).json( result.object );
    } catch (error) {
        console.error("Error generating action:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

// API Endpoint
app.post("/generate-action-farmer", async (req, res) => {
    console.log("req.body",req.body);
    try {
        const userInput = req.body.text;
        console.log("userInput",userInput);
        if (!userInput) {
            return res.status(400).json({ error: "Text field is required in the request body." });
        }

        const result = await generateObject({
            model: openai("gpt-4o-mini-2024-07-18"),
           // schemaName: "move to screen",
            schema: z.object({
                action: z.object({
                    type: z.enum(["AddProduct", "EditProduct", "OrdersScreen", "AddCropScreen" , "ChatBotScreen" , "MyCropsScreen" , "BidsScreen" , "WheatherScreen" , "CalenderScreen " , "ChatScreen" , "NegotiationScreen" , "CalculateArea" , "VideoScreen" , "MandiScreen"]),
                  //  target: z.string().describe("target to move to which screen on the basis of provied user input."),
                    text: z.string(),
                }),
            }),
            messages: [
                {
                    role: "system",
                    content: "You are an asistant, User will provide a text to you and you will tell on which screen user should naviagate and if user is searching then just give me name of vegetable or fruit name in english which user is searching in text",
                },
                {
                    role: "user",
                    content: userInput,
                },
            ],
        });

        res.status(200).json( result.object );
    } catch (error) {
        console.error("Error generating action:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});



server.listen(port, console.log(`Server run and listening port: ${port}`));


