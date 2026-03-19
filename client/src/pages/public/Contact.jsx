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
      setSuccess("Thank you. We will be in touch shortly.");
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
        <title>Contact | Never The Twain</title>
      </Helmet>

      <section className="section-shell pt-14">
        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <div className="editorial-card rounded-[34px] bg-[#232820] p-8 text-[#f0e7d9] shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#d6b57d]">Appointments & Enquiries</p>
              <h1 className="mt-4 max-w-xl font-display text-5xl leading-tight">For sourcing requests, private viewings, and purchase enquiries.</h1>
              <p className="mt-5 max-w-xl text-sm leading-8 text-[#efe6d5]/76">
                Tell us what you are looking for, which room you are shaping, or which piece has caught your attention. A more detailed enquiry usually leads to a better recommendation.
              </p>
            </div>

            <div className="editorial-card rounded-[34px] p-8 shadow-soft">
              <h2 className="font-display text-3xl text-[#263024]">Visit or write</h2>
              <div className="mt-6 space-y-4 text-[#5e594d]">
                <p>
                  <span className="font-semibold text-[#263024]">Opening Hours:</span> Monday to Saturday, 10:00 - 18:00
                </p>
                <p>
                  <span className="font-semibold text-[#263024]">Location:</span> Maynooth, Ireland
                </p>
                <p>Private viewings and sourcing appointments are available by request.</p>
              </div>

              <div className="mt-8 rounded-[28px] bg-[#ece3d2] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#b68a3c]">WhatsApp</p>
                <p className="mt-3 max-w-md text-sm leading-7 text-[#5f584b]">
                  Reach out directly for availability, delivery questions, and sourcing requests. Your privacy is preserved and the number is never shown on site.
                </p>
                <div className="mt-6">
                  <WhatsAppButton label="General WhatsApp Enquiry" />
                </div>
              </div>
            </div>
          </div>

          <div className="editorial-card rounded-[34px] p-8 shadow-soft">
            <p className="eyebrow">Contact</p>
            <h2 className="section-title">Start an enquiry</h2>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <input className="form-input" name="name" onChange={handleChange} placeholder="Your name" required value={form.name} />
              <input className="form-input" name="email" onChange={handleChange} placeholder="Email address" required type="email" value={form.email} />
              <input className="form-input" name="phone" onChange={handleChange} placeholder="Phone number" required value={form.phone} />
              <input className="form-input" name="itemReference" onChange={handleChange} placeholder="Item reference (optional)" value={form.itemReference} />
              <textarea className="form-input min-h-[200px]" name="message" onChange={handleChange} placeholder="Tell us what caught your eye" required value={form.message} />

              {success ? <p className="rounded-2xl bg-emerald-50 p-4 text-emerald-700">{success}</p> : null}
              {error ? <p className="rounded-2xl bg-red-50 p-4 text-red-700">{error}</p> : null}

              <button className="btn-primary w-full" disabled={loading} type="submit">
                {loading ? "Sending..." : "Send Enquiry"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
