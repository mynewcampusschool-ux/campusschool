import React from 'react';
import { Helmet } from 'react-helmet-async';

const PrivacyPolicyPage: React.FC = () => (
  <>
    <Helmet>
      <title>Privacy Policy – Campus School Pantnagar Alumni Portal</title>
      <meta name="description" content="Privacy Policy for Campus School Pantnagar Alumni Portal. Learn how we collect, use, and protect your personal information." />
      <meta name="robots" content="index, follow" />
    </Helmet>

    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: January 1, 2025</p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700 text-sm leading-relaxed">

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">1. Information We Collect</h2>
          <p>We collect information you provide when registering as an alumni, including your name, email address, graduation year, profession, and profile photo. We also collect usage data such as pages visited and features used.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">2. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To create and manage your alumni profile</li>
            <li>To connect you with fellow alumni, mentors, and job opportunities</li>
            <li>To send newsletters, event updates, and important announcements</li>
            <li>To improve our platform and user experience</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">3. Information Sharing</h2>
          <p>We do not sell, trade, or rent your personal information to third parties. Your profile information is visible to other registered alumni on the platform. We may share data with service providers (Firebase, hosting) solely to operate the platform.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">4. Data Security</h2>
          <p>We implement industry-standard security measures including encrypted connections (HTTPS), secure authentication via Firebase, and hashed passwords. However, no method of transmission over the internet is 100% secure.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">5. Cookies</h2>
          <p>We use cookies and similar technologies to maintain your login session and analyze site usage via Google Analytics. You can disable cookies in your browser settings, though some features may not function properly.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">6. Your Rights</h2>
          <p>You have the right to access, update, or delete your personal information at any time through your profile settings. To request complete data deletion, contact us at <a href="mailto:campusschoolpantnagar@gmail.com" className="text-green-700 underline">campusschoolpantnagar@gmail.com</a>.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">7. Third-Party Services</h2>
          <p>Our platform uses Google Analytics for usage tracking and Firebase for authentication. These services have their own privacy policies. We encourage you to review them.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">8. Children's Privacy</h2>
          <p>This portal is intended for alumni (adults). We do not knowingly collect personal information from individuals under 18 years of age.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">9. Changes to This Policy</h2>
          <p>We may update this Privacy Policy periodically. Changes will be posted on this page with an updated date. Continued use of the platform constitutes acceptance of the revised policy.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">10. Contact Us</h2>
          <p>For any privacy-related questions or concerns, please contact:</p>
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

export default PrivacyPolicyPage;
