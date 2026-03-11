"use server";

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const topic = formData.get("topic") as string;
  const message = formData.get("message") as string;

  // Basic validation
  if (!name || !email || !topic || !message) {
    return { success: false, error: "Semua field wajib diisi" };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Format email tidak valid" };
  }

  if (message.length < 20) {
    return { success: false, error: "Pesan minimal 20 karakter" };
  }

  try {
    // Simulate an email send / database save
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Here you would typically integrate with Resend, SendGrid, or save to a DB
    // e.g., await sendEmail({ to: "admin@nusantarahijau.example.com", subject: topic, body: message });

    return { success: true };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return { success: false, error: "Gagal mengirim pesan, silakan coba lagi." };
  }
}
