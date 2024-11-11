import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function GET(req: Request) {
  console.log("request")
  try {
    const prompt =
      "Create a list of three open-ended andengaging questions formatted as a single string. Each question should be separated by 'Ill'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this:'What's a hobby you've recently started?| |If you could have dinner with any historical figure, who would it be?lI What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

      const {text} = await generateText({
        model:openai("gpt-3.5-turbo"),
        prompt,
        maxTokens:400
      })

      console.log(text)
      return Response.json(text);
  } catch (error) {
    console.log("error occured in openai", error);
    throw error;
  }
}
