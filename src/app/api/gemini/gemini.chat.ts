import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  try {
    const response = await fetch("https://api.gemini.com/v1/your-endpoint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error from Gemini API:", errorData);
      return res
        .status(response.status)
        .json({ error: errorData.message || "Something went wrong." });
    }

    const data = await response.json();
    return res
      .status(200)
      .json({ reply: data.reply || "Sorry, I didn't understand that." });
  } catch (error) {
    console.error("Error in API route:", error);
    return res.status(500).json({ error: "Something went wrong." });
  }
};

export default handler;
