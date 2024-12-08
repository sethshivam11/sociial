import Link from "next/link";

function Page() {
  return (
    <div className="col-span-10 flex items-center justify-center">
      <div className="flex flex-col gap-5 sm:py-10 py-6 lg:w-1/2 sm:w-2/3 w-full px-5">
        <h1 className="sm:text-4xl text-2xl font-extrabold tracking-tighter">
          Privacy Policy
        </h1>
        <p className="text-stone-900 dark:text-stone-200">
          We value your privacy. This Privacy Policy explains how Sociial (&quot;we&quot;,
          &quot;our&quot;, or &quot;us&quot;) collects, uses, and protects your information when you
          use our platform (the “Service”).
        </p>
        <h3 className="sm:text-2xl text-xl font-semibold tracking-tight">
          Information we collect
        </h3>
        <p className="text-stone-900 dark:text-stone-200">
          Personal Information: When you sign up or log in using Google OAuth,
          we may collect basic profile information such as your name, email
          address, and profile picture.
          <br />
          Usage Data: We may collect non-personal data, such as how you interact
          with the Service, for analytics purposes.
        </p>
        <h3 className="sm:text-2xl text-xl font-semibold tracking-tight">
          How we use your information
        </h3>
        <p className="text-stone-900 dark:text-stone-200">
          We use the information collected to:
          <ul className="list-disc pl-4 pt-1">
            <li>Provide, improve, and personalize the Service.</li>
            <li>Communicate with you about updates or features.</li>
            <li>Ensure the security and functionality of the Service.</li>
          </ul>
        </p>
        <h3 className="sm:text-2xl text-xl font-semibold tracking-tight">
          Sharing your information
        </h3>
        <p className="text-stone-900 dark:text-stone-200">
          We do not sell, rent, or share your personal information with third
          parties, except as required to:
          <ul className="list-disc pl-4 pt-1">
            <li>Comply with legal obligations.</li>
            <li>Prevent fraud or misuse of the Service.</li>
          </ul>
        </p>
        <h3 className="sm:text-2xl text-xl font-semibold tracking-tight">
          Data Security
        </h3>
        <p className="text-stone-900 dark:text-stone-200">
          We implement reasonable security measures to protect your data.
          However, no method of transmission or storage is completely secure,
          and we cannot guarantee absolute security.
        </p>
        <h3 className="sm:text-2xl text-xl font-semibold tracking-tight">
          Your choices
        </h3>
        <p className="text-stone-900 dark:text-stone-200">
          You can manage your account and the information you provide. If you
          wish to delete your account or data, please contact us at&nbsp;
          <Link
            href="mailto:sociial99@gmail.com"
            className="text-blue-500 hover:text-blue-600"
          >
            sociial99@gmail.com
          </Link>
          .
        </p>
        <h3 className="sm:text-2xl text-xl font-semibold tracking-tight">
          Changes to this policy
        </h3>
        <p className="text-stone-900 dark:text-stone-200">
          We may update this Privacy Policy from time to time. Continued use of
          the Service after changes indicates your acceptance of the new policy.
          For more details on your obligations, please refer to our&nbsp;
          <Link href="/terms" className="text-blue-500 hover:text-blue-600">
            Terms and Conditions
          </Link>
          .
        </p>
        <p className="text-stone-900 dark:text-stone-200">
          If you have questions, please contact us at&nbsp;
          <Link
            href="mailto:sociial99@gmail.com"
            className="text-blue-500 hover:text-blue-600"
          >
            sociial99@gmail.com
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

export default Page;
