"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Phone, MessageCircle, Camera, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function ContactPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('store_settings')
        .select('phone_number, whatsapp_number, instagram_url')
        .eq('id', 1)
        .single();
      
      if (data) {
        setSettings(data);
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const { error } = await supabase.from('contact_messages').insert([{
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        message: formData.message
      }]);
      
      if (error) throw error;
      
      setSubmitStatus({ type: 'success', message: 'Your message has been sent successfully. We will get back to you soon.' });
      setFormData({ firstName: '', lastName: '', email: '', message: '' });
    } catch (err: any) {
      setSubmitStatus({ type: 'error', message: err.message || 'An error occurred. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-background pt-20">
      <Navbar />

      {/* Page Header */}
      <section className="bg-background border-b border-foreground/5 py-24">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-heading text-foreground mb-6 uppercase tracking-wider"
          >
            Contact Us
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-foreground/60 max-w-2xl mx-auto tracking-wide mb-8"
          >
            Our concierge team is available to assist you with inquiries, bespoke orders, and client support.
          </motion.p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="flex-1 container mx-auto px-6 py-24">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Contact Information */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/3"
          >
            <h3 className="text-[#D4AF37] font-bold tracking-widest uppercase text-sm mb-8 border-b border-foreground/10 pb-4">
              Direct Channels
            </h3>
            
            {loading ? (
              <div className="flex items-center gap-2 text-foreground/50">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading channels...
              </div>
            ) : (
              <div className="space-y-8">
                {/* Phone */}
                {settings?.phone_number && (
                  <div className="flex items-start space-x-4">
                    <div className="bg-surface p-4 rounded-full border border-foreground/10">
                      <Phone className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h4 className="text-foreground font-medium tracking-widest uppercase mb-1">Phone</h4>
                      <p className="text-foreground/60 font-light">{settings.phone_number}</p>
                      <p className="text-foreground/40 text-xs mt-1 uppercase tracking-wider">Mon-Fri, 9am - 6pm EST</p>
                    </div>
                  </div>
                )}

                {/* WhatsApp */}
                {settings?.whatsapp_number && (
                  <div className="flex items-start space-x-4">
                    <div className="bg-surface p-4 rounded-full border border-foreground/10">
                      <MessageCircle className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h4 className="text-foreground font-medium tracking-widest uppercase mb-1">WhatsApp</h4>
                      <p className="text-foreground/60 font-light">{settings.whatsapp_number}</p>
                      <p className="text-foreground/40 text-xs mt-1 uppercase tracking-wider">24/7 Client Support</p>
                    </div>
                  </div>
                )}

                {/* Instagram */}
                {settings?.instagram_url && (
                  <div className="flex items-start space-x-4">
                    <div className="bg-surface p-4 rounded-full border border-foreground/10">
                      <Camera className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h4 className="text-foreground font-medium tracking-widest uppercase mb-1">Instagram</h4>
                      <a href={settings.instagram_url} target="_blank" rel="noreferrer" className="text-foreground/60 font-light hover:text-[#D4AF37] transition-colors">
                        @orvano.official
                      </a>
                      <p className="text-foreground/40 text-xs mt-1 uppercase tracking-wider">Follow for Updates</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-2/3 bg-surface border border-foreground/5 p-8 md:p-12"
          >
            <h3 className="text-3xl font-heading text-foreground mb-8">Send a Message</h3>
            
            {submitStatus?.type === 'success' ? (
              <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-6 rounded-md">
                <h4 className="font-bold mb-2">Thank you!</h4>
                <p className="text-sm">{submitStatus.message}</p>
                <Button className="mt-4" onClick={() => setSubmitStatus(null)}>Send another message</Button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-foreground/60 text-xs tracking-widest uppercase block">First Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.firstName}
                      onChange={e => setFormData({...formData, firstName: e.target.value})}
                      className="w-full bg-background border border-foreground/10 px-4 py-3 text-foreground focus:outline-none focus:border-[#D4AF37] transition-colors"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-foreground/60 text-xs tracking-widest uppercase block">Last Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.lastName}
                      onChange={e => setFormData({...formData, lastName: e.target.value})}
                      className="w-full bg-background border border-foreground/10 px-4 py-3 text-foreground focus:outline-none focus:border-[#D4AF37] transition-colors"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-foreground/60 text-xs tracking-widest uppercase block">Email Address</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-background border border-foreground/10 px-4 py-3 text-foreground focus:outline-none focus:border-[#D4AF37] transition-colors"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-foreground/60 text-xs tracking-widest uppercase block">Message</label>
                  <textarea 
                    required
                    rows={5}
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-background border border-foreground/10 px-4 py-3 text-foreground focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
                    placeholder="How can we assist you?"
                  ></textarea>
                </div>

                {submitStatus?.type === 'error' && (
                  <p className="text-red-500 text-sm">{submitStatus.message}</p>
                )}

                <Button type="submit" size="lg" className="w-full md:w-auto mt-4" disabled={submitting}>
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Inquiry"}
                </Button>
              </form>
            )}
          </motion.div>
          
        </div>
      </section>

      <Footer />
    </main>
  );
}
