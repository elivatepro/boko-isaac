import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.json();

    // Zoho webhook URL
    const webhookUrl =
      "https://flow.zoho.com/859069849/flow/webhook/incoming?zapikey=1001.3440a789f28dd74157e91569f5aa0d75.5fe36f4cc99275ea240607bc069231b1&isdebug=false";

    // Send data to Zoho webhook as form-encoded data
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        name: formData.name,
        email: formData.email,
        company: formData.company || "",
        projectDescription: formData.projectDescription,
      }).toString(),
    });

    if (!response.ok) {
      throw new Error(`Webhook returned status: ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting to webhook:", error);
    return NextResponse.json({ success: false, error: "Failed to submit form" }, { status: 500 });
  }
}
