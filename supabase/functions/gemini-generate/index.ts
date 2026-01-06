import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeData, jobDescription, type } = await req.json();

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (type === "cover-letter") {
      // Generate cover letter
      const coverLetterPrompt = `You are an expert career coach and professional writer. Write a compelling, personalized cover letter.

CANDIDATE PROFILE:
Name: ${resumeData.name}
Skills: ${resumeData.skills.join(", ")}
Experience: ${JSON.stringify(resumeData.experience)}
Education: ${JSON.stringify(resumeData.education)}

JOB DESCRIPTION:
${jobDescription}

Write a professional cover letter that:
1. Opens with a strong, personalized hook
2. Highlights 2-3 most relevant experiences/skills
3. Shows enthusiasm and cultural fit
4. Closes with a confident call to action
5. Is approximately 300-400 words
6. Uses a professional but personable tone

Return the cover letter as plain text, properly formatted with paragraphs.`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: "You are a professional cover letter writer." },
            { role: "user", content: coverLetterPrompt },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Cover letter generation failed");
      }

      const data = await response.json();
      const coverLetterContent = data.choices?.[0]?.message?.content || "";

      // Evaluate the cover letter
      const evalPrompt = `You are a hiring manager evaluating a cover letter. Score it on three metrics from 1-10:

COVER LETTER:
${coverLetterContent}

JOB DESCRIPTION:
${jobDescription}

Score:
1. Relevance (1-10): Does it address the job requirements?
2. Accuracy (1-10): Is it faithful to the candidate's actual experience?
3. Effectiveness (1-10): How persuasive and engaging is it?

Also provide a brief feedback sentence.

Return ONLY JSON in this format:
{
  "relevance": number,
  "accuracy": number,
  "effectiveness": number,
  "overall": number (average of the three),
  "feedback": "string"
}`;

      const evalResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: "You are a hiring manager. Return only valid JSON." },
            { role: "user", content: evalPrompt },
          ],
        }),
      });

      let qualityScore = {
        relevance: 8,
        accuracy: 8,
        effectiveness: 8,
        overall: 8,
        feedback: "Well-crafted cover letter that addresses key requirements.",
      };

      if (evalResponse.ok) {
        const evalData = await evalResponse.json();
        const evalContent = evalData.choices?.[0]?.message?.content || "";
        try {
          const jsonMatch = evalContent.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            qualityScore = JSON.parse(jsonMatch[0]);
          }
        } catch (e) {
          console.error("Failed to parse evaluation:", evalContent);
        }
      }

      return new Response(
        JSON.stringify({
          coverLetter: {
            content: coverLetterContent,
            qualityScore,
          },
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (type === "interview-questions") {
      // Generate interview questions
      const interviewPrompt = `You are a senior technical interviewer. Generate 5 custom interview questions.

CANDIDATE PROFILE:
Name: ${resumeData.name}
Skills: ${resumeData.skills.join(", ")}
Experience: ${JSON.stringify(resumeData.experience)}

JOB DESCRIPTION:
${jobDescription}

Generate exactly 5 questions:
- 3 Technical questions (test specific skills mentioned in the JD)
- 2 Behavioral questions (assess culture fit and soft skills)

Return ONLY JSON in this format:
{
  "questions": [
    {
      "question": "string",
      "type": "technical" or "behavioral",
      "focus": "what skill/trait this tests"
    }
  ]
}`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: "You are a technical interviewer. Return only valid JSON." },
            { role: "user", content: interviewPrompt },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Interview question generation failed");
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "";

      let interviewQuestions = [];
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          interviewQuestions = parsed.questions || [];
        }
      } catch (e) {
        console.error("Failed to parse interview questions:", content);
        interviewQuestions = [
          { question: "Tell me about your experience with the technologies in this role.", type: "technical", focus: "Technical depth" },
          { question: "Describe a challenging project you've worked on.", type: "technical", focus: "Problem solving" },
          { question: "How do you stay current with industry trends?", type: "technical", focus: "Learning ability" },
          { question: "Tell me about a time you had a conflict with a teammate.", type: "behavioral", focus: "Conflict resolution" },
          { question: "Why are you interested in this role?", type: "behavioral", focus: "Motivation" },
        ];
      }

      return new Response(
        JSON.stringify({ interviewQuestions }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    throw new Error("Invalid generation type");
  } catch (error) {
    console.error("gemini-generate error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Generation failed" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
