import { OpenAI } from "openai";
import { OPENAI_API_KEY } from "./secret.js";

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const feeling = "anxious";
const input = "school";

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a lyricd writer that puts a lot of feeling in her songs.",
      },
      {
        role: "user",
        content: `Please generate a ${feeling} lyrics about ${input}`,
      },
    ],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0]);
}
main();
