import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { submitEnquiry } from "../../api/api";
import WhatsAppButton from "../../components/WhatsAppButton";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  message: "",
  itemReference: "",
};

export default function Contact() {
  const [searchParams] = useSearchParams();
  const initialItemReference = searchParams.get("itemReference") || "";
  const initialMessage = searchParams.get("message") || "";
  const [form, setForm] = useState({
    ...initialForm,
    itemReference: initialItemReference,
    message: initialMessage,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setSuccess("");
      setError("");
      await submitEnquiry(form);
      setSuccess("Thank you! We will be in touch soon.");
      setForm(initialForm);
    } catch {
      setError("We could not send your enquiry right now. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact | The Antique Room</title>
      </Helmet>

      <section className="section-shell">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr]">
          <div className="rounded-[32px] border border-antique-gold/20 bg-white p-8 shadow-soft">
            <p className="eyebrow">Contact</p>
            <h1 className="section-title">Get In Touch</h1>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <input className="form-input" name="name" onChange={handleChange} placeholder="Your name" required value={form.name} />
              <input className="form-input" name="email" onChange={handleChange} placeholder="Email address" required type="email" value={form.email} />
              <input className="form-input" name="phone" onChange={handleChange} placeholder="Phone number" required value={form.phone} />
              <input className="form-input" name="itemReference" onChange={handleChange} placeholder="Item reference (optional)" value={form.itemReference} />
              <textarea className="form-input min-h-[180px]" name="message" onChange={handleChange} placeholder="Tell us what caught your eye" required value={form.message} />

              {success ? <p className="rounded-2xl bg-emerald-50 p-4 text-emerald-700">{success}</p> : null}
              {error ? <p className="rounded-2xl bg-red-50 p-4 text-red-700">{error}</p> : null}

              <button className="btn-primary justify-center" disabled={loading} type="submit">
                {loading ? "Sending..." : "Send Enquiry"}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-[32px] bg-antique-navy p-8 text-antique-cream shadow-soft">
              <p className="eyebrow text-antique-gold">Direct Enquiry</p>
              <h2 className="font-display text-4xl">Prefer WhatsApp?</h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-antique-cream/80">
                Reach out directly for availability, delivery questions, and sourcing requests. Your privacy is preserved and the number is never shown on site.
              </p>
              <div className="mt-6">
                <WhatsAppButton label="General WhatsApp Enquiry" />
              </div>
            </div>

            <div className="rounded-[32px] border border-antique-gold/20 bg-white p-8 shadow-soft">
              <h3 className="font-display text-3xl text-antique-navy">Visit Or Write</h3>
              <div className="mt-6 space-y-4 text-antique-muted">
                <p>
                  <span className="font-semibold text-antique-navy">Opening Hours:</span> Monday to Saturday, 10:00 - 18:00
                </p>
                <p>
                  <span className="font-semibold text-antique-navy">Location:</span> Georgian Quarter, Dublin
                </p>
                <p>Private viewings and sourcing appointments are available by request.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
