import { Helmet } from 'react-helmet-async';

export default function Legal({ page }: { page: 'privacy' | 'terms' }) {
  const isPrivacy = page === 'privacy';
  const title = isPrivacy ? 'Privacy Policy' : 'Terms of Service';

  return (
    <>
      <Helmet><title>{title} | AureviaWeb Studio</title></Helmet>
      
      <section className="pt-12 pb-24 lg:pt-16 lg:pb-32 bg-soft-white overflow-hidden">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-12 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-charcoal mb-6">{title}</h1>
          <p className="text-text-muted font-medium">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </section>

      <section className="py-24 bg-white min-h-[50vh]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 prose prose-lg prose-blue">
          {isPrivacy ? (
            <>
              <h2>Information We Collect</h2>
              <p>We only collect information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and services, when you participate in activities on the Website or otherwise when you contact us.</p>
              
              <h2>How We Use Your Information</h2>
              <p>We use personal information collected via our Website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
              <ul>
                <li>To facilitate account creation and logon process.</li>
                <li>To send you marketing and promotional communications.</li>
                <li>To fulfill and manage your orders.</li>
              </ul>
              
              <p className="text-sm text-text-muted font-medium mt-12 italic">Note: This is a placeholder document and does not constitute real legal advice. Please consult with a legal professional to generate a valid Privacy Policy for your jurisdiction.</p>
            </>
          ) : (
            <>
              <h2>Agreement to Terms</h2>
              <p>These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and AureviaWeb ("we," "us" or "our"), concerning your access to and use of our website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the “Site”).</p>
              
              <h2>Intellectual Property Rights</h2>
              <p>Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights and unfair competition laws.</p>
              
              <p className="text-sm text-text-muted font-medium mt-12 italic">Note: This is a placeholder document and does not constitute real legal advice. Please consult with a legal professional to generate valid Terms of Service for your jurisdiction.</p>
            </>
          )}
        </div>
      </section>
    </>
  );
}
