import Link from "next/link";

function Page() {
  return (
    <div className="col-span-10 flex items-center justify-center">
      <div className="flex flex-col gap-5 sm:py-10 py-6 lg:w-1/2 sm:w-2/3 w-full px-5">
        <h1 className="sm:text-4xl text-2xl font-extrabold tracking-tighter">
          Terms and Conditions
        </h1>
        <p className="text-stone-900 dark:text-stone-200">
          Welcome to Sociial! By accessing or using our platform (the
          “Service”), you agree to the following Terms of Service. If you do not
          agree, please do not use the Service.
        </p>
        <h3 className="sm:text-2xl text-xl font-semibold tracking-tight">
          Use of the service
        </h3>
        <p className="text-stone-900 dark:text-stone-200">
          You may use the Service in compliance with these Terms. You are
          responsible for your activity on the platform and must not engage in
          any unlawful, harmful, or abusive activities.
        </p>
        <h3 className="sm:text-2xl text-xl font-semibold tracking-tight">
          User content
        </h3>
        <p className="text-stone-900 dark:text-stone-200">
          You retain ownership of any content you post but grant us permission
          to display and store it as part of the Service. Do not post content
          that violates laws, infringes rights, or is inappropriate.
        </p>
        <h3 className="sm:text-2xl text-xl font-semibold tracking-tight">
          Privacy
        </h3>
        <p className="text-stone-900 dark:text-stone-200">
          Your use of the Service is subject to our&nbsp;
          <Link href="/privacy" className="text-blue-500 hover:text-blue-600">
            Privacy Policy
          </Link>
          , which explains how we collect, use, and store your information.
        </p>
        <h3 className="sm:text-2xl text-xl font-semibold tracking-tight">
          Limitations
        </h3>
        <p className="text-stone-900 dark:text-stone-200">
          We provide the Service on an &quot;as is&quot; basis and do not guarantee
          uninterrupted access or functionality.
        </p>
        <h3 className="sm:text-2xl text-xl font-semibold tracking-tight">
          Modifications
        </h3>
        <p className="text-stone-900 dark:text-stone-200">
          We may update these Terms from time to time. Continued use of the
          Service after updates indicates your acceptance of the new Terms.
        </p>
        <h3 className="sm:text-2xl text-xl font-semibold tracking-tight">
          Terminations
        </h3>
        <p className="text-stone-900 dark:text-stone-200">
          We may suspend or terminate your access to the Service for any
          violations of the Terms and Conditions.
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
