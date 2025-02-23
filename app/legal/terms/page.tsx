export default function TermsPage() {
  return (
    <div className="p-6 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
      <p className="mb-4">Last updated: October 25, 2024</p>
      <section className="p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By using MiniFyn, you agree to these Terms and Conditions. If you disagree, please do not use our service.
        </p>
        <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
        <p className="mb-4">
          MiniFyn provides URL shortening and analytics services. We reserve the right to modify or discontinue the service at any time.
        </p>
        <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
        <p className="mb-4">
          You are responsible for all activity that occurs under your account. Do not use MiniFyn for any illegal or unauthorized purpose.
        </p>
        <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
        <p className="mb-4">
          The MiniFyn service and its original content are and will remain the exclusive property of MiniFyn.
        </p>
        <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
        <p className="mb-4">
          MiniFyn shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the service.
        </p>
        <h2 className="text-2xl font-semibold mb-4">6. Changes to Terms</h2>
        <p className="mb-4">
          We reserve the right to modify these Terms at any time. Please review these terms periodically.
        </p>
        <h2 className="text-2xl font-semibold mb-4">7. Governing Law</h2>
        <p className="mb-4">
          These Terms shall be governed by the laws of India.
        </p>
        <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at <a className="text-blue-400" href="mailto:legal@minifyn.com">legal@minifyn.com</a>.
        </p>
      </section>
    </div>
  );
}