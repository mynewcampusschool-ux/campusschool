import React from 'react';
import { Helmet } from 'react-helmet-async';

const TermsPage: React.FC = () => (
  <>
    <Helmet>
      <title>Terms & Conditions – Campus School Pantnagar Alumni Portal</title>
      <meta name="description" content="Terms and Conditions for using the Campus School Pantnagar Alumni Portal." />
      <meta name="robots" content="index, follow" />
    </Helmet>

    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms &amp; Conditions</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: January 1, 2025</p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700 text-sm leading-relaxed">

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">1. Acceptance of Terms</h2>
          <p>By accessing or using the Campus School Pantnagar Alumni Portal ("Portal"), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the Portal.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">2. Eligibility</h2>
          <p>The Portal is exclusively for alumni, current students, faculty, and staff of Campus School Pantnagar. By registering, you confirm that you have a genuine affiliation with the institution. We reserve the right to verify and remove accounts that do not meet this criterion.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">3. User Accounts</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You must provide accurate and truthful information during registration.</li>
            <li>You must not share your account with others or create multiple accounts.</li>
            <li>Notify us immediately of any unauthorized use of your account.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">4. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Post false, misleading, or defamatory content</li>
            <li>Harass, abuse, or harm other users</li>
            <li>Use the Portal for commercial solicitation without permission</li>
            <li>Upload malicious code, spam, or unauthorized advertisements</li>
            <li>Scrape or harvest user data from the Portal</li>
            <li>Violate any applicable laws or regulations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">5. Content Ownership</h2>
          <p>You retain ownership of content you post (profile information, photos, etc.). By posting, you grant Campus School Pantnagar Alumni Portal a non-exclusive, royalty-free license to display and use that content within the platform. The Portal's design, logo, and original content are the property of Campus School Pantnagar.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">6. Job Listings & Mentorship</h2>
          <p>Job listings, internships, and mentorship connections are provided as a community service. The Portal does not guarantee employment or the accuracy of listings. Users engage with these features at their own discretion and risk.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">7. Disclaimer of Warranties</h2>
          <p>The Portal is provided "as is" without warranties of any kind. We do not guarantee uninterrupted access, error-free operation, or the accuracy of user-submitted content.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">8. Limitation of Liability</h2>
          <p>Campus School Pantnagar Alumni Portal shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Portal, including but not limited to loss of data or business opportunities.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">9. Account Termination</h2>
          <p>We reserve the right to suspend or terminate accounts that violate these Terms, post inappropriate content, or misrepresent their affiliation with Campus School Pantnagar.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">10. Governing Law</h2>
          <p>These Terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Uttarakhand, India.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">11. Changes to Terms</h2>
          <p>We may update these Terms periodically. Continued use of the Portal after changes constitutes acceptance of the revised Terms.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">12. Contact Us</h2>
          <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="font-semibold text-gray-800">Campus School Pantnagar Alumni Portal</p>
            <p>Campus School Pantnagar, Udham Singh Nagar, Uttarakhand – 263145</p>
            <p>Email: <a href="mailto:campusschoolpantnagar@gmail.com" className="text-green-700 underline">campusschoolpantnagar@gmail.com</a></p>
            <p>Phone: +91-5944-233530</p>
          </div>
        </section>

      </div>
    </div>
  </>
);

export default TermsPage;
