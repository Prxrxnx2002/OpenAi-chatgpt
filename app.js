const http = require('http');
const querystring = require('querystring');
const url = require('url');

async function generator(text) {
  const {OpenAI} =  await import("openai");
  const openai = new OpenAI({ apiKey: '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' });
  const completion = await openai.chat.completions.create({
    messages: [{"role": "user", "content": text}],
    model: "gpt-3.5-turbo",
  });

  console.log(completion);
  return completion.choices[0].message.content;
}

// Define the HTTP server
const server = http.createServer();
const hostname = '127.0.0.1';
const port = 3001;

server.listen(port, hostname, async () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// Listen for requests made to the server
server.on('request', async (req, res) => {
  try{
    // Parse the request URL
  const parsedUrl = url.parse(req.url);

  // Extract the query parameters
  let { text } = querystring.parse(parsedUrl.query);

  // let query = 'modify this sentence with respect to what work you have done: ';

  // let query = 'explain the following task with respect to what work you have done: ';

  let query = 'you are  logging the work you have done during the day in the office time tracker. you need to add a comment in end explaining the task you have performed. what should i write for the following task: ';

  // let query = 'you are  logging the work you have done during the day in the office time tracker. you need to add a comment in end explaining the task you have performed. write a comment for the following task: ';

  text = text ? query + text : '';
  console.log('text:', text);

  // Set the response headers
  res.setHeader('Content-Type', 'application/json');

  let response;
  if (parsedUrl.pathname === '/generate' && text) {
    // const classifier = await MyClassificationPipeline.getInstance();
    response = await generator(text);
    res.statusCode = 200;
  } else {
    response = { 'error': 'Bad request' }
    res.statusCode = 400;
  }

  // Send the JSON response
  res.end(JSON.stringify(response));
  }catch(err){
    console.log(err);
    res.statusCode = 500;
    res.end("Something went wrong");
    return;
  }
});